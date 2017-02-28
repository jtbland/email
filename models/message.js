"use strict";
var mongoose = require("mongoose");
;
exports.messageSchema = new mongoose.Schema({
    created_at: { type: Date, default: Date.now },
    unread: Boolean,
    isSpam: Boolean,
    subject: String,
    body: String,
    snippet: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
});
exports.messageSchema.virtual('created_at_ms').get(function () {
    return this.created_at.getTime();
});
exports.messageSchema.set('toJSON', { getters: true, virtuals: true });
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mongoose.model("Message", exports.messageSchema);
