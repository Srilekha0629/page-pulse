const axios = require("axios");
const cheerio = require("cheerio");

const analyzeWebsite = async (url) => {
  const startTime = Date.now();

  const response = await axios.get(url, {
    timeout: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 PagePulse"
    }
  });

  const responseTime = Date.now() - startTime;

  const html = response.data;

  const $ = cheerio.load(html);

  const title = $("title").text().trim();

  const metaDescription =
    $('meta[name="description"]').attr("content") || "Not Found";

  const h1Count = $("h1").length;

  const imagesWithoutAlt = $("img")
    .toArray()
    .filter(img => !$(img).attr("alt"))
    .length;

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();

  const wordCount = bodyText
    ? bodyText.split(" ").length
    : 0;

  return {
    status: response.status,
    responseTime: `${responseTime} ms`,
    title,
    metaDescription,
    h1Count,
    imagesWithoutAlt,
    wordCount
  };
};

module.exports = { analyzeWebsite };