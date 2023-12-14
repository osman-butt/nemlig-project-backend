/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: A list of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       403:
 *         description: Brugeren er ikke logget ind
 *       404:
 *         description: Kunden eksisterer ikke
 *       500:
 *         description: Could not fetch orders
 */
/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardNo:
 *                 type: string
 *               expiry:
 *                 type: string
 *               cvc:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 *       404:
 *         description: Betalings oplysninger mangler / Brugeren er ikke logget ind / Kunden eksisterer ikke / Kurven er tom
 *       403:
 *         description: Brugeren er ikke logget ind
 *       500:
 *         description: Internal server error
 */
