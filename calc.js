const btn_pad = document.querySelector('.btn_pad');
const display = document.querySelector('.display');

// Initialize display
display.value = '0';

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) return 'Error';
    return a / b;
}

function tokenize(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
        if (/\d|\./.test(expr[i])) {
            let num = '';
            while (i < expr.length && /\d|\./.test(expr[i])) {
                num += expr[i];
                i++;
            }
            tokens.push(parseFloat(num));
        } else if (['+', '-', '*', '/', '^', '(', ')'].includes(expr[i])) {
            tokens.push(expr[i]);
            i++;
        } else {
            i++; // skip invalid characters
        }
    }
    return tokens;
}

function evaluate(expr) {
    const tokens = tokenize(expr);
    let index = 0;

    function parseExpression() {
        let result = parseTerm();
        while (index < tokens.length && (tokens[index] === '+' || tokens[index] === '-')) {
            const op = tokens[index++];
            const right = parseTerm();
            if (op === '+') result = add(result, right);
            else result = subtract(result, right);
        }
        return result;
    }

    function parseTerm() {
        let result = parseFactor();
        while (index < tokens.length && (tokens[index] === '*' || tokens[index] === '/')) {
            const op = tokens[index++];
            const right = parseFactor();
            if (op === '*') result = multiply(result, right);
            else if (op === '/') {
                result = divide(result, right);
                if (result === 'Error') throw new Error('Division by zero');
            }
        }
        return result;
    }

    function parseFactor() {
        return parsePower();
    }

    function parsePower() {
        let result = parseAtom();
        if (index < tokens.length && tokens[index] === '^') {
            index++;
            const right = parsePower(); // right associative
            result = Math.pow(result, right);
        }
        return result;
    }

    function parseAtom() {
        if (typeof tokens[index] === 'number') {
            return tokens[index++];
        } else if (tokens[index] === '(') {
            index++;
            const result = parseExpression();
            if (index < tokens.length && tokens[index] === ')') index++;
            return result;
        } else if (tokens[index] === '-') {
            index++;
            return -parseAtom();
        } else {
            throw new Error('Invalid expression');
        }
    }

    const result = parseExpression();
    if (index < tokens.length) throw new Error('Invalid expression');
    return result;
}

function operate() {
    let expr = display.value.trim();
    if (expr === '' || expr === '0') return;

    // Replace symbols
    expr = expr.replace(/÷/g, '/');

    try {
        let result = evaluate(expr);
        if (result === 'Error' || isNaN(result) || !isFinite(result)) {
            display.value = 'Error';
        } else {
            display.value = result.toString();
        }
    } catch (e) {
        display.value = 'Error';
    }
}

btn_pad.addEventListener("click", function(e) {
    e.preventDefault();

    let entry = e.target.innerText.trim();
    let val = display.value;

    if (entry === 'AC') {
        display.value = '0';
    } else if (entry === '←') {
        if (val.length > 1) {
            display.value = val.slice(0, -1);
        } else {
            display.value = '0';
        }
    } else if (entry === '=') {
        operate();
    } else {
        if (val === '0' && !isNaN(entry)) {
            display.value = entry;
        } else {
            display.value = val + entry;
        }
    }
});
