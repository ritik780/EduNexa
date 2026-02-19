import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import HomePage from "./components/HomePage.jsx";       // intro
import Login from "./components/Login.jsx";

import FeedPage from "./components/FeedPage.jsx";       // MAIN ENTRY
import UploadPage from "./components/UploadPage.jsx";
import ReelsPage from "./components/ReelsPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🟢 INTRO PAGE */}
        <Route
          path="/"
          element={
            <>
              <SignedOut>
                <HomePage />
              </SignedOut>

              <SignedIn>
                <Navigate to="/feed" />
              </SignedIn>
            </>
          }
        />

        {/* 🔐 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 AUTHENTICATED APP */}
        <Route
          path="/feed"
          element={
            <SignedIn>
              <FeedPage />
            </SignedIn>
          }
        />

        <Route
          path="/upload"
          element={
            <SignedIn>
              <UploadPage />
            </SignedIn>
          }
        />

        <Route
          path="/reels"
          element={
            <SignedIn>
              <ReelsPage />
            </SignedIn>
          }
        />

        <Route
          path="/profile"
          element={
            <SignedIn>
              <ProfilePage />
            </SignedIn>
          }
        />

        {/* 🚫 FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
