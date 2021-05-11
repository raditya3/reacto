import { routeConfig } from "./client/route.config";
import * as containerConfig from "./client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BaseComponent from "./base-context";
import { get } from "lodash";
import React from "react";

function App() {
  return (
    <Router>
      <Switch>
        {routeConfig.map((item, index) => {
          return (
            <Route path={item.path} key={index}>
              <BaseComponent config={get(containerConfig, item.name)} />
            </Route>
          );
        })}
      </Switch>
    </Router>
  );
}

export default App;
