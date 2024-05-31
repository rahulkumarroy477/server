const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./schema.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL)
  .then(() => {
    console.log("Database connected");
  }).catch(err => console.log(err));

const app = express();

app.use(cors());
app.use(express.json());

app.get('/customData', async (req, res) => {
  const headers = req.headers;
  const row = headers.row;
  let data = headers.data;   // string
  console.log(row,data);
  data = data.split(',').join(' '); // get the attribute names
  const users = await getUsers(row, data);
  return res.status(201).json({
    receivedData: users,
    status: "Data retrieved",
  });
});

app.get('/aiData', async (req, res) => {
  const headers = req.headers;
  const data = headers.data;

  console.log("Received data:", data);
  try {
    const ai_data = await generateData(data);
    return res.status(201).json({
      status: "Data generated",
      receivedData: ai_data
    });
  } catch (error) {
    console.error('Error generating AI data:', error);
    return res.status(500).json({
      status: "Error",
      message: error.message
    });
  }
});

async function generateData(params) {
  const apiKey = process.env.API_KEY;
  let dummy_data = [];
  if (!apiKey) {
    throw new Error("Missing API_KEY in .env file");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate 10 rows of JSON data with attributes: ${params}`;
  for (let i = 0; i < 5; i++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      try {
        const cleanedText = text.replace(/`/g, '').replace('json', '').trim();
        const data = JSON.parse(cleanedText);

        dummy_data = dummy_data.concat(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        continue;
      }
      console.log(`API call ${i + 1} completed`);

    } catch (error) {
      console.error("Error generating content:", error);
    }
  }

  dummy_data = dummy_data.map((row, index) => {
    row.id = index + 1;
    return row;
  });

  return dummy_data;
}

async function getUsers(count, fields) {
  try {
    const users = await User.find({},{_id:0}).limit(count).select(fields);
    return users;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
