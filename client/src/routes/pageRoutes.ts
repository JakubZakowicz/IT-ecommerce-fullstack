export const pageRoutes = {
  root: () => '/',
  categories: (id: number) => `/categories/${id}`,
  products: (id: number) => `/products/${id}`,
  singIn: () => '/sign-in',
  signUp: () => '/sign-up',
  cart: () => '/cart',
  checkout: () => '/checkout',
  forgotPassword: () => '/forgot-password',
  accountDetails: () => '/account-details',
  editAccountDetails: () => '/account-details/edit',
};