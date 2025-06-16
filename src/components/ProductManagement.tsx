
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Save, Trash2, Edit, Package, Tag, Percent } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  reduction?: number;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  reduction?: number;
}

export const ProductManagement = () => {
  const [activeSection, setActiveSection] = useState('products');
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Gourmet Burger', price: 12.99, description: 'Delicious beef burger', image: '/placeholder.svg', category: 'Burgers' },
    { id: 2, name: 'Caesar Salad', price: 8.99, description: 'Fresh caesar salad', image: '/placeholder.svg', category: 'Salads' },
  ]);
  
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Burgers', icon: '🍔' },
    { id: 2, name: 'Salads', icon: '🥗' },
    { id: 3, name: 'Drinks', icon: '🥤' },
  ]);

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

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      const product: Product = {
        id: Date.now(),
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        image: newProduct.image || '/placeholder.svg',
        category: newProduct.category,
        reduction: newProduct.reduction ? parseFloat(newProduct.reduction) : undefined
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', price: '', description: '', image: '', category: '', reduction: '' });
      setShowProductForm(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.icon) {
      const category: Category = {
        id: Date.now(),
        name: newCategory.name,
        icon: newCategory.icon,
        reduction: newCategory.reduction ? parseFloat(newCategory.reduction) : undefined
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', icon: '', reduction: '' });
      setShowCategoryForm(false);
    }
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
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
            <h3 className="text-xl font-semibold text-black">Products</h3>
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
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="rounded-xl"
                  />
                  <Input
                    placeholder="Price"
                    type="number"
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
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Reduction % (optional)"
                    type="number"
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
                    <span className="font-bold text-black">${product.price}</span>
                    <Badge className="bg-gray-100 text-black">{product.category}</Badge>
                  </div>
                  {product.reduction && (
                    <Badge className="bg-red-100 text-red-800 mb-2">-{product.reduction}%</Badge>
                  )}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteProduct(product.id)}
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
            <h3 className="text-xl font-semibold text-black">Categories</h3>
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
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="rounded-xl"
                  />
                  <Input
                    placeholder="Icon (emoji)"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                    className="rounded-xl"
                  />
                  <Input
                    placeholder="Reduction % (optional)"
                    type="number"
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
                  {category.reduction && (
                    <Badge className="bg-red-100 text-red-800 mb-2">-{category.reduction}%</Badge>
                  )}
                  <div className="flex space-x-2 justify-center">
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteCategory(category.id)}
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
                  {products.filter(p => p.reduction).map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                      <span className="text-black">{product.name}</span>
                      <Badge className="bg-red-100 text-red-800">-{product.reduction}%</Badge>
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
                  {categories.filter(c => c.reduction).map((category) => (
                    <div key={category.id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                      <span className="text-black">{category.icon} {category.name}</span>
                      <Badge className="bg-red-100 text-red-800">-{category.reduction}%</Badge>
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
