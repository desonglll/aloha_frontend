import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "npm:framer-motion@^11.0.8";
import Navbar from "./components/Navbar.tsx";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import UserGroups from "./pages/UserGroups.tsx";
import HealthCheck from "./components/HealthCheck.tsx";
import PageTransition from "./components/PageTransition.tsx";
import Users from "./pages/Users.tsx";

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
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <AnimatedRoutes />
        <HealthCheck />
      </div>
    </Router>
  );
}

export default App;
