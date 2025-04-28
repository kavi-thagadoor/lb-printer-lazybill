"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sort = void 0;
const Sort = (items, isAscending = true, fieldName, isFilterByNumber) => {
    if (isFilterByNumber) {
        if (isAscending) {
            if (fieldName) {
                return items.sort((a, b) => (parseFloat(a[fieldName]) < parseFloat(b[fieldName]) ? -1 : 1));
            }
            else {
                return items.sort((a, b) => (parseFloat(a) < parseFloat(b) ? -1 : 1));
            }
        }
        else {
            if (fieldName) {
                return items.sort((a, b) => (parseFloat(a[fieldName]) > parseFloat(b[fieldName]) ? -1 : 1));
            }
            else {
                return items.sort((a, b) => (parseFloat(a) > parseFloat(b) ? -1 : 1));
            }
        }
    }
    else {
        if (isAscending) {
            if (fieldName) {
                return items.sort((a, b) => (a[fieldName] < b[fieldName] ? -1 : 1));
            }
            else {
                return items.sort((a, b) => (a < b ? -1 : 1));
            }
        }
        else {
            if (fieldName) {
                return items.sort((a, b) => (a[fieldName] > b[fieldName] ? -1 : 1));
            }
            else {
                return items.sort((a, b) => (a > b ? -1 : 1));
            }
        }
    }
};
exports.Sort = Sort;
//# sourceMappingURL=general.js.map