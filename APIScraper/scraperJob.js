import cron from "node-cron";
import { fetchRema1000Products } from "./rema1000scraper.js";

export default function startScraper() {
  // Every sunday at 6am
  cron.schedule("0 06 * * 0", async () => {
    console.log("Running the scraper at:", new Date());
    try {
      await fetchRema1000Products();
      console.log("Scraper finished!");
    } catch (error) {
      console.error("Error running scraper:", error);
    }
  });
}
