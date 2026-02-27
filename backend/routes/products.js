const express = require("express");
const { nanoid } = require("nanoid");
const store = require("../store/productsStore");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: The error message
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The product ID
 *         title:
 *           type: string
 *           description: The product title
 *         price:
 *           type: number
 *           description: The product price
 *         category:
 *           type: string
 *           description: The product category
 *         description:
 *           type: string
 *           description: The product description
 *         stock:
 *           type: number
 *           description: The product stock
 *         rating:
 *           type: number
 *           description: The product rating
 *         imageUrl:
 *           type: string
 *           description: The product image URL
 *       required:
 *         - id
 *         - title
 *         - price
 *         - category
 *         - description
 *         - stock
 *         - rating
 *         - imageUrl
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of all products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", async (req, res, next) => {
  try {
    const products = await store.readAll();
    res.json(products);
  } catch (e) {
    next(e);
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with the given details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", async (req, res, next) => {
  try {
    const { title, price, category, description, stock, rating, imageUrl } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "title is required" });
    }

    const newProduct = {
      id: nanoid(8),
      title: title.trim(),
      price: Number(price) || 0,
      category: category ? String(category).trim() : "",
      description: description ? String(description).trim() : "",
      stock: Number(stock) >= 0 ? Number(stock) : 0,
      rating: Number(rating) >= 0 ? Number(rating) : 0,
      imageUrl: imageUrl ? String(imageUrl).trim() : "",
    };

    await store.add(newProduct);
    res.status(201).json(newProduct);
  } catch (e) {
    next(e);
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product
 *     description: Updates a product with the given details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:id", async (req, res, next) => {
  try {
    const updated = await store.patch(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product with the given ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: The result of the operation
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const ok = await store.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;