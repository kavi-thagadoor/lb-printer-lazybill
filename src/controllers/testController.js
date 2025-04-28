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
exports.test = exports.version = exports.IsServiceAvailable = exports.DownloadFile = void 0;
const moment_1 = __importDefault(require("moment"));
const convertor_1 = require("../convertor");
const types_1 = require("../types");
const printerManagement_1 = require("../management/printerManagement");
const os = require('os');
const path = require('path');
const DownloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receivedPath = req.query.path;
        const filePath = path.join(__dirname, 'public', receivedPath).replace('\\controllers', '').replace('/controllers', '');
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            }
        });
    }
    catch (ex) {
        res.status(404).send(ex);
    }
});
exports.DownloadFile = DownloadFile;
const IsServiceAvailable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rtn = { status: types_1.Status.Success };
        res.send(rtn);
    }
    catch (ex) {
        res.status(404).send(ex);
    }
});
exports.IsServiceAvailable = IsServiceAvailable;
let version = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const domain = (0, convertor_1.GetCurrentHostUrl)(req);
    const hostedUrl = (0, convertor_1.GetCurrentHostUrl)(req, true);
    res.json({
        version: process.env.version + ' version is running!',
        type: "Offline Api",
        utc_time: moment_1.default.utc().toDate(),
        os: os.platform(),
        projectFolder: convertor_1.projectFolder,
        tempFolder: convertor_1.temporaryFolder,
        supportedOs: "Windows, Linux, Mac",
        toPrinteTestData: hostedUrl + '/test',
        usage: req.params.id && req.params.id == '1' ? GetList(domain) : '-'
    });
});
exports.version = version;
let test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const language = req.params.language && convertor_1.languageCodes.find(x => x.code == req.params.language) ? req.params.language : 'en';
        const domain = (0, convertor_1.GetCurrentHostUrl)(req, true);
        const printers = yield (0, printerManagement_1.GetPrinters)();
        const dataPath = [convertor_1.projectFolder, 'src', 'testData', 'printerTitle.json'].join(convertor_1.slashSymbol);
        const printerTitle = (yield require(dataPath));
        const languageText = (0, convertor_1.getEnumValueByKey)(convertor_1.FontFileNameByCode, language);
        const paperSizes = ['45mm', '50mm', '60mm', '70mm', '80mm', '90mm', '100mm', '110mm', '120mm'];
        const route = [domain, 'test'].join('/');
        let html = '<select style="padding:10px;margin-bottom:10px" name="lazydigisoltest" onchange="location = this.value;">';
        convertor_1.languageCodes.forEach(languageCode => {
            const selected = language == languageCode.code ? ' selected ' : '';
            const value = route + '/' + languageCode.code;
            const text = languageCode.title;
            html += '<option ' + selected + ' value="' + value + '">' + text + '</option>';
        });
        html += '</select></br>';
        const printerText = (_a = printerTitle.printer.find(x => x.text == languageText)) === null || _a === void 0 ? void 0 : _a.title;
        html += '<table cellpadding="0" cellspacing="0"><thead><tr><td>' + printerText + '</td>';
        paperSizes.forEach(paperSize => {
            html += '<td>' + paperSize + '</td>';
        });
        html += '</tr></thead><tbody>';
        const printSizes = [{ key: 'sm', title: 'Small' }, { key: 'md', title: 'Medium' }, { key: 'lg', title: 'Large' }];
        printers.printerNames.forEach(printerName => {
            html += '<tr><td>' + printerName + '</td>';
            paperSizes.forEach(paperSize => {
                const url = domain + '/printer/test-print/' + language + '/' + paperSize + '/' + printerName;
                const title = paperSize + ', ' + printerName;
                html += '<td>';
                printSizes.forEach(printSize => {
                    var _a, _b, _c;
                    let printSizeTitle = '';
                    switch (printSize.key) {
                        case 'sm':
                            {
                                printSizeTitle = (_a = printerTitle.smallPrint.find(x => x.text == languageText)) === null || _a === void 0 ? void 0 : _a.title;
                            }
                            break;
                        case 'md':
                            {
                                printSizeTitle = (_b = printerTitle.mediumPrint.find(x => x.text == languageText)) === null || _b === void 0 ? void 0 : _b.title;
                            }
                            break;
                        case 'lg':
                            {
                                printSizeTitle = (_c = printerTitle.largePrint.find(x => x.text == languageText)) === null || _c === void 0 ? void 0 : _c.title;
                            }
                            break;
                        default:
                            {
                                printSizeTitle = 'Print ' + printSize.title;
                            }
                            break;
                    }
                    html += '<div style="width:100%;margin:5px;"><a target="_blank" href="' + (url + '/' + printSize.key) + '" title=' + title + '>' + printSizeTitle + '</a></div>';
                });
                html += '</td>';
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        const style = '<style>body{display: ruby-text;} table{ font-size:18px;font-family: sans-serif;} table td{ border: grey 1px solid;padding: 5px; } table thead td{ background-color:#008cba; color: white; text-align:center;} table tbody tr:hover{background-color: lightyellow;} </style>';
        res.setHeader("Content-Type", "text/html");
        res.send(style + html);
    }
    catch (ex) {
        res.setHeader("Content-Type", "text/html");
        res.send('<p>' + ex + '</p>');
    }
});
exports.test = test;
const GetList = (domain) => {
    const urls = [
        {
            "Title": "Get All Printers",
            "Method": "Get",
            "Url": domain + "/printer/get-printers"
        },
        {
            "Title": "To Test Print",
            "Method": "Get",
            "Url": domain + "/printer/test-print/Send To OneNote 2013"
        },
        {
            "Title": "Send multiple HTML Data to Multiple printer",
            "Method": "Post",
            "Url": domain + "/printer/set-print"
        },
        {
            "Title": "Convert HTML to PDF",
            "Method": "Get",
            "Url": domain + "/file-handler/test-html-to-pdf"
        }
    ];
    return urls;
};
//# sourceMappingURL=testController.js.map