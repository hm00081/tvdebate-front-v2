import React from "react";
import {
  HashRouter as Router, // 변경: BrowserRouter -> HashRouter
  Routes,
  Route,
} from "react-router-dom";
import "./App.scss";
import ConceptualRecurrencePlot from "./views/ConceptualRecurrencePlot/ConceptualRecurrencePlot";
import Home from "./views/Home/Home";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/coocurence_matrix"
            element={<ConceptualRecurrencePlot />}
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
