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
                path : '',
                name: '',
            },
            {
                path: 'products/:id',
                name: 'laptopPage'
            }
        ]
    },
    
]