import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import CreateListing from "./components/CreateListing";
import Messages from "./components/Messages";
import Favorites from "./components/Favorites";
import EditProfile from "./components/EditProfile";
import ResetPassword from "./components/ResetPassword";
import Goodbye from "./components/Goodbye";
import Moderator from "./components/Moderator";
import { AuthProvider } from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <main>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Home />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Profile />
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Messages />
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-listing"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <CreateListing />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Favorites />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <>
                    <EditProfile />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/moderator"
              element={
                <ProtectedRoute>
                  <>
                    <Moderator />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <ProtectedRoute>
                  <>
                    <ResetPassword />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="goodbye"
              element={
                <ProtectedRoute>
                  <>
                    <Goodbye />
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
