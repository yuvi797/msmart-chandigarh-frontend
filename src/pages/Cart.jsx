
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./Cart.css";
import "./Home.css";

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

const formatPrice = (amount) =>
  `₹${(Number(amount) || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function getProducts(response) {
  const data = response.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.products)) {
    return data.data.products;
  }

  return [];
}

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQty,
    clearCart,
    subtotal: contextSubtotal,
    total: contextTotal,
    savings: contextSavings,
    itemCount: contextItemCount,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [recommendationError, setRecommendationError] = useState("");

  // Fetch recommendations using the existing products API
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setRecommendationError("");

        const response = await axios.get(API_URL);

        if (!cancelled) {
          setProducts(getProducts(response));
        }
      } catch (error) {
        console.error("Failed to load recommended products:", error);

        if (!cancelled) {
          setRecommendationError(
            "We couldn't load recommendations right now."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Exclude products already in the cart
  const recommendations = useMemo(() => {
    const cartIds = new Set(cart.map((item) => String(item._id)));

    return products
      .filter((product) => !cartIds.has(String(product._id)))
      .filter((product) => Number(product.stock) > 0)
      .slice(0, 8);
  }, [products, cart]);

  const subtotal =
    contextSubtotal ??
    cart.reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * item.qty,
      0
    );

  const itemCount =
    contextItemCount ??
    cart.reduce((sum, item) => sum + item.qty, 0);

  const savings =
    contextSavings ??
    cart.reduce(
      (sum, item) =>
        sum +
        Math.max(
          0,
          (Number(item.mrp) || Number(item.price) || 0) -
            (Number(item.price) || 0)
        ) *
          item.qty,
      0
    );

  // No delivery fee is added
  const total = contextTotal ?? subtotal;

  const checkout = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  return (
    <main className="cart-page">
      {/* Page heading */}
      <div className="cart-heading">
        <div>
          <span className="cart-eyebrow">YOUR SHOPPING BAG</span>
          <h1>
            My Cart <span>({itemCount} items)</span>
          </h1>
          <p>Fresh groceries, ready for your order.</p>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Clear cart
          </button>
        )}
      </div>

      {/* Cart content */}
      {cart.length === 0 ? (
        <section className="cart-empty-page">
          <div className="empty-cart-illustration">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Explore our groceries and add your favourites.</p>

          <button
            type="button"
            className="cart-primary-btn"
            onClick={() => navigate("/")}
          >
            Start Shopping →
          </button>
        </section>
      ) : (
        <div className="cart-layout">
          {/* Cart products */}
          <section className="cart-items-panel">
            <div className="cart-panel-heading">
              <h2>Your Products</h2>
              <span>{cart.length} different products</span>
            </div>

            {cart.map((item) => {
              const price = Number(item.price) || 0;
              const mrp = Number(item.mrp) || price;
              const stock = Number(item.stock);
              const hasStock =
                item.stock != null && Number.isFinite(stock);
              const atStockLimit =
                hasStock && item.qty >= stock;

              return (
                <article className="cart-item" key={item._id}>
                  <div className="cart-product-image">
                    <img
                      src={
                        item.image ||
                        "https://placehold.co/160x160?text=Grocery"
                      }
                      alt={item.name || "Grocery product"}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://placehold.co/160x160?text=Product";
                      }}
                    />
                  </div>

                  <div className="cart-product-info">
                    <h3>{item.name}</h3>
                    <p className="cart-product-unit">
                      {item.unit || "1 unit"}
                    </p>

                    <div className="cart-unit-price">
                      <strong>{formatPrice(price)}</strong>
                      {mrp > price && (
                        <span className="cart-mrp">
                          {formatPrice(mrp)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="cart-remove-mobile"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="cart-item-right">
                    <div className="cart-qty-control">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name}`}
                        onClick={() =>
                          updateQty(item._id, item.qty - 1)
                        }
                      >
                        −
                      </button>

                      <span>{item.qty}</span>

                      <button
                        type="button"
                        aria-label={`Increase ${item.name}`}
                        disabled={atStockLimit}
                        onClick={() =>
                          updateQty(item._id, item.qty + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <strong className="cart-line-total">
                      {formatPrice(price * item.qty)}
                    </strong>

                    <button
                      type="button"
                      className="cart-remove-desktop"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}

            <button
              type="button"
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              ← Continue Shopping
            </button>
          </section>

          {/* Bill summary */}
          <aside className="cart-summary-panel">
            <h2>Bill Details</h2>

            <div className="cart-summary-row">
              <span>Items ({itemCount})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {savings > 0 && (
              <div className="cart-summary-row cart-savings-row">
                <span>Your Savings</span>
                <span>-{formatPrice(savings)}</span>
              </div>
            )}

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <div>
                <strong>Total</strong>
                <small>Product prices only</small>
              </div>
              <strong>{formatPrice(total)}</strong>
            </div>

            <button
              type="button"
              className="cart-checkout-btn"
              onClick={checkout}
            >
              Proceed to Checkout <span>→</span>
            </button>

            <div className="cart-trust-note">
              <span>🔒</span>
              <p>Your order details will be reviewed at checkout.</p>
            </div>
          </aside>
        </div>
      )}

      {/* Recommended products */}
      <section className="cart-recommendations">
        <div className="recommendations-heading">
          <div>
            <span className="cart-eyebrow">DISCOVER MORE</span>
            <h2>You may also like</h2>
            <p>Pick up a few more essentials for your home.</p>
          </div>

          <button
            type="button"
            className="view-all-products"
            onClick={() => navigate("/")}
          >
            View all →
          </button>
        </div>

        {loadingProducts ? (
          <div className="recommendation-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="recommendation-skeleton"
                key={index}
              >
                <div className="skeleton-image" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
                <div className="skeleton-button" />
              </div>
            ))}
          </div>
        ) : recommendationError ? (
          <div className="recommendation-message">
            <p>{recommendationError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="recommendation-grid">
            {recommendations.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="recommendation-message">
            <p>No additional products to recommend right now.</p>
            <button
              type="button"
              onClick={() => navigate("/")}
            >
              Browse all groceries
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
