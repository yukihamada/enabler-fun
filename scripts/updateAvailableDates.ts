const axios = require('axios');

async function updateAvailableDates() {
  try {
    const response = await axios.post('http://localhost:3001/api/update-available-dates', {});
    console.log('更新結果:', response.data);
  } catch (error) {
    console.error('エラー:', error);
  }
}

updateAvailableDates();