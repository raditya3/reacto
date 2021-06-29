import get from "lodash/get";
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
                    const productCategory = get(data,'routeParams.id');
                }
            }
        ],
        propConfig : [
            ['_xxx',null]
        ],
    },
    style : null,
}