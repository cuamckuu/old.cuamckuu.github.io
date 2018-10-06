"use strict";

const get_input = function  () {
    const form = document.getElementById("InputForm");
    const num = (form.elements[0].value |0);

    if (num <= 0) {
        return 1;
    }

    if (num > 5) {
        return 10;
    }

    return num;
}

const dec2bin_str = function (num, args_num) {
    const bin_str = (num|0).toString(2);
    const zeros_cnt = +args_num - bin_str.length;
    return ("0".repeat(zeros_cnt) + bin_str);
};

const generate_table = function (args_num, res) {
    var table = document.createElement("table");

    // Add first row with variables names
    var args_row = document.createElement("tr");
    for (var i = 0; i < +args_num + 1; i++) {
        var arg_cell = document.createElement("td");

        if (i == args_num) {
            arg_cell.innerHTML = "F".bold();
            arg_cell.style = "border-left: 2px solid black;";
        } else {
            arg_cell.innerHTML = String.fromCharCode("a".charCodeAt(0) + i).bold();
        }

        args_row.appendChild(arg_cell);
    }

    table.appendChild(args_row);

    // Add other rows with values and function results
    const maxI = Math.pow(2, +args_num);
    const res_str = dec2bin_str(+res, maxI);
    for (var i = 0; i < maxI; i++) {
        var table_row = document.createElement("tr");

        for (var ch of dec2bin_str(i, args_num)) {
            var table_cell = document.createElement("td");
            table_cell.innerHTML = ch;

            table_row.appendChild(table_cell)
        }

        var res_cell = document.createElement("td");
        res_cell.id = "row_res" + i;
        res_cell.style = "border-left: 2px solid black;";
        res_cell.innerHTML = res_str[i];
        table_row.appendChild(res_cell)

        table.appendChild(table_row);
    }

    return table;
};

const check_for = function (cl, tableNode) {
    const tableWidth = tableNode.children[0].children.length;
    const tableHeight = tableNode.children.length;

    if (cl == "T0") {
        const val = +tableNode.children[1].children[tableWidth - 1].innerHTML;
        if (val === 0) {
            return "+";
        }
    }

    if (cl == "T1") {
        const last_row = tableNode.children[tableHeight - 1];
        const val = +last_row.children[tableWidth - 1].innerHTML;

        if (val === 1) {
            return "+";
        }
    }

    if (cl == "S") {
        var res_string = "";

        for (var i = 1; i < tableHeight; i++) {
            const row = tableNode.children[i];
            const val = row.children[tableWidth - 1].innerHTML;
            res_string += val;
        }

        var inverted_string = res_string
            .split("")
            .map((el) => {
                return (el == "1"?"0":"1");
            })
            .reverse()
            .join("");

        if (res_string === inverted_string) {
            return "+";
        }
    }

    if (cl == "L") {
        return "?";
    }

    if (cl == "M") {
        for (var i = 1; i < tableHeight - 1; i++) {
            for (var j = i + 1; j < tableHeight; j++) {
                const row_i = tableNode.children[i];
                const val_i = +row_i.children[tableWidth - 1].innerHTML;

                const row_j = tableNode.children[j];
                const val_j = +row_j.children[tableWidth - 1].innerHTML;

                for (var arg_n = 0; arg_n < tableWidth - 1; arg_n++) {
                    const arg_i_n = +row_i.children[arg_n].innerHTML;
                    const arg_j_n = +row_j.children[arg_n].innerHTML;

                    if (arg_i_n <= arg_j_n && val_i > val_j) {
                        return "-";
                    }
                }
            }
        }

        return "+";
    }

    return "-";
};

const get_posts_lattice = function (tableNode) {
    var table_lattice = document.createElement("table");

    const classes = ["T0", "T1", "S", "L", "M"];

    var arg_row = document.createElement("tr");
    var val_row = document.createElement("tr");

    for (const cl of classes) {
        var arg_cell = document.createElement("td");
        var val_cell = document.createElement("td");

        arg_cell.innerHTML = cl;
        val_cell.innerHTML = check_for(cl, tableNode);

        arg_row.appendChild(arg_cell);
        val_row.appendChild(val_cell);
    }
    table_lattice.appendChild(arg_row);
    table_lattice.appendChild(val_row);

    return table_lattice;
}

const process_form = function (e) {
    var result_div = document.getElementById("result");
    result_div.innerHTML = "";

    e.preventDefault();

    const args_num = +get_input();
    const res_amount = Math.pow(2, args_num + 1);
    for (var res = 0; res < res_amount; res++) {
        var func_and_lattice = document.createElement("span");

        const table = generate_table(args_num, res);
        const table_lattice = get_posts_lattice(table);

        func_and_lattice.appendChild(table);
        func_and_lattice.appendChild(table_lattice);

        result_div.appendChild(func_and_lattice);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("InputForm");
    form.addEventListener("submit", process_form);
});
