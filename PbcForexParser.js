import puppeteer from 'puppeteer';

export const getPbcRates = async (PbcUrl) => {
  try {
    // Launch chromium browser
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    //Goto PBC Forex article
    await page.goto(PbcUrl, {waitUntil: 'networkidle2'});

    //Get article content
    await page.waitForSelector("#zoom")
    const article = await page.$eval('#zoom',(element) => element.textContent.trim());
    console.log(article);
    
    await browser.close();

    // Process content
    const rates = extractRates(article);
    
    return rates;
  } catch (error) {
    console.error('Error during external API call:', error);
    throw new Error('Error processing external request');
  }
};

// Function to extract rates from the article
const extractRates = (article) => {

  // Currency symbol mapping
  const currencyMapping = {
    美元: 'USD',
    欧元: 'EUR',
    日元: 'JPY',
    港元: 'HKD',
    英镑: 'GBP',
    澳大利亚元: 'AUD',
    新西兰元: 'NZD',
    新加坡元: 'SGD',
    瑞士法郎: 'CHF',
    加拿大元: 'CAD',
    澳门元: 'MOP',
    林吉特: 'MYR',
    俄罗斯卢布: 'RUB',
    南非兰特: 'ZAR',
    韩元: 'KRW',
    阿联酋迪拉姆: 'AED',
    沙特里亚尔: 'SAR',
    匈牙利福林: 'HUF',
    波兰兹罗提: 'PLN',
    丹麦克朗: 'DKK',
    瑞典克朗: 'SEK',
    挪威克朗: 'NOK',
    土耳其里拉: 'TRY',
    墨西哥比索: 'MXN',
    泰铢: 'THB',
  };

  // Match and transform the results
  const results = [];
  let match;

  const regex1 = /(\d+(?:\.\d+)?)([^\d]+)对人民币(\d+(?:\.\d+)?)(元)/g;
  const regex2 = /人民币(\d+(?:\.\d+)?)(元)对(\d+(?:\.\d+)?)([^\d^，。]+)/g
  
  while ((match = regex1.exec(article)) !== null) {
    const [_, foreignAmount, currencyName, rate] = match;
    const identifier = currencyMapping[currencyName];
    if (identifier) {
      results.push({
        currency: currencyName,
        rate: parseFloat(rate / foreignAmount).toFixed(4), // Keep 4 decimal places
        identifier,
      });
    }
  }
  while ((match = regex2.exec(article)) !== null) {
    const [_, rmbAmount, yuan, rate, currencyName] = match;
    const identifier = currencyMapping[currencyName];
    if (identifier) {
      results.push({
        currency: currencyName,
        rate: parseFloat(rmbAmount / rate).toFixed(4), // Keep 4 decimal places
        identifier,
      });
    }
  }


  //console.log(results);

  return results;
};

console.log(await getPbcRates("http://www.pbc.gov.cn/zhengcehuobisi/125207/125217/125925/5523127/index.html"))
/**extractRates(`
  中国人民银行授权中国外汇交易中心公布，2024年12月2日银行间外汇市场人民币汇率中间价为1美元对人民币7.1865元，1欧元对人民币7.5907元，100日元对人民币4.8134元，1港元对人民币0.92343元，1英镑对人民币9.1462元，1澳大利亚元对人民币4.6856元，1新西兰元对人民币4.2607元，1新加坡元对人民币5.3768元，1瑞士法郎对人民币8.1580元，1加拿大元对人民币5.1429元，人民币1元对1.1160澳门元，人民币1元对0.61670林吉特，人民币1元对14.7104俄罗斯卢布，人民币1元对2.5120南非兰特，人民币1元对193.44韩元，人民币1元对0.50962阿联酋迪拉姆，人民币1元对0.52122沙特里亚尔，人民币1元对54.4038匈牙利福林，人民币1元对0.56605波兰兹罗提，人民币1元对0.9830丹麦克朗，人民币1元对1.5179瑞典克朗，人民币1元对1.5373挪威克朗，人民币1元对4.81201土耳其里拉，人民币1元对2.8331墨西哥比索，人民币1元对4.7598泰铢。
     中国外汇交易中心
                  2024年12月2日
  `)*/
