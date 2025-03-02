"use client";
import makePath from "@/libs/makePath";
import { useCommonContext } from "@/providers/CommonContext";
import productService from "@/services/product.service";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ProductSizes = () => {
  const { currentPath, size: currentSize } = useCommonContext();
  // const sizes = ["S", "M", "L", "XL", "XXL"];

  const [sizes, setSizes] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await productService.getSizes({ fields: "name,slug" });
      setSizes(res);
    })();
  }, []);
  return (
    <div className="widget ltn__tagcloud-widget ltn__size-widget">
      <h4 className="ltn__widget-title ltn__widget-title-border">
        Product Size
      </h4>
      <ul>
        {sizes?.map((size, idx) => (
          <li key={idx}>
            <Link
              href={`${currentPath ? currentPath : "/shop"}?size=${size.slug}`}
              className={currentSize === size.slug ? "active" : ""}
            >
              {size.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSizes;
