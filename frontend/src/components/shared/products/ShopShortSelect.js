"use client";
import getNiceSelectValue from "@/libs/getNiceSelectValue";
import { useEffect } from "react";

const selectInputs = [
  {
    value: "createdAt:desc",
    name: "Default Sorting",
  },
  {
    value: "popular:desc",
    name: "Sort by popularity",
  },
  {
    value: "createdAt:desc",
    name: "Sort by new arrivals",
  },
  {
    value: "sale_price:asc",
    name: "Sort by price: low to high",
  },
  {
    value: "sale_price:desc",
    name: "Sort by price: high to low",
  },
];
const ShopShortSelect = ({ handleSort }) => {
  useEffect(() => {
    getNiceSelectValue(handleSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="short-by text-center">
      <select className="nice-select">
        {selectInputs?.map(({ value, name }, idx) => (
          <option value={value} key={idx}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ShopShortSelect;
