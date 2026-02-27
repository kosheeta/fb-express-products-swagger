import { useMemo, useState } from "react";
import { Button } from "../Button/Button";
import "./ProductForm.scss";

export function ProductForm({ onSubmit, onRefresh }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [rating, setRating] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const canSubmit = useMemo(() => title.trim() !== "" && price !== "", [title, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      title: title.trim(),
      price: Number(price),
    };

    if (category.trim()) payload.category = category.trim();
    if (description.trim()) payload.description = description.trim();
    if (stock) payload.stock = Number(stock);
    if (rating) payload.rating = Number(rating);
    if (imageUrl.trim()) payload.imageUrl = imageUrl.trim();

    await onSubmit(payload);

    setTitle("");
    setPrice("");
    setCategory("");
    setDescription("");
    setStock("");
    setRating("");
    setImageUrl("");
  };

  return (
    <section className="product-form-section">
      <h2 className="product-form-section__title">Добавить товар</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название"
          className="product-form__input"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Цена"
          type="number"
          className="product-form__input product-form__input--short"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Категория"
          className="product-form__input"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание"
          className="product-form__input product-form__input--wide"
        />
        <input
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Остаток"
          type="number"
          className="product-form__input product-form__input--short"
        />
        <input
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Рейтинг"
          type="number"
          step="0.1"
          min="0"
          max="5"
          className="product-form__input product-form__input--short"
        />
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL изображения"
          className="product-form__input product-form__input--wide"
        />
        <Button disabled={!canSubmit} className="product-form__button">
          Добавить
        </Button>
        <Button type="button" onClick={onRefresh} className="product-form__button">
          Обновить список
        </Button>
      </form>
    </section>
  );
}
