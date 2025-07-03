import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store"; // ✅ adjust this path if needed
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import Installations from "./pages/Installations";
import Services from "./pages/Services";
import Contracts from "./pages/Contracts";
import Alerts from "./pages/Alerts";
import Facilities from "./pages/Facilities";
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/installations" element={<Installations />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/facilities" element={<Facilities />} />
          {/* Add more routes if needed */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
