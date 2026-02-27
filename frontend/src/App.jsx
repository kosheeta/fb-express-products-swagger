import { useEffect, useState } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./api/productsApi";
import { Note, ProductCard, ProductForm } from "./components";

import "./App.scss";

/**
 * Практика 4 (заготовка).
 * Важно: это НЕ готовое решение. В файле api/productsApi.js стоят TODO.
 * Цель: подключить React к вашему Express API и выполнить базовый CRUD.
 */
export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getProducts();
      setItems(data);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAddProduct(payload) {
    setError("");
    try {
      await createProduct(payload);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onDelete(id) {
    setError("");
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onPricePlus(id, currentPrice) {
    setError("");
    try {
      await updateProduct(id, { price: Number(currentPrice) + 10 });
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  return (
    <div className="page">
      <h1>Практика 4 — React + Express API</h1>

      <Note>
        Если видите ошибку <code>TODO: реализуйте ...</code>, значит вы ещё не реализовали функции в{" "}
        <code>src/api/productsApi.js</code>.
      </Note>

      <ProductForm onSubmit={handleAddProduct} onRefresh={load} />

      <section className="products-section">
        <h2>Список товаров</h2>

        {loading && <p>Загрузка...</p>}
        {error && (
          <p className="error-message">
            Ошибка: {error}
            <br />
            Проверьте, что: (1) backend запущен на 3000, (2) CORS настроен, (3) TODO в productsApi.js реализованы.
          </p>
        )}

        <div className="products-list">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={onDelete}
              onPricePlus={onPricePlus}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
