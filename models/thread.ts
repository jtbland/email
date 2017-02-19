import * as mongoose from 'mongoose';

interface IThread extends mongoose.Document {
    unread: boolean;
    participants: Array<string>;
    messages: Array<string>;
};

const threadSchema = new mongoose.Schema({
    unread: Boolean,
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }]
});

threadSchema.virtual('updated_at').get(function() {
    if (this.messages.length) {
        return this.messages[0].created_at;
    }
    return 0;
});

threadSchema.virtual('messages_count').get(function() {
    return this.messages.length;
});

threadSchema.virtual('last_message').get(function() {
    return this.messages[this.messages.length - 1];
});

threadSchema.set('toJSON', { getters: true, virtuals: true });


export default mongoose.model<IThread>("Thread", threadSchema);