import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/dashboard`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => `/stats`,
    }),
  }),
});

export { dashboardApi };
export const { useGetDashboardStatsQuery } = dashboardApi;
