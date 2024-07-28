import React from 'react';
import { AppBar, Toolbar, Button, useMediaQuery, useTheme, IconButton, Menu, MenuItem } from '@mui/material';
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from '../../store/authSlice.js';
import axios from 'axios';
import { toast } from 'react-toastify';

const navItems = [
  { text: "Profile", slug: "/profile", authRequired: true },
  { text: "Sign Up", slug: "/register", authRequired: false },
  { text: "Sign In", slug: "/login", authRequired: false },
  { text: "Upload Results", slug: "/admin/upload", adminRequired: true },
  { text: "Result", slug: "/resultlist", authRequired: true },
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.userData);

  const isAdmin = user && user.isAdmin; 

  console.log('Auth Status:', authStatus);
  console.log('User:', user);
  console.log('Is Admin:', isAdmin);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/v1/users/logout', {}, {
        withCredentials: true
      });
      dispatch(logout());
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.adminRequired) {
      return authStatus && isAdmin;
    }
    if (item.authRequired) {
      return authStatus;
    }
    return !authStatus;
  });

  console.log('Filtered Nav Items:', filteredNavItems);

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {filteredNavItems.map((item) => (
                <MenuItem key={item.slug} onClick={handleClose} component={NavLink} to={item.slug}>
                  {item.text}
                </MenuItem>
              ))}
              {authStatus && (
                <MenuItem onClick={() => { handleLogout(); handleClose(); }}>
                  Logout
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <>
            {filteredNavItems.map((item) => (
              <Button
                key={item.slug}
                color="inherit"
                component={NavLink}
                to={item.slug}
                sx={{ marginRight: 2 }}
              >
                {item.text}
              </Button>
            ))}
            {authStatus && (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}