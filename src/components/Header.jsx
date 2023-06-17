import React from "react";
import { useTodoContext } from "../context/TodoContext";

export default function Header() {
  const { setReload, addItem } = useTodoContext();

  const addHandler = (e) => {
    if (e.key === "Enter") {
      const title = e.target.value.trim();
      addItem(title)
        .then((id) => {
          console.log("id", id);
          setReload(true);
        })
        .catch((e) => {
          console.log(e);
        });

      e.target.value = "";
    }
  };
  return (
    <>
      <h1 className="text-2xl mx-auto my-3 text-cyan-700 max-w-max">
        待办事项
      </h1>
      <div className="">
        <input
          className="border border-blue-300 block w-full outline-none p-3 rounded-md"
          onKeyUp={addHandler}
          placeholder="输入待办事项，按回车添加"
        />
      </div>
    </>
  );
}
