import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import CategoryBar from "../components/CategoryBar";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCat = activeCat === "All" || p.category === activeCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">⚡ Wonderfull Grocery Shop</span>
          <h1>
            Fresh Groceries <em>in 10 minutes</em>
          </h1>
          <p>Chandigarh's most trusted online grocery delivery</p>
          <div className="hero-features">
            <div className="hero-feature">
              <span>🚴</span>
              <span>Fast Delivery</span>
            </div>
            <div className="hero-feature">
              <span>🥬</span>
              <span>Farm Fresh</span>
            </div>
            <div className="hero-feature">
              <span>💯</span>
              <span>Best Prices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Search for milk, bread, fruits, vegetables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <CategoryBar
          categories={categories}
          active={activeCat}
          onSelect={setActiveCat}
        />
      )}

      {/* Products */}
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          {products.length === 0
            ? "🛒 Abhi koi products nahi hain. Admin login karke add kare."
            : "🔍 Koi product nahi mila."}
        </div>
      ) : (
        <>
          <h2 className="section-title">
            {activeCat === "All" ? "All Products" : activeCat}
          </h2>
          <div className="grid">
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}