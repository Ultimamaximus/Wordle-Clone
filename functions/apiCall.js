const axios = require("axios");

exports.handler = async function(event, context) {
  const API_KEY = process.env.API_KEY;

  try {
    const response = await axios.get(`https://yourapi.com/endpoint?api_key=${API_KEY}`);
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
