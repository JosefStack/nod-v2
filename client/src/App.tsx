import { Routes, Route, Navigate } from "react-router";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Onboarding from "./pages/onboarding/Onboarding";
import ChatPage from "./pages/chat/ChatPage";
import { Spinner } from "@/components/ui/spinner";


const App = () => {

  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center gap-1 bg-black">
        <Spinner className="size-6 text-white"/>
        <span className="text-white">Loading</span>
    </div>
  };

  return (

    <>
      <Routes>
        <Route path="/" element={user ? (user.isOnboarded ? < ChatPage /> : <Navigate to="/onboarding" />) : <Navigate to="/login" />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/onboarding" element={!user ? <Navigate to="/login" /> : (user?.isOnboarded ? <Navigate to="/" /> : <Onboarding />)} />
      </Routes>

      <Toaster />
    </>
  )
}

export default App;
