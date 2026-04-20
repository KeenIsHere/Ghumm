import { Link } from 'react-router-dom';
import { FiMapPin, FiShield, FiCreditCard, FiStar } from 'react-icons/fi';

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[85vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1617633784633-97c2722e0aa5?q=80&w=1170')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
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
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose GhummGhamm?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FiMapPin, title: 'Detailed Routes', desc: 'Comprehensive route information with difficulty ratings, elevation profiles, and seasonal tips.' },
              { icon: FiShield, title: 'Verified Operators', desc: 'All trekking operators are verified for safety, reliability, and quality service.' },
              { icon: FiCreditCard, title: 'Secure Payments', desc: 'Pay securely with eSewa and other trusted payment methods.' },
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
          <Link to="/register" className="px-8 py-3 bg-white text-primary-700 rounded-xl text-lg font-bold hover:bg-gray-100 transition">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
