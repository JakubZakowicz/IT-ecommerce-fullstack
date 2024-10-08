'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Box,
  Button,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GridViewIcon from '@mui/icons-material/GridView';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { pageRoutes } from '@/src/routes/pageRoutes';
import { useGetCategories } from '@/src/api/categories';
import Logo from '@/public/logo.svg';
import { useGetMe } from '@/src/api/auth';
import UserMenu from '../UserMenu';
import SearchBar from '../SearchBar';
import ShoppingCart from '../ShoppingCart';
import Loader from '../Loader';

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const [open, setOpen] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUser, setIsUser] = useState(false);

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError
  } = useGetCategories();
  const { data: me } = useGetMe();

  useEffect(() => {
    if (me) setIsUser(true);
  }, [me]);

  const handleClick = () => {
    setOpen(!open);
  };

  const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);

  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

  if (isCategoriesError) throw new Error(categoriesError.message)

  return (
    <Box>
      <Box
        margin="30px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        rowGap={2}
      >
        {isMobileView ? (
          <>
            <Button onClick={toggleDrawer} sx={{ color: 'white', zIndex: 100 }}>
              <MenuIcon />
            </Button>
            <Link href={pageRoutes.root()}>
              <Image src={Logo} width={60} alt="logo" />
            </Link>
            <Box display="flex" alignItems="center" gap="40px">
              {isUser ? (
                <UserMenu userId={me!.userId} setIsUser={setIsUser} />
              ) : (
                <Link href={pageRoutes.singIn()}>
                  <PersonIcon sx={{ fontSize: '40px', color: 'white' }} />
                </Link>
              )}
              <ShoppingCart />
            </Box>
            <SearchBar />
          </>
        ) : (
          <>
            <Link href={pageRoutes.root()}>
              <Image src={Logo} width={60} alt="logo" />
            </Link>
            <SearchBar />
            <Box display="flex" alignItems="center" gap="40px">
              {isUser ? (
                <UserMenu userId={me!.userId} setIsUser={setIsUser} />
              ) : (
                <Link href={pageRoutes.singIn()}>
                  <PersonIcon sx={{ fontSize: '40px', color: 'white' }} />
                </Link>
              )}
              <ShoppingCart />
            </Box>
          </>
        )}
      </Box>
      <Drawer
        open={isMobileView && isDrawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 300,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
            backgroundColor: isMobileView ? 'black' : 'transparent',
            color: 'white',
            marginTop: isMobileView ? 0 : 15,
            border: 'none',
          },
        }}
        variant={isMobileView ? 'temporary' : 'permanent'}
        anchor="left"
      >
        <List>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <GridViewIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Categories" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {isCategoriesLoading && (
              <Loader size={80} style={{ margin: '80px 0' }} />
            )}
            {categories &&
              !isCategoriesLoading &&
              categories.categories?.map(({ id, slug, name }) => (
                <List
                  key={id}
                  component={Link}
                  href={pageRoutes.categories(slug)}
                  disablePadding
                  sx={{ color: 'white', textDecoration: 'none' }}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary={name} />
                  </ListItemButton>
                </List>
              ))}
          </Collapse>
        </List>
      </Drawer>
      <Box width="80%" marginLeft={isMobileView ? '50px' : '350px'}>
        {children}
      </Box>
    </Box>
  );
};

export default Navbar;
