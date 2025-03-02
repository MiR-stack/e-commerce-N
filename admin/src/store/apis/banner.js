import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const bannersApi = createApi({
  reducerPath: 'bannersApi',
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
  tagTypes: ['Banners'],
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: () => {
        const params = new URLSearchParams();

        params.append('fields', 'id,title,sub_title,image_data');

        // Return the URL with query parameters
        return `/banners?${params.toString()}`;
      },
      providesTags: ['Banners'],
    }),

    createBanner: builder.mutation({
      query: (data) => ({
        url: '/banners/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Banners'],
    }),

    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banners'],
    }),
    getBanner: builder.query({
      query: (id) => `/banners/${id}`,
      providesTags: ['Banners'],
    }),
    updateBanner: builder.mutation({
      query: ({ id, data }) => ({
        url: `/banners/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Banners'],
    }),
  }),
});

export { bannersApi };
export const { useCreateBannerMutation, useDeleteBannerMutation, useGetBannerQuery, useGetBannersQuery, useUpdateBannerMutation } = bannersApi;
