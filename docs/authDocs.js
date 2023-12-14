/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       403:
 *         description: Invalid login credentials
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_email:
 *                 type: string
 *               user_password:
 *                 type: string
 *               customer:
 *                 type: object
 *                 properties:
 *                   customer_name:
 *                     type: string
 *                   addresses:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       zip_code:
 *                         type: integer
 *                       country:
 *                         type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Invalid input
 *       409:
 *         description: E-mail already in use
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /logout:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Logout a user
 *     responses:
 *       204:
 *         description: User logged out
 *       403:
 *         description: Forbidden
 */
/**
 * @swagger
 * /refresh:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Refresh a user's token
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
