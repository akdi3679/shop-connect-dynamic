
import { Product } from '@/contexts/CartContext';

export const products: Product[] = [
  // Sandwiches
  {
    id: 1,
    name: 'Classic Club Sandwich',
    description: 'Triple-decker with turkey, bacon, lettuce, tomato, and mayo on toasted white bread.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?q=80&w=1925&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Grilled Chicken Sandwich',
    description: 'Juicy grilled chicken breast with avocado, bacon, and chipotle mayo on brioche.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=1981&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Italian Sub Sandwich',
    description: 'Salami, ham, pepperoni, provolone, lettuce, tomato, onion, and Italian dressing.',
    price: 13.75,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Philly Cheesesteak Sandwich',
    description: 'Sliced ribeye, grilled onions, bell peppers, and melted provolone on hoagie roll.',
    price: 15.25,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'BBQ Pulled Pork Sandwich',
    description: 'Slow-cooked pulled pork with tangy BBQ sauce and coleslaw on brioche bun.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Veggie Deluxe Sandwich',
    description: 'Grilled vegetables, hummus, sprouts, cucumber, and avocado on multigrain bread.',
    price: 11.50,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1984&auto=format&fit=crop',
  },

  // Salads
  {
    id: 7,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and creamy caesar dressing.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 8,
    name: 'Greek Salad',
    description: 'Mixed greens, feta cheese, olives, tomatoes, cucumber, and Greek dressing.',
    price: 12.25,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1984&auto=format&fit=crop',
  },
  {
    id: 9,
    name: 'Quinoa Power Salad',
    description: 'Quinoa, kale, roasted sweet potato, chickpeas, and tahini lemon dressing.',
    price: 13.50,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 10,
    name: 'Chicken Cobb Salad',
    description: 'Grilled chicken, bacon, blue cheese, avocado, egg, and ranch dressing.',
    price: 14.75,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 11,
    name: 'Asian Fusion Salad',
    description: 'Mixed greens, edamame, carrots, bell peppers, and sesame ginger dressing.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1984&auto=format&fit=crop',
  },
  {
    id: 12,
    name: 'Mediterranean Salad',
    description: 'Arugula, cherry tomatoes, mozzarella, pine nuts, and balsamic vinaigrette.',
    price: 13.25,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
  },

  // Potatoes
  {
    id: 13,
    name: 'Loaded Baked Potato',
    description: 'Fluffy baked potato topped with butter, sour cream, bacon, and chives.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1553787499-6d8c48e6a4a8?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 14,
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries with sea salt and served with chipotle mayo.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=2069&auto=format&fit=crop',
  },
  {
    id: 15,
    name: 'Garlic Mashed Potatoes',
    description: 'Creamy mashed potatoes with roasted garlic and fresh herbs.',
    price: 6.75,
    image: 'https://images.unsplash.com/photo-1585158062491-7ca74d7b8c6c?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 16,
    name: 'Hasselback Potato',
    description: 'Sliced potato baked with herbs, butter, and parmesan cheese.',
    price: 9.25,
    image: 'https://images.unsplash.com/photo-1553787499-6d8c48e6a4a8?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 17,
    name: 'Potato Wedges',
    description: 'Crispy seasoned potato wedges with sour cream and chive dip.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=2069&auto=format&fit=crop',
  },
  {
    id: 18,
    name: 'Stuffed Potato Skins',
    description: 'Crispy potato skins filled with cheese, bacon, and green onions.',
    price: 10.50,
    image: 'https://images.unsplash.com/photo-1553787499-6d8c48e6a4a8?q=80&w=2070&auto=format&fit=crop',
  },

  // Drinks
  {
    id: 19,
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice packed with vitamin C.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1887&auto=format&fit=crop',
  },
  {
    id: 20,
    name: 'Green Smoothie',
    description: 'Spinach, kale, banana, pineapple, and coconut water blend.',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=1912&auto=format&fit=crop',
  },
  {
    id: 21,
    name: 'Iced Coffee',
    description: 'Cold brew coffee served over ice with a splash of cream.',
    price: 3.75,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2069&auto=format&fit=crop',
  },
  {
    id: 22,
    name: 'Berry Lemonade',
    description: 'Fresh lemonade infused with mixed berries and mint.',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1887&auto=format&fit=crop',
  },
  {
    id: 23,
    name: 'Mango Lassi',
    description: 'Creamy yogurt drink blended with ripe mangoes and cardamom.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=1912&auto=format&fit=crop',
  },
  {
    id: 24,
    name: 'Sparkling Water',
    description: 'Premium sparkling water with natural fruit flavors.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1887&auto=format&fit=crop',
  },
];
