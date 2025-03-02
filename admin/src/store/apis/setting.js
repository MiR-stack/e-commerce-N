import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const settingsApi = createApi({
  reducerPath: 'settingsApi',
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
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),

    updateSettings: builder.mutation({
      query: (data) => ({
        url: '/settings',
        method: 'Put',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export { settingsApi };
export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
