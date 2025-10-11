import { get } from "http";

export const API_URL = `https://backend.lerah.in/api/v1`;
export const API_ENDPOINT = {
  VERIFY_USER: `${API_URL}/user/verify-me `,
  LOGIN: `${API_URL}/user/login`,
  GOOGLE_LOGIN: `${API_URL}/user/google-login`,
  ADD_PRODUCT: `${API_URL}/product`,
  LIST_PRODUCTS: (page, size, search) =>
    `${API_URL}/product/list?page=${page}&size=${size}&search=${search}`,
  ADMIN_PRODUCT_LIST: (page, size, search) =>
    `${API_URL}/product/list/admin?page=${page}&size=${size}&search=${search}`,
  DELETE_PRODUCT: (id) => `${API_URL}/product/${id}`,
  EDIT_PRODUCT: (id) => `${API_URL}/product/${id}`,
  ADMIN_COUPON_LIST: (page, size, search) =>
    `${API_URL}/coupon/list?page=${page}&size=${size}&search=${search}`,
  ADD_COUPON: `${API_URL}/coupon`,
  EDIT_COUPON: (id) => `${API_URL}/coupon/${id}`,
  DELETE_COUPON: (id) => `${API_URL}/coupon/${id}`,
  ADMIN_DASHBOARD: `${API_URL}/admin/dashboard`,
  ADMIN_ORDER_LIST: (page, size, search, filter) =>
    `${API_URL}/order/admin/list?page=${page}&size=${size}&search=${search}&filter=${filter}`,
  PRODUCT_LIST: (page, size, search, filter, category) =>
    `${API_URL}/product/list?&page=${page}&size=${size}&search=${search}&filter=${filter}&category=${encodeURIComponent(
      category
    )}`,
  GET_PRODUCT: (id) => `${API_URL}/product/show/${id}`,
  ADD_TO_CART: `${API_URL}/cart`,
  DELETE_CART_ITEM: (id) => `${API_URL}/cart/${id}`,
  GET_CART: `${API_URL}/cart`,
  APPLY_COUPON: `${API_URL}/coupon/apply`,
  GET_ADDRESS: `${API_URL}/user/address`,
  ADD_ADDRESS: `${API_URL}/user/address`,
  UPDATE_ADDRESS: (id) => `${API_URL}/address/${id}`,
  DELETE_ADDRESS: (id) => `${API_URL}/address/${id}`,
  CREATE_RAZORPAY_ORDER: `${API_URL}/order/place-order/payment-request`,
  VERIFY_RAZORPAY_PAYMENT: (transaction_id) =>
    `${API_URL}/order/transaction/${transaction_id}/verify}`,
  UPDATE_TRANSACTION_STATUS: (transaction_id) =>
    `${API_URL}/order/transaction/${transaction_id}}`,
  DELETE_ORDER: (id) => `${API_URL}/order/${id}`,
  ORDER_LIST: (page, size, search) =>
    `${API_URL}/order/list?page=${page}&size=${size}&search=${search}`,
  UPDATE_ORDER_STATUS: (id) => `${API_URL}/order/status/${id}`,
  CONTACT_US: `${API_URL}/user/contact-us`,
  FORGOT_PASSWORD: `${API_URL}/user/forgot-password`,
  RESET_PASSWORD: `${API_URL}/user/reset-password`,
};
