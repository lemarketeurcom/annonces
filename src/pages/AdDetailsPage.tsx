import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Eye, Heart, Share2, Flag, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  images: string[];
  category: string;
  subcategory: string;
  condition: string;
  createdAt: string;
  views: number;
  seller: {
    name: string;
    memberSince: string;
    phone?: string;
    email?: string;
  };
}

const AdDetailsPage: React.FC = () => {
  const { adId } = useParams<{ adId: string }>();
  const [ad, setAd] = useState<Ad | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    loadAd();
  }, [adId]);

  const loadAd = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API
      setTimeout(() => {
        setAd({
          id: adId || '1',
          title: 'BMW Série 3 320d - Excellent état',
          description: 'Magnifique BMW Série 3 320d en excellent état. Véhicule très bien entretenu, révisions à jour. Intérieur cuir, GPS, climatisation automatique, régulateur de vitesse. Aucun accident, non fumeur. Visible sur rendez-vous.',
          price: '18 500 €',
          location: 'Paris 15ème',
          images: [
            'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          category: 'Véhicules',
          subcategory: 'Voitures',
          condition: 'Excellent état',
          createdAt: '2024-01-15',
          views: 156,
          seller: {
            name: 'Jean Martin',
            memberSince: '2022-03-15',
            phone: '06 12 34 56 78',
            email: 'jean.martin@email.com'
          }
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading ad:', error);
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    if (ad && ad.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % ad.images.length);
    }
  };

  const prevImage = () => {
    if (ad && ad.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Annonce non trouvée</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Accueil</Link>
          <span>/</span>
          <Link to={`/categorie/${ad.category.toLowerCase()}`} className="hover:text-blue-600">
            {ad.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{ad.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={ad.images[currentImageIndex]}
                  alt={ad.title}
                  className="w-full h-96 object-cover"
                />
                {ad.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {ad.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {ad.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {ad.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`${ad.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ad Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{ad.title}</h1>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Flag className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {ad.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(ad.createdAt)}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {ad.views} vues
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-500">Catégorie</span>
                  <p className="font-medium">{ad.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Sous-catégorie</span>
                  <p className="font-medium">{ad.subcategory}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">État</span>
                  <p className="font-medium">{ad.condition}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Prix</span>
                  <p className="font-bold text-blue-600 text-lg">{ad.price}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <div className="prose max-w-none text-gray-700">
                  {ad.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info and Contact */}
          <div className="space-y-6">
            {/* Price and Contact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-blue-600 mb-2">{ad.price}</p>
                <p className="text-gray-500">Prix fixe</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowContactInfo(!showContactInfo)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {showContactInfo ? 'Masquer les contacts' : 'Voir les contacts'}
                </button>

                {showContactInfo && (
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    {ad.seller.phone && (
                      <a
                        href={`tel:${ad.seller.phone}`}
                        className="flex items-center justify-center w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {ad.seller.phone}
                      </a>
                    )}
                    {ad.seller.email && (
                      <a
                        href={`mailto:${ad.seller.email}`}
                        className="flex items-center justify-center w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Envoyer un email
                      </a>
                    )}
                  </div>
                )}

                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Envoyer un message
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendeur</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {ad.seller.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{ad.seller.name}</p>
                  <p className="text-sm text-gray-500">
                    Membre depuis {formatDate(ad.seller.memberSince)}
                  </p>
                </div>
              </div>
              <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium">
                Voir toutes ses annonces
              </button>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Conseils de sécurité</h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• Rencontrez le vendeur dans un lieu public</li>
                <li>• Vérifiez l'article avant le paiement</li>
                <li>• Ne payez jamais à l'avance</li>
                <li>• Méfiez-vous des prix trop bas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetailsPage;