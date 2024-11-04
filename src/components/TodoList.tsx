"use client";
import api from "@/type/zusatnd";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface TodoType {
  img: string;
  name: string;
}

const TodoList = () => {
  const {
    register: registerData,
    handleSubmit: handleSubmitData,
    reset,
  } = useForm<TodoType>();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
  } = useForm<TodoType>();
  const [id, setId] = useState<number | null>(null);
  const { todos, postTodos, fetchTodos, deleteTodos, patchTodos } = api();
  console.log(todos);

  const onSubmit: SubmitHandler<TodoType> = async (data) => {
    await postTodos(data);
    reset(); // Сброс формы после добавления
  };

  const onSubmitEdit: SubmitHandler<TodoType> = async (data) => {
    if (id !== null) {
      await patchTodos(id, data);
      setId(null); // Сбросить ID после редактирования
      resetEdit(); // Сброс формы редактирования
    }
    setId(null);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <h1>TodoList Zustand</h1>
      <form onSubmit={handleSubmitData(onSubmit)}>
        <input
          type="text"
          placeholder="Image URL"
          {...registerData("img", { required: true })}
        />
        <input
          type="text"
          placeholder="Name"
          {...registerData("name", { required: true })}
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map((item, index) =>
          id === item._id ? (
            <li key={index}>
              <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
                <input
                  type="text"
                  placeholder="Image URL"
                  {...registerEdit("img", { required: true })}
                  defaultValue={item.img}
                />
                <input
                  type="text"
                  placeholder="Name"
                  {...registerEdit("name", { required: true })}
                  defaultValue={item.name}
                />
                <button type="submit">Submit</button>
                <button onClick={() => setId(null)}>Cancel</button>
              </form>
            </li>
          ) : (
            <li key={item._id}>
              <h2>{item.name}</h2>
              <button onClick={() => deleteTodos(item._id)}>Delete</button>
              <button onClick={() => setId(item._id)}>Edit</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default TodoList;
