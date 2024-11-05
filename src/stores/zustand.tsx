import axios from "axios";
import { create } from "zustand";

interface ProductType {
  _id: number;
  image: string;
  title: string;
}

interface ZustandType {
  product: ProductType[];
  GetProduct: () => void;
  PostProduct: (data: { image: string; title: string }) => void;
  DeleteProduct: (id: number) => void;
  PatchProduct: (id: number, data: { image?: string; title?: string }) => void;
}

const zustand = create<ZustandType>((set) => ({
  product: [],

  GetProduct: async () => {
    try {
      const { data } = await axios.get<ProductType[]>(
        `${process.env.NEXT_PUBLIC_ZUSTAND}`
      );
      set({ product: data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },

  PostProduct: async (data) => {
    try {
      const { data: response } = await axios.post<ProductType>(
        `${process.env.NEXT_PUBLIC_ZUSTAND}`,
        data
      );
      set((state) => ({ product: [...state.product, response] }));
    } catch (error) {
      console.error("Error posting product:", error);
    }
  },

  DeleteProduct: async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_ZUSTAND}/${id}`);
      set((state) => ({
        product: state.product.filter((item) => item._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  },

  PatchProduct: async (id, data) => {
    try {
      const { data: response } = await axios.patch<ProductType>(
        `${process.env.NEXT_PUBLIC_ZUSTAND}/${id}`,
        data
      );
      set((state) => ({
        product: state.product.map((item) =>
          item._id === id ? response : item
        ),
      }));
    } catch (error) {
      console.error("Error patching product:", error);
    }
  },
}));

export default zustand;
