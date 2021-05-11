import { get, set } from "lodash";
import React from "react";
import { Subject, Subscription } from "rxjs";
import { delay, filter } from "rxjs/operators";
import { IPageConfig } from "./Types";
import { LayoutRenderer } from "./layout-renderer";

interface IPropType {
  config: IPageConfig;
}

interface IStateConfig {
  context: { [key: string]: Subject<any> };
}

class BaseComponent extends React.Component<IPropType, IStateConfig> {
  subsBag: Subscription[] = [];
  config: IPageConfig = this.props.config;
  contextVar: {
    [key: string]: any;
  } = {};
  _context: { [key: string]: Subject<any> } = {};
  constructor(props: any) {
    super(props);

    this.config.contextProp.propConfig.forEach((item) => {
      set(this.contextVar, item[0], item[1]);
      if (!get(this._context, item[0] + "$")) {
        set(this._context, item[0] + "$", new Subject());
      }
    });

    this.config.contextProp.derivedSpec.forEach((item) => {
      if (!get(this._context, item.name + "$")) {
        set(this._context, item.name + "$", new Subject());
      }
      item.from.forEach((v) => {
        this.subsBag.push(
          this._context[v + "$"]
            .pipe(
              delay(item.delayTime ? item.delayTime : 0),
              filter((val) => {
                if (!!item.filterFn) {
                  const filterData = {};
                  item.from.forEach((varName) => {
                    const v1 = get(this.state.context, varName);
                    set(filterData, varName, v1);
                  });
                  set(filterData, v, val);
                  return !!item.filterFn(filterData, v);
                }
                return true;
              })
            )
            .subscribe((val) => {
              let data = {};
              set(this.contextVar, v, val);
              item.from.forEach((varName) => {
                const v1 = get(this.contextVar, varName);
                set(data, varName, v1);
              });
              const calculatedValue = item.spec(data);
              set(this.contextVar, item.name, calculatedValue);

              if (!!get(this._context, item.name + "$")) {
                setTimeout(() => {
                  get(this._context, item.name + "$").next(calculatedValue);
                });
              }
            })
        );
      });
    });
    this.state = {
      context: this._context,
    };
  }

  componentDidMount() {
    this.config.contextProp.propConfig.forEach((item) => {
      const target: any = item[0];
      const propSub: Subject<any> = this._context[target + "$"];
      if (!!propSub) {
        setTimeout(() => {
          propSub.next(item[1]);
        });
      }
    });
  }

  componentWillUnmount() {
    this.subsBag.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  render() {
    return (
      <LayoutRenderer
        layout={this.config.layout}
        style={this.config.style}
        context={this.state.context}
      />
    );
  }
}

export default BaseComponent;
