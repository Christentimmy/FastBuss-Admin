import React, { useState, useEffect } from 'react';
import { Company } from '../types/company';
import { motion } from 'framer-motion';
import CompanyForm from '../components/companies/CompanyForm';

const CompaniesManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      // TODO: Implement API call
      // const response = await fetch('/api/super-admin/companies');
      // const data = await response.json();
      // setCompanies(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setIsLoading(false);
    }
  };

  const handleAddCompany = async (formData: any) => {
    try {
      // TODO: Implement API call
      // const response = await fetch('/api/super-admin/company', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // const newCompany = await response.json();
      // setCompanies([...companies, newCompany]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  const handleEditCompany = async (formData: any) => {
    if (!selectedCompany) return;
    try {
      // TODO: Implement API call
      // const response = await fetch(`/api/super-admin/company/${selectedCompany.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // const updatedCompany = await response.json();
      // setCompanies(companies.map(company => 
      //   company.id === updatedCompany.id ? updatedCompany : company
      // ));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    try {
      // TODO: Implement API call
      // await fetch(`/api/super-admin/company/${companyId}`, {
      //   method: 'DELETE',
      // });
      // setCompanies(companies.filter(company => company.id !== companyId));
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const handleSuspendCompany = async (companyId: string) => {
    try {
      // TODO: Implement API call
      // await fetch(`/api/super-admin/company/${companyId}/suspend`, {
      //   method: 'PUT',
      // });
      // setCompanies(companies.map(company => 
      //   company.id === companyId ? { ...company, status: 'blocked' } : company
      // ));
    } catch (error) {
      console.error('Error suspending company:', error);
    }
  };

  const handleActivateCompany = async (companyId: string) => {
    try {
      // TODO: Implement API call
      // await fetch(`/api/super-admin/company/${companyId}/activate`, {
      //   method: 'PUT',
      // });
      // setCompanies(companies.map(company => 
      //   company.id === companyId ? { ...company, status: 'active' } : company
      // ));
    } catch (error) {
      console.error('Error activating company:', error);
    }
  };

  const handleViewDetails = async (companyId: string) => {
    try {
      // TODO: Implement API call
      // const response = await fetch(`/api/super-admin/company/${companyId}`);
      // const companyDetails = await response.json();
      // setSelectedCompany(companyDetails);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Companies Management</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Company
        </button>
      </div>

      <div className="bg-dark-blue rounded-lg p-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search companies..."
            className="flex-1 px-4 py-2 bg-dark rounded-lg text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 bg-dark rounded-lg text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'blocked')}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="p-4">Company Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="border-t border-gray-700">
                  <td className="p-4 text-white">{company.name}</td>
                  <td className="p-4 text-white">{company.email}</td>
                  <td className="p-4 text-white">{company.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      company.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(company.id)}
                        className="px-3 py-1 rounded-lg text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setIsEditModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                      >
                        Edit
                      </button>
                      {company.status === 'active' ? (
                        <button
                          onClick={() => handleSuspendCompany(company.id)}
                          className="px-3 py-1 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateCompany(company.id)}
                          className="px-3 py-1 rounded-lg text-sm bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
                        className="px-3 py-1 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-blue rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Add New Company</h2>
            <CompanyForm
              onSubmit={handleAddCompany}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {isEditModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-blue rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Edit Company</h2>
            <CompanyForm
              initialData={selectedCompany}
              onSubmit={handleEditCompany}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Company Details Modal */}
      {isDetailsModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-blue rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-white">Company Details</h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Company Name</p>
                <p className="text-white">{selectedCompany.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="text-white">{selectedCompany.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone</p>
                <p className="text-white">{selectedCompany.phone}</p>
              </div>
              <div>
                <p className="text-gray-400">Address</p>
                <p className="text-white">{selectedCompany.address}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className={`${
                  selectedCompany.status === 'active' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedCompany.status}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Created At</p>
                <p className="text-white">{new Date(selectedCompany.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CompaniesManagement; 