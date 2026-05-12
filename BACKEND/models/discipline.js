import mongoose from 'mongoose';

const disciplineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    img: {
        type: String,
        required: false,
        trim: true
    }
});

const Discipline = mongoose.model('Discipline', disciplineSchema);

export default Discipline;