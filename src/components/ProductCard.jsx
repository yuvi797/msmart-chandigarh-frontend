
import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQty } = useCart();
  const [imageError, setImageError] = useState(false);

  const cartItem = cart.find(
    (item) => item._id === product._id
  );

  const qty = cartItem?.qty || 0;
  const price = Number(product.price) || 0;
  const mrp = Number(product.mrp) || 0;

  const discount =
    mrp > price && mrp > 0
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0;

  const outOfStock =
    product.stock !== undefined &&
    Number(product.stock) <= 0;

  return (
    <article className="product-card">
      <div className="product-image-area">
        {discount > 0 && (
          <span className="product-discount">
            {discount}% OFF
          </span>
        )}

        {outOfStock && (
          <span className="product-stock-label">
            Sold out
          </span>
        )}

        {!imageError && product.image ? (
          <img
            className="product-image"
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-image-placeholder">
            <span>No image available</span>
          </div>
        )}
      </div>

      <div className="product-details">
        <div className="product-delivery">
          <span className="delivery-dot" />
          10 MIN DELIVERY
        </div>

        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        <p className="product-unit">
          {product.unit || "1 unit"}
        </p>

        <div className="product-bottom">
          <div className="product-pricing">
            <span className="product-price">
              ₹{price.toFixed(0)}
            </span>

            {mrp > price && (
              <span className="product-mrp">
                ₹{mrp.toFixed(0)}
              </span>
            )}
          </div>

          {outOfStock ? (
            <button
              className="product-add-button product-add-disabled"
              disabled
            >
              Sold out
            </button>
          ) : qty === 0 ? (
            <button
              className="product-add-button"
              onClick={() => addToCart(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              Add
            </button>
          ) : (
            <div className="product-quantity">
              <button
                type="button"
                onClick={() => updateQty(product._id, qty - 1)}
                aria-label={`Remove one ${product.name}`}
              >
                −
              </button>

              <span>{qty}</span>

              <button
                type="button"
                onClick={() => updateQty(product._id, qty + 1)}
                aria-label={`Add one ${product.name}`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
