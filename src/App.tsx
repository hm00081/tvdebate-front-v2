// /* eslint-disable no-unused-vars */
// export default App;
import React from "react";
import {
  HashRouter as Router, // 변경: BrowserRouter -> HashRouter
  Switch,
  Route,
} from "react-router-dom";
import "./App.scss";
import ConceptualRecurrencePlot from "./views/ConceptualRecurrencePlot/ConceptualRecurrencePlot";
import Home from "./views/Home/Home";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/coocurence_matrix">
            <ConceptualRecurrencePlot />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
