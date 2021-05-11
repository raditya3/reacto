import { constant } from 'lodash';
import { IPageConfig } from '../../../Types';
import style from './root-style.module.css';
export const rootContainer : IPageConfig = {
    layout : {
        name: 'div',
        props: {
            className : 'root-container',
        },
        children: [ 
            {
                name: 'modal',
                props : {
                    '[show]' : 'showModal',
                },
                events: {
                    close : [
                        ['showModal',constant(false)]
                    ]
                },
                children: [
                    {
                        name : 'div',
                        props: {
                            innerHTML : 'Hello Modal'
                        }
                    }
                ]
            },
            {
                name: 'div',
                props: {
                    className: 'header-container'
                },
                children: [
                    {
                        name: 'img',
                        props: {
                            className: 'user-avatar',
                            img : require('../../../assets/user-image.png'),
                            alt : 'John Doe'
                        }
                    },
                    {
                        name: 'h5',
                        props: {
                            className: 'name-container',
                            '[innerHTML]' : 'userName'
                        }
                    },
                    {
                        name: 'div',
                        props: {
                            className : 'info-containers qualification_container',
                        },
                        children: [
                            {
                                name: 'h3',
                                props: {
                                    innerHTML : 'Assistant Professor'
                                }
                            },
                            {
                                name: 'p',
                                props: {
                                    innerHTML: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis pellentesque pellentesque.`
                                }
                            }
                        ]
                    },
                    {
                        name: 'div',
                        props: {
                            className: 'info-containers title_container',
                        },
                        children : [
                            {
                                name: 'h3',
                                props: {
                                    innerHTML : 'asdasdasd'
                                }
                            },
                            {
                                name: 'div',
                                children: [
                                    {
                                        name: 'a',
                                        props: {
                                            innerHTML: 'google<br/>',
                                            to: 'https://www.google.in'
                                        }
                                    },
                                    {
                                        name: 'a',
                                        props: {
                                            innerHTML: 'Learn rxjs',
                                            to: 'https://www.learnrxjs.io/'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'div',
                        props: {
                            className: 'info-containers contact_container',
                        },
                        children : [
                            {
                                name: 'h3',
                                props: {
                                    innerHTML : 'Container'
                                }
                            },
                            {
                                name: 'div',
                                props: {
                                    className : 'contact_inf'
                                },
                                children : [
                                    {
                                        name: 'span',
                                        props: {
                                            innerHTML : 'adssadsdadsadsad<br/>'
                                        }
                                    },
                                    {
                                        name: 'span',
                                        props: {
                                            innerHTML : 'asdasdasd'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'navbar',
                props: {
                    '[items]': 'menuItems',
                    labelClass: 'menubar-label',
                    navClass: 'horizontal-menubar',
                    '[activeTab]' : 'tabControl',
                    activeClass : 'menubar-item-active'
                },
                events: [
                    ['selectedItem',function($data : any){
                        return $data;
                    }]
                ]
            }
        ]
    },
    style : style,
    contextProp: {
        propConfig: [
            ['menuItems', []],
            ['selectedItem',null],
            ['onInit', true],
            ['tabControl',0],
            ['userName','John Doe'],
            ['showModal',false],
        ],
        derivedSpec : [
            {
                name: 'menuItems',
                from: ['onInit'],
                // filterFn : (data : any) => {
                //     if(!!data.onInit){
                //         return true;
                //     }
                //     return false;
                // },
                spec : (data : any) => {
                    const items = [];
                    for(var i = 0; i<5;i++){
                        items.push({ label : `item ${i}`, 
                        // value: `tab${i}`,
                         submenu : [
                                [`submenu ${i} 0`,`${i}0$`],
                                [`submenu ${i} 1`,`${i}1$`],
                                [`submenu ${i} 2`,`${i}2$`]
                            ]
                        });
                    }
                    return items;
                }
            },
            {
                name : 'userName',
                delayTime:5000,
                from: ['onInit'],
                spec : (data : any) => {
                    if(data.onInit){
                        return "Whats Up!";
                    }
                    return "JohnDoe";
                }
            },
            {
                name: 'showModal',
                from :['selectedItem'],
                filterFn: (data : any) => {
                    return data.selectedItem!=null;
                },
                spec : (data : any) => {
                    console.log(data);
                    if(data.selectedItem==="11$"){
                        return true;
                    } return false;
                }
            }
        ],
    }
}