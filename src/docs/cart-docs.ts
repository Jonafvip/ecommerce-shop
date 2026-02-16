/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         userId:
 *           type: number
 *           example: 1
 *         productId:
 *           type: number
 *           example: 10
 *         quantity:
 *           type: number
 *           example: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AddProductToCartInput:
 *       type: object
 *       properties:
 *         quantity:
 *           type: number
 *           example: 1
 *           description: Number of units to add (defaults to 1)
 *
 *     CartResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Product added to cart successfully"
 *         data:
 *           $ref: '#/components/schemas/CartItem'
 */
