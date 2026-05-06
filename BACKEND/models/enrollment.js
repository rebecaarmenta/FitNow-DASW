import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },

    enrollment_date: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ['activa', 'cancelada'],
        default: 'activa'
    }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;