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
exports.Decrypt = exports.Encrypt = exports.getDistinctAsString = exports.getDistinctNumber = exports.getDistinct = exports.FontFileNameByCode = exports.FontFileName = exports.languageCodes = exports.ReplaceAll = exports.temporaryFolder = exports.projectFolder = exports.GetCurrentHostUrl = exports.slashSymbol = exports.osType = exports.sleep = void 0;
exports.getEnumValueByKey = getEnumValueByKey;
const types_1 = require("./types");
const CryptoJS = __importStar(require("crypto-js"));
const os = require('os');
const url = require('url');
const path = require("path");
const sleep = (milliSeconds) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => setTimeout(resolve, milliSeconds));
});
exports.sleep = sleep;
const GetOsType = () => {
    let rtn = types_1.OsType.Auto;
    switch (os.platform()) {
        case 'win32':
            {
                rtn = types_1.OsType.Windows;
            }
            break;
        case 'linux':
            {
                rtn = types_1.OsType.Linux;
            }
            break;
        case 'darwin':
            {
                rtn = types_1.OsType.Mac;
            }
            break;
    }
    return rtn;
};
exports.osType = GetOsType();
const GetSlashSymbol = () => {
    let rtn = "\\";
    switch (exports.osType) {
        case types_1.OsType.Linux:
        case types_1.OsType.Mac:
            {
                rtn = '/';
            }
            break;
    }
    return rtn;
};
exports.slashSymbol = GetSlashSymbol();
const GetCurrentHostUrl = (req, isOnlyDomain = true) => {
    let rtn = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: isOnlyDomain ? '' : req.originalUrl
    });
    return rtn;
};
exports.GetCurrentHostUrl = GetCurrentHostUrl;
const GetProjectFolder = () => {
    var absolutePath = path.resolve("");
    return absolutePath;
};
exports.projectFolder = GetProjectFolder();
const GetTemporaryFolder = () => {
    const projectFolder = GetProjectFolder();
    const projectFolders = projectFolder.split(exports.slashSymbol);
    let rtn = '';
    if (projectFolders.length > 0) {
        projectFolders.pop();
        rtn = projectFolders.join(exports.slashSymbol);
    }
    return rtn;
};
exports.temporaryFolder = GetTemporaryFolder();
const ReplaceAll = (fullValue, toReplaceValue = '', replaceWith = '') => {
    var regExp = new RegExp(toReplaceValue, 'g');
    var newStr = fullValue.replace(regExp, replaceWith);
    return newStr;
};
exports.ReplaceAll = ReplaceAll;
exports.languageCodes = [
    { code: 'ar', title: "عربي", fontNames: ['ArabicFont'] },
    { code: 'bn', title: "বাংলা", fontNames: ['BengaliFont'] },
    { code: 'en', title: "English", fontNames: ['EnglishFont_Verdana', 'EnglishFont_Tahoma', 'EnglishFont_Arial', 'EnglishFont_Courier', 'EnglishFont_JetBrainsMono', 'EnglishFont'] },
    { code: 'de', title: "Deutsch", fontNames: ['GermanFont_Verdana', 'GermanFont_Tahoma', 'GermanFont_Arial', 'GermanFont_Courier', 'GermanFont_JetBrainsMono', 'GermanFont'] },
    { code: 'es', title: "Española", fontNames: ['SpanishFont_Verdana', 'SpanishFont_Tahoma', 'SpanishFont_Arial', 'SpanishFont_Courier', 'SpanishFont_JetBrainsMono', 'SpanishFont'] },
    { code: 'fr', title: "Français", fontNames: ['FrenchFont_Verdana', 'FrenchFont_Tahoma', 'FrenchFont_Arial', 'FrenchFont_Courier', 'FrenchFont_JetBrainsMono', 'FrenchFont'] },
    { code: 'gu', title: "ગુજરાતી", fontNames: ['GujaratiFont'] },
    { code: 'hi', title: "हिंदी", fontNames: ['HindiFont'] },
    { code: 'ja', title: "日本語", fontNames: ['JapaneseFont'] },
    { code: 'kn', title: "ಕನ್ನಡ", fontNames: ['KannadaFont'] },
    { code: 'ko', title: "한국인", fontNames: ['KoreanFont'] },
    { code: 'ml', title: "മലയാളം", fontNames: ['MalayalamFont'] },
    { code: 'mr', title: "मराठी", fontNames: ['MarathiFont'] },
    { code: 'or', title: "ଓଡିଆ", fontNames: ['OdiaFont'] },
    { code: 'pa', title: "ਪੰਜਾਬੀ", fontNames: ['PunjabiFont'] },
    { code: 'ru', title: "Русский", fontNames: ['RussianFont'] },
    { code: 'si', title: "සිංහල", fontNames: ['SinhalaFont'] },
    { code: 'ta', title: "தமிழ்", fontNames: ['TamilFont'] },
    { code: 'te', title: "తెలుగు", fontNames: ['TeluguFont'] },
    { code: 'th', title: "แบบไทย", fontNames: ['ThaiFont'] },
    { code: 'zh-CN', title: "中国人", fontNames: ['ChineseFont'] },
];
var FontFileName;
(function (FontFileName) {
    FontFileName["ArabicFont"] = "arabic";
    FontFileName["BengaliFont"] = "bengali";
    FontFileName["GermanFont"] = "english";
    FontFileName["EnglishFont"] = "english";
    FontFileName["SpanishFont"] = "english";
    FontFileName["FrenchFont"] = "english";
    FontFileName["GujaratiFont"] = "gujarati";
    FontFileName["HindiFont"] = "hindi";
    FontFileName["JapaneseFont"] = "japanese";
    FontFileName["KannadaFont"] = "kannada";
    FontFileName["KoreanFont"] = "korean";
    FontFileName["MalayalamFont"] = "malayalam";
    FontFileName["MarathiFont"] = "marathi";
    FontFileName["OdiaFont"] = "odia";
    FontFileName["PunjabiFont"] = "punjabi";
    FontFileName["RussianFont"] = "russian";
    FontFileName["SinhalaFont"] = "sinhala";
    FontFileName["TamilFont"] = "tamil";
    FontFileName["TeluguFont"] = "telugu";
    FontFileName["ThaiFont"] = "thai";
    FontFileName["ChineseFont"] = "chinese";
    FontFileName["EnglishFont_Courier"] = "english_courier";
    FontFileName["GermanFont_Courier"] = "english_courier";
    FontFileName["SpanishFont_Courier"] = "english_courier";
    FontFileName["FrenchFont_Courier"] = "english_courier";
    FontFileName["EnglishFont_JetBrainsMono"] = "english_jetbrainsmono";
    FontFileName["GermanFont_JetBrainsMono"] = "english_jetbrainsmono";
    FontFileName["SpanishFont_JetBrainsMono"] = "english_jetbrainsmono";
    FontFileName["FrenchFont_JetBrainsMono"] = "english_jetbrainsmono";
    FontFileName["EnglishFont_Arial"] = "english_arial";
    FontFileName["GermanFont_Arial"] = "english_arial";
    FontFileName["SpanishFont_Arial"] = "english_arial";
    FontFileName["FrenchFont_Arial"] = "english_arial";
    FontFileName["EnglishFont_Tahoma"] = "english_tahoma";
    FontFileName["GermanFont_Tahoma"] = "english_tahoma";
    FontFileName["SpanishFont_Tahoma"] = "english_tahoma";
    FontFileName["FrenchFont_Tahoma"] = "english_tahoma";
    FontFileName["EnglishFont_Verdana"] = "english_verdana";
    FontFileName["GermanFont_Verdana"] = "english_verdana";
    FontFileName["SpanishFont_Verdana"] = "english_verdana";
    FontFileName["FrenchFont_Verdana"] = "english_verdana";
})(FontFileName || (exports.FontFileName = FontFileName = {}));
var FontFileNameByCode;
(function (FontFileNameByCode) {
    FontFileNameByCode["ar"] = "arabic";
    FontFileNameByCode["bn"] = "bengali";
    FontFileNameByCode["de"] = "english";
    FontFileNameByCode["en"] = "english";
    FontFileNameByCode["es"] = "english";
    FontFileNameByCode["fr"] = "english";
    FontFileNameByCode["gu"] = "gujarati";
    FontFileNameByCode["hi"] = "hindi";
    FontFileNameByCode["ja"] = "japanese";
    FontFileNameByCode["kn"] = "kannada";
    FontFileNameByCode["ko"] = "korean";
    FontFileNameByCode["ml"] = "malayalam";
    FontFileNameByCode["mr"] = "marathi";
    FontFileNameByCode["or"] = "odia";
    FontFileNameByCode["pa"] = "punjabi";
    FontFileNameByCode["ru"] = "russian";
    FontFileNameByCode["si"] = "sinhala";
    FontFileNameByCode["ta"] = "tamil";
    FontFileNameByCode["te"] = "telugu";
    FontFileNameByCode["th"] = "thai";
    FontFileNameByCode["zh-CN"] = "chinese";
})(FontFileNameByCode || (exports.FontFileNameByCode = FontFileNameByCode = {}));
const getDistinct = (arr) => {
    let rtn;
    rtn = arr.filter((n, itemCount) => arr.indexOf(n) === itemCount);
    return rtn;
};
exports.getDistinct = getDistinct;
const getDistinctNumber = (arr) => {
    let rtn = [];
    rtn = arr.filter((n, itemCount) => arr.indexOf(n) === itemCount);
    return rtn;
};
exports.getDistinctNumber = getDistinctNumber;
const getDistinctAsString = (arr) => {
    let rtn = [];
    arr.forEach((x) => {
        if (!rtn.includes(x.toString())) {
            rtn.push(x.toString());
        }
    });
    return rtn;
};
exports.getDistinctAsString = getDistinctAsString;
const autRequ = 'uiwscrwiow4ak';
const Encrypt = (text, ky) => {
    return CryptoJS.AES.encrypt(text, ky ? ky : autRequ).toString();
};
exports.Encrypt = Encrypt;
const Decrypt = (text, ky) => {
    return CryptoJS.AES.decrypt(text, ky ? ky : autRequ).toString(CryptoJS.enc.Utf8);
};
exports.Decrypt = Decrypt;
function getEnumValueByKey(enumObj, key) {
    return enumObj[key];
}
//# sourceMappingURL=convertor.js.map