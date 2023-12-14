/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         favorite_id:
 *           type: integer
 *           description: The favorite ID
 *           example: 5
 *         customer_id:
 *           type: integer
 *           description: The customer ID
 *           example: "20"
 *         product_id:
 *           type: integer
 *           description: The product ID
 *           example: "10169"
 *         product_name:
 *           type: string
 *           description: The name of the product
 *           example: "SUNJOY"
 *         product_underline:
 *           type: string
 *           description: The underline of the product
 *           example: "50 CL. / HINDBÆR"
 *         product_description:
 *           type: string
 *           description: The description of the product
 *           example: null
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               image_id:
 *                 type: integer
 *                 description: The ID of the image
 *                 example: 55
 *               image_url:
 *                 type: string
 *                 description: The URL of the product image
 *                 example: "https://d2dql7oeescq6w.cloudfront.net/11002/1-small-kAonNEMox8.webp"
 *               product_id:
 *                 type: integer
 *                 description: The ID of the product
 *                 example: 10169
 *         labels:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               label_id:
 *                 type: integer
 *                 description: The ID of the label
 *                 example: 6
 *               label_name:
 *                 type: string
 *                 description: The name of the label
 *                 example: "Økologi"
 *               label_image:
 *                 type: string
 *                 description: The URL of the label image
 *                 example: "https://d15493jtiio2fp.cloudfront.net/product/labels/6-64.webp"
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             # Define properties for categories here
 *         inventory:
 *           type: object
 *           properties:
 *             inventory_id:
 *               type: integer
 *               description: The ID of the inventory
 *               example: 346
 *             inventory_stock:
 *               type: integer
 *               description: The stock of the product
 *               example: 23
 *             product_id:
 *               type: integer
 *               description: The ID of the product
 *               example: 10169
 *         prices:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               price_id:
 *                 type: integer
 *                 description: The ID of the price
 *                 example: 446
 *               price:
 *                 type: number
 *                 description: The price of the product
 *                 example: 10
 *               starting_at:
 *                 type: string
 *                 format: date
 *                 description: The start date of the price
 *                 example: "2022-10-13T00:00:00.000Z"
 *               is_campaign:
 *                 type: boolean
 *                 description: Whether the price is a campaign price
 *                 example: false
 *               ending_at:
 *                 type: string
 *                 format: date
 *                 description: The end date of the price
 *                 example: "2099-12-31T00:00:00.000Z"
 *               product_id:
 *                 type: integer
 *                 description: The ID of the product
 *                 example: 10169
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     FavoriteCreate:
 *       type: object
 *       required:
 *         - product_id
 *         - customer_id
 *       properties:
 *         product_id:
 *           type: integer
 *           description: The ID of the product
 *         customer_id:
 *           type: integer
 *           description: The ID of the customer
 */
/**
 * @swagger
 * /favorites:
 *   get:
 *     tags:
 *       - Favorites
 *     summary: Get all favorites
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, low-high, high-low]
 *         description: The sort order
 *       - in: query
 *         name: label
 *         schema:
 *           type: string
 *           enum: [økologi]
 *         description: The label to filter by
 *     responses:
 *       200:
 *         description: A list of favorites.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 */
/**
 * @swagger
 * /favorites:
 *   post:
 *     tags:
 *       - Favorites
 *     summary: Create a new favorite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: The ID of the product
 *                 example: 13271
 *               customer_id:
 *                 type: integer
 *                 description: The ID of the customer
 *                 example: 7
 *     responses:
 *       201:
 *         description: The favorite was successfully created
 *       400:
 *         description: Missing or invalid request body
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /favorites/{id}:
 *   delete:
 *     summary: Delete a favorite by favoriteID
 *     tags:
 *       - Favorites
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The favorite ID
 *     responses:
 *       200:
 *         description: The favorite was successfully deleted
 *       400:
 *         description: Missing or invalid request parameters
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /favorites/search:
 *   get:
 *     tags:
 *       - Favorites
 *     summary: Search favorites
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, low-high, high-low]
 *         description: The sort order
 *       - in: query
 *         name: label
 *         schema:
 *           type: string
 *           enum: [økologi]
 *         description: The label to filter by
 *     responses:
 *       200:
 *         description: A list of matching favorites.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 */
