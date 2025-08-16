import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Page_Layout from "./components/Page_Layout";
import AuthProvider from "./context/authentication/authProvider";
import HomePage from "./pages/Home";
import { Navigate } from "react-router-dom";
import Login from "./pages/authentication/Login";
import MerchandisingLayout from "./components/Merchandise/MechandisingLayout";
import Merchandising from "./pages/Mechandising";
import PendingMerchandise from "./pages/PendingMerchandise";
import ReviewedMerchandise from "./pages/ReviewedMerchandise";

import OrderLayout from "./components/Orders-Layout";
import OrdersPage from "./pages/Orders";

import StaffLayout from "./components/Staff-Layout";
import StaffPage from "./pages/Staff";
import StaffRegistration from "./pages/authentication/Register";
import Analytics from "./pages/analytics";

import LeaderboardPage from "./pages/Leaderboard";
import LeaderboardLayout from "./components/Leaderboard-Layout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Page_Layout />}>
          <Route index element={<Navigate to="home" replace />}></Route>
          <Route path={"home"} element={<HomePage />}></Route>

          <Route path="merchandise/" element={<MerchandisingLayout />}>
            <Route index element={<Merchandising />}></Route>
            <Route
              path="merch_pending_review/:merchId"
              element={<PendingMerchandise />}
            />
            <Route
              path="merch_reviewed/:merchId"
              element={<ReviewedMerchandise />}
            />
          </Route>

          <Route path="orders/" element={<OrderLayout />}>
            <Route index element={<OrdersPage />}></Route>
          </Route>

          <Route path="leaderboard/" element={<LeaderboardLayout />}>
            <Route index element={<LeaderboardPage />}></Route>
          </Route>

          <Route path="staff/" element={<StaffLayout />}>
            <Route index element={<StaffPage />}></Route>
            <Route path="registration" element={<StaffRegistration />}></Route>
          </Route>

          <Route path="analytics" element={<Analytics />}></Route>
        </Route>
        <Route path="auth/login" element={<Login />}></Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
