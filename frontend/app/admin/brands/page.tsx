'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { adminAPI, Brand } from '@/lib/api';
import { Card, CardBody, Button, Badge, LoadingSpinner, Input } from '@/components/ui';
import { routes } from '@/lib/routes';

export default function AdminBrandsPage() {
  const router = useRouter();
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

  const handleBrandClick = (brandId: number) => {
    router.push(`${routes.adminBrands}/${brandId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
            <p className="text-gray-600 mt-1 mb-1">Manage all brands and their configurations</p>
            <p className="text-sm font-medium text-primary-600">Replies, right on time</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Brand
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardBody className="p-4">
            <div className="flex flex-wrap gap-4">
              <Input
                type="text"
                placeholder="Filter by category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 min-w-[200px]"
              />
              <select
                value={statusFilter === undefined ? 'all' : statusFilter.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setStatusFilter(value === 'all' ? undefined : value === 'true');
                }}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </CardBody>
        </Card>

        {/* Brands List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : brands.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12 text-gray-500">No brands found</div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {brands.map((brand) => (
              <Card 
                key={brand.id} 
                hover
                onClick={() => handleBrandClick(brand.id)}
                className="cursor-pointer"
              >
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                        <Badge variant={brand.is_active ? 'success' : 'error'}>
                          {brand.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {brand.category && (
                        <p className="text-sm text-gray-500">Category: {brand.category}</p>
                      )}
                    </div>
                    <Button
                      variant={brand.is_active ? 'danger' : 'primary'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(brand.id, brand.is_active);
                      }}
                    >
                      {brand.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold mb-4">Create New Brand</h3>
                <div className="space-y-4">
                  <Input
                    label="Brand Name"
                    type="text"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Enter brand name"
                    required
                  />
                  <Input
                    label="Category (optional)"
                    type="text"
                    value={newBrandCategory}
                    onChange={(e) => setNewBrandCategory(e.target.value)}
                    placeholder="e.g., Retail, Food & Beverage"
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewBrandName('');
                      setNewBrandCategory('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCreateBrand}
                  >
                    Create
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

