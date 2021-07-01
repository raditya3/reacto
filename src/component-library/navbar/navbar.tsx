import { get } from "lodash";
import ItemRender from "./navbar-item.render";
import "./navbar.scss";
import { BehaviorSubject } from "rxjs";
import { useEffect, useState } from "react";
import { resolveClassNames } from "../../layout-renderer";
interface IProps {
  props: {
    items: Array<{ label: string; submenu?: Array<any>; value?: any }>;
    activeTab?: number;
    navClass?: string;
    labelClass?: string;
    activeClass?: string;
  };
  context: any;
  style: any;
  event: Array<[string, Function]>;
}

function Navbar(properts: IProps) {
  const [props, setProps] = useState(properts.props);
  const [items, setItems] = useState<
    Array<{ label: string; submenu?: Array<any>; value?: any }>
  >([]);
  const [activeTab, setActiveTab] = useState(props.activeTab);
  const [navClass, setNavClass] = useState<string>("");
  const [labelClass, setLabelClass] = useState<string>("");

  useEffect(() => {
    setProps(properts.props);
    setItems(properts.props.items || []);
    if (typeof properts.props.activeTab !== "undefined") {
      setActiveTab(properts.props.activeTab);
    }
    setNavClass(
      resolveClassNames(properts.props.navClass || "", properts.style) || ""
    );
    setLabelClass(
      resolveClassNames(properts.props.labelClass || "", properts.style) || ""
    );
  }, [
    properts.props.items,
    properts.props,
    properts.props.activeTab,
    properts.props.navClass,
    properts.props.labelClass,
    properts.style,
  ]);

  const selectHandler = (selectedValue: any, index: number) => {
    setActiveTab(index);
    properts.event.forEach((evnt) => {
      const contextVar$: BehaviorSubject<any> = get(
        properts.context,
        evnt[0] + "$"
      );
      if (!!contextVar$) contextVar$.next(evnt[1](selectedValue));
    });
  };
  return (
    <ul className={navClass || "navbar-container"}>
      {items.map((item, index: number) => {
        return (
          <ItemRender
            key={index}
            label={item.label}
            selectHandler={selectHandler}
            isActive={index === activeTab}
            index={index}
            labelValue={item.value}
            subMenu={item.submenu}
            labelClass={labelClass}
            activeClass={
              resolveClassNames(
                properts.props.activeClass || "",
                properts.style
              ) || ""
            }
          />
        );
      })}
    </ul>
  );
}

export default Navbar;
