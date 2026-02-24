const express = require("express");
const { nanoid } = require("nanoid");
const store = require("../store/productsStore");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await store.readAll();
    res.json(products);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, price } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "title is required" });
    }

    const newProduct = {
      id: nanoid(8),
      title: title.trim(),
      price: Number(price) || 0,
    };

    await store.add(newProduct);
    res.status(201).json(newProduct);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const updated = await store.patch(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

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