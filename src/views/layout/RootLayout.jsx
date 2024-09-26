import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const RootLayout = () => {
  return (
    <main>
      <Header/>
      <Outlet />
    </main>
  );
};

export default RootLayout;
