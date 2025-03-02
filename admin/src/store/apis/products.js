import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const productsAPI = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, limit = 10, search, sortBy, status, sortOrder = 'desc' }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);

        if (search) {
          params.append('search', search);
        }
        if (sortBy) {
          params.append('sortBy', sortBy);
          params.append('sortOrder', sortOrder);
        }
        if (status) {
          params.append('status', status);
        }

        params.append('fields', 'id,name,stock_quantity,sale_price,status,images');

        // Return the URL with query parameters
        return `/products?${params.toString()}`;
      },
      providesTags: ['Products'],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}/details`,
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/products/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
    createImage: builder.mutation({
      query: ({ data }) => ({
        url: '/product-images/upload',
        method: 'POST',
        body: data,
      }),
    }),
    getImage: builder.query({
      query: (id) => `/product-images/${id}`,
      providesTags: ['Images'],
    }),
    deleteImage: builder.mutation({
      query: (id) => ({
        url: `/product-images/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export { productsAPI };
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateImageMutation,
  useGetImageQuery,
  useDeleteImageMutation,
} = productsAPI;
