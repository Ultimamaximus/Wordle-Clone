const axios = require("axios");

exports.handler = async function(event, context) {
  const API_KEY = process.env.API_KEY;

  const options = {
    method: 'GET',
    url: 'https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
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
