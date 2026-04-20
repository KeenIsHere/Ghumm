import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiUpload } from 'react-icons/fi';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(user?.profileImage);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    bio: user?.bio || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    gender: user?.gender || '',
  });
  const [preferences, setPreferences] = useState({
    notificationsEnabled: user?.notificationsEnabled ?? true,
    emailNotifications: user?.emailNotifications ?? true,
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [verifyOtp, setVerifyOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [premiumData, setPremiumData] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [loadingPremium, setLoadingPremium] = useState(false);

  useEffect(() => {
    if (user) {
      setProfilePicturePreview(user.profileImage);
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        bio: user.bio || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
      });

      // Fetch premium data if user is premium
      if (user.isPremium) {
        fetchPremiumData();
      }
    }
  }, [user]);

  const fetchPremiumData = async () => {
    setLoadingPremium(true);
    try {
      const [subRes, rewardRes] = await Promise.all([
        API.get('/premium/subscription'),
        API.get('/users/rewards')
      ]);
      setPremiumData(subRes.data.subscription);
      setRewards(rewardRes.data.rewards);
    } catch (err) {
      console.error('Failed to fetch premium data:', err);
    } finally {
      setLoadingPremium(false);
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setProfilePicturePreview(base64);
      uploadProfilePicture(base64);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfilePicture = async (profileImage) => {
    try {
      const { data } = await API.post('/users/profile-picture', { profileImage });
      dispatch(setUser(data.user));
      toast.success('Profile picture updated');
    } catch (err) {
      toast.error('Failed to upload picture');
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/users/profile', { ...form, ...preferences });
      dispatch(setUser(data.user));
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (pwForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      await API.put('/users/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const sendVerifyOtp = async () => {
    setOtpLoading(true);
    try {
      await API.post('/auth/send-verify-otp');
      setShowOtpInput(true);
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error('Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyEmailOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/verify-email', { otp: verifyOtp });
      dispatch(setUser(data.user));
      setShowOtpInput(false);
      setVerifyOtp('');
      toast.success('Email verified successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar - Profile Picture & Quick Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={profilePicturePreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
                />
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition">
                  <FiUpload className="w-5 h-5" />
                  <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
                </label>
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              
              {user.isPremium && (
                <div className="mt-3 inline-block">
                  <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-semibold">
                    ⭐ {user.premiumTier?.toUpperCase()} Member
                  </span>
                </div>
              )}

              {user.isAccountVerified ? (
                <div className="mt-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs inline-block">
                  ✓ Verified
                </div>
              ) : (
                <div className="mt-3">
                  {!showOtpInput ? (
                    <button
                      onClick={sendVerifyOtp}
                      disabled={otpLoading}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-200 transition"
                    >
                      {otpLoading ? 'Sending...' : 'Verify Email'}
                    </button>
                  ) : (
                    <form onSubmit={verifyEmailOtp} className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={verifyOtp}
                        onChange={(e) => setVerifyOtp(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border bg-white border-gray-300"
                        required
                      />
                      <button type="submit" className="w-full px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                        Verify
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 bg-white p-4 rounded-xl flex-wrap">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'overview' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'settings' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Settings
              </button>
              {user.isPremium && (
                <button
                  onClick={() => setActiveTab('premium')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'premium' ? 'bg-accent-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  ⭐ Premium
                </button>
              )}
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'security' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Security
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Personal Information</h3>
                  <button
                    onClick={() => setEditing(!editing)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${editing ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
                  >
                    {editing ? (
                      <>
                        <FiX /> Cancel
                      </>
                    ) : (
                      <>
                        <FiEdit2 /> Edit
                      </>
                    )}
                  </button>
                </div>

                {editing ? (
                  <form onSubmit={updateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email (Read-only)</label>
                        <input type="email" value={form.email} disabled className="w-full px-3 py-2 rounded-lg border bg-gray-100 border-gray-300 cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Gender</label>
                        <select
                          value={form.gender}
                          onChange={(e) => setForm({ ...form, gender: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={form.dateOfBirth}
                          onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <textarea
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Bio</label>
                      <textarea
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 500) })}
                        rows="3"
                        maxLength="500"
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300"
                      />
                      <p className="text-xs mt-1 text-gray-500">{form.bio.length}/500 characters</p>
                    </div>

                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                        <FiSave /> Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Name:</span><span className="font-medium">{form.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Email:</span><span className="font-medium">{form.email}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Phone:</span><span className="font-medium">{form.phone || 'Not provided'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Gender:</span><span className="font-medium capitalize">{form.gender || 'Not provided'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">DOB:</span><span className="font-medium">{form.dateOfBirth || 'Not provided'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">City:</span><span className="font-medium">{form.city || 'Not provided'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Address:</span><span className="font-medium">{form.address || 'Not provided'}</span></div>
                    {form.bio && <div className="mt-4 p-3 bg-primary-50 rounded-lg text-sm"><span className="font-medium">Bio:</span> {form.bio}</div>}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-bold mb-4">Preferences</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.notificationsEnabled}
                      onChange={(e) => {
                        setPreferences({ ...preferences, notificationsEnabled: e.target.checked });
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span>Enable push notifications</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => {
                        setPreferences({ ...preferences, emailNotifications: e.target.checked });
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span>Enable email notifications</span>
                  </label>
                </div>

                <button
                  onClick={updateProfile}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Change Password</h3>
                
                <form onSubmit={changePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <input
                      type="password"
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input
                      type="password"
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300"
                      required
                    />
                    <p className="text-xs mt-1 text-gray-500">Minimum 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={pwForm.confirmPassword}
                      onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300"
                      required
                    />
                  </div>

                  <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {/* Premium Tab */}
            {activeTab === 'premium' && user.isPremium && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h3 className="text-lg font-bold mb-4">⭐ Premium Membership</h3>

                {loadingPremium ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-600"></div>
                  </div>
                ) : (
                  <>
                    {/* Subscription Info */}
                    {premiumData && (
                      <div className="bg-gradient-to-r from-accent-50 to-accent-100 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-3 capitalize flex items-center gap-2">
                          <span className="text-2xl">🎁</span>
                          {premiumData.tierName} Tier
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium ml-2 capitalize">{premiumData.status}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Billing:</span>
                            <span className="font-medium ml-2 capitalize">{premiumData.billingCycle}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Started:</span>
                            <span className="font-medium ml-2">{new Date(premiumData.startDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Expires:</span>
                            <span className="font-medium ml-2 text-accent-600">{new Date(premiumData.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reward Points */}
                    {rewards && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Available Points</p>
                          <p className="text-3xl font-bold text-blue-600">{rewards.availablePoints || 0}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Total Points Earned</p>
                          <p className="text-3xl font-bold text-green-600">{rewards.totalPoints || 0}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Redeemed Points</p>
                          <p className="text-3xl font-bold text-purple-600">{rewards.redeemedPoints || 0}</p>
                        </div>
                      </div>
                    )}

                    {/* Benefits */}
                    <div>
                      <h4 className="font-bold text-base mb-3">Premium Benefits</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Get discounts on all bookings
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Earn reward points per booking
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Priority customer support
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Exclusive packages access
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Travel insurance included
                        </li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700">
                        Renew Membership
                      </button>
                      <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
                        Cancel Subscription
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
