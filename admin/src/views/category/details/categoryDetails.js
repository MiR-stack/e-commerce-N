import React from 'react';
import { useUpdateCategoryMutation } from 'store/apis/categories';

import CategoryInputs from '../categoryInputs';

function CategoryDetails({ data }) {
  const [updateCategory] = useUpdateCategoryMutation();

  if (data) {
    return <CategoryInputs categoryData={data} submit={updateCategory} />;
  }

  return <div />;
}

export default CategoryDetails;
