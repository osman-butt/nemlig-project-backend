import cron from 'node-cron';
import axios from 'axios';

function startCronJob() {
    // Every 2 days at 6am
  cron.schedule('0 06 */2 * *', async () => {
    console.log('Running the pricematch cron job at:', new Date());
    try {
      const response = await axios.post('http://localhost:3000/api/v1/pricematch');
      console.log(response.data);
    } catch (error) {
      console.error('Error running pricematch:', error);
    }
  });
}

export {startCronJob}