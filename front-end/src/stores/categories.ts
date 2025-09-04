import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
}

export const useCategoryStore = defineStore('categories', {
  state: (): CategoryState => ({
    categories: [],
    loading: false,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const response = await api.get('/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        this.loading = false;
      }
    },

    async createCategory(categoryData: any) {
      try {
        const response = await api.post('/categories', categoryData);
        this.categories.push(response.data);
        return { success: true };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Failed to create category' 
        };
      }
    },
  },
});