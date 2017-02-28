"use strict";
var mongoose = require('mongoose');
;
exports.authorSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mongoose.model("Author", exports.authorSchema);
