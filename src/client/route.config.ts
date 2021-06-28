export interface RouteConfig {
    path: string,
    name: string,
    children?: RouteConfig[]
}

export const routeConfig : Array<RouteConfig> = [
    {
        path : '/',
        name: 'rootContainer',
        children: [
            {
                path: 'laptop',
                name: 'laptopPage'
            }
        ]
    },
    
]