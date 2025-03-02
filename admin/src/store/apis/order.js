import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/orders`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ page = 1, limit = 10, search }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);

        if (search) {
          params.append('search', search);
        }

        return `?${params}`;
      },
      providesTags: ['Orders'],
    }),
    getOrder: builder.query({
      query: (id) => `/${id}`,
      providesTags: ['Orders'],
    }),
    updateStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export { ordersApi };
export const { useGetOrderQuery, useGetOrdersQuery, useUpdateStatusMutation, useCancelOrderMutation } = ordersApi;
