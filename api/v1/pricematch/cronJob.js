import cron from "node-cron";
import axios from "axios";
import { deleteOutdatedPriceMatchPrices } from "./pricematchModel";

function startCronJob() {
  // Every Sunday at 6am
  cron.schedule("0 06 * * 0", async () => {
    console.log("Running the pricematch cron job at:", new Date());
    try {
      const response = await axios.post("http://localhost:3000/api/v1/pricematch");
      console.log(response.data);
    } catch (error) {
      console.error("Error running pricematch:", error);
    }
  });
}

// Delete outdated pricematch prices every day at 6am
function deleteCronJob() {
  cron.schedule("0 06 * * *", async () => {
    console.log("Deleting outdated pricematch prices at:", new Date());
    try {
      await deleteOutdatedPriceMatchPrices();
    } catch (error) {
      console.error("Error deleting outdated pricematch prices:", error);
    }
  });
}

export { startCronJob, deleteCronJob };
