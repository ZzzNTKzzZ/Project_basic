import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./ProductDetail.module.scss";
import { AltImage, Arrow } from "../../Assets";
import { useCart } from "../../Hook/useCartContext";
import Button from "../../Components/Button";
import QuantitySelector from "./Quantity";
import Rating from "../../Components/Rating";
import ProductList from "../../Components/ProductList";
import { useCheckOut } from "../../Hook/useCheckOutContext";
import Breadcrumb from "../../Components/BreadCrumb";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { setCheckOutItems } = useCheckOut();
  const navigate = useNavigate();

  // === State ===
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState({});
  const [validSelected, setValidSelected] = useState(true);

  // === Fetch product ===
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/products/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("❌ Fetch product failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // === Initialize selected variations ===
  useEffect(() => {
    if (!product?.variations) return;

    const initialSelected = Object.keys(product.variations).reduce(
      (acc, key) => {
        const single = key.endsWith("s") ? key.slice(0, -1) : key;
        acc[single] = "";
        return acc;
      },
      {}
    );

    setSelected(initialSelected);
  }, [product]);

  // === Handlers ===
  const handleSelect = (key, value) => {
    if (!validSelected) {
      setValidSelected(true);
    }
    const singular = key.endsWith("s") ? key.slice(0, -1) : key;
    setSelected((prev) => ({ ...prev, [singular]: value }));
  };

  const handleAddToCart = () => {
    const keys = Object.keys(selected);
    const valid = keys.every(
      (key) => selected[key] !== "" && selected !== null
    );
    setValidSelected(valid);
    if (!product) return;
    addToCart({
      ...product,
      quantity: quantity,
      variations: product.variations,
      variants: selected,
    });
  };

  const handleBuyNow = () => {
    const keys = Object.keys(selected);
    const valid = keys.every(
      (key) => selected[key] !== "" && selected !== null
    );
    if (valid) {
      navigate("/checkout");
    }
    setValidSelected(valid);
    if (!product) return;
    setCheckOutItems([
      {
        ...product,
        quantity: quantity,
        variations: product.variations,
        variants: selected,
      },
    ]);
  };

  // === Derived values ===
  const variationKeys = useMemo(
    () => Object.keys(product?.variations || {}),
    [product]
  );

  // Loading Error
  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  // === Render ===
  return (
    <div className={`container ${styles.wrapper}`}>
      {/* Breadcrumbs */}
      <Breadcrumb currentPath={product.name} />

      {/* Product section */}
      <section className={styles.productSection}>
        {/* Gallery */}
        <div className={`${styles.gallery} col-5`}>
          <div className={styles.mainImage}>
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
            />
          </div>
        </div>

        {/* Info */}
        <div className={`${styles.info} col-7`}>
          <h3 className={styles.name}>{product.name}</h3>

          <div className={styles.stats}>
            <Rating rating={product.rating} />
            <span className={styles.divider}></span>
            <span>
              <p className={styles.label}>Reviews</p>{" "}
              {product.reviews?.length || 0}
            </span>
            <span className={styles.divider}></span>
            <span>
              <p className={styles.label}>Sold</p> {product.sold}
            </span>
          </div>

          <p className={styles.price}>
            {product.isOnSale ? (
              <span className={styles.sale}>
                <span className={styles.price}>
                  {product.sale.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                <span className={styles.oldPrice}>
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </span>
            ) : (
              <span className={styles.price}>
                {product.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            )}
          </p>

          {/* Variations */}
          <div
            className={`${styles.variationsGroup} ${
              !validSelected ? styles.error : ""
            }`}
          >
            {variationKeys.map((key) => {
              const singular = key.endsWith("s") ? key.slice(0, -1) : key;
              const values = product.variations[key];
              return (
                <div key={key} className={styles.variations}>
                  <p className={styles.variationsLabel}>
                    {singular.charAt(0).toUpperCase() + singular.slice(1)}
                  </p>
                  {values.map((value) => (
                    <Button
                      key={value}
                      type={2}
                      className={styles.variationBtn}
                      active={selected[singular] === value}
                      onClick={() => handleSelect(key, value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Quantity */}
          <div className={styles.quantityGroup}>
            <p className={styles.quantityLabel}>Quantity</p>
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            <div className={styles.stockText}>In stock: {product.stock}</div>
          </div>

          {!validSelected && (
            <span className={styles.errorMessage}>
              Please select Product Category{" "}
            </span>
          )}
          {/* Actions */}
          <div className={styles.actions}>
            <Button onClick={handleAddToCart} className={styles.addBtn}>
              Add To Cart
            </Button>
            <Button onClick={handleBuyNow} type={2} className={styles.buyBtn}>
              Buy Now
            </Button>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className={styles.details}>
        <h2>Product Detail</h2>
        <div className={styles.detailList}>
          <Detail
            label="Category"
            value={product.category?.name || "Uncategorized"}
          />
          <Detail label="Stock" value={product.stock} />
          <Detail
            label="Tags"
            value={product.tags?.map((t) => t.name).join(", ") || "None"}
          />
        </div>

        <h2>Description</h2>
        <div className={styles.description}>{product.des}</div>
      </section>

      {/* Related products */}
      <ProductList />

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <section className={styles.reviews}>
          <h2>Customer Reviews</h2>
          <div className={styles.reviewList}>
            {product.reviews.map((r) => (
              <div key={r._id} className={styles.reviewItem}>
                <Rating rating={r.rating} />
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// === Small helper component ===
function Detail({ label, value }) {
  return (
    <div className={styles.detailItem}>
      <p>{label}</p>
      <span>{value}</span>
    </div>
  );
}
