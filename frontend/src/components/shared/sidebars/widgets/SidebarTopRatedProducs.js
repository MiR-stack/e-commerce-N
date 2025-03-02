import getAllProducts from "@/libs/getAllProducts";
import TopRatedProductCard from "../../cards/TopRatedProductCard";
import productService from "@/services/product.service";
import { useEffect, useState } from "react";

const SidebarTopRatedProducs = () => {
  const [products, setProducts] = useState();
  const handleProdcut = async () => {
    const { data } = await productService.getProducts({
      sortBy: "topRated",
      limit: 4,
      fields: "name,id,sale_price,base_price,images",
    });
    setProducts(data);
  };

  useEffect(() => {
    handleProdcut();
  }, []);

  return (
    <div className="widget ltn__top-rated-product-widget">
      <h4 className="ltn__widget-title ltn__widget-title-border">
        Top Rated Product
      </h4>
      <ul>
        {products?.map((product, idx) => (
          <li key={idx}>
            <TopRatedProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarTopRatedProducs;
