export interface IDerivedCalc {
  name: string;
  from: Array<string>;
  delayTime?: number;
  spec: Function;
  filterFn?: Function;
}

export interface ILayout {
  name: string;
  props?: any;
  children?: ILayout[];
  events?: any;
}

export interface IPageConfig {
  layout: ILayout;
  style: any;
  contextProp: {
    propConfig: Array<[string, any]>;
    derivedSpec: Array<IDerivedCalc>;
  };
}
