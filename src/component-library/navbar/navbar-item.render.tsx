import { set } from "lodash";
import React from "react";

function ItemRender(props: {
  label: string;
  selectHandler: Function;
  isActive: boolean;
  index: number;
  labelValue?: any;
  subMenu?: Array<any>;
  labelClass?: string;
  activeClass?: string;
}) {
  const liParams = {};
  if (!!props.labelValue) {
    set(liParams, "onClick", () => {
      props.selectHandler(props.labelValue, props.index);
    });
  }
  return (
    <li
      className={
        "hvr " +
        (props.labelClass ? props.labelClass : "") +
        " " +
        (props.isActive && props.labelValue ? props.activeClass : "")
      }
      key={props.index}
    >
      <div {...liParams} className={"label "}>
        {props.label}
      </div>
      {props.subMenu ? (
        <div className="submenu">
          {props.subMenu.map((subMenuItem, index: number) => {
            return (
              <React.Fragment key={index}>
                <div
                  onClick={() => {
                    props.selectHandler(subMenuItem[1]);
                  }}
                  className="submenu-item"
                >
                  {subMenuItem[0]}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      ) : null}
    </li>
  );
}

export default ItemRender;
