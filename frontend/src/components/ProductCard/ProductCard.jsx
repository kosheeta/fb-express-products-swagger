import "./ProductCard.scss";
import { Button } from "../Button/Button";

export function ProductCard({ product, onDelete, onPricePlus }) {
  return (
    <div className="product-card">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.title} className="product-card__image" />
      ) : (
        <div className="product-card__image" />
      )}

      <div className="product-card__content">
        <h2 className="product-card__title">{product.title}</h2>

        {product.category && <p className="product-card__category">Категория: {product.category}</p>}

        {product.description && <p className="product-card__desc">{product.description}</p>}

        {product.rating && <p className="product-card__rating">⭐ Рейтинг: {product.rating}</p>}

        {product.stock !== undefined && (
          <p className="product-card__stock">На складе: {product.stock} шт.</p>
        )}

        <div className="product-card__footer">
          <span className="product-card__price">{product.price} ₽</span>
          <div className="product-card__actions">
            {onPricePlus && (
              <Button onClick={() => onPricePlus(product.id, product.price)}>+10 ₽</Button>
            )}
            {onDelete && <Button onClick={() => onDelete(product.id)}>Удалить</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
