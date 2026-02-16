/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         orderId:
 *           type: number
 *         productId:
 *           type: number
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         userId:
 *           type: number
 *           example: 1
 *         paymentMethod:
 *           type: string
 *           enum: [PAYPAL, CREDITCARD]
 *           example: "CREDITCARD"
 *         status:
 *           type: string
 *           enum: [PENDING, SENT, CANCELED, DELIVERED]
 *           example: "PENDING"
 *         total:
 *           type: number
 *           example: 99.99
 *         createdAt:
 *           type: string
 *           format: date-time
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *
 *     CreateOrderInput:
 *       type: object
 *       required: [paymentMethod, status]
 *       properties:
 *         paymentMethod:
 *           type: string
 *           enum: [PAYPAL, CREDITCARD]
 *           example: "PAYPAL"
 *         status:
 *           type: string
 *           enum: [PENDING, SENT, CANCELED, DELIVERED]
 *           example: "PENDING"
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Order placed successfully"
 *         data:
 *           $ref: '#/components/schemas/Order'
 */
