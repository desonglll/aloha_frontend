import { BrowserRouter, Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import React from "react";
import Layout from "./components/Layout";
import Loading from "./components/Loading";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Users = lazy(() => import("./pages/Users"));
const UserGroups = lazy(() => import("./pages/UserGroups"));
const Permissions = lazy(() => import("./pages/Permissions"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user-groups" element={<UserGroups />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
