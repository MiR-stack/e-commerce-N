import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const authenticationAPI = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/admins`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/login',
        method: 'POST',
        body: { email, password },
      }),
    }),
    getAdmin: builder.mutation({
      query: (token) => ({
        url: '/me',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export { authenticationAPI };
export const { useLoginMutation, useGetAdminMutation } = authenticationAPI;
