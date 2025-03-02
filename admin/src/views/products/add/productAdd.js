import React from 'react';
import { useCreateProductMutation } from 'store/apis/products';
import ProductInputsWraper from '../productInputs/productInputsWraper';

function ProductAdd() {
  const [createProduct, { data }] = useCreateProductMutation();

  return <ProductInputsWraper submit={createProduct} productId={data?.id} />;
}

export default ProductAdd;
