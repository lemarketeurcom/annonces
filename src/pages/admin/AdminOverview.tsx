import React, { useState, useEffect } from 'react';
import { Users, FileText, TrendingUp, Eye, Plus, AlertCircle } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  monthlyViews: number;
  monthlyRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'ad_posted' | 'ad_sold' | 'ad_reported';
  message: string;
  timestamp: string;
  user?: string;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAds: 0,
    activeAds: 0,
    pendingAds: 0,
    monthlyViews: 0,
    monthlyRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalAds: 3892,
        activeAds: 2156,
        pendingAds: 23,
        monthlyViews: 45678,
        monthlyRevenue: 2340
      });

      setRecentActivity([
        {
          id: '1',
          type: 'user_registered',
          message: 'Nouvel utilisateur inscrit',
          timestamp: '2024-01-16T10:30:00Z',
          user: 'Marie Dubois'
        },
        {
          id: '2',
          type: 'ad_posted',
          message: 'Nouvelle annonce publiée',
          timestamp: '2024-01-16T10:15:00Z',
          user: 'Jean Martin'
        },
        {
          id: '3',
          type: 'ad_sold',
          message: 'Annonce marquée comme vendue',
          timestamp: '2024-01-16T09:45:00Z',
          user: 'Sophie Leroy'
        },
        {
          id: '4',
          type: 'ad_reported',
          message: 'Annonce signalée par un utilisateur',
          timestamp: '2024-01-16T09:30:00Z',
          user: 'Pierre Durand'
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'ad_posted':
        return <Plus className="w-4 h-4 text-blue-600" />;
      case 'ad_sold':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'ad_reported':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+12%</span>
            <span className="text-gray-500 text-sm ml-1">ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annonces totales</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAds.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+8%</span>
            <span className="text-gray-500 text-sm ml-1">ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annonces actives</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeAds.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-red-600 text-sm font-medium">{stats.pendingAds}</span>
            <span className="text-gray-500 text-sm ml-1">en attente</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vues mensuelles</p>
              <p className="text-3xl font-bold text-gray-900">{stats.monthlyViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+15%</span>
            <span className="text-gray-500 text-sm ml-1">ce mois</span>
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    {activity.message}
                    {activity.user && (
                      <span className="font-medium"> - {activity.user}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Gérer les utilisateurs</p>
              <p className="text-sm text-gray-500">Voir tous les utilisateurs</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <FileText className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Modérer les annonces</p>
              <p className="text-sm text-gray-500">{stats.pendingAds} en attente</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
              <p className="font-medium text-gray-900">Signalements</p>
              <p className="text-sm text-gray-500">Traiter les signalements</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Statistiques</p>
              <p className="text-sm text-gray-500">Voir les rapports</p>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">État du système</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Base de données: Opérationnelle</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Email: Opérationnel</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Stockage: 78% utilisé</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;