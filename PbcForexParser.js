// src/controllers/businessLogic.js
import axios from 'axios';
import { exec } from 'child_process'

/**
 * 使用 curl 发起请求的函数
 * @param {string} url - 目标请求URL
 * @returns {Promise<string>} - 返回HTML内容
 */
const fetchWithCurl = (url) => {
  return new Promise((resolve, reject) => {
      // 使用 curl 命令，请求时跟随重定向 (-L 参数)
      const command = `curl -L --silent --show-error "${url}"`;
      exec(command, (error, stdout, stderr) => {
          if (error) {
              return reject(new Error(`Curl error: ${stderr || error.message}`));
          }
          resolve(stdout);
      });
  });
};

// 你可以根据需要修改此URL
const externalURL = 'https://api.example.com/data';

export const processRequest = async (requestData) => {
  try {
    // 请求外部URL，获取数据
    const response = await axios.get(externalURL, {
      params: { query: requestData.query }
    });

    // 处理响应数据
    const processedData = {
      originalData: response.data,
      message: 'Successfully processed the data',
      timestamp: new Date().toISOString()
    };

    return processedData;
  } catch (error) {
    console.error('Error during external API call:', error);
    throw new Error('Error processing external request');
  }
};
