import NavBar from "./NavBar";
import { Route, Routes } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import NotFound from "./NotFound";

function App() {
  return (
    <>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
