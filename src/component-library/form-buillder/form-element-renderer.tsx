import { includes, set } from "lodash";
import { LayoutRenderer } from "../../layout-renderer";

const valueFields = ["text", "radio", "select"];

export const fieldRenderer = (
  field: any,
  context: any,
  onChange_handler: Function,
  fieldTouchedHandler: Function
) => {
  if (includes(valueFields, field.type)) {
    set(field, "props.onChange_handler", onChange_handler);
    set(field, "props.fieldTouched_handler", fieldTouchedHandler);
  }
  return (
    <LayoutRenderer
      layout={field}
      style={null}
      context={context}
      identifierKey={"type"}
    />
  );
};

export const action_buttonRenderer = (
  action_button: any,
  index: number,
  actionTypeSetter: Function
) => {
  return (
    <button
      type="submit"
      key={index}
      onClick={(e) => {
        actionTypeSetter(action_button.action_type);
      }}
    >
      {action_button.label}
    </button>
  );
};
