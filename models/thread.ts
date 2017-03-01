import * as mongoose from 'mongoose';

interface IThread extends mongoose.Document {
    participants: Array<string>;
    messages: Array<string>;
};

const threadSchema = new mongoose.Schema({
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }]
});

threadSchema.virtual('updated_at').get(function() {
    if (this.messages.length) {
        return this.messages[0].created_at;
    }
    return {getTime(){return 0;}};
});

threadSchema.virtual('isSpam').get(function() {
    return this.messages.some((m) => m.isSpam);
});

threadSchema.virtual('unread').get(function() {
    return this.messages.some((m) => m.unread);
});


threadSchema.virtual('messages_count').get(function() {
    return this.messages.length;
});

threadSchema.virtual('last_message').get(function() {
    return this.messages[this.messages.length - 1];
});

threadSchema.set('toJSON', { getters: true, virtuals: true });


export default mongoose.model<IThread>("Thread", threadSchema);
