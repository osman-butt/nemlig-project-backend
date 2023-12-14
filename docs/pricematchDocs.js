/**
 * @swagger
 * /pricematch:
 *   post:
 *     tags:
 *       - PriceMatch
 *     summary: DO NOT RUN THIS! Scrape REMA's API and create new pricematch prices based on the result
 *     responses:
 *       201:
 *         description: Price match price created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /pricematch:
 *   delete:
 *     tags:
 *       - PriceMatch
 *     summary: Delete outdated price match prices
 *     responses:
 *       200:
 *         description: Outdated price match prices deleted
 *       500:
 *         description: Internal server error
 */
