import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiChevronLeft, FiChevronRight, FiMapPin, FiShield, FiCreditCard, FiStar } from 'react-icons/fi';
import API from '../api/axios';

const DEFAULT_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1617633784633-97c2722e0aa5?q=80&w=1170',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200',
  'https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=1200',
];

export default function Landing() {
  const { user } = useSelector((state) => state.auth);
  const [heroImages, setHeroImages] = useState(DEFAULT_HERO_IMAGES);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadHeroImages = async () => {
      try {
        const { data } = await API.get('/site/home-slider');
        const images = (data.images || []).map((item) => item.url).filter(Boolean);

        if (mounted && images.length > 0) {
          setHeroImages(images);
          setActiveHeroIndex(0);
        }
      } catch (err) {
        if (mounted) {
          setHeroImages(DEFAULT_HERO_IMAGES);
        }
      }
    };

    loadHeroImages();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActiveHeroIndex((currentIndex) => (currentIndex + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  const goToPreviousHero = () => {
    setActiveHeroIndex((currentIndex) => (currentIndex - 1 + heroImages.length) % heroImages.length);
  };

  const goToNextHero = () => {
    setActiveHeroIndex((currentIndex) => (currentIndex + 1) % heroImages.length);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImages[activeHeroIndex]}
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        {heroImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPreviousHero}
              aria-label="Previous hero image"
              className="absolute left-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 transition"
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={goToNextHero}
              aria-label="Next hero image"
              className="absolute right-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 transition"
            >
              <FiChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Discover the Beauty of <span className="text-primary-400">Pokhara</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Explore breathtaking trekking routes, compare packages, and book your next adventure with GhummGhamm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-lg font-semibold transition">
              Explore Packages
            </Link>
            <Link to="/register" className="px-8 py-3 border-2 border-white hover:bg-white hover:text-gray-900 text-white rounded-xl text-lg font-semibold transition">
              Get Started
            </Link>
          </div>
        </div>

        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to hero image ${index + 1}`}
                onClick={() => setActiveHeroIndex(index)}
                className={`h-2.5 rounded-full transition-all ${index === activeHeroIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/60'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose GhummGhamm?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FiMapPin, title: 'Detailed Routes', desc: 'Comprehensive route information with difficulty ratings, elevation profiles, and seasonal tips.' },
              { icon: FiShield, title: 'Verified Operators', desc: 'All trekking operators are verified for safety, reliability, and quality service.' },
              { icon: FiCreditCard, title: 'Secure Payments', desc: 'Pay securely with Khalti and other trusted payment methods.' },
              { icon: FiStar, title: 'Premium Experience', desc: 'Upgrade to premium for exclusive routes, priority booking, and personalized service.' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center">
                <f.icon className="w-10 h-10 mx-auto text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Trekking Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Annapurna Base Camp', img: 'https://images.unsplash.com/photo-1617633784633-97c2722e0aa5?q=80&w=1170', days: '10 Days' },
              { name: 'Mardi Himal', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600', days: '6 Days' },
              { name: 'Poon Hill', img: 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=600', days: '4 Days' },
            ].map((d, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer">
                <img src={d.img} alt={d.name} className="w-full h-72 object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{d.name}</h3>
                  <p className="text-sm text-gray-200">{d.days}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/packages" className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold">
              View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-lg mb-8 text-primary-100">
            Join thousands of trekkers who trust GhummGhamm for planning their perfect mountain escape.
          </p>
          <Link
            to={user ? '/packages' : '/register'}
            className="px-8 py-3 bg-white text-primary-700 rounded-xl text-lg font-bold hover:bg-gray-100 transition"
          >
            {user ? 'Explore Packages' : 'Create Free Account'}
          </Link>
        </div>
      </section>
    </div>
  );
}
