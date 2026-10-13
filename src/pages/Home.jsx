
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import CategoryBar from "../components/CategoryBar";
import "./Home.css";

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

function getProductArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.products)) return data.data.products;
  if (Array.isArray(data?.result?.products)) return data.result.products;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.result)) return data.result;

  return null;
}

function ProductSkeleton() {
  return (
    <div className="product-skeleton" aria-hidden="true">
      <div className="skeleton-image" />
      <div className="skeleton-line skeleton-short" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-price" />
      <div className="skeleton-button" />
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(API_URL);
      const list = getProductArray(res.data);

      if (!list) {
        throw new Error(
          "The API response does not contain a recognizable product array."
        );
      }

      setProducts(list);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const list = products
      .map((product) => product.category)
      .filter((category) => typeof category === "string" && category.trim());

    return [
      "All",
      ...new Set(list),
    ].sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const name = String(product.name || "").toLowerCase();
      const category = String(product.category || "").toLowerCase();

      const matchesSearch =
        !term || name.includes(term) || category.includes(term);

      const matchesCategory =
        activeCat === "All" || product.category === activeCat;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sort === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sort === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
    }

    return result;
  }, [products, search, activeCat, sort]);

  return (
    <main className="grocery-home">
      {/* HERO BANNER — REAL GROCERY PHOTOS ONLY */}
      <section className="grocery-hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span className="hero-dot" />
            FRESHNESS AT YOUR DOORSTEP
          </span>

          <h1>
            Your daily needs,
            <br />
            <span>delivered fresh.</span>
          </h1>

          <p>
            From farm-fresh vegetables to everyday essentials,
            your favourites are just a few clicks away.
          </p>

          <button
            type="button"
            className="hero-cta"
            onClick={() =>
              document
                .getElementById("grocery-products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Shop groceries <span aria-hidden="true">→</span>
          </button>

          <div className="hero-trust">
            <span>✓ Fresh picks</span>
            <span>✓ Great value</span>
            <span>✓ Easy shopping</span>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />

          <div className="hero-photo hero-photo-fruits">
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=85"
              alt="Fresh assorted fruits"
            />
          </div>

          <div className="hero-photo hero-photo-vegetables">
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=85"
              alt="Fresh green vegetables"
            />
          </div>

          <div className="hero-photo hero-photo-bread">
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=85"
              alt="Freshly baked bread"
            />
          </div>

          <div className="hero-photo hero-photo-milk">
            <img
              src="https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=85"
              alt="Fresh milk"
            />
          </div>

          <div className="hero-fresh-tag">
            <span>🌿</span>
            Fresh every day
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefit-strip" aria-label="Shopping benefits">
        <div className="benefit-item">
          <span className="benefit-icon">🥬</span>
          <div>
            <strong>Fresh quality</strong>
            <span>Everyday essentials</span>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">🏷️</span>
          <div>
            <strong>Great value</strong>
            <span>Shop within budget</span>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">🚚</span>
          <div>
            <strong>Easy delivery</strong>
            <span>Convenience at home</span>
          </div>
        </div>
      </section>

      {/* PRODUCT CATALOGUE */}
      <section id="grocery-products" className="catalog-section">
        <div className="catalog-heading">
          <div>
            <span className="section-eyebrow">
              YOUR NEIGHBOURHOOD STORE
            </span>
            <h2>What are you shopping for?</h2>
            <p>Find your everyday favourites in one place.</p>
          </div>
        </div>

        <div className="catalog-toolbar">
          <label className="grocery-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fruits, milk, bread..."
              aria-label="Search grocery products"
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <label className="sort-control">
            <span>Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>

        {!loading && categories.length > 0 && (
          <CategoryBar
            categories={categories}
            active={activeCat}
            onSelect={setActiveCat}
          />
        )}

        <div className="catalog-results">
          <div className="results-heading">
            <h3>
              {search.trim()
                ? "Search results"
                : activeCat === "All"
                  ? "Popular groceries"
                  : activeCat}
            </h3>

            {!loading && !error && (
              <span className="results-count">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grocery-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="catalog-message">
              <span className="message-icon">⚠️</span>
              <h3>Couldn't load your groceries</h3>
              <p>{error}</p>
              <button
                type="button"
                className="retry-button"
                onClick={fetchProducts}
              >
                Try again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="catalog-message">
              <span className="message-icon">🛒</span>
              <h3>
                {products.length === 0
                  ? "Your store is waiting for its first products"
                  : "No matching groceries found"}
              </h3>
              <p>
                {products.length === 0
                  ? "Products will appear here when they are added to your store."
                  : "Try another search or clear your category filter."}
              </p>

              {(search || activeCat !== "All") && (
                <button
                  type="button"
                  className="retry-button"
                  onClick={() => {
                    setSearch("");
                    setActiveCat("All");
                  }}
                >
                  Show all products
                </button>
              )}
            </div>
          ) : (
            <div className="grocery-grid">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product._id || product.id || index}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROMOTIONAL BANNER */}
      <section className="grocery-promo">
        <div>
          <span className="promo-eyebrow">GOOD FOOD, GOOD MOOD</span>
          <h2>Make everyday shopping simpler.</h2>
          <p>
            Explore your favourites and fill your basket with goodness.
          </p>
        </div>

        <span className="promo-emoji" aria-hidden="true">
          🥦
        </span>
      </section>
    </main>
  );
}
