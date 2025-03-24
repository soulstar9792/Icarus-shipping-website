// src/pages/Main.js
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Dashboard from "../components/Main/Dashboard";
import OrderLabel from "../components/Main/OrderLabel";
import BulkOrder from "../components/Main/BulkOrder/index";
import Orders from "../components/Main/Orders";
import BatchOrders from "../components/Main/BatchOrders";
import Deposit from "../components/Main/Deposit";
import Address from "../components/Main/Address";
import AdminPanel from "../components/Main/AdminPanel";
import Sidebar from "../components/Main/Sidebar"; // Import Sidebar
import MainHeader from "../components/Main/MainHeader"; // Import MainHeader
import Account from "../components/Main/Account"; // Import the Account component
import SKUManagement from "../components/Main/SKUMangement";

const routes = [
  { path: "dashboard", Component: Dashboard },
  { path: "order-label", Component: OrderLabel },
  { path: "bulk-order", Component: BulkOrder },
  { path: "orders", Component: Orders },
  { path: "batch-orders", Component: BatchOrders },
  { path: "deposit", Component: Deposit },
  { path: "address", Component: Address },
  { path: "sku", Component: SKUManagement },
  { path: "admin", Component: AdminPanel },
  { path: "account", Component: Account }, // Add the new Account route
];

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // console.log(isSidebarOpen);
  };
  return (
    <div className="flex h-screen bg-custom-background">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        toggleSidebar={toggleSidebar}
      />{" "}
      {/* Static Sidebar on the left */}
      <div className="flex flex-col w-[calc(100%-200px)] w-full ">
        <MainHeader
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex-1 overflow-auto">
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PrivateRoute>
                    <route.Component />
                  </PrivateRoute>
                }
              />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Main;
