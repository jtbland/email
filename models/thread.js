"use strict";
var mongoose = require("mongoose");
;
var threadSchema = new mongoose.Schema({
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }]
});
threadSchema.virtual('updated_at').get(function () {
    if (this.messages.length) {
        return this.messages[0].created_at;
    }
    return { getTime: function () { return 0; } };
});
threadSchema.virtual('isSpam').get(function () {
    return this.messages.some(function (m) { return m.isSpam; });
});
threadSchema.virtual('unread').get(function () {
    return this.messages.some(function (m) { return m.unread; });
});
threadSchema.virtual('messages_count').get(function () {
    return this.messages.length;
});
threadSchema.virtual('last_message').get(function () {
    return this.messages[this.messages.length - 1];
});
threadSchema.set('toJSON', { getters: true, virtuals: true });
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mongoose.model("Thread", threadSchema);
