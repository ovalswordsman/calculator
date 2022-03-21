import "./style.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

const INT_FORMAT = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: "0"
})

function formatNum(operand){
  if(operand==null)return 
  const[integer, decimal ] = operand.split(".")
  if(decimal==null)return INT_FORMAT.format(integer)

  return  `${INT_FORMAT.format(integer)}.${decimal}`

}
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;
      if (state.currentOperand == null)
        return {
          ...state,
          operation: payload.operation,
        };
      if (state.previousOperand == null)
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };

      return {
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.previousOperand == null ||
        state.currentOperand == null
      )
        return state;
      return {
        ...state,
        previousOperand: null,
        operation: null,
        overwrite: true,
        currentOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CLEAR:
      return {};
  }
}
function evaluate({ currentOperand, previousOperand, operation }) {
  const curr = parseFloat(currentOperand);
  const prev = parseFloat(previousOperand);
  if (isNaN(curr) || isNaN(prev)) return "";

  let res = "";
  switch (operation) {
    case "+":
      res = curr + prev;
      break;
    case "-":
      res = prev - curr;
      break;
    case "*":
      res = prev * curr;
      break;
    case "÷":
      res = prev / curr;
      break;
  }
  return res.toString();
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatNum(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatNum(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
