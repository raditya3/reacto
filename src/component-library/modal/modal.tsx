import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { LayoutRenderer } from "../../layout-renderer";
import { ILayout } from "../../Types";
import "./modal.scss";
interface IProps {
  props: {
    show: boolean;
  };
  children: ILayout[];
  style: any;
  context: any;
  events?: {
    close: [string, Function][];
  };
}

function Modal(props: IProps) {
  const children = props.children;
  const style = props.style;
  const context = props.context;
  const [showModal, setShow] = useState(props.props.show);
  useEffect(() => {
    setShow(!!props.props.show);
  }, [props.props.show]);
  if (!showModal) {
    return null;
  }

  const handleClose = () => {
    debugger;
    props.events?.close.forEach((item) => {
      const sub: Subject<any> = get(props.context, item[0] + "$");
      if (sub) {
        sub.next(item[1]());
      }
    });
    setShow(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="close-modal-icon" onClick={handleClose}>
          X
        </div>
        {children
          ? children.map((item: any, index: number) => {
              return (
                <LayoutRenderer
                  layout={item}
                  style={style}
                  context={context}
                  key={index}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}

export default Modal;
