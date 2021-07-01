import {
  set,
  get,
  keys,
  trim,
  includes,
  isArray,
  cloneDeep,
  map,
  forEach,
  split,
  join,
} from "lodash";
import { Link, Redirect } from "react-router-dom";
import Navbar from "./component-library/navbar/navbar";
import parse from "html-react-parser";
import React from "react";
import { Subject, Subscription } from "rxjs";
import Primitives from "./component-library/primitive-components/primitives";
import { ILayout } from "./Types";
import FormBuilder from "./component-library/form-builder/form-builder";

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
  loop?: any;
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
  layout: any = null;
  style = null;
  _context: { [key: string]: Subject<any> } | null = null;
  identifierKey = "name";

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
    keys(this.layout.props).forEach((propKey) => {
      if (propKey.match(/^\[+\w+\]$/)) {
        const propSub: Subject<any> = contextResolve(
          this._context || {},
          get(this.layout.props, propKey)
        );
        if (!!propSub) {
          this.subsBag.push(
            propSub.subscribe((val) => {
              const propSplit = split(get(this.layout.props, propKey), ".");
              if (propSplit.length > 1) {
                propSplit.shift();
                val = get(val, join(propSplit, "."));
              }
              const resolvedVal = val;
              const resolvedKey = propKey.substring(1, propKey.length - 1);
              this.setState((p: any) => {
                set(p.props, resolvedKey, resolvedVal);
                delete p.props.propKey;
                return p;
              });
            })
          );
        }
      }
    });
    if (this.layout.loop) {
      const propSub: Subject<any> = contextResolve(
        this._context || {},
        this.layout.loop
      );
      if (propSub) {
        this.subsBag.push(
          propSub.subscribe((val) => {
            if (!!isArray(val)) {
              const loopSub: Subject<any>[] = [];
              this.setState({
                loop: map(val, (item) => {
                  const loopConfig = cloneDeep(this._context) || {};
                  const loopLayout = cloneDeep(this.layout);
                  delete loopLayout.loop;
                  loopLayout.props = cloneDeep(this.state.props);
                  const sub = new Subject<any>();
                  loopSub.push(sub);
                  set(loopConfig, "this$", sub);
                  return (
                    <LayoutRenderer
                      context={loopConfig}
                      layout={loopLayout}
                      style={this.style}
                      children={this.props.children}
                    />
                  );
                }),
              });
              forEach(loopSub, (item, index) => {
                setTimeout(() => {
                  item.next(val[index]);
                });
              });
            }
          })
        );
      }
    }
  }

  subsBag: Subscription[] = [];

  componentWillUnmount() {
    this.subsBag.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  render() {
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
    if (!!this.state.loop) {
      return this.state.loop;
    }
    if (
      includes(["div", "p", "span", "img"], tagName) ||
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
      this.state.props.to
    ) {
      console.log("redirect", this.state.props.to);
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
    } else if (tagName === "text") {
      const inputProps = {
        name: this.layout.name,
        type: this.state.props.type || "text",
        onChange: (_event: any) => {
          this.state.props.onChange_handler(this.layout, _event);
        },
        onClick: (event: any) => {
          this.state.props.fieldTouched_handler(this.layout);
        },
      };
      if (!!this.state.props.autocomplete) {
        set(inputProps, "autoComplete", this.state.props.autocomplete);
      }
      return (
        <div>
          <label>{this.layout.label}</label>
          <br />
          <input {...inputProps} />
          {!!this.state.props.validationMsg ? (
            <span style={{ color: "red" }}>
              {" "}
              {this.state.props.validationMsg}{" "}
            </span>
          ) : null}
        </div>
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
