export interface RouteConfig {
    path: string,
    name: string,
}

export const routeConfig : Array<RouteConfig> = [
    {
        path : '/login',
        name: 'loginPage',
    },
]