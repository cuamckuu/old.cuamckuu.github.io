"use strict";

const parse_lambda = function (string, i) {
    if (i === -1) return -1;

    let ch = string[i];
    if ("xyzt".includes(ch)) {
        i = parse_var(string, i);
        if (i === -1) return -1;

    } else if (ch === "(") {
        i = parse_func(string, i+1);
        if (i === -1) return -1;

        ch = string[i];
        if (ch === ")") {
            i += 1;
        } else {
            alert("Error parsing close bracket");
            return -1;
        }
    } else {
        alert("Error parsing lambda");
        return -1;
    }

    return i;
};

const parse_func = function (string, i) {
    if (i === -1) return -1;

    let ch = string[i];
    if ("xyzt(".includes(ch)) {
        i = parse_lambda(string, i);
        if (i === -1) return -1;

        i = parse_lambda(string, i);
        if (i === -1) return -1;
    } else if (ch == "h") {
        i = parse_var(string, i+1);
        if (i === -1) return -1;

        ch = string[i];
        if (ch === ".") {
            i += 1;
        } else {
            alert("Error reading dot");
            return -1;
        }

        i = parse_lambda(string, i);
        if (i === -1) return -1;
    } else {
        alert("Error parsing func");
        return -1;
    }

    return i;
};

const parse_var = function (string, i) {
    if (i === -1) return -1;

    let ch = string[i];
    if ("xyzt".includes(ch)) {
        i += 1;
    } else {
        alert("Error parsing var");
        return -1;
    }

    return i;
};

document.addEventListener("DOMContentLoaded", function () {
    let string = prompt("Введите строку для проверки:");
    let i = parse_lambda(string, 0);

    if (i === string.length) {
        alert("Разбор выполнен без ошибок");
    };


});
