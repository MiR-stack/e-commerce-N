"use client";
import Features4 from "@/components/sections/features/Features4";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import ProductDetailsPrimary from "@/components/sections/product-details/ProductDetailsPrimary";
import Products5 from "@/components/sections/products/Products5";
import CommonContext from "@/providers/CommonContext";
import productService from "@/services/product.service";
import { useEffect, useState } from "react";

const ProductDetailsMain = ({ title, text, type, isNotSidebar, product }) => {
  // get related products
  const [relatedProducts, setRelatedProducts] = useState();
  const handleProducts = async () => {
    const { data } = await productService.getRelatedProducts(product.id);
    setRelatedProducts(data);
  };

  useEffect(() => {
    handleProducts();
  }, []);

  return (
    <main>
      <HeroPrimary
        title={title ? title : "Product Details"}
        text={text ? text : "Product Details"}
        type={3}
      />
      <CommonContext value={{ type, isNotSidebar }}>
        <ProductDetailsPrimary product={product} />
      </CommonContext>
      <Products5
        isRelated={true}
        title="Related Products"
        tag="// Foods"
        products={{ data: relatedProducts }}
      />
      <Features4 />
    </main>
  );
};

export default ProductDetailsMain;
