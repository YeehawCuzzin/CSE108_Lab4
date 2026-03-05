import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import "./Calculator.css";

function compute(a, op, b) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b === 0 ? NaN : a / b;
        default: return b;
    }
}

function formatNumber(n) {
    if (!Number.isFinite(n)) return "Error";
    return n.toString();
}

function CalcBtn({ className, onClick, children }) {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            className={className}
            fullWidth
            disableElevation
        >
            {children}
        </Button>
    );
}

export default function Calculator() {
    const [display, setDisplay] = useState("0");     // string
    const [first, setFirst] = useState(null);        // number|null
    const [operator, setOperator] = useState(null);  // "+-*/"|null
    const [waitingForSecond, setWaitingForSecond] = useState(false);

    // repeated equals memory
    const [lastOp, setLastOp] = useState(null);
    const [lastSecond, setLastSecond] = useState(null);

    // highlight state
    const [activeOp, setActiveOp] = useState(null);

    function clearAll() {
        setDisplay("0");
        setFirst(null);
        setOperator(null);
        setWaitingForSecond(false);
        setLastOp(null);
        setLastSecond(null);
        setActiveOp(null);
    }

    function beginSecondIfNeeded() {
        if (waitingForSecond) {
            setDisplay("0");
            setWaitingForSecond(false);
        }
    }

    function pressDigit(d) {
        beginSecondIfNeeded();

        setDisplay((prev) => (prev === "0" ? d : prev + d));

        // number input removes highlight
        setActiveOp(null);
    }

    function pressDecimal() {
        beginSecondIfNeeded();

        setDisplay((prev) => {
            if (prev.includes(".")) return prev;
            return prev + ".";
        });

        // number input removes highlight
        setActiveOp(null);
    }

    function pressOperator(op) {
        const curr = parseFloat(display);

        // no first yet
        if (first === null) {
            setFirst(curr);
            setOperator(op);
            setWaitingForSecond(true);
            setActiveOp(op);
            return;
        }

        // operator pressed again while waiting, just switch operator + highlight
        if (waitingForSecond) {
            setOperator(op);
            setActiveOp(op);
            return;
        }

        // if we have first + operator + second number, new operator acts like equals
        if (operator !== null) {
            const result = compute(first, operator, curr);
            const formatted = formatNumber(result);

            if (formatted === "Error") {
                clearAll();
                return;
            }

            setDisplay(formatted);
            setFirst(result);

            // store repeat memory
            setLastOp(operator);
            setLastSecond(curr);

            // now set new operator active
            setOperator(op);
            setWaitingForSecond(true);
            setActiveOp(op);
            return;
        }

        // fallback
        setOperator(op);
        setWaitingForSecond(true);
        setActiveOp(op);
    }

    function pressEquals() {
        // equals clears highlight
        setActiveOp(null);

        const curr = parseFloat(display);

        // nothing to do
        if (operator === null && lastOp === null) return;

        // normal equals
        if (operator !== null) {
            if (first === null) return;

            // If user hit operator then equals, use first as second (2 + = becomes 2 + 2)
            const second = waitingForSecond ? first : curr;

            const result = compute(first, operator, second);
            const formatted = formatNumber(result);

            if (formatted === "Error") {
                clearAll();
                return;
            }

            setDisplay(formatted);
            setFirst(result);

            // store repeat memory
            setLastOp(operator);
            setLastSecond(second);

            // clear active operator, but keep repeat memory
            setOperator(null);
            setWaitingForSecond(true);
            return;
        }

        // repeated equals
        if (lastOp !== null && lastSecond !== null) {
            const a = parseFloat(display);
            const result = compute(a, lastOp, lastSecond);
            const formatted = formatNumber(result);

            if (formatted === "Error") {
                clearAll();
                return;
            }

            setDisplay(formatted);
            setFirst(result);
            setWaitingForSecond(true);
        }
    }

    return (
        <Box className="page">
            <Box className="calc">
                <Typography variant="h6" className="title">
                    CSE 108 Lab 4 Calculator
                </Typography>

                <TextField
                    value={display}
                    className="display"
                    inputProps={{ readOnly: true, style: { textAlign: "right" } }}
                />

                {/* Row 1 */}
                <CalcBtn className="btn num" onClick={() => pressDigit("1")}>1</CalcBtn>
                <CalcBtn className="btn num" onClick={() => pressDigit("2")}>2</CalcBtn>
                <CalcBtn className="btn num" onClick={() => pressDigit("3")}>3</CalcBtn>
                <CalcBtn className={`btn op ${activeOp === "+" ? "active" : ""}`} onClick={() => pressOperator("+")}>+</CalcBtn>

                {/* Row 2 */}
                <CalcBtn className="btn num" onClick={() => pressDigit("4")}>4</CalcBtn>
                <CalcBtn className="btn num" onClick={() => pressDigit("5")}>5</CalcBtn>
                <CalcBtn className="btn num" onClick={() => pressDigit("6")}>6</CalcBtn>
                <CalcBtn className={`btn op ${activeOp === "-" ? "active" : ""}`} onClick={() => pressOperator("-")}>-</CalcBtn>

                {/* Row 3 */}
                <CalcBtn className="btn num" onClick={() => pressDigit("7")}>7</CalcBtn>
                <CalcBtn className="btn num" onClick={() => pressDigit("8")}>8</CalcBtn>
                <CalcBtn className="btn num" onClick={() => pressDigit("9")}>9</CalcBtn>
                <CalcBtn className={`btn op ${activeOp === "*" ? "active" : ""}`} onClick={() => pressOperator("*")}>x</CalcBtn>

                {/* Row 4 */}
                <CalcBtn className="btn num" onClick={() => pressDigit("0")}>0</CalcBtn>
                <CalcBtn className="btn num" onClick={pressDecimal}>.</CalcBtn>
                <CalcBtn className="btn eq" onClick={pressEquals}>=</CalcBtn>
                <CalcBtn className={`btn op ${activeOp === "/" ? "active" : ""}`} onClick={() => pressOperator("/")}>/</CalcBtn>

                {/* Row 5 */}
                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    disableElevation
                    className="btn clear"
                    onClick={clearAll}
                >
                    C
                </Button>
            </Box>
        </Box>
    );
}