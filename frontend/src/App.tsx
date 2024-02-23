import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import MakeAccount from "./components/MakeAccount";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/makeaccount" element={<MakeAccount />} />

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
        </Routes>
      </main>
    </Router>
  );
}

export default App;
