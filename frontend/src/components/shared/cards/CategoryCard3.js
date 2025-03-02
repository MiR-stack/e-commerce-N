import { getImageUrl } from "@/utils/getImageUrl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoryCard3 = ({ category }) => {
  const { name, image_data, slug, _count } = category;

  const image = getImageUrl(image_data?.url);

  return (
    <div className="ltn__category-item ltn__category-item-3 text-center">
      <div className="ltn__category-item-img">
        <Link href={`shop?cat=${slug}`}>
          <Image
            className="category__image--avatar"
            src={image}
            alt={image_data.alt_text}
            width={103}
            height={99}
          />
        </Link>
      </div>
      <div className="ltn__category-item-name">
        <h5>
          <Link href={`shop?cat=${slug}`}>{name}</Link>
        </h5>
        <h6>({_count.products} items)</h6>
      </div>
    </div>
  );
};

export default CategoryCard3;
