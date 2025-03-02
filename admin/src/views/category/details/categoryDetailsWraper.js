import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetCategoryQuery } from 'store/apis/categories';
import CategoryDetails from './categoryDetails';

function CategoryDetailsWraper() {
  const categoryId = useSelector((state) => state.global.categoryId);
  const history = useHistory();

  if (!categoryId) {
    history.push('/categories/list');
    return <div />;
  }

  const { data } = useGetCategoryQuery(categoryId);

  if (data) {
    return <CategoryDetails data={{ ...data, id: categoryId }} />;
  }

  return <div />;
}

export default CategoryDetailsWraper;
