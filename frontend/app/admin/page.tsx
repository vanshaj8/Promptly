'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { adminAPI, Brand } from '@/lib/api';

export default function AdminPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCategory, setNewBrandCategory] = useState('');

  useEffect(() => {
    loadBrands();
  }, [categoryFilter, statusFilter]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter !== undefined) params.is_active = statusFilter;
      
      const data = await adminAPI.getBrands(params);
      setBrands(data.brands);
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBrand = async () => {
    if (!newBrandName.trim()) return;

    try {
      await adminAPI.createBrand({
        name: newBrandName,
        category: newBrandCategory || undefined,
      });
      setShowCreateModal(false);
      setNewBrandName('');
      setNewBrandCategory('');
      loadBrands();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create brand');
    }
  };

  const handleToggleStatus = async (brandId: number, currentStatus: boolean) => {
    try {
      await adminAPI.toggleBrandStatus(brandId, !currentStatus);
      loadBrands();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update brand status');
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
            <p className="text-gray-600 mt-1">Manage all brands and their configurations</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Create Brand
          </button>
        </div>

        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={statusFilter === undefined ? 'all' : statusFilter.toString()}
            onChange={(e) => {
              const value = e.target.value;
              setStatusFilter(value === 'all' ? undefined : value === 'true');
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No brands found</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {brands.map((brand) => (
                <li key={brand.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{brand.name}</h3>
                      {brand.category && (
                        <p className="text-sm text-gray-500">Category: {brand.category}</p>
                      )}
                      <span
                        className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                          brand.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {brand.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(brand.id, brand.is_active)}
                      className={`px-4 py-2 rounded-md ${
                        brand.is_active
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {brand.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Create New Brand</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category (optional)</label>
                  <input
                    type="text"
                    value={newBrandCategory}
                    onChange={(e) => setNewBrandCategory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Retail, Food & Beverage"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewBrandName('');
                    setNewBrandCategory('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBrand}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

