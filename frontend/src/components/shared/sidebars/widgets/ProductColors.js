"use client";
import makePath from "@/libs/makePath";
import { useCommonContext } from "@/providers/CommonContext";
import productService from "@/services/product.service";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ProductColors = () => {
  const { currentPath } = useCommonContext();
  const [colors, setColors] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await productService.getColors({
        fields: "name,hex_code,slug",
      });
      setColors(res);
    })();
  }, []);

  return (
    <div className="widget ltn__color-widget">
      <h4 className="ltn__widget-title ltn__widget-title-border">
        Product Color
      </h4>
      <ul>
        {colors?.map((color, idx) => (
          <li key={idx} style={{ backgroundColor: color.hex_code }}>
            <Link
              href={`${currentPath ? currentPath : "/shop"}?color=${
                color.slug
              }`}
            ></Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductColors;
