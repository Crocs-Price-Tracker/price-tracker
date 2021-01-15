import React from 'react';
import { AppBar, Button, Typography, Toolbar, Grid } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import useStyles from '../../style/theme';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../routes/useAuth';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const classes = useStyles();
  const history = useHistory();
  const auth = useAuth();

  const user = auth.getUser();

  if (!user) return auth.signout(() => history.push('/'));

  const logOut = (e) => {
    e.preventDefault();

    fetch('/api/auth/logout', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (res.status === 200) {
          auth.signout(() => history.push('/'));
        }
      })
      .catch((error) => {
        console.error('Logout Error:', error);
      });
  };

  return (
    <AppBar>
      <Toolbar className={classes.productAppBar}>
        <div className={classes.navBar}>
          <AccountCircle />
          <Typography className={classes.username} variant="h6">
            {user ? user.email : ''}
          </Typography>
        </div>
        <div>
          <Button>
        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>
          Home
        </Link>
        </Button>
        <Button>
        <Link
          to="/favorites"
          style={{ color: 'white', textDecoration: 'none' }}
        >
          Favorites
        </Link>
        </Button>
        <Button onClick={logOut} color="inherit" endIcon={<ExitToAppIcon />}>
          Logout
        </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
