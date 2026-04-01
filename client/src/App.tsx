import { Routes, Route, Navigate } from "react-router";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Onboarding from "./pages/onboarding/Onboarding";
import ChatPage from "./pages/chat/ChatPage";
// import { Divide } from "lucide-react";


const App = () => {

  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  };

  return (

    <>
      <Routes>
        <Route path="/" element={user ? (user.isOnboarded ? < ChatPage /> : <Navigate to="/onboarding" />): <Navigate to="/login" />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/onboarding" element={!user ? <Navigate to="/login" /> : (user?.isOnboarded ? <Navigate to="/" /> : <Onboarding />)} />
      </Routes>

      <Toaster />
    </>
  )
}

export default App;
