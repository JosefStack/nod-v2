import { Routes, Route, Navigate } from "react-router";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "sonner";


const App = () => {

  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [])

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (

    <>
      <Routes>
        <Route path="/" element={user ? <div>chat</div> : <Navigate to="/login" />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      </Routes>

      <Toaster />
    </>
  )
}

export default App  
