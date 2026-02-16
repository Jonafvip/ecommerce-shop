/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Wireless Mouse"
 *         description:
 *           type: string
 *           example: "High precision wireless optical mouse"
 *         price:
 *           type: number
 *           example: 25.99
 *         stock:
 *           type: number
 *           example: 50
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateProductInput:
 *       type: object
 *       required: [name, description, price, stock]
 *       properties:
 *         name:
 *           type: string
 *           example: "Wireless Mouse"
 *         description:
 *           type: string
 *           example: "High precision wireless optical mouse"
 *         price:
 *           type: number
 *           example: 25.99
 *         stock:
 *           type: number
 *           example: 50
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Product operation successful"
 *         data:
 *           $ref: '#/components/schemas/Product'
 *
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Products retrieved successfully"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 */
