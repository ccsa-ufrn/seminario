import mongoose, { Schema } from 'mongoose';

const submissionSessionSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
  },
  entity: {
    type: Schema.Types.ObjectId,
  },
  date: Date,
  shift: Number, // 0 - Manhã; 1 - Tarde; 2 - Noite
  hour: {
    type: String,
    default: null,
  },
});

const submissionSessionModel = mongoose.model('ActivitySession', submissionSessionSchema);

export { submissionSessionSchema };
export default submissionSessionModel;
