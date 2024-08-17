import dayjs, { Dayjs } from "dayjs";
import React, { Reducer, useReducer } from "react";
import { Spinner } from "./spinner";
import { Input } from "./input";

type RelativeDateInputValue = Dayjs | null;

interface ComponentState {
  upstreamValue: RelativeDateInputValue;
  internalPendingValue: RelativeDateInputValue;
  mode: "unchanged" | "dirty" | "pending";
  currentValue: string;
}

interface Props {
  initial: RelativeDateInputValue;
  onChangeComplete: (value: RelativeDateInputValue) => void;
  clearable?: boolean;
  /**
   * For use in interactive testing
   */
  forceMode?: ComponentState["mode"];
}

type Action =
  | { type: "change"; value: string }
  | { type: "blur"; value: string }
  | { type: "updateUpstream"; value: RelativeDateInputValue };

const invalidAction = (action: Action): never => {
  throw new Error(`unknown action type ${action.type}`);
};
const invalidMode = (mode: ComponentState["mode"]): never => {
  throw new Error(`unknown mode ${mode}`);
};

const inputToValue = (input: string): RelativeDateInputValue => {
  if (input === "") {
    return null;
  }
  return dayjs(input);
};

const upstreamToInput = (upstream: RelativeDateInputValue): string => {
  if (upstream === null) {
    return "";
  }
  return upstream.format("YYYY-MM-DD");
};

const reducer: Reducer<ComponentState, Action> = (p, a): ComponentState => {
  switch (a.type) {
    case "change":
      return { ...p, mode: "dirty", currentValue: a.value };
    case "blur": {
      return {
        ...p,
        mode:
          p.upstreamValue === inputToValue(a.value) ? "unchanged" : "pending",
        currentValue: a.value,
      };
    }
    case "updateUpstream":
      switch (p.mode) {
        case "dirty":
          return { ...p, upstreamValue: a.value };
        case "pending":
          return {
            ...p,
            mode:
              inputToValue(p.currentValue) === a.value
                ? "unchanged"
                : "pending",
            upstreamValue: a.value,
          };
        case "unchanged":
          return {
            ...p,
            currentValue: upstreamToInput(a.value),
            upstreamValue: a.value,
          };
      }
      return invalidMode(p.mode);
  }
  return invalidAction(a);
};

export const AutosavingInput: React.FC<
  Props & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>
> = (props) => {
  const { initial, forceMode, ...rest } = props;
  const initialState: ComponentState = {
    upstreamValue: initial,
    internalPendingValue: initial,
    currentValue: upstreamToInput(initial),
    mode: "unchanged",
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const mode = forceMode ?? state.mode;
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch({ type: "change", value: e.target.value });
    },
    [dispatch]
  );
  //   const onBlur = React.useCallback(() => {
  //     if (mode === "dirty") {
  //       const commitValue = state.internalPendingValue;
  //       const blurValue = commitValue;
  //       dispatch({ type: "blur", value: blurValue });
  //       onCommit(commitValue);
  //     }
  //   }, [dispatch, state.currentValue, mode, onCommit]);
  React.useEffect(() => {
    dispatch({ type: "updateUpstream", value: initial });
  }, [dispatch, initial]);
  return (
    <div className="relative">
      <span className="box flex-1">
        <Input
          value={state.currentValue}
          onChange={onChange}
          autoComplete="off"
          {...rest}
        />
      </span>
      {mode === "pending" ? (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Spinner />
        </div>
      ) : null}
    </div>
  );
};
