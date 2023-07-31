const axios = require("axios");

exports.handler = async function(event, context) {
  const API_KEY = process.env.API_KEY;
  const API_HOST = 'wordsapiv1.p.rapidapi.com';
  const { word } = event.queryStringParameters;

  try {
    const response = await axios.get(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
      }
    });

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