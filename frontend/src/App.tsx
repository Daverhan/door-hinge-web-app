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
<<<<<<< HEAD
import EditProfile from "./components/EditProfile";
import ResetPassword from "./components/ResetPassword";
import Goodbye from "./components/Goodbye";
=======
import Moderator from "./components/Moderator";
import { AuthProvider } from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
>>>>>>> origin/main

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/makeaccount" element={<MakeAccount />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/Goodbye" element={<Goodbye />} />
          <Route
            path="/home"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          />
          <Route
            path="/create-listing"
            element={
              <>
                <Navbar />
                <CreateListing />
              </>
            }
          />
        </Routes>
      </main>
=======
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
              path="/moderator"
              element={
                <ProtectedRoute>
                  <>
                    <Moderator />
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
>>>>>>> origin/main
    </Router>
  );
}

export default App;
