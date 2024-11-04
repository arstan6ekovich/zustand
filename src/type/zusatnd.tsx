// store/api.ts
import axios from "axios";
import { create } from "zustand";

interface Todo {
  _id: number;
  img: string;
  name: string;
}

interface TodoStore {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  postTodos: (data: { img: string; name: string }) => Promise<void>;
  deleteTodos: (id: number) => Promise<void>;
  patchTodos: (
    id: number,
    data: { img: string; name: string }
  ) => Promise<void>;
}

const api = create<TodoStore>((set) => ({
  todos: [],

  fetchTodos: async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_ZUSTAND}`);
    set({ todos: data });
  },

  postTodos: async (data) => {
    const { data: responseData } = await axios.post(
      `${process.env.NEXT_PUBLIC_ZUSTAND}`,
      data
    );
    set((state) => ({ todos: [...state.todos, responseData] }));
  },

  deleteTodos: async (id) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_ZUSTAND}/${id}`);
    set((state) => ({
      todos: state.todos.filter((todo) => todo._id !== id),
    }));
  },

  patchTodos: async (id, updatedData) => {
    const { data: updatedTodo } = await axios.patch(
      `${process.env.NEXT_PUBLIC_ZUSTAND}/${id}`,
      updatedData
    );
    set((state) => ({
      todos: state.todos.map((todo) => (todo._id === id ? updatedTodo : todo)),
    }));
  },
}));

export default api;
