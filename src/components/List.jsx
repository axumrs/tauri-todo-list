import React, { useEffect, useState } from "react";
import ConfirmBox from "./ConfirmBox";
import { useTodoContext } from "../context/TodoContext";

export default function List() {
  const {
    getList,
    reload,
    setReload,
    editItem: updateItem,
    delItem: removeItem,
    checkItem,
  } = useTodoContext();
  const [list, setList] = useState([]);

  const [editItem, setEditItem] = useState(null);
  const [delItem, setDelItem] = useState(null);

  useEffect(() => {
    setReload(true);
    getList()
      .then((list) => {
        setList(list);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setReload(false);
      });
  }, [reload]);

  const editHandler = () => {
    setReload(false);
    updateItem({ ...editItem })
      .then((data) => {
        console.log("aff", data);
        setReload(true);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setEditItem(null);
      });
  };

  const delHandler = () => {
    setReload(false);
    removeItem(delItem.id)
      .then((data) => {
        console.log("aff:", data);
        setReload(true);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setDelItem(null);
      });
  };

  const checkHandler = (id) => {
    return () => {
      setReload(false);
      checkItem(id)
        .then((data) => {
          console.log(data);
          setReload(true);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {});
    };
  };
  return (
    <>
      {delItem && (
        <ConfirmBox
          okCallback={delHandler}
          cancelCallback={() => {
            setDelItem(null);
          }}
        >
          确定要删除「{delItem.title}」吗？
        </ConfirmBox>
      )}
      <ul className="flex flex-col gap-y-2 my-3">
        {list.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center p-3 rounded group hover:bg-gray-100 odd:bg-gray-50"
          >
            <label className="flex justify-start items-center gap-x-2 w-full">
              <input
                type="checkbox"
                value={t.id}
                onChange={checkHandler(t.id)}
                checked={t.is_done}
              />
              {editItem && editItem.id === t.id ? (
                <input
                  value={editItem.title}
                  onChange={(e) => {
                    setEditItem({ ...editItem, title: e.target.value.trim() });
                  }}
                  onBlur={editHandler}
                  onKeyUp={(e) => e.key === "Enter" && editHandler()}
                  autoFocus
                />
              ) : (
                <span className={`${t.is_done ? "line-through" : ""}`}>
                  {t.title}
                </span>
              )}
            </label>
            <div className="flex opacity-0 justify-start items-center gap-x-2 shrink-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
              {!editItem && (
                <button
                  className="border text-sm px-2 py-1 rounded text-white bg-blue-600 border-blue-700 hover:bg-blue-700"
                  onClick={() => {
                    setEditItem({ ...t });
                  }}
                >
                  修改
                </button>
              )}
              <button
                className="border text-sm px-2 py-1 rounded text-white bg-red-600 border-red-700 hover:bg-red-700"
                onClick={() => {
                  setDelItem(t);
                }}
              >
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
