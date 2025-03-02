import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const categoriesAPI = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getCategories: builder.query({
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

        params.append('fields', 'id,name,status,image_data');

        params.append('flat', true);

        // Return the URL with query parameters
        return `/categories?${params.toString()}`;
      },
      providesTags: ['Categories'],
    }),
    getCategory: builder.query({
      query: (id) => `/categories/${id}?fields=name,slug,parent(name,id),description,image_data,status,createdAt,createdBy(name)`,
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation({
      query: ({ data }) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export { categoriesAPI };
export const { useGetCategoriesQuery, useGetCategoryQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoriesAPI;
