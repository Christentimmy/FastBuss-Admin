export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'blocked';
  createdAt: string;
  updatedAt: string;
  parentCompanyId?: string; // For sub-companies
}

export interface CompanyFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  parentCompanyId?: string;
} 