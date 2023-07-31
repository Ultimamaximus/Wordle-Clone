const axios = require("axios");

exports.handler = async function(event, context) {
  const API_KEY = process.env.API_KEY;
  const API_HOST = 'wordsapiv1.p.rapidapi.com';
  const { word } = event.queryStringParameters;

  const options = {
    method: 'GET',
    url: `https://wordsapiv1.p.rapidapi.com/words/${word}`,
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  try {
    const response = await axios.request(options);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve data' }),
    };
  }
};

