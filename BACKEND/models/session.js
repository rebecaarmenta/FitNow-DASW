import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    discipline_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discipline',
        required: true
    },

    instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    capacity: {
        type: Number,
        required: true
    },

    place: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ['programada', 'cancelada', 'finalizada'],
        default: 'programada'
    }
});


const Session = mongoose.model('Session', sessionSchema);

export default Session;