// index.js
import express from 'express';
import { getPbcRates } from './PbcForexParser';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // 解析JSON请求体

app.post('/callback', async (req, res) => {
  try {
    const requestData = req.body;
    const result = await getPbcRates(requestData);
    res.json(result); // 返回JSON格式的回调数据
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
