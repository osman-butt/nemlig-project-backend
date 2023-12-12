import cron from "node-cron";
import axios from "axios";

function startCronJob() {
  // Every day at 6am
  cron.schedule("0 06 * * *", async () => {
    console.log("Running the pricematch cron job at:", new Date());
    try {
      const response = await axios.post("http://localhost:3000/api/v1/pricematch");
      console.log(response.data);
    } catch (error) {
      console.error("Error running pricematch:", error);
    }
  });
}

// Scrape Rema1000 products every sunday at 6am
function scrapeCronJob() {
  cron.schedule("0 06 * * 0", async () => {
    console.log("Scraping products to our DB at:", new Date());
    try {
      const response = await axios.post("http://localhost:3000/api/v1/pricematch/scrape");
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting outdated pricematch prices:", error);
    }
  });
}

export { startCronJob, scrapeCronJob };
