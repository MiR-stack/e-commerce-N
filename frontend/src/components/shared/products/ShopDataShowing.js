import React from "react";

const ShopDataShowing = ({ limit, totalItems, firstItem, lastItem }) => {
  return (
    <div className="showing-product-number text-right">
      <span>
        Showing{" "}
        {firstItem === lastItem || totalItems <= limit
          ? totalItems
          : `${firstItem}–${
              lastItem > totalItems ? totalItems : lastItem
            }`}{" "}
        of {totalItems} results
      </span>
    </div>
  );
};

export default ShopDataShowing;
