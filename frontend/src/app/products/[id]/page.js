import ProductDetailsMain from "@/components/layout/main/ProductDetailsMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { api } from "@/libs/api";
import { notFound } from "next/navigation";

const ProductDetails = async ({ params }) => {
  const { id } = params;

  const product = await api.products.getById({
    id,
    fields:
      "reviews_count,name,id,images,description,sale_price,base_price,categories(name,id),colors(id,name,hex_code),sizes(id,name)",
  });

  if (!product) {
    return notFound();
  }

  return (
    <PageWrapper
      isNotHeaderTop={true}
      isHeaderRight={true}
      isTextWhite={true}
      isNavbarAppointmentBtn={true}
    >
      <ProductDetailsMain type={1} product={product} />
    </PageWrapper>
  );
};

export default ProductDetails;
