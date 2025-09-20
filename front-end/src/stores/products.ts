import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId?: string;
  stockQuantity: number;
  images: string[];
  isActive: boolean;
  minStock: number;
  maxStock: number;
  costPrice: number;
  supplier?: string;
  barcode?: string;
  location?: string;
  lastInventoryDate?: string;
  inventoryNotes?: string;
  category?: {
    id: string;
    name: string;
  };
}

interface ProductState {
  products: Product[];
  loading: boolean;
}

export const useProductStore = defineStore('products', {
  state: (): ProductState => ({
    products: [],
    loading: false,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await api.get('/products');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },

    async createProduct(productData: any) {
      try {
        const response = await api.post('/products', productData);
        this.products.push(response.data);
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Failed to create product' 
        };
      }
    },

    async updateProduct(id: string, productData: any) {
      try {
        const response = await api.put(`/products/${id}`, productData);
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Failed to update product' 
        };
      }
    },

    async deleteProduct(id: string) {
      try {
        await api.delete(`/products/${id}`);
        this.products = this.products.filter(p => p.id !== id);
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Failed to delete product' 
        };
      }
    },

    async updateStock(id: string, stockData: { stockQuantity: number; inventoryNotes?: string }) {
      try {
        const response = await api.patch(`/products/${id}/stock`, stockData);
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Failed to update stock' 
        };
      }
    },
  },
});