import { IPageConfig } from "../../../Types";

export const redirectDashboard: IPageConfig = {
  layout: {
    name: "redirect",
    props: {
      to: "dashboard",
      isVisible: true,
    },
  },
  contextProp: {
    derivedSpec: [],
    propConfig: [],
  },
  style: null,
};
