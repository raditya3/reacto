import { IPageConfig } from "../../../Types";

export const laptopPage : IPageConfig = {
    layout : {
        name: 'div',
        props: {
            innerHTML: 'hello world',
        }
    },
    contextProp : {
        derivedSpec : [],
        propConfig : [],
    },
    style : null,
}