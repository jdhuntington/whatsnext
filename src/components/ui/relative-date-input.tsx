import React, { Reducer, useReducer } from "react";
import { Spinner } from "./spinner";
import { Input } from "./input";
import { formattedDate, parseDate } from "../../lib/date-parser";
import { OptionalLocalDate } from "../../types";

interface ComponentState {
  upstreamValue: OptionalLocalDate;
  internalPendingValue: OptionalLocalDate;
  mode: "unchanged" | "dirty" | "pending" | "processing";
  currentValue: string;
}

interface Props {
  initial: OptionalLocalDate;
  onChangeComplete: (value: OptionalLocalDate) => void;
  clearable?: boolean;
  /**
   * For use in interactive testing
   */
  forceMode?: ComponentState["mode"];
}

type Action =
  | { type: "change"; value: string }
  | { type: "blur" }
  | { type: "processingComplete"; value: OptionalLocalDate }
  | { type: "updateUpstream"; value: OptionalLocalDate };

const invalidAction = (action: Action): never => {
  throw new Error(`unknown action type ${action.type}`);
};
const invalidMode = (mode: ComponentState["mode"]): never => {
  throw new Error(`unknown mode ${mode}`);
};

const upstreamToInput = (upstream: OptionalLocalDate): string => {
  if (upstream === null) {
    return "";
  }
  return formattedDate(upstream);
};

const reducer: Reducer<ComponentState, Action> = (p, a): ComponentState => {
  switch (a.type) {
    case "change":
      return { ...p, mode: "dirty", currentValue: a.value };
    case "blur": {
      switch (p.mode) {
        case "dirty":
          return {
            ...p,
            mode: "processing",
          };

        default:
          return p;
      }
    }
    case "processingComplete":
      return {
        ...p,
        mode: "pending",
        internalPendingValue: a.value,
      };

    case "updateUpstream":
      switch (p.mode) {
        case "dirty":
          return { ...p, upstreamValue: a.value };
        case "pending":
          return {
            ...p,
            mode: "unchanged",
            upstreamValue: a.value,
            internalPendingValue: a.value,
            currentValue: upstreamToInput(a.value),
          };
        case "unchanged":
          return {
            ...p,
            currentValue: upstreamToInput(a.value),
            internalPendingValue: a.value,
            upstreamValue: a.value,
          };
      }
      return invalidMode(p.mode);
  }
  return invalidAction(a);
};

export const RelativeDateInput: React.FC<
  Props & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>
> = (props) => {
  const { initial, onChangeComplete, forceMode, ...rest } = props;
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
    [dispatch],
  );
  const onBlur = React.useCallback(() => {
    if (mode === "dirty") {
      dispatch({ type: "blur" });
    }
  }, [dispatch, mode]);
  React.useEffect(() => {
    dispatch({ type: "updateUpstream", value: initial });
  }, [dispatch, initial]);
  React.useEffect(() => {
    if (state.mode === "processing") {
      const value = parseDate(state.currentValue);
      dispatch({ type: "processingComplete", value });
    }
  }, [dispatch, state.mode, state.currentValue]);
  React.useEffect(() => {
    if (state.mode === "pending") {
      onChangeComplete(state.internalPendingValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, state.mode, state.internalPendingValue]); // onChangeComplete in this array would have unintended consequences for poorly behaved upstreams
  return (
    <div className="relative">
      <span className="box flex-1">
        <Input
          value={state.currentValue}
          onChange={onChange}
          autoComplete="off"
          onBlur={onBlur}
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
