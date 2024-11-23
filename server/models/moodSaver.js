const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moodSaverSchema = new Schema({
    userId:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true,
        dafault:Date.now
    },
    mood:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    description:{
        type:String,
        required:true,
    },
    insight: {
        type:String,
        required:true
    }
});

const MoodData = mongoose.model('MoodData', moodSaverSchema);

module.exports = MoodData;
