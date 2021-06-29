import { IPageConfig } from "../../../Types";

export const laptopPage : IPageConfig = {
    layout : {
        name: 'div',
        props: {
            innerHTML: 'hello world',
        }
    },
    contextProp : {
        derivedSpec : [
            {
                from: ['routeParams'],
                name: '_xxx',
                spec: function(data : any){
                    console.log(data);
                }
            }
        ],
        propConfig : [
            ['_xxx',null]
        ],
    },
    style : null,
}