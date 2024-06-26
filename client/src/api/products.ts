import { apiRoutes } from '../routes/apiRoutes';
import { useFetch } from '../utils/reactQuery.utils';
import { pathToUrl } from '../utils/router.utils';
import { Product, ProductData } from '../utils/types';

export const useGetProducts = (
  categoryId?: string,
  page?: number,
  sort?: string
) =>
  useFetch<ProductData>(
    `${apiRoutes.getProducts}?${
      categoryId && `category_id=${categoryId}&`
    }page=${page || 1}&size=20${sort && `&sort=${sort}`}`
  );

export const useGetProduct = (slug: string) =>
  useFetch<Product>(pathToUrl(apiRoutes.getProduct, { slug }));
