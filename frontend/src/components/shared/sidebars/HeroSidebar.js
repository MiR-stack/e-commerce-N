"use client";
import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import productService from "@/services/product.service";

const HeroSidebar = ({ type, categoryData }) => {
  const [categories, setCategories] = useState();
  const [pagination, setPagination] = useState();

  // set server side featched categories
  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData?.data);
      setPagination(categoryData?.pagination);
    }
  }, [categoryData]);

  // get more categories
  const getMoreCategories = async (limit = 1) => {
    if (!pagination) return;
    if (pagination.totalPages <= pagination.page) return;

    // get page number
    const page = Math.ceil(pagination.limit / limit + pagination.page);
    if (!page) return;

    // get categories
    const moreCategories = await productService.getCategories({
      fields: "id,name,slug,children(id,name,slug)",
      page,
      limit,
    });

    // update states
    setCategories([...categories, ...moreCategories?.data]);
    setPagination(moreCategories?.pagination);
  };

  // handle lesss categories
  const handleLess = () => {
    setCategories(categoryData?.data);
    setPagination(categoryData?.pagination);
  };

  // handle control buttons
  const Buttons = () => {
    if (pagination && pagination.totalPages > pagination.page) {
      return (
        <div className="category_btn--ml " onClick={() => getMoreCategories(2)}>
          More categories <span className="cat-thumb  icon-plus"></span>
        </div>
      );
    }

    if (categories?.length > categoryData?.pagination.limit) {
      return (
        <div className="category_btn--ml" onClick={handleLess}>
          close menu <span className="cat-thumb  icon-remove"></span>
        </div>
      );
    }

    return <></>;
  };

  return (
    <div className="ltn__category-menu-wrap">
      <div className="ltn__category-menu-title">
        <h2
          className={
            type === 2
              ? ` section-bg-2 ltn__secondary-bg text-color-white`
              : "section-bg-1"
          }
        >
          categories
        </h2>
      </div>
      <div className="ltn__category-menu-toggle ltn__one-line-active">
        <ul>
          {/* <!-- Submenu Column - unlimited --> */}

          {categories?.map((item) => (
            <CategoryItem key={item.id} item={item} />
          ))}

          {/* show more controllers */}
          <li className="ltn__category-menu-more-item-parent">
            <Buttons />
          </li>
          {/* <!-- Single menu end --> */}
        </ul>
      </div>
    </div>
  );
};

export default HeroSidebar;
