"use client";
import zustand from "@/stores/zustand";
import Image from "next/image";
import { useEffect, useState } from "react";

const TodoList = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [imageEdit, setImageEdit] = useState("");
  const [titleEdit, setTitleEdit] = useState("");
  const [isEdit, setIsEdit] = useState<number | null>(null);
  const { PostProduct, GetProduct, DeleteProduct, PatchProduct, product } =
    zustand();

  const onSubmit = async () => {
    const newProduct = {
      image,
      title,
    };
    await PostProduct(newProduct);
    setImage("");
    setTitle("");
  };

  const onSubmitEdit = async () => {
    if (isEdit !== null) {
      const newProduct = {
        image: imageEdit,
        title: titleEdit,
      };
      await PatchProduct(isEdit, newProduct);
      setIsEdit(null);
      setImageEdit("");
      setTitleEdit("");
    }
  };

  useEffect(() => {
    GetProduct();
  }, [GetProduct]);

  return (
    <div>
      <h1>TodoList</h1>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL"
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <button onClick={onSubmit}>Submit</button>

      {product.map((item) => (
        <div key={item._id ?? item.title}>
          {isEdit === item._id ? (
            <>
              <input
                type="text"
                value={imageEdit}
                onChange={(e) => setImageEdit(e.target.value)}
                placeholder="Edit Image URL"
              />
              <input
                type="text"
                value={titleEdit}
                onChange={(e) => setTitleEdit(e.target.value)}
                placeholder="Edit Title"
              />
              <button onClick={onSubmitEdit}>Submit</button>
            </>
          ) : (
            <div>
              <Image
                width={200}
                height={200}
                src={item.image}
                alt={item.title}
              />
              <h3>{item.title}</h3>
              <button onClick={() => DeleteProduct(item._id)}>Delete</button>
              <button
                onClick={() => {
                  setIsEdit(item._id);
                  setImageEdit(item.image);
                  setTitleEdit(item.title);
                }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoList;
