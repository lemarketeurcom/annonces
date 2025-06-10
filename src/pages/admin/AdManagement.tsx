import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit2, Trash2, Check, X, MoreVertical } from 'lucide-react';

interface Ad {
  id: number;
  title: string;
  price: number;
  location: string;
  status: 'active' | 'pending' | 'sold' | 'expired' | 'rejected';
  category_name: string;
  subcategory_name?: string;
  user_name: string;
  views: number;
  created_at: string;
  images?: string[];
}

const AdManagement: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAds, setSelectedAds] = useState<number[]>([]);

  useEffect(() => {
    loadAds();
  }, [currentPage, searchTerm, filterStatus, filterCategory]);

  const loadAds = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockAds: Ad[] = [
          {
            id: 1,
            title: 'BMW Série 3 320d - Excellent état',
            price: 18500,
            location: 'Paris 15ème',
            status: 'pending',
            category_name: 'Véhicules',
            subcategory_name: 'Voitures',
            user_name: 'Jean Martin',
            views: 45,
            created_at: '2024-01-15T10:30:00Z',
            images: ['image1.jpg']
          },
          {
            id: 2,
            title: 'iPhone 15 Pro Max 256GB',
            price: 1100,
            location: 'Lyon 6ème',
            status: 'active',
            category_name: 'Multimédia',
            subcategory_name: 'Téléphones',
            user_name: 'Marie Dubois',
            views: 78,
            created_at: '2024-01-14T14:20:00Z',
            images: ['image2.jpg']
          },
          {
            id: 3,
            title: 'Appartement T3 avec balcon',
            price: 1200,
            location: 'Marseille',
            status: 'active',
            category_name: 'Immobilier',
            subcategory_name: 'Location',
            user_name: 'Pierre Durand',
            views: 123,
            created_at: '2024-01-13T09:15:00Z',
            images: ['image3.jpg']
          }
        ];

        // Apply filters
        let filteredAds = mockAds;
        
        if (searchTerm) {
          filteredAds = filteredAds.filter(ad => 
            ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ad.user_name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (filterStatus !== 'all') {
          filteredAds = filteredAds.filter(ad => ad.status === filterStatus);
        }

        if (filterCategory !== 'all') {
          filteredAds = filteredAds.filter(ad => ad.category_name === filterCategory);
        }

        setAds(filteredAds);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading ads:', error);
      setIsLoading(false);
    }
  };

  const handleSelectAd = (adId: number) => {
    setSelectedAds(prev => 
      prev.includes(adId) 
        ? prev.filter(id => id !== adId)
        : [...prev, adId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAds.length === ads.length) {
      setSelectedAds([]);
    } else {
      setSelectedAds(ads.map(ad => ad.id));
    }
  };

  const handleApproveAd = async (adId: number) => {
    try {
      // API call to approve ad
      setAds(prev => prev.map(ad => 
        ad.id === adId ? { ...ad, status: 'active' as const } : ad
      ));
    } catch (error) {
      console.error('Error approving ad:', error);
    }
  };

  const handleRejectAd = async (adId: number) => {
    try {
      // API call to reject ad
      setAds(prev => prev.map(ad => 
        ad.id === adId ? { ...ad, status: 'rejected' as const } : ad
      ));
    } catch (error) {
      console.error('Error rejecting ad:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      sold: 'bg-blue-100 text-blue-800',
      expired: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const labels = {
      active: 'Active',
      pending: 'En attente',
      sold: 'Vendue',
      expired: 'Expirée',
      rejected: 'Rejetée'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des annonces</h2>
          <p className="text-gray-600">Modérez et gérez toutes les annonces de la plateforme</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Approuver sélectionnées
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Rejeter sélectionnées
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Rechercher par titre, utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="active">Actives</option>
              <option value="sold">Vendues</option>
              <option value="expired">Expirées</option>
              <option value="rejected">Rejetées</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              <option value="Véhicules">Véhicules</option>
              <option value="Immobilier">Immobilier</option>
              <option value="Multimédia">Multimédia</option>
              <option value="Mode">Mode</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Plus de filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ads Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {selectedAds.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedAds.length} annonce(s) sélectionnée(s)
              </span>
              <div className="flex space-x-2">
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Approuver
                </button>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Rejeter
                </button>
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAds.length === ads.length && ads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annonce
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : ads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    Aucune annonce trouvée
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAds.includes(ad.id)}
                        onChange={() => handleSelectAd(ad.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 mr-4">
                          {/* Placeholder for image */}
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {ad.title}
                          </div>
                          <div className="text-sm text-gray-500">{ad.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatPrice(ad.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{ad.category_name}</div>
                      {ad.subcategory_name && (
                        <div className="text-sm text-gray-500">{ad.subcategory_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ad.user_name}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ad.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        {ad.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(ad.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {ad.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveAd(ad.id)}
                              className="p-2 text-green-600 hover:text-green-700 transition-colors"
                              title="Approuver"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectAd(ad.id)}
                              className="p-2 text-red-600 hover:text-red-700 transition-colors"
                              title="Rejeter"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{ads.length}</span> sur <span className="font-medium">{ads.length}</span> résultats
            </div>
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdManagement;