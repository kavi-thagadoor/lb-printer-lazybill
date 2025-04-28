"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const serviceControllersMethods_1 = require("./serviceControllersMethods");
const testController = __importStar(require("./controllers/testController"));
const printerController = __importStar(require("./controllers/printerController"));
const fileHandlerController = __importStar(require("./controllers/fileHandlerController"));
const router = express_1.default.Router();
router.get('/download', testController.DownloadFile);
router.get('/version', testController.version);
router.get('/test', testController.test);
router.get('/test/:language', testController.test);
router.get('/version/:id', testController.version);
router.get('/is-service-available', testController.IsServiceAvailable);
router.get('/' + serviceControllersMethods_1.service_controllers_methods.printer.controller + serviceControllersMethods_1.service_controllers_methods.printer.methods.getPrinters, printerController.GetPrinters);
router.get('/' + serviceControllersMethods_1.service_controllers_methods.printer.controller + serviceControllersMethods_1.service_controllers_methods.printer.methods.testPrint, printerController.TestPrintByMm);
router.post('/' + serviceControllersMethods_1.service_controllers_methods.printer.controller + serviceControllersMethods_1.service_controllers_methods.printer.methods.setPrint, printerController.SetPrint);
router.get('/' + serviceControllersMethods_1.service_controllers_methods.printer.controller + serviceControllersMethods_1.service_controllers_methods.printer.methods.getTemporaryFolder, printerController.GetTemporaryFolder);
router.get('/' + serviceControllersMethods_1.service_controllers_methods.fileHandler.controller + serviceControllersMethods_1.service_controllers_methods.fileHandler.methods.testHtmlToPdf, fileHandlerController.TestHtmlToPdf);
module.exports = router;
//# sourceMappingURL=routes.js.map