"use client";
import controlModal from "@/libs/controlModal";
import countDiscount from "@/libs/countDiscount";
import modifyAmount from "@/libs/modifyAmount";
import { useCartContext } from "@/providers/CartContext";
import { useWishlistContext } from "@/providers/WshlistContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCommonContext } from "@/providers/CommonContext";
import moment from "moment";
import countCommentLength from "@/libs/countCommentLength";
import modifyNumber from "@/libs/modifyNumber";
import { MONEY_SIGN } from "@/constants";
const ProductDetailsRight = ({ product }) => {
  // destructure current product
  const {
    id,
    name,
    sale_price,
    base_price,
    reviews_count,
    categories,
    image,
    colors,
    sizes,
  } = product;
  // current Date

  const Categories = categories?.map((category) => category.name);

  // hooks
  const value = useCommonContext();
  const { addProductToCart } = useCartContext();
  const { addProductToWishlist } = useWishlistContext();
  // dom referance
  const inputRef = useRef(null);
  // states
  const [quantity, setQuantity] = useState(1);
  const [currentColor, setCurrentColor] = useState();
  const [currentSize, setCurrentSize] = useState();

  const handleCurrentColor = (e) => {
    setCurrentColor(e.target.value);
  };
  const handleCurrentSize = (e) => {
    setCurrentSize(e.target.value);
  };

  // set initial current color id and size id
  useEffect(() => {
    if (colors) {
      setCurrentColor(colors[0].id);
    }

    if (sizes) {
      setCurrentSize(sizes[0].id);
    }
  }, [colors, sizes]);

  const [purchaseDate, setPurchaseDate] = useState(null);
  // varriables
  const { type } = value ? value : {};
  const netPriceModified = modifyAmount(sale_price);
  const priceModified = modifyAmount(base_price);
  const purchaseDateMilliseconds = moment(purchaseDate)?.valueOf();
  const productToSave = {
    id,
    image: image.url,
    title: name,
    price: sale_price,
    base_price: base_price,
    color_id: currentColor,
    size_id: currentSize,
    quantity,
    purchaseDate: purchaseDateMilliseconds,
  };
  useEffect(() => {
    const currentDate = Date.now();
    const calanderFormat = moment(currentDate).format("YYYY-MM-DD");
    setPurchaseDate(calanderFormat);

    // Add null check for inputRef.current
    if (inputRef.current) {
      const inputParent = inputRef.current;
      const input = inputParent.querySelector("input");
      setTimeout(() => {
        const increament = inputParent.querySelector(".inc");
        const decreament = inputParent.querySelector(".dec");

        increament.addEventListener("click", () => {
          setQuantity(parseInt(input.value));
        });
        decreament.addEventListener("click", () => {
          setQuantity(parseInt(input.value));
        });

        // Cleanup event listeners
        return () => {
          if (increament && decreament) {
            increament.removeEventListener("click", () => {
              setQuantity(parseInt(input.value));
            });
            decreament.removeEventListener("click", () => {
              setQuantity(parseInt(input.value));
            });
          }
        };
      }, 500);
    }
  }, []);

  return (
    <div className="modal-product-info shop-details-info pl-0" id="details">
      {/* ratings */}
      <div className="product-ratting">
        <ul>
          <li>
            <Link href="#">
              <i className="fas fa-star"></i>
            </Link>
          </li>{" "}
          <li>
            <Link href="#">
              <i className="fas fa-star"></i>
            </Link>
          </li>{" "}
          <li>
            <Link href="#">
              <i className="fas fa-star"></i>
            </Link>
          </li>{" "}
          <li>
            <Link href="#">
              <i className="fas fa-star-half-alt"></i>
            </Link>
          </li>{" "}
          <li>
            <Link href="#">
              <i className="far fa-star"></i>
            </Link>
          </li>{" "}
          <li className="review-total">
            <Link href="#">{reviews_count}</Link>
          </li>
        </ul>
      </div>
      {/* title */}
      <h3>{name}</h3>
      {/* price */}
      <div className="product-price text-nowrap">
        <span>
          {MONEY_SIGN}
          {netPriceModified}
        </span>{" "}
        {sale_price !== base_price && (
          <del>
            {MONEY_SIGN}
            {priceModified}
          </del>
        )}
      </div>
      {/* description */}

      {/* category, availability */}
      {Categories && (
        <div className={`modal-product-meta ltn__product-details-menu-1  `}>
          <ul>
            <li>
              <strong>Categories:</strong>{" "}
              <span>
                {Categories.map((category, idx) => (
                  <Link href={`/shop?cat=${category}`} key={idx}>
                    {category}
                  </Link>
                ))}
              </span>
              {/* colors  */}
              {colors && (
                <div className="d-flex gap-2">
                  <strong> Colors:</strong>

                  {colors.map((color) => (
                    <div
                      className="form-check"
                      key={color.id}
                      style={{ color: color.hex_code }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        value={color.id}
                        id={color.id}
                        checked={color.id === currentColor}
                        onChange={handleCurrentColor}
                        key={color.id}
                      />
                      <label className="form-check-label" htmlFor={color.id}>
                        {color.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {/* sizes  */}
              {sizes && (
                <div className="d-flex gap-2">
                  <strong> Sizes:</strong>

                  {sizes.map((size) => (
                    <div className="form-check" key={size.id}>
                      <input
                        className="form-check-input"
                        type="radio"
                        value={size.id}
                        id={size.id}
                        checked={size.id === currentSize}
                        onChange={handleCurrentSize}
                      />
                      <label className="form-check-label" htmlFor={size.id}>
                        {size.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>
      )}

      {/* add to cart */}
      <div className="ltn__product-details-menu-2">
        <ul>
          <li>
            <div className="cart-plus-minus" ref={inputRef}>
              <input
                onChange={(e) =>
                  setQuantity(
                    !parseInt(e.target.value) ? 1 : parseInt(e.target.value)
                  )
                }
                type="text"
                value={quantity}
                name="qtybutton"
                className="cart-plus-minus-box"
              />
            </div>
          </li>{" "}
          <li>
            <Link
              onClick={(e) => {
                e.preventDefault();
                addProductToCart(productToSave);
              }}
              href="#"
              className="theme-btn-1 btn btn-effect-1"
              title="Add to Cart"
              data-bs-toggle="modal"
              data-bs-target="#add_to_cart_modal"
            >
              <i className="fas fa-shopping-cart"></i> <span>ADD TO CART</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* add to wishlist and compare */}
      <div className="ltn__product-details-menu-3">
        <ul>
          <li>
            <Link
              onClick={(e) => {
                e.preventDefault();
                addProductToWishlist(productToSave);
              }}
              href="#"
              className=""
              title="Wishlist"
              data-bs-toggle="modal"
              data-bs-target="#liton_wishlist_modal"
            >
              <i className="far fa-heart"></i> <span>Add to Wishlist</span>
            </Link>
          </li>{" "}
          <li>
            <Link
              href="#"
              className=""
              title="Compare"
              data-bs-toggle="modal"
              data-bs-target="#quick_view_modal"
            >
              <i className="fas fa-exchange-alt"></i> <span>Compare</span>
            </Link>
          </li>
        </ul>
      </div>
      <hr />
      {/* socials */}
      <div className="ltn__social-media">
        <ul>
          <li>Share:</li>{" "}
          <li>
            <Link href="https://www.facebook.com" title="Facebook">
              <i className="fab fa-facebook-f"></i>
            </Link>
          </li>{" "}
          <li>
            <Link href="https://x.com" title="Twitter">
              <i className="fab fa-twitter"></i>
            </Link>
          </li>{" "}
          <li>
            <Link href="https://www.linkedin.com" title="Linkedin">
              <i className="fab fa-linkedin"></i>
            </Link>
          </li>{" "}
          <li>
            <Link href="https://www.instagram.com" title="Instagram">
              <i className="fab fa-instagram"></i>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetailsRight;
