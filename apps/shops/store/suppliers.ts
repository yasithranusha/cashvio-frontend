import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TSupplier } from '@/types/supplier';
import { getSuppliers } from '@/actions/supplier';

interface SupplierState {
  suppliers: TSupplier[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSuppliers: (shopId: string) => Promise<void>;
  setSuppliers: (suppliers: TSupplier[]) => void;
  reset: () => void;
}

export const useSupplierStore = create<SupplierState>()(
  persist(
    (set) => ({
      suppliers: [],
      isLoading: false,
      error: null,
      
      fetchSuppliers: async (shopId: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await getSuppliers(shopId);
          
          if (result.success && result.data) {
            set({ suppliers: result.data.data || [] });
          } else if (result.error) {
            set({ error: `Failed to fetch suppliers: ${result.error}` });
          }
        } catch (error) {
          set({ error: `Failed to fetch suppliers: ${error instanceof Error ? error.message : String(error)}` });
        } finally {
          set({ isLoading: false });
        }
      },
      
      setSuppliers: (suppliers: TSupplier[]) => {
        set({ suppliers });
      },
      
      reset: () => {
        set({ 
          suppliers: [],
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'supplier-storage',
      // Only persist supplier data, not the loading state or errors
      partialize: (state) => ({
        suppliers: state.suppliers,
      }),
    }
  )
);