import { BrowserRouter, Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import React from "react";
import Layout from "./components/Layout.tsx";
import Loading from "./components/Loading.tsx";

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
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user-groups" element={<UserGroups />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/tweets" element={<Tweets />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
