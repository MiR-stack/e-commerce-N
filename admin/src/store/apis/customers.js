import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const customersApi = createApi({
  reducerPath: 'customersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/customers`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Customers'],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({ search, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();

        if (search) {
          params.append('search', search);
        }

        params.append('fields', 'name,id,address,number,is_blocked');
        params.append('page', page);
        params.append('limit', limit);

        return `?${params}`;
      },
      providesTags: ['Customers'],
    }),
    getCustomer: builder.query({
      query: (id) => `/${id}`,
      providesTags: ['Customers'],
    }),

    getCustomerStats: builder.query({
      query: (id) => `/${id}/stats`,
      providesTags: ['Customers'],
    }),
    getCustomerRecentOrders: builder.query({
      query: (id) => `/${id}/recent-orders`,
      providesTags: ['Customers'],
    }),
    customerBlockToggle: builder.mutation({
      query: (id) => ({
        url: `/${id}/toggle-block`,
        method: 'GET',
      }),
      invalidatesTags: ['Customers'],
    }),
  }),
});

export { customersApi };
export const { useGetCustomersQuery, useCustomerBlockToggleMutation, useGetCustomerQuery, useGetCustomerRecentOrdersQuery, useGetCustomerStatsQuery } =
  customersApi;
