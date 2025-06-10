import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Plus, Edit2, Trash2, GripVertical, FolderPlus, Folder } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  categoryId: string;
}

const ItemTypes = {
  CATEGORY: 'category',
  SUBCATEGORY: 'subcategory'
};

const DraggableCategory: React.FC<{
  category: Category;
  index: number;
  moveCategory: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onEditSubcategory: (subcategory: Subcategory) => void;
  onDeleteSubcategory: (id: string) => void;
  onAddSubcategory: (categoryId: string) => void;
}> = ({ category, index, moveCategory, onEdit, onDelete, onEditSubcategory, onDeleteSubcategory, onAddSubcategory }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CATEGORY,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.CATEGORY,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveCategory(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">/{category.slug}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAddSubcategory(category.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Ajouter une sous-catégorie"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {category.subcategories.length > 0 && (
        <div className="ml-8 space-y-2">
          {category.subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Folder className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{subcategory.name}</span>
                <span className="text-xs text-gray-500">/{subcategory.slug}</span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEditSubcategory(subcategory)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDeleteSubcategory(subcategory.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '📁'
  });

  const [subcategoryFormData, setSubcategoryFormData] = useState({
    name: '',
    slug: '',
    categoryId: ''
  });

  useEffect(() => {
    // Load categories from API
    loadCategories();
  }, []);

  const loadCategories = async () => {
    // Simulate API call
    setCategories([
      {
        id: '1',
        name: 'Véhicules',
        slug: 'vehicules',
        icon: '🚗',
        order: 1,
        subcategories: [
          { id: '1-1', name: 'Voitures', slug: 'voitures', order: 1, categoryId: '1' },
          { id: '1-2', name: 'Motos', slug: 'motos', order: 2, categoryId: '1' },
          { id: '1-3', name: 'Vélos', slug: 'velos', order: 3, categoryId: '1' }
        ]
      },
      {
        id: '2',
        name: 'Immobilier',
        slug: 'immobilier',
        icon: '🏠',
        order: 2,
        subcategories: [
          { id: '2-1', name: 'Vente', slug: 'vente', order: 1, categoryId: '2' },
          { id: '2-2', name: 'Location', slug: 'location', order: 2, categoryId: '2' }
        ]
      },
      {
        id: '3',
        name: 'Multimédia',
        slug: 'multimedia',
        icon: '📱',
        order: 3,
        subcategories: [
          { id: '3-1', name: 'Téléphones', slug: 'telephones', order: 1, categoryId: '3' },
          { id: '3-2', name: 'Ordinateurs', slug: 'ordinateurs', order: 2, categoryId: '3' }
        ]
      }
    ]);
  };

  const moveCategory = (dragIndex: number, hoverIndex: number) => {
    const draggedCategory = categories[dragIndex];
    const newCategories = [...categories];
    newCategories.splice(dragIndex, 1);
    newCategories.splice(hoverIndex, 0, draggedCategory);
    setCategories(newCategories);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && { slug: generateSlug(value) })
    }));
  };

  const handleSubcategoryFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubcategoryFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && { slug: generateSlug(value) })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      // Update category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        order: categories.length + 1,
        subcategories: []
      };
      setCategories(prev => [...prev, newCategory]);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', icon: '📁' });
  };

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSubcategory) {
      // Update subcategory
      setCategories(prev => prev.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub =>
          sub.id === editingSubcategory.id
            ? { ...sub, ...subcategoryFormData }
            : sub
        )
      })));
    } else {
      // Create new subcategory
      const newSubcategory: Subcategory = {
        id: Date.now().toString(),
        ...subcategoryFormData,
        order: 1
      };
      
      setCategories(prev => prev.map(cat =>
        cat.id === subcategoryFormData.categoryId
          ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
          : cat
      ));
    }

    setIsSubcategoryModalOpen(false);
    setEditingSubcategory(null);
    setSubcategoryFormData({ name: '', slug: '', categoryId: '' });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon
    });
    setIsModalOpen(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryFormData({
      name: subcategory.name,
      slug: subcategory.slug,
      categoryId: subcategory.categoryId
    });
    setIsSubcategoryModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?')) {
      setCategories(prev => prev.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.filter(sub => sub.id !== id)
      })));
    }
  };

  const handleAddSubcategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSubcategoryFormData({ name: '', slug: '', categoryId });
    setIsSubcategoryModalOpen(true);
  };

  const openModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', icon: '📁' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des catégories</h2>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle catégorie</span>
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          💡 <strong>Astuce :</strong> Glissez-déposez les catégories pour réorganiser leur ordre d'affichage.
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <DraggableCategory
            key={category.id}
            category={category}
            index={index}
            moveCategory={moveCategory}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onEditSubcategory={handleEditSubcategory}
            onDeleteSubcategory={handleDeleteSubcategory}
            onAddSubcategory={handleAddSubcategory}
          />
        ))}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la catégorie
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icône (emoji)
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="📁"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCategory ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {isSubcategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingSubcategory ? 'Modifier la sous-catégorie' : 'Nouvelle sous-catégorie'}
            </h3>
            <form onSubmit={handleSubcategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la sous-catégorie
                </label>
                <input
                  type="text"
                  name="name"
                  value={subcategoryFormData.name}
                  onChange={handleSubcategoryFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={subcategoryFormData.slug}
                  onChange={handleSubcategoryFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsSubcategoryModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSubcategory ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;