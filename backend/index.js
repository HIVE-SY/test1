
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const { connectAstra, client } = require("./astradb");
const { verifyToken } = require("./firebase-auth");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to Astra DB
connectAstra();

// Protected route using Firebase token
app.post("/run-langflow", verifyToken, async (req, res) => {
  const inputText = req.body.text;
  try {
    const response = await axios.post(process.env.LANGFLOW_API_URL, {
      flow_id: process.env.LANGFLOW_FLOW_ID,
      inputs: { text: inputText }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
