```

import { IPageConfig  } from "../../../Types";
export const management : IPageConfig = {
    layout : {
        name: 'div',
        props: {
            className: 'root-container',
        },
        children: [
           {
               name: 'div',
               props: {
                   innerHTML: 'Hello',
               }
           },
           {
               name:'router-outlet',
           },
           {
            name: 'div',
            props: {
                innerHTML: 'Hello WOrld',
            }
        },
        ]
    },
    contextProp : {
        derivedSpec : [],
        propConfig : [
            ['_xxx',null],
        ],
    },
    style :null,
}

```
