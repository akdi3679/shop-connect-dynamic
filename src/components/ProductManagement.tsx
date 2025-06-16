
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/contexts/ProductContext';
import { Package, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export const ProductManagement = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory } = useProducts();
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: ''
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      toast.error('Please fill all fields correctly');
      return;
    }

    addProduct({
      ...newProduct,
      id: Date.now(),
      image: newProduct.image || '/placeholder.svg'
    });

    setNewProduct({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: ''
    });

    toast.success('Product added successfully!');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    addCategory(newCategory.trim());
    setNewCategory('');
    toast.success('Category added successfully!');
  };

  const startEdit = (product: any) => {
    setEditingProduct(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category || ''
    });
  };

  const saveEdit = () => {
    if (!editForm.name || !editForm.description || editForm.price <= 0) {
      toast.error('Please fill all fields correctly');
      return;
    }

    updateProduct(editingProduct!, editForm);
    setEditingProduct(null);
    toast.success('Product updated successfully!');
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: ''
    });
  };

  const handleDelete = (productId: number, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      deleteProduct(productId);
      toast.success('Product deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black">Product Management</h2>
      
      {/* Add New Category */}
      <Card className="glass-morphism border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-white/80 border-gray-200"
            />
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add New Product */}
      <Card className="glass-morphism border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="bg-white/80 border-gray-200"
            />
            <Input
              type="number"
              placeholder="Price"
              value={newProduct.price || ''}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
              className="bg-white/80 border-gray-200"
            />
            <Input
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="bg-white/80 border-gray-200"
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="px-3 py-2 bg-white/80 border border-gray-200 rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Textarea
              placeholder="Product description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="md:col-span-2 bg-white/80 border-gray-200"
            />
            <Button onClick={handleAddProduct} className="md:col-span-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card className="glass-morphism border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-black">Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white/80 rounded-lg p-4 border border-gray-200">
                {editingProduct === product.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="bg-white border-gray-200"
                    />
                    <Input
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                      className="bg-white border-gray-200"
                    />
                    <Input
                      value={editForm.image}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      className="bg-white border-gray-200"
                      placeholder="Image URL"
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-md"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="md:col-span-2 bg-white border-gray-200"
                    />
                    <div className="md:col-span-2 flex gap-2">
                      <Button onClick={saveEdit} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-black">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEdit(product)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id, product.name)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
