import { IPageConfig } from "../../../Types";
import { headerLayout } from "./header/header";
import { derived as headerDerived } from "./header/header.derived";
import { props as headerProps } from "./header/header.props";
export const rootContainer: IPageConfig = {
  layout: {
    name: "div",
    props: {
      className: "root-container",
    },
    children: [
      {
        name: "redirect",
        props: {
          "[to]": "$(redirectURL)",
          "[isVisible]": "$(triggerRedirect)",
        },
      },
      headerLayout,
      {
        name: "router-outlet",
      },
      {
        name: "div",
        props: {
          className: "footer",
        },
      },
    ],
  },
  contextProp: {
    derivedSpec: [...headerDerived],
    propConfig: [
      ...headerProps,
      ["triggerRedirect", false],
      ["redirectURL", null],
      ["_xxx", null],
    ],
  },
  style: require("./root-container.module.scss"),
};
