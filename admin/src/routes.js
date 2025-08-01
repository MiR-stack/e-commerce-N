/* eslint-disable */
import { lazy } from 'react';
import { DEFAULT_PATHS } from 'config.js';

const dashboard = lazy(() => import('views/dashboard/Dashboard'));
const products = {
  list: lazy(() => import('views/products/list/ProductsList')),
  detail: lazy(() => import('views/products/detail/ProductsDetail')),
  add: lazy(() => import('views/products/add/productAdd')),
};
const orders = {
  list: lazy(() => import('views/orders/list/OrdersList')),
  detail: lazy(() => import('views/orders/detail/OrdersDetail')),
};
const categories = {
  list: lazy(() => import('views/category/list/categoryList')),
  add: lazy(() => import('views/category/add/categoryAdd')),
  detail: lazy(() => import('views/category/details/categoryDetailsWraper')),
};
const customers = {
  list: lazy(() => import('views/customers/list/CustomersList')),
  detail: lazy(() => import('views/customers/detail/CustomersDetail')),
};

// const storefront = {
//   home: lazy(() => import('views/storefront/home/Home')),
//   filters: lazy(() => import('views/storefront/filters/Filters')),
//   categories: lazy(() => import('views/storefront/categories/Categories')),
//   detail: lazy(() => import('views/storefront/detail/Detail')),
//   cart: lazy(() => import('views/storefront/cart/Cart')),
//   checkout: lazy(() => import('views/storefront/checkout/Checkout')),
//   invoice: lazy(() => import('views/storefront/invoice/Invoice')),
// };
const shipping = lazy(() => import('views/shipping/Shipping'));
const discount = lazy(() => import('views/discount/Discount'));

const settings = {
  home: lazy(() => import('views/settings/home/Home')),
  general: lazy(() => import('views/settings/general/General')),
  attributes: lazy(() => import('views/settings/attributes/Attributes')),
  banners: lazy(() => import('views/settings/banners/banners')),
  areas: lazy(() => import('views/settings/deliveryArea/deliveryArea')),
  paymentMethods: lazy(() => import('views/settings/paymentMethods/method')),
  others: lazy(() => import('views/settings/others/others')),
};

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      exact: true,
      redirect: true,
      to: `${appRoot}/dashboard`,
    },
    {
      path: `${appRoot}/dashboard`,
      component: dashboard,
      protected: true,
      label: 'menu.dashboard',
      icon: 'shop',
    },
    {
      path: `${appRoot}/products`,
      exact: true,
      redirect: true,
      protected: true,
      to: `${appRoot}/products/list`,
      label: 'menu.products',
      icon: 'cupcake',
      subs: [
        { path: '/list', label: 'menu.list', component: products.list },
        { path: '/detail', label: 'menu.detail', component: products.detail },
        { path: '/add', label: 'menu.add', component: products.add },
      ],
    },
    {
      path: `${appRoot}/orders`,
      exact: true,
      redirect: true,
      protected: true,
      to: `${appRoot}/orders/list`,
      label: 'menu.orders',
      icon: 'cart',
      subs: [
        { path: '/list', label: 'menu.list', component: orders.list },
        { path: '/detail', label: 'menu.detail', component: orders.detail },
      ],
    },
    {
      path: `${appRoot}/categories`,
      exact: true,
      redirect: true,
      protected: true,
      to: `${appRoot}/categories/add`,
      label: 'menu.categories',
      icon: 'folders',
      subs: [
        { path: '/list', label: 'menu.list', component: categories.list },
        { path: '/add', label: 'menu.add', component: categories.add },
        { path: '/detail', label: 'menu.detail', component: categories.detail },
      ],
    },
    {
      path: `${appRoot}/customers`,
      exact: true,
      redirect: true,
      protected: true,

      to: `${appRoot}/customers/list`,
      label: 'menu.customers',
      icon: 'user',
      subs: [
        { path: '/list', label: 'menu.list', component: customers.list },
        { path: '/detail', label: 'menu.detail', component: customers.detail },
      ],
    },
    // {
    //   path: `${appRoot}/storefront`,
    //   exact: true,
    //   redirect: true,
    //   protected: true,
    //   to: `${appRoot}/storefront/home`,
    //   label: 'menu.storefront',
    //   icon: 'screen',
    //   subs: [
    //     { path: '/home', label: 'menu.home', component: storefront.home },
    //     { path: '/filters', label: 'menu.filters', component: storefront.filters },
    //     { path: '/categories', label: 'menu.categories', component: storefront.categories },
    //     { path: '/detail', label: 'menu.detail', component: storefront.detail },
    //     { path: '/cart', label: 'menu.cart', component: storefront.cart },
    //     { path: '/checkout', label: 'menu.checkout', component: storefront.checkout },
    //     { path: '/invoice', label: 'menu.invoice', component: storefront.invoice },
    //   ],
    // },
    {
      path: `${appRoot}/shipping`,
      component: shipping,
      protected: true,
      label: 'menu.shipping',
      icon: 'shipping',
    },
    {
      path: `${appRoot}/discount`,
      component: discount,
      protected: true,
      label: 'menu.discount',
      icon: 'tag',
    },
    {
      path: `${appRoot}/settings`,
      component: settings.home,
      protected: true,
      label: 'menu.settings',
      icon: 'gear',
      subs: [
        { path: '/general', component: settings.general, hideInMenu: true },
        { path: '/attributes', component: settings.attributes, hideInMenu: true },
        { path: '/banners', component: settings.banners, hideInMenu: true },
        { path: '/delivery-area', component: settings.areas, hideInMenu: true },
        { path: '/payment-methods', component: settings.paymentMethods, hideInMenu: true },
      ],
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;
