export interface RouteConfig {
  path: string;
  name: string;
  children?: RouteConfig[];
}

export const routeConfig: Array<RouteConfig> = [
  {
    path: "/",
    name: "rootContainer",
    children: [
      {
        path: "dashboard",
        name: "dashboardPage",
      },
      {
        path: "",
        name: "redirectDashboard",
      },
      {
        path: "products/:id",
        name: "categoryPage",
      },
    ],
  },
];
