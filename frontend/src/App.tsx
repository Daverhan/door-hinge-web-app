import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import MakeAccount from "./components/MakeAccount";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import CreateListing from "./components/CreateListing";
import Favorites from "./components/Favorites";
import EditProfile from "./components/EditProfile";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/makeaccount" element={<MakeAccount />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
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
    </Router>
  );
}

export default App;
