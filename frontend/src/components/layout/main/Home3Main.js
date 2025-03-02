import CallToAction3 from "@/components/sections/call-to-action/CallToAction3";
import Categories3 from "@/components/sections/categories/Categories3";
import Features5 from "@/components/sections/features/Features5";
import Hero15 from "@/components/sections/hero-banners/Hero15";
import Products3 from "@/components/sections/products/Products3";
import Products5 from "@/components/sections/products/Products5";
import { api } from "@/libs/api";
import React from "react";

const Home3Main = async () => {
  const products = await api.products.list({
    fields:
      "name,id,slug,images,base_price,sale_price,colors(id,name,hex_code),sizes(id,name)",
    special: true,
    limit: 6,
  });
  return (
    <main>
      <Hero15 />
      <Features5 type={2} />

      <Products3
        isSmallTitle={true}
        isDouble={true}
        desc="A highly efficient slip-ring scanner for today's diagnostic requirements."
      />
      <Categories3 type={2} />
      <Products5 products={products} />
      <CallToAction3 />
    </main>
  );
};

export default Home3Main;
