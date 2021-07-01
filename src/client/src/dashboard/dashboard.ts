import { IPageConfig } from "../../../Types";

export const dashboardPage: IPageConfig = {
  layout: {
    name: "div",
    props: {
      innerHTML: "Hello World",
    },
  },
  contextProp: {
    derivedSpec: [],
    propConfig: [],
  },
  style: null,
};
