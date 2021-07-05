import {
  set,
  get,
  keys,
  trim,
  includes,
  split,
  join,
  isArray,
  cloneDeep,
  map,
} from "lodash";
import { Link, Redirect } from "react-router-dom";
import Navbar from "./component-library/navbar/navbar";
import parse from "html-react-parser";
import React from "react";
import { Subject, Subscription } from "rxjs";
import Primitives from "./component-library/primitive-components/primitives";
import { ILayout } from "./Types";
import FormBuilder from "./component-library/form-builder/form-builder";
import { createRef } from "react";
import { RefObject } from "react";

function contextResolve(
  context: { [key: string]: Subject<any> },
  val: string
): Subject<any> {
  const objSplit = val.split(".");
  return get(context, objSplit[0] + "$");
}

interface IProps {
  layout: ILayout;
  style: any;
  context: { [key: string]: Subject<any> };
  identifierKey?: string;
  children?: any[];
}

interface IState {
  props: any;
  loopRender?: any[];
  loopVal?: any[];
}

export function resolveClassNames(
  className: string,
  style: any
): string | null {
  if (trim(className) === "") return null;
  return className
    .split(" ")
    .map((cls) => {
      return get(style, cls) || "";
    })
    .join(" ");
}

export class LayoutRenderer extends React.Component<IProps, IState> {
  layout: ILayout;
  style = null;
  _context: { [key: string]: Subject<any> } | null = null;
  identifierKey = "name";
  loopChildRefBag: RefObject<any>[] = [];
  constructor(props: IProps) {
    super(props);
    this.layout = props.layout;
    this.style = props.style;
    this._context = props.context;

    this.state = {
      props: this.layout.props || {},
    };
  }
  componentDidMount() {
    if (!!this.layout.loop) {
      const loopVariableSubject: Subject<any> | undefined = get(
        this._context,
        this.layout.loop + "$"
      );
      if (!!loopVariableSubject) {
        this.subsBag.push(
          loopVariableSubject.subscribe((val) => {
            if (!isArray(val)) return;
            this.loopChildRefBag = [];
            setTimeout(() => {
              this.setState({
                loopRender: map(val, (item, index) => {
                  const clonedlayout = cloneDeep(this.layout);
                  delete this.layout.loop;
                  const clonedContext = cloneDeep(this._context) || {};
                  const tmpRef = createRef<any>();
                  set(clonedContext, "this$", new Subject<any>());
                  const render = (
                    <LayoutRenderer
                      ref={tmpRef}
                      context={clonedContext}
                      layout={clonedlayout}
                      style={this.style}
                      key={index}
                    >
                      {this.props.children}
                    </LayoutRenderer>
                  );
                  this.loopChildRefBag.push(tmpRef);
                  return render;
                }),
                loopVal: val,
              });
            });
          })
        );
      }
    } else {
      this.setState({
        loopRender: undefined,
        loopVal: undefined,
      });
    }

    if (!!this.layout.loop || !!this.state.loopVal) {
      return;
    }
    keys(this.layout.props).forEach((propKey) => {
      if (propKey.match(/^\[+[\w.]+\]$/)) {
        const rawPropValue: string = get(this.layout.props, propKey);
        const templateProps = rawPropValue.match(/\$\([\w.]+\)/g);
        if (!!templateProps) {
          const contextValueHolder = {};
          templateProps.forEach((rawProp) => {
            rawProp = rawProp.substring(2, rawProp.length - 1);
            const propSub = contextResolve(this._context || {}, rawProp);
            if (!!!propSub) {
              return;
            }
            this.subsBag.push(
              propSub.subscribe((val) => {
                const tmppropVal = this.layout.props[propKey] || "";
                const propSplit = split(
                  tmppropVal.substring(2, tmppropVal.length - 1),
                  "."
                );
                if (propSplit.length > 1) {
                  propSplit.shift();
                  val = get(val, join(propSplit, "."));
                }
                set(contextValueHolder, rawProp, val);
                let resolvedVal = rawPropValue;
                templateProps.forEach((uprp) => {
                  const val = get(
                    contextValueHolder,
                    uprp.substring(2, uprp.length - 1)
                  ); //unprocessed raw prop
                  resolvedVal = resolvedVal.replace(uprp, val || "");
                });

                const resolvedKey = propKey.substring(1, propKey.length - 1);
                this.setState((p: any) => {
                  set(p.props, resolvedKey, resolvedVal);
                  return p;
                });
              })
            );
          });
        }
      }
    });
  }

  componentDidUpdate() {
    if (this.loopChildRefBag.length > 0) {
      this.loopChildRefBag.forEach((ref, index) => {
        const v = get(this.state.loopVal, `[${index}]`);
        if (typeof v !== "undefined" && !!ref.current._context) {
          setTimeout(() => {
            ref.current?._context.this$.next(v);
          });
        }
      });
    }
  }

  subsBag: Subscription[] = [];

  componentWillUnmount() {
    this.subsBag.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  render() {
    if (!!this.state.loopRender) {
      return <>{this.state.loopRender}</>;
    }

    const events = get(this.props.layout, "events");
    if (this.state.props.isVisible === false) {
      return null;
    }
    let resolvedClassName = "";
    if (!!this.state.props.className) {
      resolvedClassName =
        resolveClassNames(this.state.props.className, this.style) || "";
    }
    //Primitive elements
    const tagName: string = get(this.layout, "name");
    if (
      includes(["div", "p", "span", "img", "ul", "li"], tagName) ||
      tagName.match(/^h[1-6]$/)
    ) {
      return (
        <Primitives
          context={this._context || {}}
          props={this.state.props}
          style={this.style}
          tagName={tagName}
          children_={this.layout.children}
        >
          {this.props.children}
        </Primitives>
      );
      // Anchor element
    } else if (tagName === "a") {
      if (!!this.state.props.native) {
        return (
          <Link className={resolvedClassName} to={this.state.props.to}>
            {this.state.props.innerHTML
              ? parse(this.state.props.innerHTML)
              : null}
          </Link>
        );
      } else {
        return (
          <a className={resolvedClassName} href={this.state.props.to}>
            {this.state.props.innerHTML
              ? parse(this.state.props.innerHTML)
              : null}
          </a>
        );
      }
    } else if (
      tagName === "redirect" &&
      !!this.state.props.isVisible &&
      !!this.state.props.to
    ) {
      return <Redirect to={this.state.props.to} />;
    } else if (tagName === "navbar") {
      //Navbar menu
      const inputProps = {
        context: this._context,
        style: this.style,
        event: events,
      };
      if (!!this.state.props.navClass) {
        set(
          inputProps,
          "navClass",
          resolveClassNames(this.state.props.navClass, this.style)
        );
      }
      if (!!this.state.props.labelClass) {
        set(
          inputProps,
          "labelClass",
          resolveClassNames(this.state.props.labelClass, this.style)
        );
      }
      if (typeof this.state.props.activeTab !== "undefined") {
        set(inputProps, "activeTab", this.state.props.activeTab);
      }
      return (
        <Navbar
          props={this.state.props}
          context={this._context}
          style={this.style}
          event={events}
        />
      );
    } else if (tagName === "form") {
      return (
        <FormBuilder
          props={this.state.props}
          context={this._context}
          style={this.style}
          event={events}
        />
      );
    } else if (tagName === "router-outlet") {
      return <>{this.props.children}</>;
    }
    return <div></div>;
  }
}
