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
import Moderator from "./components/Moderator";

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
            path="/messages"
            element={
              <>
                <Navbar />
                <Messages />
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
          <Route
            path="/favorites"
            element={
              <>
                <Navbar />
                <Favorites />
              </>
            }
          />
          <Route
            path="/moderator"
            element={
              <>
                <Moderator />
              </>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
