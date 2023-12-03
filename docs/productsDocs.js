/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - product_name
 *       properties:
 *         product_id:
 *          type: integer
 *          description: The ID of the product
 *          example: 10
 *         product_name:
 *           type: string
 *           description: The name of the product
 *           example: "Test product"
 *         product_underline:
 *           type: string
 *           description: The underline of the product
 *           example: "Test underline"
 *         product_description:
 *           type: string
 *           description: The description of the product
 *           example: "Test description"
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               image_id:
 *                type: integer
 *                description: The ID of the image
 *                example: 1
 *               image_url:
 *                 type: string
 *                 description: The URL of the product image
 *                 example: "https://example.com/image.jpg"
 *               product_id:
 *                type: integer
 *                description: The ID of the product
 *                example: 10
 *         labels:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               label_id:
 *                type: integer
 *                description: The ID of the label
 *                example: 6
 *               label_name:
 *                 type: string
 *                 description: The name of the label
 *                 example: "Test label"
 *               label_image:
 *                 type: string
 *                 description: The URL of the label image
 *                 example: "https://example.com/image.jpg"
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *              category_id:
 *               type: integer
 *               description: The ID of the category
 *               example: 5
 *              category_name:
 *                type: string
 *                description: The name of the category
 *                example: "Test category"
 *              category_description:
 *                type: string
 *                description: The description of the category
 *                example: "Test description"
 *         inventory:
 *           type: object
 *           properties:
 *             inventory_id:
 *              type: integer
 *              description: The ID of the inventory
 *              example: 1
 *             inventory_stock:
 *              type: integer
 *              description: The stock of the product
 *              example: 100
 *             product_id:
 *              type: integer
 *              description: The ID of the product
 *              example: 10
 *         prices:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               price_id:
 *                 type: integer
 *                 description: The ID of the price
 *                 example: 1
 *               price:
 *                 type: number
 *                 description: The price of the product
 *                 example: 10
 *               starting_at:
 *                 type: string
 *                 format: date
 *                 description: The start date of the price
 *               is_campaign:
 *                 type: boolean
 *                 description: Whether the price is a campaign price
 *               ending_at:
 *                 type: string
 *                 format: date
 *                 description: The end date of the price
 *               product_id:
 *                type: integer
 *                description: The ID of the product
 *                example: 10
 */
/**
/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCreate:
 *       type: object
 *       properties:
 *         product_name:
 *           type: string
 *           description: The name of the product
 *           example: "Test product"
 *         product_underline:
 *           type: string
 *           description: The underline of the product
 *           example: "Test underline"
 *         product_description:
 *           type: string
 *           description: The description of the product
 *           example: "Test description"
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               image_url:
 *                 type: string
 *                 description: The URL of the product image
 *                 example: "https://example.com/image.jpg"
 *         labels:
 *           type: array
 *           items:
 *             type: integer
 *             description: The ID of the label
 *             example: 6
 *         categories:
 *           type: array
 *           items:
 *             type: integer
 *             description: The ID of the category
 *             example: 5
 *         inventory_stock:
 *           type: integer
 *           description: The stock of the product
 *           example: 100
 *         prices:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 description: The price of the product
 *                 example: 100
 *               starting_at:
 *                 type: string
 *                 format: date
 *                 description: The start date of the price
 *               is_campaign:
 *                 type: boolean
 *                 description: Whether the price is a campaign price
 *               ending_at:
 *                 type: string
 *                 format: date
 *                 description: The end date of the price
 */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *       400:
 *         description: Missing or invalid request body
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         product_name:
 *           type: string
 *           description: The name of the product
 *           example: "Test update product"
 *         product_underline:
 *           type: string
 *           description: The underline of the product
 *           example: "Product Underline"
 *         product_description:
 *           type: string
 *           description: The description of the product
 *           example: "Product Description"
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               image_id:
 *                 type: integer
 *                 description: The ID of the image
 *                 example: 895
 *               image_url:
 *                 type: string
 *                 description: The URL of the product image
 *                 example: "https://d2dql7oeescq6w.cloudfront.net/100232/1-small-nDPWJ78p9W.webp"
 *         labels:
 *           type: array
 *           items:
 *             type: integer
 *             example: 6
 *         categories:
 *           type: array
 *           items:
 *             type: integer
 *             example: 5
 *         inventory_stock:
 *           type: integer
 *           description: The stock of the product
 *           example: 100
 *         prices:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               price_id:
 *                 type: integer
 *                 description: The ID of the price
 *                 example: 1345
 *               price:
 *                 type: number
 *                 description: The price of the product
 *                 example: 25
 *               starting_at:
 *                 type: string
 *                 format: date
 *                 description: The start date of the price
 *                 example: "2022-02-02"
 *               is_campaign:
 *                 type: boolean
 *                 description: Whether the price is a campaign price
 *                 example: false
 *               ending_at:
 *                 type: string
 *                 format: date
 *                 description: The end date of the price
 *                 example: "2022-12-31"
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *       400:
 *         description: Invalid input, product not updated
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product was successfully deleted
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Internal server error
 */