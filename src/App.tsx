import { RouteConfig, routeConfig } from "./client/route.config";
import * as containerConfig from "./client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BaseComponent from "./base-context";
import { clone, cloneDeep, get } from "lodash";
import React from "react";
import { BehaviorSubject } from "rxjs";

//<BaseComponent config={get(containerConfig, route.name)}></BaseComponent>
function App() {
  const appContextSubject = new BehaviorSubject(null);

  function preprocessRoutes(
    routes: RouteConfig[],
    parent: string,
    parentContexts: string
  ): RouteConfig[] {
    const configuredRoutes: RouteConfig[] = [];
    routes.forEach((route) => {
      if (!!route.children) {
        configuredRoutes.push(
          ...preprocessRoutes(
            route.children,
            parent + route.path,
            parentContexts + " " + route.name
          )
        );
      } else {
        const newRoute = cloneDeep(route);
        newRoute.path = parent + newRoute.path;
        newRoute.name = parentContexts + " " + newRoute.name;
        configuredRoutes.push(newRoute);
      }
    });
    return configuredRoutes.filter((route) => !route.children);
  }

  function pageNameResolver(name: string[]) {
    const newArray = clone(name);
    newArray.shift();
    if (!get(containerConfig, name[0])) {
      console.error(
        `No config found for ${name[0]}. Did you forget to export it?`
      );
      return null;
    }
    return (
      <BaseComponent
        appContext={appContextSubject}
        config={get(containerConfig, name[0])}
      >
        {" "}
        {newArray.length > 0 ? pageNameResolver(newArray) : null}{" "}
      </BaseComponent>
    );
  }

  function renderRoutes(routes: RouteConfig[]) {
    const processedRoutes = preprocessRoutes(routeConfig, "", "");
    return (
      <Switch>
        {processedRoutes.map((route, index) => {
          return (
            <Route exact path={route.path} key={index}>
              {pageNameResolver(route.name.trim().split(" "))}
            </Route>
          );
        })}
      </Switch>
    );
  }

  return <Router>{renderRoutes(routeConfig)}</Router>;
}

export default App;
