import Link from "next/link";
import React from "react";

const CategoryItem = ({ item, isMore }) => {
  const { name, children, slug } = item;
  const totalSections = children?.length;
  return (
    <li
      className={`${
        isMore
          ? "ltn__category-menu-more-item-child"
          : "ltn__category-menu-item ltn__category-menu-drop"
      }`}
    >
      <Link href={`/shop?category=${slug}`}>{name}</Link>
      {/* dropdown */}
      {children.length > 0 ? (
        <ul
          className={`ltn__category-submenu ltn__category-column-${totalSections}`}
        >
          {children?.map((item) => (
            <li key={item.id}>
              <Link href={`/shop?category=${item.slug}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}
    </li>
  );
};

export default CategoryItem;
