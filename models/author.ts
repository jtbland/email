import * as mongoose from 'mongoose';

interface IAuthor extends mongoose.Document {
    first_name: string;
    last_name: string;
    email: string;
};

export const authorSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String
});

export default mongoose.model<IAuthor>("Author", authorSchema);
