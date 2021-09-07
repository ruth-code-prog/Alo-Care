import { useState } from "react";

export const useForm = (initialValue) => {
  const [values, setValues] = useState(initialValue);
  return [
    values,
    (formType, formValue) => {
      if (formType === "reset") {
        return setValues(initialValue);
      }
      return setValues({ ...values, [formType]: formValue });
    },
  ];
};

export function useFormSoul(initialState) {
  const [state, setState] = useState(initialState);
  const setMergedState = (newState) =>
    setState((prevState) => Object.assign({}, prevState, newState));
  return [state, setMergedState];
}
