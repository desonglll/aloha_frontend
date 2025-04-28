import { BrowserRouter, Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import React from "react";
import Layout from "./components/Layout.tsx";
import Loading from "./components/Loading.tsx";
import Login from "./pages/Login.tsx";
import ProtectedRoute from "./components/ProtectRoute.tsx";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home.tsx"));
const Users = lazy(() => import("./pages/Users.tsx"));
const UserGroups = lazy(() => import("./pages/UserGroups.tsx"));
const Permissions = lazy(() => import("./pages/Permissions.tsx"));
const Tweets = lazy(() => import("./pages/Tweets.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* login 不需要 layout */}
          <Route path="/login" element={<Login />} />

          {/* 需要 layout 的页面 */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user-groups" element={<UserGroups />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/tweets" element={<Tweets />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
