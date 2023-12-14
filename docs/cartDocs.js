/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         product_id:
 *           type: integer
 *         quantity:
 *           type: integer
 * /cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get customer's cart
 *     responses:
 *       200:
 *         description: A list of all items in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add multiple items to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CartItem'
 *     responses:
 *       201:
 *         description: Items added to cart
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /cart/items:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Add or deduct quantity from cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Cart updated
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /cart/items:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Delete all items from cart
 *     responses:
 *       204:
 *         description: All items deleted from cart
 *       500:
 *         description: Internal server error
 */
