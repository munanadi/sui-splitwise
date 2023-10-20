import { Route, Routes } from "react-router-dom";
import NavBar from "./NavBar";
import About from "./About";
import Home from "./Home";
import NotFound from "./NotFound";
import Footer from "./Footer";
import Transactions from "./Transactions";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Toaster />
      <NavBar />

      <div className="my-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
