import React from 'react';
import { CompanyFormData } from '../../types/company';

interface CompanyFormProps {
  initialData?: Partial<CompanyFormData>;
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<CompanyFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    parentCompanyId: initialData?.parentCompanyId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Company Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-dark rounded-lg text-white"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 bg-dark rounded-lg text-white"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Phone
          </label>
          <input
            type="tel"
            className="w-full px-4 py-2 bg-dark rounded-lg text-white"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Address
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-dark rounded-lg text-white"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Parent Company (Optional)
          </label>
          <select
            className="w-full px-4 py-2 bg-dark rounded-lg text-white"
            value={formData.parentCompanyId || ''}
            onChange={(e) => setFormData({ ...formData, parentCompanyId: e.target.value || undefined })}
          >
            <option value="">None</option>
            {/* Parent companies will be populated here */}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {initialData ? 'Update Company' : 'Add Company'}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm; 