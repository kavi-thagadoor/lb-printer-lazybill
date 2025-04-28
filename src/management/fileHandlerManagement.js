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
exports.GetTestData = exports.GetTestDataByMM = exports.RemoveFile = exports.WriteFile = exports.GetFileContentFromUrl = exports.ConvertHtmlToPdf = void 0;
const convertor_1 = require("../convertor");
const constants_1 = require("../constants");
const types_1 = require("../types");
const moment_1 = __importDefault(require("moment"));
//import JsPDF from 'jspdf';
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
//const htmlPdf = require('html-pdf');
//const html_to_pdf = require('html-pdf-node');
const puppeteer = require('puppeteer');
const isEnableLog = false;
const ConvertHtmlToPdf = (printContent, tempFolder, hostedUrl) => __awaiter(void 0, void 0, void 0, function* () {
    let rtn = { status: types_1.Status.None };
    try {
        if (printContent.htmlContent) {
            //printContent.htmlContent = ReplaceAll(printContent.htmlContent, "\r", "");
            //printContent.htmlContent = ReplaceAll(printContent.htmlContent, "\n", "");
            //printContent.htmlContent = ReplaceAll(printContent.htmlContent, "</br>", "");
            const fileName = uuidv4() + '.pdf';
            let elligibleLanguageCodes = [];
            convertor_1.languageCodes.forEach(languageCode => {
                if (printContent && printContent.htmlContent) {
                    const languageCodeClass = 'class="receipt_font_' + languageCode.code + '';
                    if (printContent.htmlContent.indexOf(languageCodeClass) > -1) {
                        elligibleLanguageCodes.push(languageCode);
                    }
                }
            });
            elligibleLanguageCodes.forEach(elligibleLanguageCode => {
                if (printContent.htmlContent) {
                    elligibleLanguageCode.fontNames.forEach(fontName => {
                        if (hasMultipleRegexMatches(printContent.htmlContent, fontName)) {
                            const fontFileName = (0, convertor_1.getEnumValueByKey)(convertor_1.FontFileName, fontName);
                            const cssPath = '{{css_path}}' + fontFileName + '.woff';
                            if (!(hostedUrl === null || hostedUrl === void 0 ? void 0 : hostedUrl.endsWith('/'))) {
                                hostedUrl = hostedUrl + '/';
                            }
                            const fontToReplace = [hostedUrl, 'download?path=assets/scss/', fontFileName, '.ttf'].join('');
                            if (fontToReplace) {
                                printContent.htmlContent = (0, convertor_1.ReplaceAll)(printContent.htmlContent, cssPath, fontToReplace);
                            }
                        }
                    });
                }
            });
            printContent.htmlContent = (0, convertor_1.ReplaceAll)(printContent.htmlContent, "woff", "truetype");
            printContent.htmlContent = (0, convertor_1.ReplaceAll)(printContent.htmlContent, '{{icon_path}}', constants_1.logoUrl);
            if (isEnableLog) {
                const filePathLastHtml = [convertor_1.projectFolder, 'src', 'testData', 'lastHtml.txt'].join(convertor_1.slashSymbol);
                rtn = yield (0, exports.WriteFile)(filePathLastHtml, printContent.htmlContent);
            }
            const filePath = [(tempFolder !== null && tempFolder !== void 0 ? tempFolder : convertor_1.temporaryFolder), fileName].join(convertor_1.slashSymbol);
            if (isEnableLog) {
                console.log("Start time : " + moment_1.default.utc().toDate());
            }
            rtn = yield CreatePdfByPuppeteer(printContent, filePath);
            if (isEnableLog) {
                console.log("End time : " + moment_1.default.utc().toDate());
            }
        }
        else {
            rtn.status = types_1.Status.DataRequired;
        }
    }
    catch (ex) {
        rtn.message = JSON.stringify(ex);
        rtn.status = types_1.Status.Failed;
    }
    return rtn;
});
exports.ConvertHtmlToPdf = ConvertHtmlToPdf;
const hasMultipleRegexMatches = (text, searchString) => {
    // Escape special characters in the search string to avoid regex errors
    const escapedSearchString = searchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Create a global regex pattern
    const regex = new RegExp(escapedSearchString, "g");
    // Find all matches
    const matches = text.match(regex);
    // Return true if more than one occurrence is found
    return matches ? matches.length > 1 : false;
};
const CreatePdfByPuppeteer = (printContent, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let rtn = { status: types_1.Status.None };
    try {
        if (isEnableLog) {
            console.log("Puppeteer Start time : " + moment_1.default.utc().toDate());
        }
        if (printContent.htmlContent) {
            const browser = yield puppeteer.launch({
                headless: true, // Ensure headless mode is on
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necessary for some environments
            });
            const page = yield browser.newPage();
            // Set the content of the page
            yield page.setContent(printContent.htmlContent, { waitUntil: 'load' });
            const styles = yield page.evaluate(() => {
                const styleInfo = [];
                let table = document.getElementById('tbl-content'); // Replace with your table ID or selector
                if (table) {
                    const rows = table.querySelectorAll('tr');
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        const isEmpty = Array.from(cells).every(cell => {
                            // Clean up whitespace and check if content is empty
                            const cleanedText = cell && cell.textContent ? cell.textContent.replace(/\s+/g, ' ').trim() : '';
                            return cleanedText === '';
                        });
                        if (isEmpty) {
                            row.remove();
                        }
                    });
                    // const multiple = table.clientHeight / 720;
                    // const minHeight = (parseInt(multiple.toString().split('.')[0]) + 1) * 720;
                    // table.style.minHeight = minHeight+'px';
                    const computedStyle = window.getComputedStyle(table);
                    styleInfo.push({
                        width: computedStyle.width,
                        height: computedStyle.height
                        // Add more styles as needed
                    });
                }
                return styleInfo;
            });
            const marginBottom = parseInt((_a = process.env.marginbottom) !== null && _a !== void 0 ? _a : '0');
            // Generate the PDF
            if (styles.length > 0) {
                yield page.pdf({
                    path: filePath, // Save the PDF to a file
                    width: styles[0].width,
                    margin: {
                        top: '0mm',
                        right: '0mm',
                        bottom: marginBottom + 'mm',
                        left: '0mm'
                    },
                    landscape: false
                });
            }
            else {
                yield page.pdf({
                    path: filePath, // Save the PDF to a file
                    format: 'A4',
                    margin: {
                        top: '0mm',
                        right: '0mm',
                        bottom: '0mm',
                        left: '0mm'
                    },
                    landscape: false
                });
            }
            yield browser.close();
            rtn.id = filePath;
            rtn.status = types_1.Status.Success;
        }
        else {
            rtn.status = types_1.Status.DataRequired;
        }
        if (isEnableLog) {
            console.log("Puppeteer End time : " + moment_1.default.utc().toDate());
        }
    }
    catch (ex) {
        rtn.message = JSON.stringify(ex);
        rtn.status = types_1.Status.Failed;
    }
    return rtn;
});
// const CreatePdfByHtmlPdf = async (printContent: PrintContent, filePath: string): Promise<StatusId> => {
//     let rtn: StatusId = { status: Status.None } as StatusId;
//     let isExecuted = false;
//     var options = {
//         format: 'A4',
//         renderDelay: 0,
//         border: 0
//     };
//     //Font other than 'Lato' is displaying as Italic style
//     await htmlPdf.create(printContent.htmlContent, options).toFile(filePath, (err: any, res: any) => {
//         if (err) {
//             rtn.status = Status.Failed;
//             console.log(err);
//         } else {
//             rtn.status = Status.Success;
//             rtn.id = filePath;
//         }
//         isExecuted = true;
//     });
//     if (!isExecuted) {
//         while (!isExecuted) {
//             await sleep(100);
//         }
//     }
//     return rtn;
// }
// const getPDF = async (printContent: PrintContent, filePath: string): Promise<StatusId> => {
//     const HTMLToPDF = require('html-to-pdf');
//     let rtn: StatusId = { status: Status.None } as StatusId;
//     const htmlToPDF = new HTMLToPDF(printContent.htmlContent, {
//         waitForNetworkIdle: true,
//     });
//     let isExecuted = false;
//     let convertedBuffer;
//     await htmlToPDF.convert()
//         .then((buffer: any) => {
//             convertedBuffer = buffer;
//             isExecuted = true;
//             rtn.status = Status.Success;
//         }).catch((err: any) => {
//             isExecuted = true;
//             rtn.status = Status.Failed;
//             // do something on error
//         });
//     while (!isExecuted) {
//         await sleep(200);
//     }
//     if (rtn.status == Status.Success) {
//         await WriteFile(filePath, convertedBuffer);
//     }
//     return rtn
// };
// const CreatePdfByJsPdf = async (printContent: PrintContent, filePath: string): Promise<StatusId> => {
//     let rtn: StatusId = { status: Status.None } as StatusId;
//     if (printContent.htmlContent) {
//         try {
//             const doc = new JsPDF();
//             doc.text(printContent.htmlContent, 10, 10);
//             doc.save(filePath);
//             rtn.id = filePath;
//             rtn.status = Status.Success;
//         } catch (ex: any) {
//             rtn.id = ex.toString();
//             rtn.status = Status.Failed;
//         }
//     } else {
//         rtn.status = Status.DataRequired;
//     }
//     return rtn;
// }
// const CreatePdfByHtmlPdfNode = async (printContent: PrintContent, filePath: string): Promise<StatusId> => {
//     let rtn: StatusId = { status: Status.None } as StatusId;
//     const test = await calculateContentHeightinMM(printContent.htmlContent ?? '');
//     let file = { content: printContent.htmlContent };
//     let options = {
//         width: '60mm'
//         , height: test + 'mm'
//         , args: ['--no-sandbox', '--disable-setuid-sandbox']
//     };
//     let convertedBuffer;
//     await html_to_pdf.generatePdf(file, options).then((pdfBuffer: any) => {
//         convertedBuffer = pdfBuffer;
//     }).catch((err: any) => {
//     });
//     if (convertedBuffer) {
//         await WriteFile(filePath, convertedBuffer);
//         rtn.id = filePath;
//         rtn.status = Status.Success;
//     } else {
//         rtn.status = Status.Failed;
//     }
//     return rtn;
// }
const GetFileContentFromUrl = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    let rtn;
    try {
        let isExecuted = false;
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (!err) {
                rtn = data;
            }
            isExecuted = true;
        });
        while (!isExecuted) {
            yield (0, convertor_1.sleep)(200);
        }
    }
    catch (ex) {
        rtn.message = JSON.stringify(ex);
    }
    return rtn;
});
exports.GetFileContentFromUrl = GetFileContentFromUrl;
function calculateContentHeightinMM(html) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer.launch();
        const page = yield browser.newPage();
        yield page.setContent(html);
        const contentHeight = yield page.evaluate(() => {
            return document.body.scrollHeight;
        });
        yield browser.close();
        const heightInMm = contentHeight * 0.264583; // Convert pixels to mm
        return heightInMm;
    });
}
const WriteFile = (filePath, content) => __awaiter(void 0, void 0, void 0, function* () {
    let rtn = { status: types_1.Status.None };
    try {
        let isExecuted = false;
        fs.writeFile(filePath, content, function (err) {
            if (err) {
                rtn.status = types_1.Status.Failed;
            }
            else {
                rtn.status = types_1.Status.Success;
            }
            isExecuted = true;
        });
        while (!isExecuted) {
            yield (0, convertor_1.sleep)(200);
        }
    }
    catch (ex) {
        rtn.message = JSON.stringify(ex);
        rtn.status = types_1.Status.Failed;
    }
    return rtn;
});
exports.WriteFile = WriteFile;
const RemoveFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    let rtn = { status: types_1.Status.None };
    try {
        let isExecuted = false;
        var fs = require('fs');
        fs.unlinkSync(filePath, function (err) {
            if (err) {
                rtn.status = types_1.Status.Failed;
            }
            else {
                rtn.status = types_1.Status.Success;
            }
            isExecuted = true;
        });
        while (!isExecuted) {
            yield (0, convertor_1.sleep)(200);
        }
    }
    catch (ex) {
        rtn.message = JSON.stringify(ex);
        rtn.status = types_1.Status.Failed;
    }
    return rtn;
});
exports.RemoveFile = RemoveFile;
const GetTestDataByMM = (languageCode, printSizeCode, mm) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const stylePath = [convertor_1.projectFolder, 'src', 'testData', 'style.html'].join(convertor_1.slashSymbol);
    const dataPath = [convertor_1.projectFolder, 'src', 'testData', 'data.json'].join(convertor_1.slashSymbol);
    const filePath = [convertor_1.projectFolder, 'src', 'testData', printSizeCode + '-testHtmlFull.html'].join(convertor_1.slashSymbol);
    let htmlContent = yield (0, exports.GetFileContentFromUrl)(filePath);
    const style = yield (0, exports.GetFileContentFromUrl)(stylePath);
    const languageText = (0, convertor_1.getEnumValueByKey)(convertor_1.FontFileNameByCode, languageCode);
    const testData = (yield require(dataPath));
    if (!mm.endsWith('mm')) {
        mm += 'mm';
    }
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{widthinmm}}', 'style="width:' + mm + '"');
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{langugeCode}}', languageCode);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{companyName}}', (_a = testData.companyName.find(x => x.text == languageText)) === null || _a === void 0 ? void 0 : _a.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{gstin}}', (_b = testData.gstin.find(x => x.text == languageText)) === null || _b === void 0 ? void 0 : _b.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{address}}', (_c = testData.address.find(x => x.text == languageText)) === null || _c === void 0 ? void 0 : _c.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{tokenTitle}}', (_d = testData.tokenTitle.find(x => x.text == languageText)) === null || _d === void 0 ? void 0 : _d.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{itemNameTitle}}', (_e = testData.itemNameTitle.find(x => x.text == languageText)) === null || _e === void 0 ? void 0 : _e.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{itemPriceTitle}}', (_f = testData.itemPriceTitle.find(x => x.text == languageText)) === null || _f === void 0 ? void 0 : _f.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{itemQtyTitle}}', (_g = testData.itemQtyTitle.find(x => x.text == languageText)) === null || _g === void 0 ? void 0 : _g.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{itemAmountTitle}}', (_h = testData.itemAmountTitle.find(x => x.text == languageText)) === null || _h === void 0 ? void 0 : _h.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{totalTitle}}', (_j = testData.totalTitle.find(x => x.text == languageText)) === null || _j === void 0 ? void 0 : _j.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{paidTitle}}', (_k = testData.paidTitle.find(x => x.text == languageText)) === null || _k === void 0 ? void 0 : _k.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{quantitiesTitle}}', (_l = testData.quantitiesTitle.find(x => x.text == languageText)) === null || _l === void 0 ? void 0 : _l.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{thankYouTitle}}', (_m = testData.thankYouTitle.find(x => x.text == languageText)) === null || _m === void 0 ? void 0 : _m.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{hsnTitle}}', (_o = testData.hsnTitle.find(x => x.text == languageText)) === null || _o === void 0 ? void 0 : _o.title);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{sacTitle}}', (_p = testData.sacTitle.find(x => x.text == languageText)) === null || _p === void 0 ? void 0 : _p.title);
    const totalItemsMultiply = (printSizeCode == 'lg' ? 18 : 3) / 3;
    let items = [];
    for (var itemCount = 0; itemCount < totalItemsMultiply; itemCount++) {
        items.push(...testData.items);
    }
    for (var itemCount = 0; itemCount < items.length; itemCount++) {
        const item = items[itemCount];
        htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{item-' + (itemCount + 1) + '}}', (_q = item.find(x => x.text == languageText)) === null || _q === void 0 ? void 0 : _q.title);
    }
    return [style, htmlContent].join(' ');
});
exports.GetTestDataByMM = GetTestDataByMM;
const GetTestData = () => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = [convertor_1.projectFolder, 'src', 'testData', 'testReceiptHtml.txt'].join(convertor_1.slashSymbol);
    let htmlContent = yield (0, exports.GetFileContentFromUrl)(filePath);
    const filePathItems = [convertor_1.projectFolder, 'src', 'testData', 'testReceiptItems.txt'].join(convertor_1.slashSymbol);
    const htmlContentItems = yield (0, exports.GetFileContentFromUrl)(filePathItems);
    htmlContent = (0, convertor_1.ReplaceAll)(htmlContent, '{{items_list}}', htmlContentItems);
    return htmlContent;
});
exports.GetTestData = GetTestData;
//# sourceMappingURL=fileHandlerManagement.js.map