import React from "react";
import { set, get, map } from "lodash";
import { BehaviorSubject } from "rxjs";
import { action_buttonRenderer, fieldRenderer } from "./form-element-renderer";
import performValidations from "./field-validator";
interface IFormProps {
  fields: Array<any>;
  context: any;
  action_buttons: Array<any>;
  event_handler?: {
    update?: Array<[string, Function]>;
    submit: Array<[string, Function] | [string, Function, Function]>;
  };
}

class FormBuilder extends React.Component<IFormProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      formValues: {},
      fields: this.props.fields,
      action_buttons: this.props.action_buttons,
    };
  }

  actionType: string = "";
  isSubmitClicked: boolean = false;

  validateField = (field: any, value: any) => {
    if (value === "undefined") {
      return;
    }
    const validations = field.validations || [];
    const validationResult = performValidations(validations, value);
    this.setState({
      field: map(this.state.fields, function (_field: any) {
        if (field.name === _field.name) {
          set(
            field,
            "validationMsg",
            validationResult ? validationResult : false
          );
          return field;
        } else {
          return field;
        }
      }),
    });
  };

  setActionType = (type: string) => {
    this.actionType = type;
  };

  submit_handler = (v: any) => {
    v.preventDefault();
    this.isSubmitClicked = true;

    this.state.fields.forEach((field: any) => {
      this.validateField(field, get(this.state.formValues, field.name));
    });

    let data = {};
    set(data, "$value", this.state.formValues);
    this.props.event_handler?.submit.forEach((event_handler) => {
      if (event_handler.length === 2) {
        const contextVarSub: BehaviorSubject<any> = get(
          this.props.context,
          event_handler[0] + "$"
        );
        if (!!contextVarSub) {
          const calculatedVal = event_handler[1](data);
          contextVarSub.next({ val: calculatedVal });
        }
      } else if (event_handler.length === 3) {
        let filterFn = event_handler[2];
        let contextData = {};
        set(contextData, "type", this.actionType);
        set(contextData, "$context", this.props.context);
        const filterVal = filterFn(contextData);
        const contextVarSub: BehaviorSubject<any> = get(
          this.props.context,
          event_handler[0] + "$"
        );
        if (!!contextVarSub && filterVal) {
          const calculatedVal = event_handler[1](data);
          contextVarSub.next({ val: calculatedVal });
        }
      }
    });
  };

  onChange_handler = (field: any, event: any) => {
    const field_name: string = field.name;
    this.setState({
      formValues: set(this.state.formValues, field_name, event.target.value),
    });

    if (!!field.showErrorBeforeSubmit || !!this.isSubmitClicked) {
      this.validateField(field, event.target.value);
    }

    const update_events_handler = this.props.event_handler?.update;
    if (!!update_events_handler) {
      update_events_handler.forEach((event_handler) => {
        const data = { $fieldName: field_name, $val: event.target.value };
        if (event_handler.length === 2) {
          const calculatedVal = event_handler[1](data);
          const targetSub: BehaviorSubject<any> = get(
            this.context,
            event_handler[0] + "$"
          );
          if (targetSub) {
            targetSub.next({ val: calculatedVal });
          }
        }
      });
    }
  };

  fieldTouchedHandler = (field: any) => {
    this.setState({
      field: map(this.state.field, function (fld: any) {
        if (fld.name === field.name) {
          set(fld, "touched", true);
          return fld;
        } else {
          return fld;
        }
      }),
    });
  };

  render() {
    return (
      <form onSubmit={this.submit_handler}>
        {this.state.fields.map((item: any, index: number) => {
          return fieldRenderer(
            item,
            this.props.context,
            this.onChange_handler,
            this.fieldTouchedHandler
          );
        })}
        <div>
          {this.state.action_buttons.map((item: any, index: number) => {
            return action_buttonRenderer(item, index, this.setActionType);
          })}
        </div>
      </form>
    );
  }
}

export default FormBuilder;
