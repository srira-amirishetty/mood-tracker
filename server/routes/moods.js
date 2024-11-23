const express = require("express");
const router = express.Router();
const moodData = require("../models/moodSaver");
const User = require("../models/user") 
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.API_KEY; 

// create a new user route

router.post ('/register', async (req, res) => {
    const {username} = req.body;
    if (!username) {
        return res.status(400).json({message:'Username is required'});
    }

    const user = new User({username});
    await user.save()

    console.log({username})

    res.status(201).json({
        message: 'successfully registered'
    });
})

// route using gemini ai 

router.post('/submitmood', async (req, res) => {
    try{
        const {userId, mood, description} = req.body;

        if (!userId || !mood || !description) {
            console.error('Validation failed: Missing fields');
            return res.status(400).json({error:'All fields are required.'});
        }

        if( mood < 1 || mood > 5 ){
            console.error('Validation failed: Mood out of range');
            return res.status(400).json({error:'Mood rating must be between 1 and 5.'});
        }

        const prompt = ` 
        User Mood Entry:
        Mood Rating: ${mood}
        Description: ${description}

        Provide a brief insight that helps the user understand their mood and ways to improve it.
        `;

        console.log('Sending data to Gemini API...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(prompt);

        console.log(result.response.text());


        const aiInsight = result.response.text() || 'No insight generated';

        console.log(aiInsight)

        const moodEntry = new moodData({
            userId,
            date:new Date(),
            mood,
            description,
            insight:aiInsight,
            
        });

        await moodEntry.save();
        console.log('Mood entry saved to the database:', moodEntry);

        res.status(201).json({
            message: 'Mood submitted successfully!',
            insight: aiInsight,
        });


    } catch (error) {
        console.error('Error in /submitMood route:', error.message);
        res.status(500).json({error:'Internal server Error'});
    }
});


router.get('/getAllMoods', async (req, res) => {
    try{
        const allMoods = await moodData.find();
        res.status(200).json(allMoods);
    } catch (error) {
        console.error ('Error fetching mood data:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
})

router.get('/getUserMoods/:userId', async(req, res) => {
    try{
        const {userId} = req.params;

        if(!userId) {
            return res.status(400).json({error:'User Id is required.'});
        }

        const userMoods = await moodData.find({userId});

        res.status(200).json(userMoods);
    }catch (error) {
        console.error('Error in /getUserMoods route:', error.message);
        res.status(500).json({error:'Internal server error'});
    }
});

module.exports = router;