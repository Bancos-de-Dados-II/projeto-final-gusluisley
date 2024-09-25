import Map from "./component/Map";
import Charts from "./component/Charts"
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map/>}/>
        <Route path="/charts" element = {<Charts/>}/>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
