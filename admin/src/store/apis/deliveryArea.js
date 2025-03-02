import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const deliveryAreaApi = createApi({
  reducerPath: 'deliveryAreaApi',
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
  tagTypes: ['Area'],
  endpoints: (builder) => ({
    getDeliveryAreas: builder.query({
      query: () => {
        // Return the URL with query parameters
        return `/delivery-area`;
      },
      providesTags: ['Area'],
    }),

    createDeliveryArea: builder.mutation({
      query: (data) => ({
        url: '/delivery-area',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Area'],
    }),

    deleteDeliveryArea: builder.mutation({
      query: (id) => ({
        url: `/delivery-area/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Area'],
    }),
    getDeliveryArea: builder.query({
      query: (id) => `/delivery-area/${id}`,
      providesTags: ['Area'],
    }),
    updateDeliveryArea: builder.mutation({
      query: ({ id, data }) => ({
        url: `/delivery-area/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Area'],
    }),
  }),
});

export { deliveryAreaApi };
export const {
  useCreateDeliveryAreaMutation,
  useUpdateDeliveryAreaMutation,
  useGetDeliveryAreaQuery,
  useGetDeliveryAreasQuery,
  useDeleteDeliveryAreaMutation,
} = deliveryAreaApi;
