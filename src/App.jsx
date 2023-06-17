import React from "react";

import List from "./components/List";
import Footer from "./components/Footer";
import Header from "./components/Header";

import { TodoContextProvider } from "./context/TodoContext";

export default function App() {
  return (
    <TodoContextProvider value={[]}>
      <div className="m-3">
        <Header />
        <List />
        <Footer />
      </div>
    </TodoContextProvider>
  );
}
