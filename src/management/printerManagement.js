"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPrint = exports.GetPrinters = exports.GetValidHtmlContent = exports.IsValidRequest = void 0;
const convertor_1 = require("../convertor");
const types_1 = require("../types");
const unix_print_1 = require("unix-print");
const fileHandlerManagement_1 = require("./fileHandlerManagement");
const general_1 = require("../utils/general");
const moment_1 = __importDefault(require("moment"));
const printWindows = require("pdf-to-printer");
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const authTag = 'kulscript';
const authMin = 15;
const IsValidRequest = (htmlContent) => {
    let rtn = false;
    try {
        if (htmlContent.indexOf(authTag) > -1) {
            let htmlContents = htmlContent.split('<' + authTag + '>');
            if (htmlContents.length > 1) {
                htmlContents = htmlContents[1].split('</' + authTag + '>');
                if (htmlContents.length > 0) {
                    const decString = (0, convertor_1.Decrypt)(htmlContents[0]);
                    const diffenrMinutes = moment_1.default.utc().diff((0, moment_1.default)(decString), "minutes");
                    if (diffenrMinutes >= -authMin && diffenrMinutes <= authMin) {
                        rtn = true;
                    }
                }
            }
        }
    }
    catch (ex) {
    }
    return rtn;
};
exports.IsValidRequest = IsValidRequest;
const GetValidHtmlContent = (htmlContent) => {
    try {
        if (htmlContent.indexOf(authTag) > -1) {
            let htmlContents = htmlContent.split('<' + authTag + '>');
            if (htmlContents.length > 0) {
                htmlContent = htmlContents[0];
            }
        }
    }
    catch (ex) {
    }
    return htmlContent;
};
exports.GetValidHtmlContent = GetValidHtmlContent;
const GetPrinters = () => __awaiter(void 0, void 0, void 0, function* () {
    let rtn = { osType: convertor_1.osType, printerNames: [] };
    switch (convertor_1.osType) {
        case types_1.OsType.Windows:
            {
                rtn.printerWindows = yield GetPrintersWindows();
                rtn.printerNames = rtn.printerWindows.map(x => x.name);
            }
            break;
        case types_1.OsType.Linux:
        case types_1.OsType.Mac:
            {
                rtn.printerLinux = yield GetPrintersLinux();
                rtn.printerNames = rtn.printerLinux.map(x => x.printer);
            }
            break;
        default:
            {
                rtn.printerChildProcess = yield GetPrintersChildProcess();
            }
            break;
    }
    if (rtn.printerNames && rtn.printerNames.length > 0) {
        rtn.printerNames = (0, general_1.Sort)(rtn.printerNames, true);
    }
    return rtn;
});
exports.GetPrinters = GetPrinters;
const SetPrint = (req, printData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!printData.hostedUrl) {
        printData.hostedUrl = (0, convertor_1.GetCurrentHostUrl)(req, true);
    }
    let rtn = { status: types_1.Status.None };
    try {
        yield Promise.all(printData.values.map((value) => __awaiter(void 0, void 0, void 0, function* () {
            const file = yield (0, fileHandlerManagement_1.ConvertHtmlToPdf)(value, printData.tempFolder, printData.hostedUrl);
            if (file.status == types_1.Status.Success) {
                yield Promise.all(value.printerNames.map((printerName) => __awaiter(void 0, void 0, void 0, function* () {
                    switch (convertor_1.osType) {
                        case types_1.OsType.Windows:
                            {
                                rtn = yield SetPrintWindows(printerName, file.id);
                            }
                            break;
                        case types_1.OsType.Linux:
                        case types_1.OsType.Mac:
                            {
                                rtn = yield SetPrintLinux(printerName, file.id);
                            }
                            break;
                    }
                })));
                (0, fileHandlerManagement_1.RemoveFile)(file.id);
            }
            else {
                rtn = file;
            }
        })));
    }
    catch (ex) {
        rtn.status = types_1.Status.Failed;
        if (ex) {
            rtn.message = JSON.stringify(ex);
        }
    }
    return rtn;
});
exports.SetPrint = SetPrint;
const SetPrintLinux = (printerName, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    let rtn = { status: types_1.Status.None };
    try {
        const printerOption = printerName ? `-d ${printerName}` : '';
        const command = `lp ${printerOption} "${filePath}"`;
        // Execute the print command
        yield new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject({ error: error.message, stderr });
                    if (error) {
                        rtn.message = JSON.stringify(error);
                    }
                }
                else {
                    resolve({ stdout, stderr });
                    rtn.status = types_1.Status.Success;
                }
            });
        });
    }
    catch (ex) {
        rtn.status = types_1.Status.Failed;
        if (ex) {
            rtn.message = JSON.stringify(ex);
        }
    }
    return rtn;
});
// const SetPrintLinux = async (printerName: string, filePath: string): Promise<StatusId> => {
//     let rtn: StatusId = { status: Status.None } as StatusId;
//     //Print options https://www.computerhope.com/unix/ulp.htm
//     const options = ["-o fit-to-page"];
//     //onst options = ["-o media=Custom.227x567"];
//     await printUnix(filePath, printerName, options).then(res => {
//         rtn.status = Status.Success;
//     }).catch(err => {
//         console.log("Error found", err);
//         rtn.status = Status.Failed;
//     });
//     return rtn;
// }
const SetPrintWindows = (printerName, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    let rtn = { status: types_1.Status.None };
    try {
        const options = {
            printer: printerName,
            scale: 'noscale' //noscale, shrink, fit
        };
        yield printWindows.print(filePath, options).then((res) => {
            rtn.status = types_1.Status.Success;
        }).catch((err) => {
            rtn.status = types_1.Status.Failed;
            if (err) {
                rtn.message = JSON.stringify(err);
            }
        });
    }
    catch (ex) {
        rtn.status = types_1.Status.Failed;
        if (ex) {
            rtn.message = JSON.stringify(ex);
        }
    }
    return rtn;
});
const GetPrintersWindows = () => __awaiter(void 0, void 0, void 0, function* () {
    let rtn = [];
    const { stdout } = yield execAsync('wmic printer get Name,Status,Default,DeviceID');
    // Parse output
    const lines = stdout.trim().split('\n');
    const printers = lines.slice(1).map((line) => {
        const [status, name, isDefault, deviceId] = line.trim().split(/\s{2,}/); // Split by 2 or more spaces
        return { status, name, default: isDefault === 'TRUE', deviceId };
    });
    printers.forEach((printer) => {
        rtn.push({
            deviceId: printer.deviceId,
            name: printer.name
        });
    });
    // await getPrintersWindows().then(res => {
    //     rtn = res as PrinterWindows[];
    // }).catch(collErr => {
    //     console.log(collErr);
    // });
    return rtn;
});
const GetPrintersLinux = () => __awaiter(void 0, void 0, void 0, function* () {
    let rtn = [];
    yield (0, unix_print_1.getPrinters)().then(res => {
        rtn = res;
    });
    return rtn;
});
const GetPrintersChildProcess = () => __awaiter(void 0, void 0, void 0, function* () {
    let rtn = [];
    let isExecuted = false;
    const { exec } = require('child_process');
    exec('wmic printer list brief', (err, stdout, stderr) => {
        if (!err) {
            stdout = stdout.split("  ");
            var stdoutCountNow = 0;
            stdout = stdout.filter((item) => item);
            for (var stdoutCount = 0; stdoutCount < stdout.length; stdoutCount++) {
                if (stdout[stdoutCount] == " \r\r\n" || stdout[stdoutCount] == "\r\r\n") {
                    rtn.push({
                        id: (stdoutCount + 1).toString(),
                        name: stdout[stdoutCount + 1] ? stdout[stdoutCount + 1].trim() : '-',
                        printerState: stdout[stdoutCount + 2] ? parseInt(stdout[stdoutCount + 2].trim()) : 0,
                        printerStatus: stdout[stdoutCount + 3] ? parseInt(stdout[stdoutCount + 3].trim()) : 0,
                        systemName: stdout[stdoutCount + 4] ? stdout[stdoutCount + 4].trim() : '-',
                        location: stdout[stdoutCount + 5] ? stdout[stdoutCount + 5].trim() : '-',
                        shareName: stdout[stdoutCount + 6] ? stdout[stdoutCount + 6].trim() : '-'
                    });
                    stdoutCountNow++;
                }
            }
        }
        isExecuted = true;
    });
    while (!isExecuted) {
        yield (0, convertor_1.sleep)(200);
    }
    return rtn;
});
//# sourceMappingURL=printerManagement.js.map