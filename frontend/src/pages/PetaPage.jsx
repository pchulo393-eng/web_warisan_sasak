import { Link } from 'react-router-dom';
import HeritageMap from '../components/HeritageMap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PetaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Peta Warisan Budaya Sasak</h1>
        <p className="text-gray-500 text-sm mb-6">Klik marker untuk melihat detail warisan budaya</p>
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200" style={{ height: 'calc(100vh - 220px)', minHeight: 500 }}>
          <HeritageMap />
        </div>
      </div>
      <Footer />
    </div>
  );
}
