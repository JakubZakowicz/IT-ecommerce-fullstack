'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Rating,
  Typography,
} from '@mui/material';
import { pageRoutes } from '@/src/routes/pageRoutes';
import { ProductData } from '@/src/utils/types';
import { convertPrice } from '@/src/utils/functions.utils';
import Pagination from '../Pagination';

interface ProductsInterface {
  name: string;
  productsData?: ProductData;
}

const Products = ({ name, productsData }: ProductsInterface) => {
  const { products, pageCount } = productsData || {};
  const router = useRouter();

  if (products?.length === 0)
    return (
      <Box>
        <Typography
          sx={{
            textAlign: 'center',
            marginTop: 15,
            fontSize: 30,
            fontWeight: 'bold',
          }}
        >
          The are no products in this section
        </Typography>
      </Box>
    );

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`?page=${value}`);
  };

  return (
    <Box>
      <Typography
        marginTop="50px"
        variant="h2"
        fontSize="30px"
        fontWeight="bold"
      >
        {name}
      </Typography>
      <Grid container marginTop="-30px" spacing={12} rowSpacing={6}>
        {products &&
          products.map(({ id, name, images, rating, price, slug }) => (
            <Grid key={id} item sm={12} lg={4} xl={3}>
              <Link
                href={pageRoutes.products(slug)}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  sx={{
                    padding: '5px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    border: '1px solid white',
                    marginTop: '10px',
                    color: 'white',
                    width: '300px',
                  }}
                >
                  <CardContent>
                    <Image
                      src={images[0].url}
                      width="250"
                      height="200"
                      alt="VR headset"
                    />
                    <Typography fontSize="20px" margin="10px 0">
                      {name}
                    </Typography>
                    <Rating
                      sx={{
                        '.MuiRating-iconEmpty': {
                          color: 'rgba(255, 255, 255, 0.5)',
                        },
                      }}
                      name="read-only"
                      value={rating}
                      readOnly
                      precision={0.1}
                    />
                    <Typography marginTop="10px">
                      ${convertPrice(price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
      </Grid>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}
      >
        {pageCount && pageCount > 1 && (
          <Pagination pageCount={pageCount} handleChange={handleChange} />
        )}
      </Box>
    </Box>
  );
};

export default Products;
