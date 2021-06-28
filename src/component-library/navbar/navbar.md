{
    name: 'navbar',
    props: {
        items: Array<{ label: string; submenu?: Array<any>; value?: any }>;
    activeTab?: number;
    navClass?: string;
    labelClass?: string;
    activeClass?: string;
    },
    events : [[]]
}