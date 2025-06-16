
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Trash2, Edit, Package, Tag, Percent } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { toast } from 'sonner';

export const ProductManagement = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    deleteProduct, 
    addCategory, 
    deleteCategory,
    updateProduct,
    updateCategory 
  } = useProducts();
  
  const [activeSection, setActiveSection] = useState('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    reduction: ''
  });

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '',
    reduction: ''
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      addProduct({
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        image: newProduct.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
        category: newProduct.category,
        reduction: newProduct.reduction ? parseFloat(newProduct.reduction) : undefined
      });
      setNewProduct({ name: '', price: '', description: '', image: '', category: '', reduction: '' });
      setShowProductForm(false);
      toast.success('Product added successfully!');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.icon) {
      addCategory({
        name: newCategory.name,
        icon: newCategory.icon,
        reduction: newCategory.reduction ? parseFloat(newCategory.reduction) : undefined
      });
      setNewCategory({ name: '', icon: '', reduction: '' });
      setShowCategoryForm(false);
      toast.success('Category added successfully!');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
    toast.success('Product deleted successfully!');
  };

  const handleDeleteCategory = (id: number) => {
    deleteCategory(id);
    toast.success('Category deleted successfully!');
  };

  const handleApplyReduction = (type: 'product' | 'category', id: number, reduction: string) => {
    const reductionValue = parseFloat(reduction);
    if (isNaN(reductionValue) || reductionValue < 0 || reductionValue > 100) {
      toast.error('Please enter a valid reduction percentage (0-100)');
      return;
    }

    if (type === 'product') {
      updateProduct(id, { reduction: reductionValue });
    } else {
      updateCategory(id, { reduction: reductionValue });
    }
    toast.success(`Reduction applied successfully!`);
  };

  const sections = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'reductions', label: 'Reductions', icon: Percent },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-black">Product Management</h2>
      </div>

      {/* Section Navigation */}
      <div className="flex space-x-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              onClick={() => setActiveSection(section.id)}
              className="rounded-xl"
            >
              <Icon className="h-4 w-4 mr-2" />
              {section.label}
            </Button>
          );
        })}
      </div>

      {/* Products Section */}
      {activeSection === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-black">Products ({products.length})</h3>
            <Button 
              onClick={() => setShowProductForm(!showProductForm)}
              className="bg-black hover:bg-gray-800 text-white rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Add Product Form */}
          {showProductForm && (
            <Card className="glass-morphism border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-black">Add New Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Product Name *"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="rounded-xl"
                  />
                  <Input
                    placeholder="Price *"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="rounded-xl"
                  />
                  <Input
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="rounded-xl"
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="rounded-xl border border-gray-300 px-3 py-2"
                  >
                    <option value="">Select Category *</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Reduction % (optional)"
                    type="number"
                    min="0"
                    max="100"
                    value={newProduct.reduction}
                    onChange={(e) => setNewProduct({...newProduct, reduction: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <Input
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="rounded-xl"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleAddProduct} className="bg-black hover:bg-gray-800 text-white rounded-xl">
                    <Save className="h-4 w-4 mr-2" />
                    Save Product
                  </Button>
                  <Button variant="outline" onClick={() => setShowProductForm(false)} className="rounded-xl">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="glass-morphism border-gray-200/50">
                <CardContent className="p-4">
                  <div className="aspect-video mb-3 rounded-xl overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-semibold text-black mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-black">${product.price.toFixed(2)}</span>
                    <Badge className="bg-gray-100 text-black">{product.category}</Badge>
                  </div>
                  {product.reduction && (
                    <Badge className="bg-red-100 text-red-800 mb-2">-{product.reduction}%</Badge>
                  )}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="rounded-xl text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Categories Section */}
      {activeSection === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-black">Categories ({categories.length})</h3>
            <Button 
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="bg-black hover:bg-gray-800 text-white rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Add Category Form */}
          {showCategoryForm && (
            <Card className="glass-morphism border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-black">Add New Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Category Name *"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="rounded-xl"
                  />
                  <Input
                    placeholder="Icon (emoji) *"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                    className="rounded-xl"
                  />
                  <Input
                    placeholder="Reduction % (optional)"
                    type="number"
                    min="0"
                    max="100"
                    value={newCategory.reduction}
                    onChange={(e) => setNewCategory({...newCategory, reduction: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddCategory} className="bg-black hover:bg-gray-800 text-white rounded-xl">
                    <Save className="h-4 w-4 mr-2" />
                    Save Category
                  </Button>
                  <Button variant="outline" onClick={() => setShowCategoryForm(false)} className="rounded-xl">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="glass-morphism border-gray-200/50">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h4 className="font-semibold text-black mb-2">{category.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {products.filter(p => p.category === category.name).length} products
                  </p>
                  {category.reduction && (
                    <Badge className="bg-red-100 text-red-800 mb-2">-{category.reduction}%</Badge>
                  )}
                  <div className="flex space-x-2 justify-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="rounded-xl text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reductions Section */}
      {activeSection === 'reductions' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-black">Manage Reductions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-morphism border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-black">Product Reductions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <span className="text-black font-medium">{product.name}</span>
                        {product.reduction && (
                          <Badge className="bg-red-100 text-red-800 ml-2">-{product.reduction}%</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          defaultValue={product.reduction || ''}
                          className="w-20 h-8"
                          onBlur={(e) => {
                            if (e.target.value) {
                              handleApplyReduction('product', product.id, e.target.value);
                            }
                          }}
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-black">Category Reductions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <span className="text-black font-medium">{category.icon} {category.name}</span>
                        {category.reduction && (
                          <Badge className="bg-red-100 text-red-800 ml-2">-{category.reduction}%</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          defaultValue={category.reduction || ''}
                          className="w-20 h-8"
                          onBlur={(e) => {
                            if (e.target.value) {
                              handleApplyReduction('category', category.id, e.target.value);
                            }
                          }}
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
