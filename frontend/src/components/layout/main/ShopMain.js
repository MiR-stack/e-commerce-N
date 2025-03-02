"use client";
import Features4 from "@/components/sections/features/Features4";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import ProductsPrimary from "@/components/sections/products/ProductsPrimary";
import getRangeValue from "@/libs/getRangeValue";
import makeText from "@/libs/makeText";
import CommonContext from "@/providers/CommonContext";
import productService from "@/services/product.service";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ShopMain = ({ title, isSidebar, text, currentTapId }) => {
  const category = useSearchParams()?.get("category");
  const brand = useSearchParams()?.get("brand");
  const tag = useSearchParams()?.get("tag");
  const size = useSearchParams()?.get("size");
  const color = useSearchParams()?.get("color");
  const search = useSearchParams()?.get("search");
  const currentPath = usePathname();

  // handle price range
  const [rangeValue, setRangeValue] = useState(null);
  const maxSize = 5000;
  const intLowerLimit = 50;
  const intUpperLimit = 1500;

  useEffect(() => {
    getRangeValue(setRangeValue, maxSize, intLowerLimit, intUpperLimit, true);
    setRangeValue(null);
  }, [
    category,
    tag,
    size,
    color,
    search,
    intLowerLimit,
    maxSize,
    intUpperLimit,
  ]);
  useEffect(() => {
    getRangeValue(setRangeValue, maxSize, intLowerLimit, intUpperLimit);
  }, [intLowerLimit, intUpperLimit, maxSize]);

  // handle sort
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const handleSort = (sortStr) => {
    const [sortBy, sortOrder] = sortStr.split(":");
    setSort({ sortBy, sortOrder });
  };

  // pagination
  const [pagination, setPagination] = useState();

  const [page, setPage] = useState(1);
  const handlePage = (pageNumber) => {
    setPage(pageNumber);
  };
  // get products
  const [products, setProducts] = useState([]);
  useEffect(() => {
    (async () => {
      let minPrice;
      let maxPrice;
      if (rangeValue) {
        const [min_price, max_price] = rangeValue?.split("-");
        minPrice = Number(min_price);
        maxPrice = Number(max_price);
      }

      const res = await productService.getProducts({
        search,
        fields:
          "name,id,slug,meta_description,images,base_price,sale_price,colors(id,name,hex_code),sizes(id,name)",
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
        minPrice,
        maxPrice,
        category,
        color,
        size,
        page,
        limit: 9,
      });
      setProducts(res.data);
      setPagination(res.pagination);
    })();
  }, [search, sort, rangeValue, category, color, size, page]);

  return (
    <main>
      <HeroPrimary
        title={
          category
            ? `Category: ${makeText(category)}`
            : brand
            ? `Brand: ${makeText(brand)}`
            : size
            ? `Product Size: ${makeText(size)}`
            : tag
            ? `Tag: ${makeText(tag)}`
            : color
            ? `Product  Color: ${makeText(color)}`
            : search
            ? `Search: ${makeText(search)}`
            : title
            ? title
            : "Shop"
        }
        text={text ? text : "Shop"}
        type={isSidebar === "primary" ? 2 : 3}
        isCapitalize={brand ? true : false}
      />
      <CommonContext
        value={{
          isShop: true,
          currentPath,
          category,
          brand,
          tag,
          size,
        }}
      >
        <ProductsPrimary
          isSidebar={isSidebar}
          currentTapId={currentTapId}
          handleSort={handleSort}
          products={products}
          pagination={pagination}
          handlePage={handlePage}
        />
      </CommonContext>
      <Features4 />
    </main>
  );
};

export default ShopMain;
