// import redux and persist plugins
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import persistStore from 'reduxjs-toolkit-persist/es/persistStore';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'reduxjs-toolkit-persist/es/constants';

// import theme reducers
import settingsReducer from 'settings/settingsSlice';
import layoutReducer from 'layout/layoutSlice';
import langReducer from 'lang/langSlice';
import authReducer from 'auth/authSlice';
import menuReducer from 'layout/nav/main-menu/menuSlice';
import notificationReducer from 'layout/nav/notifications/notificationSlice';
import scrollspyReducer from 'components/scrollspy/scrollspySlice';
import globalReducer from 'store/slices/globalSlice';

// import persist key
import { REDUX_PERSIST_KEY } from 'config.js';

import { authenticationAPI } from 'store/apis/auth';
import { productsAPI } from 'store/apis/products';
import { categoriesAPI } from 'store/apis/categories';
import { attributesApi } from 'store/apis/attributes';
import { bannersApi } from 'store/apis/banner';
import { deliveryAreaApi } from 'store/apis/deliveryArea';
import { paymentMethodsApi } from 'store/apis/paymetnMethods';
import { ordersApi } from 'store/apis/order';
import { customersApi } from 'store/apis/customers';
import { dashboardApi } from 'store/apis/dashboard';
import { settingsApi } from 'store/apis/setting';

const persistConfig = {
  key: REDUX_PERSIST_KEY,
  storage,
  whitelist: ['menu', 'settings', 'lang'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    settings: settingsReducer,
    layout: layoutReducer,
    lang: langReducer,
    auth: authReducer,
    menu: menuReducer,
    notification: notificationReducer,
    scrollspy: scrollspyReducer,
    global: globalReducer,
    [authenticationAPI.reducerPath]: authenticationAPI.reducer,
    [productsAPI.reducerPath]: productsAPI.reducer,
    [categoriesAPI.reducerPath]: categoriesAPI.reducer,
    [attributesApi.reducerPath]: attributesApi.reducer,
    [bannersApi.reducerPath]: bannersApi.reducer,
    [deliveryAreaApi.reducerPath]: deliveryAreaApi.reducer,
    [paymentMethodsApi.reducerPath]: paymentMethodsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [customersApi.reducerPath]: customersApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
  })
);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authenticationAPI.middleware,
      productsAPI.middleware,
      categoriesAPI.middleware,
      attributesApi.middleware,
      bannersApi.middleware,
      deliveryAreaApi.middleware,
      paymentMethodsApi.middleware,
      ordersApi.middleware,
      customersApi.middleware,
      dashboardApi.middleware,
      settingsApi.middleware
    ),
});
const persistedStore = persistStore(store);
export { store, persistedStore };
