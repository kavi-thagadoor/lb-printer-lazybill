"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/** src/server.ts */
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const router = (0, express_1.default)();
require('dotenv').config();
/** Logging */
router.use((0, morgan_1.default)('start'));
/** Parse the request */
router.use(express_1.default.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express_1.default.json());
const cors = require('cors');
router.use(cors({
    origin: '*'
}));
/** Routes */
router.use('/', routes_1.default);
/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});
/** Server */
const httpServer = http_1.default.createServer(router);
const PORT = (_a = process.env.port) !== null && _a !== void 0 ? _a : 6060;
const CONFIG_FILE = "offline-api";
httpServer.listen(PORT, () => {
    console.log(`The server is running on port ${PORT} with the config ${CONFIG_FILE}.json`);
    console.log(`Try with url http://localhost:${PORT}/version to check the version`);
});
//# sourceMappingURL=server.js.map