import React, { useState } from "react";
import { useTodoContext } from "../context/TodoContext";
import ConfirmBox from "./ConfirmBox";

export default function Footer() {
  const { total, doneTotal, setReload, delDone, checkAll } = useTodoContext();
  const [removeAllDone, setRemoveAllDone] = useState(false);
  const removeAllDoneHandler = () => {
    delDone()
      .then((data) => {
        console.log("aff:", data);
        setReload(true);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setRemoveAllDone(false);
      });
  };

  const checkAllHandler = (e) => {
    const isDone = e.target.checked;
    checkAll(isDone)
      .then((data) => {
        console.log("aff:", data);
        setReload(true);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {});
  };

  if (total() < 1) {
    return <></>;
  }
  return (
    <>
      {removeAllDone && (
        <ConfirmBox
          okCallback={removeAllDoneHandler}
          cancelCallback={() => {
            setRemoveAllDone(false);
          }}
        >
          确定要清除所有已完成？
        </ConfirmBox>
      )}
      <div className="flex justify-between items-center space-x-2 p-3">
        <div className="flex justify-start items-center space-x-2">
          <input
            type="checkbox"
            checked={total() && total() === doneTotal()}
            onChange={checkAllHandler}
          />
          <div>
            {doneTotal()}完成/共计{total()}
          </div>
        </div>
        <div>
          <button
            className="border text-white bg-red-600 border-red-700 hover:bg-red-700 px-3 py-1 rounded"
            onClick={() => {
              setRemoveAllDone(true);
            }}
          >
            清除所有已完成
          </button>
        </div>
      </div>
    </>
  );
}
