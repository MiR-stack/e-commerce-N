import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const paymentMethodsApi = createApi({
  reducerPath: 'paymentMethodsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/payment-methods`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Methods'],
  endpoints: (builder) => ({
    getMethods: builder.query({
      query: () => '/',
      providesTags: ['Methods'],
    }),

    createMethod: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Methods'],
    }),

    deleteMethod: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Methods'],
    }),
    getMethod: builder.query({
      query: (id) => `/${id}`,
      providesTags: ['Methods'],
    }),
    updateMethod: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Methods'],
    }),
  }),
});

export { paymentMethodsApi };
export const { useCreateMethodMutation, useDeleteMethodMutation, useGetMethodQuery, useGetMethodsQuery, useUpdateMethodMutation } = paymentMethodsApi;
