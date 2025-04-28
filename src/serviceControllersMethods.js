"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.service_controllers_methods = void 0;
exports.service_controllers_methods = {
    printer: {
        controller: "printer/",
        methods: {
            getPrinters: "get-printers",
            testPrint: "test-print/:language/:paperSize/:printerName/:printSize",
            setPrint: "set-print",
            getTemporaryFolder: "get-temporary-folder"
        }
    },
    fileHandler: {
        controller: "file-handler/",
        methods: {
            testHtmlToPdf: "test-html-to-pdf"
        }
    }
};
//# sourceMappingURL=serviceControllersMethods.js.map