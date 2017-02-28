import * as mongoose from 'mongoose';

interface IMessage extends mongoose.Document {
    unread: boolean;
    isSpam: boolean,
    subject: string;
    body: string;
    snippet: string;
    thread: string;
    recipient: string;
    created_at: number;
};

export const messageSchema = new mongoose.Schema({
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

messageSchema.virtual('created_at_ms').get(function() {
  return this.created_at.getTime();
});

messageSchema.set('toJSON', { getters: true, virtuals: true });


export default mongoose.model<IMessage>("Message", messageSchema);
