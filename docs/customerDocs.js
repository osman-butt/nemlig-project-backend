/**
 * @swagger
 * /customer:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get customer details
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       403:
 *         description: Brugeren er ikke genkendt
 *       500:
 *         description: Internal server error
 */
