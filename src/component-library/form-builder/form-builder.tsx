import get from "lodash/get";
import React, { useState } from "react";
import { BehaviorSubject } from "rxjs";

interface IProps {
  props: {
    fields: any[];
    action_buttons?: any[];
  };
  context: any;
  style: any;
  event: Array<[string, Function]>;
}

interface fieldProps {
  type: string;
  name: string;
  label: string;
  required: boolean;
}

function FormBuilder(properts: IProps) {
  const [formValue, setFormValue] = useState<any>({});
  return (
    <form>
      {properts.props.fields.map((field: fieldProps, index) => {
        if (
          field.type === "email" ||
          field.type === "text" ||
          field.type === "password"
        ) {
          return (
            <div key={index}>
              <label htmlFor={field.name}>{field.label}</label>
              <br />
              <input
                type={field.type}
                name={field.name}
                onChange={(event: any) => {
                  setFormValue((p: any) => {
                    return Object.assign({}, p, {
                      [field.name]: event.target.value,
                    });
                  });
                }}
                value={get(formValue, field.name)}
              />
            </div>
          );
        }
        return null;
      })}
      {properts.props.action_buttons?.map((button: any, index) => {
        return (
          <button
            key={index}
            title={button.label}
            onClick={() => {
              properts.event.forEach((evnt: any) => {
                const contextVar$: BehaviorSubject<any> = get(
                  properts.context,
                  evnt[0] + "$"
                );
                if (!!contextVar$)
                  contextVar$.next(
                    evnt[1]({ type: button.type, formGroup: formValue })
                  );
              });
            }}
            type="button"
          >
            {button.label}
          </button>
        );
      })}
    </form>
  );
}

export default FormBuilder;
