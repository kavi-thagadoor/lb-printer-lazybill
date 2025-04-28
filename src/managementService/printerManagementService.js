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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTemporaryFolder = exports.SetPrint = exports.TestPrintByMm = exports.GetPrinters = void 0;
const printerManagement = __importStar(require("../management/printerManagement"));
const fileHandlerManagement = __importStar(require("../management/fileHandlerManagement"));
const types_1 = require("../types");
const convertor_1 = require("../convertor");
const GetPrinters = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let rtn = yield printerManagement.GetPrinters();
    return rtn;
});
exports.GetPrinters = GetPrinters;
const TestPrintByMm = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlContent = yield fileHandlerManagement.GetTestDataByMM(req.params.language, req.params.printSize, req.params.paperSize);
    const htmlToPdfData = {
        htmlContent: htmlContent,
        printerNames: [req.params.printerName]
    };
    let rtn = yield printerManagement.SetPrint(req, { values: [htmlToPdfData] });
    return rtn;
});
exports.TestPrintByMm = TestPrintByMm;
const SetPrint = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let jsonObject = req.body.val;
    let data = jsonObject.dt;
    let rtn = { status: types_1.Status.None };
    if (data.values.length > 0) {
        const isValidRequest = printerManagement.IsValidRequest(data.values[0].htmlContent);
        if (isValidRequest) {
            data.values[0].htmlContent = printerManagement.GetValidHtmlContent(data.values[0].htmlContent);
            rtn = yield printerManagement.SetPrint(req, data);
        }
        else {
            rtn.status = types_1.Status.Invalid;
        }
    }
    return rtn;
});
exports.SetPrint = SetPrint;
const GetTemporaryFolder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return { status: types_1.Status.Success, id: convertor_1.temporaryFolder };
});
exports.GetTemporaryFolder = GetTemporaryFolder;
//# sourceMappingURL=printerManagementService.js.map