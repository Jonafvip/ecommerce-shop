import { Router } from "express";
import { verify, isAdmin } from "../middleware/auth.middleware.js";
import {
  createProducts,
  deleteProduct,
  getAllProducts,
  getProductId,
  updateProduct,
} from "../controller/product.controller.js";
import { validationSchema } from "../validation/schemaValidation.js";
import {
  deleteProductValidation,
  updateProductValidation,
  CreateProductValidation,
} from "../validation/product.validation.js";

const productRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /api/v1/admin/product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       404:
 *         description: Products not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
productRoute.use(verify);
productRoute.get("/", getAllProducts);

/**
 * @swagger
 * /api/v1/admin/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
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
 *         description: Product detailed information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
productRoute.get("/:id", getProductId);

productRoute.use(isAdmin);

/**
 * @swagger
 * /api/v1/admin/product:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       201:
 *         description: Product successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Bad Request - Validation error or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Administrator permissions required
 */
productRoute.post(
  "/",
  validationSchema(CreateProductValidation),
  createProducts
);

/**
 * @swagger
 * /api/v1/admin/product/{id}:
 *   put:
 *     summary: Update an existing product (Admin only)
 *     tags: [Products]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       200:
 *         description: Product successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Bad Request - Validation error or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Administrator permissions required
 *       404:
 *         description: Product not found
 */
productRoute.put(
  "/:id",
  validationSchema(updateProductValidation, "params"),
  updateProduct
);

/**
 * @swagger
 * /api/v1/admin/product/{id}:
 *   delete:
 *     summary: Remove a product (Admin only)
 *     tags: [Products]
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
 *         description: Product successfully removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 success: true
 *                 message: "Product successfully removed"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Administrator permissions required
 *       404:
 *         description: Product not found
 */
productRoute.delete(
  "/:id",
  validationSchema(deleteProductValidation, "params"),
  deleteProduct
);

export default productRoute;
