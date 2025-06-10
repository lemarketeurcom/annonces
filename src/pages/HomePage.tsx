import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Car, Home, Briefcase, Smartphone, Heart, Star, MapPin, Clock } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

interface FeaturedAd {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  category: string;
  createdAt: string;
  featured: boolean;
}

const HomePage: React.FC = () => {
  const [featuredAds, setFeaturedAds] = useState<FeaturedAd[]>([]);
  const [recentAds, setRecentAds] = useState<FeaturedAd[]>([]);

  const categories: Category[] = [
    { id: 'vehicules', name: 'Véhicules', icon: <Car className="w-8 h-8" />, count: 1250 },
    { id: 'immobilier', name: 'Immobilier', icon: <Home className="w-8 h-8" />, count: 890 },
    { id: 'emploi', name: 'Emploi', icon: <Briefcase className="w-8 h-8" />, count: 567 },
    { id: 'multimedia', name: 'Multimédia', icon: <Smartphone className="w-8 h-8" />, count: 432 },
    { id: 'mode', name: 'Mode', icon: <Heart className="w-8 h-8" />, count: 321 },
    { id: 'loisirs', name: 'Loisirs', icon: <Star className="w-8 h-8" />, count: 298 },
  ];

  useEffect(() => {
    // Simulate API calls
    setFeaturedAds([
      {
        id: '1',
        title: 'BMW Série 3 320d - Excellent état',
        price: '18 500 €',
        location: 'Paris 15ème',
        image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Véhicules',
        createdAt: '2024-01-15',
        featured: true
      },
      {
        id: '2',
        title: 'Appartement T3 avec balcon',
        price: '1 200 €/mois',
        location: 'Lyon 6ème',
        image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Immobilier',
        createdAt: '2024-01-14',
        featured: true
      },
      {
        id: '3',
        title: 'iPhone 15 Pro Max 256GB',
        price: '1 100 €',
        location: 'Marseille',
        image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Multimédia',
        createdAt: '2024-01-13',
        featured: true
      }
    ]);

    setRecentAds([
      {
        id: '4',
        title: 'Vélo électrique Decathlon',
        price: '800 €',
        location: 'Toulouse',
        image: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Loisirs',
        createdAt: '2024-01-16',
        featured: false
      },
      {
        id: '5',
        title: 'Canapé 3 places cuir',
        price: '450 €',
        location: 'Nice',
        image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Maison',
        createdAt: '2024-01-16',
        featured: false
      },
      {
        id: '6',
        title: 'Cours particuliers mathématiques',
        price: '25 €/h',
        location: 'Bordeaux',
        image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Services',
        createdAt: '2024-01-15',
        featured: false
      }
    ]);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trouvez tout ce que vous cherchez
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Des milliers d'annonces près de chez vous
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-2 flex items-center shadow-lg">
              <input
                type="text"
                placeholder="Que recherchez-vous ?"
                className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 border-0 focus:ring-0 focus:outline-none"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Rechercher</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Parcourir par catégorie
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categorie/${category.id}`}
                className="group bg-gray-50 rounded-xl p-6 text-center hover:bg-blue-50 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-blue-600 group-hover:text-blue-700 mb-3 flex justify-center">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} annonces</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ads Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Annonces à la une</h2>
            <Link to="/annonces-premium" className="text-blue-600 hover:text-blue-700 font-medium">
              Voir toutes les annonces premium →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAds.map((ad) => (
              <Link
                key={ad.id}
                to={`/annonce/${ad.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                    ⭐ À la une
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {ad.title}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mb-3">{ad.price}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {ad.location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(ad.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Ads Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Dernières annonces</h2>
            <Link to="/toutes-annonces" className="text-blue-600 hover:text-blue-700 font-medium">
              Voir toutes les annonces →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentAds.map((ad) => (
              <Link
                key={ad.id}
                to={`/annonce/${ad.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {ad.title}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mb-3">{ad.price}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {ad.location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(ad.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Article Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Comment publier efficacement vos petites annonces sur FranceAnnonces.com
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-xl text-gray-600 mb-6 font-medium">
                Découvrez les meilleures stratégies pour vendre et acheter rapidement sur la plateforme leader des annonces gratuites en France.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Optimisez votre annonce pour un maximum de visibilité
              </h3>
              
              <p className="mb-4">
                Pour <strong>publier une petite annonce efficace sur FranceAnnonces.com</strong>, commencez par rédiger un titre accrocheur et précis. Utilisez des mots-clés pertinents que les acheteurs potentiels recherchent. Par exemple, mentionnez la marque, le modèle, l'état et la localisation de votre produit. Un bon titre augmente considérablement vos chances d'<strong>vendre rapidement en France</strong>.
              </p>

              <p className="mb-4">
                La description détaillée est cruciale pour convaincre les acheteurs. Décrivez honnêtement l'état de votre article, ses caractéristiques principales et les raisons de la vente. Les <strong>annonces gratuites</strong> les plus performantes incluent des informations complètes sur les dimensions, l'âge, l'usage et les éventuels défauts.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                L'importance des photos de qualité
              </h3>

              <p className="mb-4">
                Les photos sont l'élément le plus important de votre annonce. Prenez plusieurs clichés sous différents angles, en pleine lumière naturelle. Les <strong>petites annonces avec photos de qualité</strong> reçoivent 5 fois plus de contacts que celles sans images. Montrez les détails importants et les éventuels défauts pour établir la confiance avec les acheteurs potentiels.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Fixez le bon prix pour vendre vite
              </h3>

              <p className="mb-4">
                Recherchez des articles similaires sur <strong>FranceAnnonces.com</strong> pour déterminer un prix compétitif. Un prix légèrement inférieur au marché accélère la vente, tandis qu'un prix trop élevé décourage les acheteurs. N'hésitez pas à mentionner si le prix est négociable pour attirer plus d'intérêt.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Géolocalisation et disponibilité
              </h3>

              <p className="mb-4">
                Précisez clairement votre localisation et vos disponibilités pour les visites. Les acheteurs privilégient les vendeurs facilement joignables et flexibles. Proposez plusieurs créneaux et modes de contact (téléphone, email, SMS) pour faciliter les échanges.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Conseils pour acheter en toute sécurité
              </h3>

              <p className="mb-4">
                Pour les acheteurs, vérifiez toujours l'identité du vendeur et inspectez l'article avant le paiement. Privilégiez les rencontres dans des lieux publics et évitez les virements bancaires pour les transactions entre particuliers. <strong>FranceAnnonces.com</strong> offre un environnement sécurisé, mais la prudence reste de mise.
              </p>

              <p className="mb-4">
                Enfin, répondez rapidement aux messages et restez courtois dans vos échanges. Une communication professionnelle et réactive augmente significativement vos chances de conclure une vente rapide. Les <strong>annonces gratuites</strong> les plus réussies sont celles où les vendeurs s'impliquent activement dans le processus de vente.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
                <p className="text-blue-800 font-medium">
                  💡 <strong>Astuce pro :</strong> Relancez votre annonce régulièrement en la modifiant légèrement pour qu'elle remonte en tête des résultats de recherche sur FranceAnnonces.com.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à vendre ou acheter ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez des milliers d'utilisateurs qui font confiance à notre plateforme
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/deposer-annonce"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Déposer une annonce
            </Link>
            <Link
              to="/inscription"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;