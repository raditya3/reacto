import { IPageConfig  } from "../../../Types";
export const loginPage : IPageConfig = {
    layout : {
        name: 'div',
        props: {
            className: 'root-container',
        },
        children: [
            {
                name: 'div',
                props: {
                    className: 'form-container'
                },
                children: [
                    {
                        name: 'div',
                        children: [
                            {
                                name: 'h1',
                                props: {
                                    innerHTML: 'Login',
                                }
                            },
                            {
                                name: 'form',
                                events : [
                                    ['_xxx',function(data : any){
                                        console.log(data);
                                        return data;
                                    }]
                                ],
                                props: {
                                    fields: [
                                        {
                                            type: 'email',
                                            label: 'Email',
                                            required: true,
                                            name: 'email',
                                        },
                                        {
                                            type: 'password',
                                            label: 'Password',
                                            required: true,
                                            name: 'password',
                                        },
                                    ],
                                    action_buttons: [
                                        {
                                            label : 'Save',
                                            type : 'type1',
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ],
            }
        ]
    },
    contextProp : {
        derivedSpec : [],
        propConfig : [
            ['_xxx',null],
        ],
    },
    style : require('./login-page.module.scss'),
}