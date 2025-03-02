"use client";
import makePath from "@/libs/makePath";
import { useCommonContext } from "@/providers/CommonContext";
import productService from "@/services/product.service";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ProductCategories = () => {
  const { currentPath, category: currentCategory } = useCommonContext();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await productService.getCategories({
        fields: "name,slug",
        limit: 7,
      });

      setCategories(res.data);
    })();
  }, []);

  return (
    <div className="widget ltn__menu-widget">
      <h4 className="ltn__widget-title ltn__widget-title-border">
        Product categories
      </h4>
      <ul>
        {categories?.map((category, idx) => (
          <li key={idx}>
            <Link
              href={`${currentPath ? currentPath : "/shop"}?category=${
                category.slug
              }`}
              className={currentCategory === category.slug ? "active" : ""}
            >
              {category.name}
              <span>
                <i className="fas fa-long-arrow-alt-right"></i>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCategories;
