import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./Dashboard";
import About from "./About";
import "./App.css";

function App() {
  return (
    <>
      <nav className="main-nav">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
