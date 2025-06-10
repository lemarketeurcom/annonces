import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Plus, GripVertical, Edit2, Trash2, Type, AlignLeft, List, CheckSquare, Circle, Hash, Mail, Phone } from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'email' | 'tel';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
}

interface Category {
  id: string;
  name: string;
  fields: FormField[];
}

const fieldTypes = [
  { type: 'text', label: 'Texte', icon: Type },
  { type: 'textarea', label: 'Zone de texte', icon: AlignLeft },
  { type: 'select', label: 'Liste déroulante', icon: List },
  { type: 'checkbox', label: 'Case à cocher', icon: CheckSquare },
  { type: 'radio', label: 'Bouton radio', icon: Circle },
  { type: 'number', label: 'Nombre', icon: Hash },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'tel', label: 'Téléphone', icon: Phone }
];

const DraggableField: React.FC<{
  field: FormField;
  index: number;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (field: FormField) => void;
  onDelete: (id: string) => void;
}> = ({ field, index, moveField, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'field',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveField(item.index, index);
        item.index = index;
      }
    },
  });

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.type === type);
    return fieldType ? fieldType.icon : Type;
  };

  const Icon = getFieldIcon(field.type);

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white border border-gray-200 rounded-lg p-4 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
          <Icon className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="font-medium text-gray-900">{field.label}</h4>
            <p className="text-sm text-gray-500 capitalize">{field.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {field.required && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              Requis
            </span>
          )}
          <button
            onClick={() => onEdit(field)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(field.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Field Preview */}
      <div className="mt-3 p-3 bg-gray-50 rounded border">
        {field.type === 'text' && (
          <input
            type="text"
            placeholder={field.placeholder || field.label}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            disabled
          />
        )}
        {field.type === 'textarea' && (
          <textarea
            placeholder={field.placeholder || field.label}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            disabled
          />
        )}
        {field.type === 'select' && (
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm\" disabled>
            <option>Sélectionnez une option</option>
            {field.options?.map((option, idx) => (
              <option key={idx}>{option}</option>
            ))}
          </select>
        )}
        {field.type === 'checkbox' && (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input type="checkbox" disabled className="rounded" />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        )}
        {field.type === 'radio' && (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input type="radio" name={field.id} disabled />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        )}
        {(field.type === 'number' || field.type === 'email' || field.type === 'tel') && (
          <input
            type={field.type}
            placeholder={field.placeholder || field.label}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            disabled
          />
        )}
      </div>
    </div>
  );
};

const FormBuilder: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('vehicules');
  const [categories] = useState<Category[]>([
    {
      id: 'vehicules',
      name: 'Véhicules',
      fields: [
        {
          id: '1',
          type: 'select',
          label: 'Marque',
          required: true,
          options: ['BMW', 'Mercedes', 'Audi', 'Peugeot', 'Renault'],
          order: 1
        },
        {
          id: '2',
          type: 'text',
          label: 'Modèle',
          placeholder: 'Ex: Série 3',
          required: true,
          order: 2
        },
        {
          id: '3',
          type: 'number',
          label: 'Année',
          placeholder: '2020',
          required: true,
          order: 3
        }
      ]
    },
    {
      id: 'immobilier',
      name: 'Immobilier',
      fields: [
        {
          id: '4',
          type: 'select',
          label: 'Type de bien',
          required: true,
          options: ['Appartement', 'Maison', 'Studio', 'Loft'],
          order: 1
        },
        {
          id: '5',
          type: 'number',
          label: 'Surface (m²)',
          placeholder: '50',
          required: true,
          order: 2
        }
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [formData, setFormData] = useState({
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
    options: ['']
  });

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const fields = currentCategory?.fields || [];

  const moveField = (dragIndex: number, hoverIndex: number) => {
    // Implementation for reordering fields
    console.log('Move field from', dragIndex, 'to', hoverIndex);
  };

  const handleAddField = () => {
    setEditingField(null);
    setFormData({
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: ['']
    });
    setIsModalOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setFormData({
      type: field.type,
      label: field.label,
      placeholder: field.placeholder || '',
      required: field.required,
      options: field.options || ['']
    });
    setIsModalOpen(true);
  };

  const handleDeleteField = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce champ ?')) {
      // Implementation for deleting field
      console.log('Delete field', id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for saving field
    console.log('Save field', formData);
    setIsModalOpen(false);
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => idx === index ? value : opt)
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== index)
    }));
  };

  const needsOptions = ['select', 'checkbox', 'radio'].includes(formData.type);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Constructeur de formulaires</h2>
        <button
          onClick={handleAddField}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un champ</span>
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          💡 <strong>Astuce :</strong> Créez des formulaires personnalisés pour chaque catégorie. 
          Glissez-déposez les champs pour réorganiser leur ordre d'affichage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Builder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Formulaire - {currentCategory?.name}
              </h3>
              <span className="text-sm text-gray-500">
                {fields.length} champ(s)
              </span>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun champ</h4>
                <p className="text-gray-500 mb-4">
                  Commencez par ajouter des champs à votre formulaire
                </p>
                <button
                  onClick={handleAddField}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter le premier champ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <DraggableField
                    key={field.id}
                    field={field}
                    index={index}
                    moveField={moveField}
                    onEdit={handleEditField}
                    onDelete={handleDeleteField}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Field Types Palette */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Types de champs</h3>
            <div className="space-y-2">
              {fieldTypes.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <button
                    key={fieldType.type}
                    onClick={handleAddField}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Icon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">{fieldType.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Field Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingField ? 'Modifier le champ' : 'Nouveau champ'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de champ
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fieldTypes.map((type) => (
                    <option key={type.type} value={type.type}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Libellé du champ
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texte d'aide (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.placeholder}
                  onChange={(e) => setFormData(prev => ({ ...prev, placeholder: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {needsOptions && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options
                  </label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Option ${index + 1}`}
                        />
                        {formData.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Ajouter une option
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={formData.required}
                  onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                  Champ obligatoire
                </label>
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
                  {editingField ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;