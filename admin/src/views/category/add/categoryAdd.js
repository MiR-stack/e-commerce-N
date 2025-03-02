import React, { useEffect } from 'react';
import { useCreateCategoryMutation } from 'store/apis/categories';
import { setCategoryId } from 'store/slices/globalSlice';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CategoryInputs from '../categoryInputs';

function CategoryAdd() {
  const [createCategory, { data }] = useCreateCategoryMutation();

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.id) {
      dispatch(setCategoryId(data.id));
      history.push('/categories/detail');
    }
  }, [data, history, dispatch]);

  return <CategoryInputs submit={createCategory} />;
}

export default CategoryAdd;
