import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
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

    attended: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;