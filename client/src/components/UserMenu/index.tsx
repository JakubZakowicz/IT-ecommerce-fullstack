import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetUser, useSignOut } from '@/src/api/auth';
import { pageRoutes } from '@/src/routes/pageRoutes';
import {
  Box,
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';

interface UserMenuProps {
  userId: string;
}

const UserMenu = ({ userId }: UserMenuProps) => {
  const { data: userData } = useGetUser(userId);
  const { mutate } = useSignOut();
  const router = useRouter();

  const { firstName } = userData || {};

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (
    event: Event | React.SyntheticEvent,
    callback?: () => any
  ) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    if (callback) callback();

    setOpen(false);
  };

  const signOut = async () => {
    await mutate(null, { onSuccess: () => router.push('/') });
  };
  return (
    <div>
      <Button
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        sx={{ color: 'white' }}
        onClick={handleToggle}
      >
        <Box
          sx={{
            fontSize: '20px',
            border: ' 2px solid white',
            borderRadius: '50%',
            padding: '3px 14px',
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
        </Box>
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper
              sx={{
                background: '#2F2F2F',
                color: 'white',
                a: { color: 'white', textDecoration: 'none' },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                >
                  <MenuItem onClick={handleClose}>
                    <Link href={pageRoutes.accountDetails()}>Profile</Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link href={pageRoutes.orderHistory()}>Order History</Link>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handleClose(e);
                      signOut();
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default UserMenu;
