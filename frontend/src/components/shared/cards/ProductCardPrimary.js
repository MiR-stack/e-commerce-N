"use client";
import { MONEY_SIGN } from "@/constants";
import countDiscount from "@/libs/countDiscount";
import modifyAmount from "@/libs/modifyAmount";
import { useCartContext } from "@/providers/CartContext";
import { useProductContext } from "@/providers/ProductContext";
import { useWishlistContext } from "@/providers/WshlistContext";
import { getImageUrl } from "@/utils/getImageUrl";
import { isNewProduct } from "@/utils/isNewProduct";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCardPrimary = ({ product, isShowDisc }) => {
  const { name, sale_price, base_price, images, id, createdAt } = product
    ? product
    : {};

  const disc = Math.round((1 - Number(sale_price) / Number(base_price)) * 100);
  const { setCurrentProduct } = useProductContext();
  const netPriceModified = modifyAmount(sale_price);
  const priceModified = modifyAmount(base_price);
  const { addProductToCart } = useCartContext();
  const { addProductToWishlist } = useWishlistContext();
  const image = {
    url: getImageUrl(images?.[0].image_data.url),
    alt: images?.[0].alt_text || "product image",
  };

  product = { ...product, image };

  const cartProduct = {
    id,
    image: image.url,
    title: name,
    price: sale_price,
    base_price: base_price,
    quantity: 1,
  };

  let status;
  if (isNewProduct(createdAt)) {
    status = "new";
  }
  if (sale_price !== base_price) {
    status = "sale";
  }

  return (
    <div
      className="ltn__product-item ltn__product-item-3 text-center"
      onClick={() => setCurrentProduct(product)}
    >
      <div className="product-img">
        <Link href={`/products/${id}`}>
          <Image
            className="product-card--primary__image"
            src={image.url}
            alt={image.alt || "product image"}
            width={1000}
            height={1000}
            // placeholder="blur"
          />
        </Link>
        {status || isShowDisc ? (
          <div className="product-badge">
            <ul>
              {isShowDisc ? (
                <li className="sale-badge">-{disc}%</li>
              ) : status === "sale" ? (
                <li className="new-badge">{status}</li>
              ) : (
                <li className="sale-badge">{status}</li>
              )}
            </ul>
          </div>
        ) : (
          ""
        )}
        <div className="product-hover-action">
          <ul>
            <li>
              <Link
                href="#"
                title="Quick View"
                data-bs-toggle="modal"
                data-bs-target="#quick_view_modal"
              >
                <i className="far fa-eye"></i>
              </Link>
            </li>{" "}
            <li>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  addProductToCart(cartProduct);
                }}
                href="#"
                title="Add to Cart"
                data-bs-toggle="modal"
                data-bs-target="#add_to_cart_modal"
              >
                <i className="fas fa-shopping-cart"></i>
              </Link>
            </li>{" "}
            <li>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  addProductToWishlist(cartProduct);
                }}
                href="#"
                title="Wishlist"
                data-bs-toggle="modal"
                data-bs-target="#liton_wishlist_modal"
              >
                <i className="far fa-heart"></i>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="product-info">
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
            </li>
          </ul>
        </div>
        <h2 className="product-title">
          <Link href={`/products/${id}`}>{name}</Link>
        </h2>
        <div className="product-price">
          <span>
            {MONEY_SIGN}
            {netPriceModified}
          </span>{" "}
          {netPriceModified !== priceModified && (
            <del>
              {MONEY_SIGN}
              {priceModified}
            </del>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCardPrimary;
