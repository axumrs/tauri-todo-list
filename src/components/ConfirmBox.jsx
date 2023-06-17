import React from "react";

export default function ConfirmBox({
  children = <></>,
  okCallback = () => {},
  cancelCallback = () => {},
}) {
  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border rounded shadow-md p-6 min-w-[20rem]">
        <div className="flex flex-col gap-y-3">
          <div className="text-gray-600 text-sm">确认</div>
          <div className="min-h-[5rem] text-lg">{children}</div>
          <div className="flex justify-end items-center space-x-2">
            <button
              className="border text-white px-3 py-1 rounded bg-blue-600 border-blue-700 hover:bg-blue-700"
              onClick={okCallback}
            >
              确定
            </button>
            <button
              className="border text-gray-900 px-3 py-1 rounded bg-gray-50 border-gray-300 hover:bg-gray-100"
              onClick={cancelCallback}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
