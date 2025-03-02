import { MONEY_SIGN } from "@/constants";
import countDiscount from "@/libs/countDiscount";
import modifyAmount from "@/libs/modifyAmount";
import sliceText from "@/libs/sliceText";
import { getImageUrl } from "@/utils/getImageUrl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TopRatedProductCard = ({ product, isShowDisc }) => {
  const { name, base_price, sale_price, images, id } = product;
  const netPriceModified = modifyAmount(sale_price);
  const priceModified = modifyAmount(base_price);

  const image = getImageUrl(images[0].image_data.url);

  return (
    <div className="top-rated-product-item clearfix">
      <div className="top-rated-product-img">
        <Link href={`/products/${id}`}>
          <Image
            src={image}
            alt={images[0].alt_text}
            width={1000}
            height={1000}
          />
        </Link>
      </div>
      <div className="top-rated-product-info">
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
                <i className="fas fa-star"></i>
              </Link>
            </li>{" "}
            <li>
              <Link href="#">
                <i className="fas fa-star"></i>
              </Link>
            </li>
          </ul>
        </div>
        <h6>
          <Link href={`/products/${id}`}>{sliceText(name, 25)}</Link>
        </h6>
        <div className="product-price">
          <span>
            {MONEY_SIGN}
            {netPriceModified}
          </span>
          <del>
            {MONEY_SIGN}
            {priceModified}
          </del>
        </div>
      </div>
    </div>
  );
};

export default TopRatedProductCard;
