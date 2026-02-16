import { Router } from "express";
import { verify } from "../middleware/auth.middleware.js";
import {
  addProductToCart,
  emptyCart,
  removeProductFromCart,
} from "../controller/cart.controller.js";
import { validationSchema } from "../validation/schemaValidation.js";
import {
  addProductToCartValidation,
  cartParamsValidation,
} from "../validation/cart.validation.js";

const cartRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

cartRoute.use(verify);

/**
 * @swagger
 * /api/v1/auth/cart/{id}:
 *   post:
 *     summary: Add product to cart
 *     description: Adds a product to the user's cart or updates quantity if it already exists.
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddProductToCartInput'
 *     responses:
 *       200:
 *         description: Product added or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       400:
 *         description: Bad Request - Insufficient stock or validation error
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Product not found
 */
cartRoute.post(
  "/:id",
  validationSchema(cartParamsValidation, "params"),
  validationSchema(addProductToCartValidation, "body"),
  addProductToCart
);

/**
 * @swagger
 * /api/v1/auth/cart/{id}:
 *   delete:
 *     summary: Remove a product from cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 success: true
 *                 message: "Product removed from cart successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found in cart
 */
cartRoute.delete(
  "/:id",
  validationSchema(cartParamsValidation, "params"),
  removeProductFromCart
);

/**
 * @swagger
 * /api/v1/auth/cart:
 *   delete:
 *     summary: Empty the shopping cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart emptied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 success: true
 *                 message: "Cart emptied successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart is already empty
 */
cartRoute.delete("/", emptyCart);

export default cartRoute;
