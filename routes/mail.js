"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require("express");
var author_1 = require("../models/author");
var thread_1 = require("../models/thread");
var message_1 = require("../models/message");
var jwt = require("express-jwt");
var auth = jwt({
    secret: "SecretKey",
    userProperty: "payload"
});
var router = express.Router();
router.get('/thread', auth, function (req, res, next) {
    var user = req.payload;
    thread_1.default
        .find()
        .populate('participants')
        .populate({
        path: 'messages',
        options: { sort: { created_at: 1 } },
        populate: { path: 'author' }
    })
        .populate({
        path: 'messages',
        options: { sort: { created_at: 1 } },
        populate: { path: 'recipient' }
    })
        .exec(function (err, threads) {
        threads.sort(function (a, b) {
            var aUpdated = a.updated_at.getTime();
            var bUpdated = b.updated_at.getTime();
            if (aUpdated < bUpdated) {
                return 1;
            }
            if (aUpdated > bUpdated) {
                return -1;
            }
            return 0;
        });
        if (!err) {
            res.send(threads);
        }
    });
});
router.get('/thread/:id', function (req, res, next) {
    thread_1.default
        .findById(req.params.id)
        .populate('participants')
        .populate({
        path: 'messages',
        options: { sort: { created_at: 1 } },
        populate: { path: 'author' }
    })
        .populate({
        path: 'messages',
        options: { sort: { created_at: 1 } },
        populate: { path: 'recipient' }
    })
        .exec(function (err, thread) {
        if (!err) {
            res.send(thread);
        }
    });
});
router.delete('/thread/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, thread_1.default.findByIdAndRemove(req.params.id)];
                case 1:
                    _a.sent();
                    res.send(200);
                    return [2 /*return*/];
            }
        });
    });
});
router.put('/message/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, message_1.default.findByIdAndUpdate(req.params.id, req.body)];
                case 1:
                    _a.sent();
                    res.send(200);
                    return [2 /*return*/];
            }
        });
    });
});
router.post('/send', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var messageToSend, sender, recipient, thread, message, saved, savedThread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    messageToSend = req.body;
                    return [4 /*yield*/, author_1.default.findOne({ email: messageToSend.from.email })];
                case 1:
                    sender = _a.sent();
                    return [4 /*yield*/, author_1.default.findOne({ email: messageToSend.to.email })];
                case 2:
                    recipient = _a.sent();
                    if (!messageToSend.threadId) return [3 /*break*/, 4];
                    return [4 /*yield*/, thread_1.default.findById(messageToSend.threadId)];
                case 3:
                    thread = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    thread = new thread_1.default({
                        participants: [
                            sender,
                            recipient
                        ]
                    });
                    _a.label = 5;
                case 5:
                    message = new message_1.default({
                        unread: true,
                        subject: messageToSend.subject,
                        body: messageToSend.body,
                        snippet: messageToSend.body.substring(0, 50),
                        recipient: recipient,
                        thread: thread,
                        author: sender
                    });
                    return [4 /*yield*/, message.save()];
                case 6:
                    saved = _a.sent();
                    thread.messages.push(message);
                    return [4 /*yield*/, thread.save()];
                case 7:
                    savedThread = _a.sent();
                    res.send(saved);
                    return [2 /*return*/];
            }
        });
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
