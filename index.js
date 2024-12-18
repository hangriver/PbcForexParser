// index.js
import express from 'express';
import { getPbcRates } from './PbcForexParser.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // 解析JSON请求体

app.post('/getPbcRates', async (req, res) => {
  try {
    const requestData = req.body;
    console.log("Received request on getPbcRates by POST with params:", requestData)
    const result = await getPbcRates(requestData.url);
    res.json(result); // 返回JSON格式的回调数据
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
