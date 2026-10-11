import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQty } = useCart();

  const cartItem = cart.find((c) => c._id === product._id);
  const qty = cartItem?.qty || 0;

  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div className="product-card">
      {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}

      <div className="img-wrap">
        <img
          src={product.image || "https://via.placeholder.com/200"}
          alt={product.name}
        />
      </div>

      <div className="delivery-time">⚡ 10 MINS</div>

      <h3>{product.name}</h3>
      <p className="unit">{product.unit}</p>

      <div className="price-row">
        <div>
          <span className="price">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="mrp">₹{product.mrp}</span>
          )}
        </div>
      </div>

      {product.stock <= 0 ? (
        <button className="add-btn out" disabled>
          Out of Stock
        </button>
      ) : qty === 0 ? (
        <button className="add-btn" onClick={() => addToCart(product)}>
          ADD
        </button>
      ) : (
        <div className="qty-box">
          <button onClick={() => updateQty(product._id, qty - 1)}>−</button>
          <span>{qty}</span>
          <button onClick={() => updateQty(product._id, qty + 1)}>+</button>
        </div>
      )}
    </div>
  );
}