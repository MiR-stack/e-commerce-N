import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const attributesApi = createApi({
  reducerPath: 'attributesApi',
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
  tagTypes: ['Attributes'],
  endpoints: (builder) => ({
    getColors: builder.query({
      query: () => {
        const params = new URLSearchParams();

        params.append('fields', 'id,name,hex_code');

        // Return the URL with query parameters
        return `/colors?${params.toString()}`;
      },
      providesTags: ['Attributes'],
    }),

    createColor: builder.mutation({
      query: (data) => ({
        url: '/colors',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attributes'],
    }),

    deleteColor: builder.mutation({
      query: (id) => ({
        url: `/colors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attributes'],
    }),
    getSizes: builder.query({
      query: () => {
        const params = new URLSearchParams();

        params.append('fields', 'id,name');

        // Return the URL with query parameters
        return `/sizes?${params.toString()}`;
      },
      providesTags: ['Attributes'],
    }),

    createSize: builder.mutation({
      query: (data) => ({
        url: '/sizes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attributes'],
    }),

    deleteSize: builder.mutation({
      query: (id) => ({
        url: `/sizes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attributes'],
    }),
  }),
});

export { attributesApi };
export const { useCreateColorMutation, useGetColorsQuery, useDeleteColorMutation, useCreateSizeMutation, useGetSizesQuery, useDeleteSizeMutation } =
  attributesApi;
