import React from 'react';
import { useHistory } from 'react-router-dom';
import { useGetProductQuery, useUpdateProductMutation } from 'store/apis/products';
import { useSelector } from 'react-redux';
import 'quill/dist/quill.bubble.css';

import ProductInputsWraper from '../productInputs/productInputsWraper';

const ProductsDetail = () => {
  const title = 'Product Detail';
  const description = 'Ecommerce Product Detail Page';

  const productId = useSelector((state) => state.global.productId);
  const history = useHistory();
  if (!productId) {
    history.push('/products/list');
  }
  const { data } = useGetProductQuery(productId);
  const [updateProduct] = useUpdateProductMutation();

  // let defautlData = {};

  // if (data) {
  //   const { name, slug, sku } = data;
  //   defautlData = {
  //     stock_status: data.stock_status,
  //     name,
  //     slug,
  //     sku,
  //     base_price: data.base_price,
  //     sale_price: data.sale_price,
  //     stock_quantity: data.stock_quantity,
  //     meta_title: data.meta_title,
  //     meta_description: data.meta_description,
  //     status: data.status,
  //   };
  // }
  if (data) {
    return <ProductInputsWraper defaultData={data} submit={updateProduct} />;
  }
  return <div />;
};

export default ProductsDetail;
