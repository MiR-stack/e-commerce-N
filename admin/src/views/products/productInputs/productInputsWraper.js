import React from 'react';
import { useGetCategoriesQuery } from 'store/apis/categories';
import { useGetColorsQuery, useGetSizesQuery } from 'store/apis/attributes';
import ProductInputs from './productInputs';

function ProductInputsWraper({ defaultData, submit, productId }) {
  // fetch all categories
  const { data: categories } = useGetCategoriesQuery({ limit: 100 });
  const { data: sizes } = useGetSizesQuery();
  const { data: colors } = useGetColorsQuery();

  return <ProductInputs InputData={{ categories: categories?.data, sizes, colors }} defaultData={defaultData} submit={submit} productId={productId} />;
}

export default ProductInputsWraper;
