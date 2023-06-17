import { createContext, useContext, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";

export const TodoContext = createContext();

export function TodoContextProvider({ value, children }) {
  const [list, setList] = useState(value || []);
  const [reload, setReload] = useState(false);

  const getList = async () => {
    const todoList = await invoke("list");
    setList(todoList);
    return list;
  };
  const getDoneList = () => {
    return list.filter((t) => t.is_done);
  };
  const total = () => {
    return list.length;
  };
  const doneTotal = () => {
    return getDoneList().length;
  };
  const addItem = async (title) => {
    return await invoke("add_item", { title });
  };
  const editItem = async (item) => {
    return await invoke("edit", { item });
  };
  const delItem = async (id) => {
    return await invoke("del", { id });
  };
  const checkItem = async (id) => {
    return await invoke("check", { id });
  };
  const delDone = async () => {
    return await invoke("del_done");
  };
  const checkAll = async (isDone) => {
    return await invoke("check_all", { isDone });
  };

  return (
    <TodoContext.Provider
      value={{
        getList,
        reload,
        setReload,
        getDoneList,
        total,
        doneTotal,
        addItem,
        editItem,
        delItem,
        checkItem,
        delDone,
        checkAll,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export const useTodoContext = () => useContext(TodoContext);
