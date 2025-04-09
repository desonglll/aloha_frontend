import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "npm:framer-motion@^11.0.8";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import UserGroups from "./pages/UserGroups.tsx";
import HealthCheck from "./components/HealthCheck.tsx";
import PageTransition from "./components/PageTransition.tsx";
import Users from "./pages/Users.tsx";
import Permissions from "./pages/Permissions.tsx";
import GroupPermissions from "./pages/GroupPermissions.tsx";

// Wrapper component to use useLocation hook
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/user-groups"
          element={
            <PageTransition>
              <UserGroups />
            </PageTransition>
          }
        />
        <Route
          path="/users"
          element={
            <PageTransition>
              <Users />
            </PageTransition>
          }
        />
        <Route
          path="/permissions"
          element={
            <PageTransition>
              <Permissions />
            </PageTransition>
          }
        />
        <Route
          path="/group-permissions"
          element={
            <PageTransition>
              <GroupPermissions />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-gray-100 overflow-y-scroll">
        <AnimatedRoutes />
        <HealthCheck />
      </div>
    </Router>
  );
}

export default App;
