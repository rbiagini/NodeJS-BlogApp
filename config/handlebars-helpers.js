// helpers: require('./config/handlebars-helpers'),
module.exports = {
    ifeq: function (a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    bar: function () {
        return "BAR!";
    },
    if_equal: function (a, b, opts) {
        if (a == b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    },
    dateFormat: require("handlebars-dateformat"),
    when: function (operand_1, operator, operand_2, options) {
        var operators = {
                eq: function (l, r) {
                    return l == r;
                },
                noteq: function (l, r) {
                    return l != r;
                },
                gt: function (l, r) {
                    return Number(l) > Number(r);
                },
                or: function (l, r) {
                    return l || r;
                },
                and: function (l, r) {
                    return l && r;
                },
                "%": function (l, r) {
                    return l % r === 0;
                },
            },
            result = operators[operator](operand_1, operand_2);

        /*return (
            result + "(" + operator + "(" + operand_1 + ", " + operand_2 + ")"
        );*/
        if (result) return options.fn(this);
        else return options.inverse(this);
    },
};
