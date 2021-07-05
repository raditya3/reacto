import React, { useEffect, useState } from "react";
import { get, defaultTo, pipe } from "lodash/fp";
import { LayoutRenderer, resolveClassNames } from "./../../layout-renderer";
import { Subject } from "rxjs";
import parse from "html-react-parser";
function Primitives(properts: {
  tagName: string;
  props: any;
  children_?: any[]; //JSON children
  children?: any; //JSX children          Can we combine the two?
  style: any;
  context: { [key: string]: Subject<any> };
}) {
  const style = properts.style;
  const context = properts.context;
  const tagName: string = properts.tagName;
  const props = properts.props;
  const _innerHTML: string = props.innerHTML || "";
  const _classNames: string | null = pipe(
    get("className"),
    defaultTo("")
  )(props);
  const _children = properts.children_;
  const [children, setChildren] = useState<any>();
  const [innerHTML, setInnerHTML] = useState<string>(_innerHTML);
  const [resolvedClassNamesObj, setResolvedClassNames] = useState<any>({});
  useEffect(() => {
    setInnerHTML(_innerHTML);
    setChildren(_children);
    if (!!_classNames) {
      setResolvedClassNames({
        className:
          resolveClassNames(_classNames, properts.style) || _classNames,
      });
    }
  }, [_innerHTML, _children, _classNames, properts.style]);
  if (tagName === "div") {
    return (
      <div {...resolvedClassNamesObj}>
        {innerHTML ? parse(innerHTML) : null}
        {children
          ? children.map((item: any, index: number) => {
              return (
                <LayoutRenderer
                  layout={item}
                  style={style}
                  context={context}
                  key={index}
                >
                  {properts.children}
                </LayoutRenderer>
              );
            })
          : ""}
      </div>
    );
  } else if (tagName === "p") {
    return (
      <p {...resolvedClassNamesObj}>{innerHTML ? parse(innerHTML) : null}</p>
    );
  } else if (tagName.match(/^h[1-6]$/)) {
    return (
      <React.Fragment>
        {parse(
          `<${tagName} ${
            resolvedClassNamesObj.className
              ? `class=${resolvedClassNamesObj.className}`
              : ``
          }>` +
            (innerHTML ? parse(innerHTML) : null) +
            `</${tagName}>`
        )}
      </React.Fragment>
    );
  } else if (tagName === "span") {
    return (
      <span {...resolvedClassNamesObj}>
        {innerHTML ? parse(innerHTML) : null}
      </span>
    );
  } else if (tagName === "img") {
    let imgProps = {
      ...(props.src && { src: props.src }),
      ...(props.alt && { alt: props.alt }),
    };
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...resolvedClassNamesObj} {...imgProps} />;
  } else if (tagName === "ul") {
    return (
      <ul {...resolvedClassNamesObj}>
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
      </ul>
    );
  } else if (tagName === "li") {
    return (
      <li {...resolvedClassNamesObj}>
        {" "}
        {innerHTML ? parse(innerHTML) : null}{" "}
      </li>
    );
  }
  return null;
}

export default Primitives;
