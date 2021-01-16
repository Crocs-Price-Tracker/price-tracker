import React, { useState, useEffect } from 'react';
import NavBar from '../nav/NavBar';
import { useAuth } from '../routes/useAuth';
import { useParams } from 'react-router-dom';
import useInput from '../hooks/useInput';
import DailyPriceChart from './DailyPriceChart';
import ProductForm from './ProductForm';
import {
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  CardHeader,
  IconButton,
} from '@material-ui/core';
import useStyles from '../../style/theme';
import LinkIcon from '@material-ui/icons/Link';
import Link from '@material-ui/core/Link';
const Favorite = () => {
  const classes = useStyles();
  const auth = useAuth();
  const user = auth.getUser();
  if (!user) return auth.signout(() => history.push('/'));

  const token = user.token ? user.token : null;

  const [favorite, setFavorite] = useState({});
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  let { productId } = useParams();

  productId = Number(productId);

  useEffect(() => {
    fetch(`/api/products/${productId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        if (res.status === 403) return auth.signout(() => history.push('/'));

        return res.json().then(({ err }) => {
          throw err;
        });
      })
      .then(({ product }) => {
        setFavorite(product);
      })
      .catch((err) => {
        setAlert({
          type: 'error',
          message: err,
        });
      });
  }, []);

  if (!favorite.price_history) {
    return <></>;
  }

  return (
    <>
      <NavBar />
      <Grid
        container
        spacing={3}
        direction="column"
        style={{
          padding: '50px',
          marginTop: '50px',
        }}
      >
        <Card
          className={classes.productCard}
          // style={{
          //   display: 'flex',
          // }}
        >
          <CardHeader title={favorite.product_name} />
          <CardContent
            style={{
              display: 'flex',
              flex: 1,
            }}
          >
            <img src={favorite.image_url} />
            <CardContent>
            <Typography variant="h6" style={{marginBottom: '20px'}}>
              <Link href={favorite.store_url} target="_blank">
                {favorite.store_name}
              </Link>
            </Typography>
            <Typography variant="h4" style={{marginBottom: '20px'}}>{`$ ${favorite.lowest_daily_price}`}</Typography>
            <ProductForm
              productId={favorite.product_id}
              productUrl={favorite.product_url}
              productName={favorite.product_name}
              formType="edit"
              price={favorite.desired_price}
              emailPreference={favorite.email_preference}
              setOpen={null}
            />
            </CardContent>
          </CardContent>
        </Card>
        <Grid
          container
          spacing={3}
          direction="column"
          style={{
            paddingTop: '50px',
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
        >
          <Card style={{ height: '100vh', overflow: 'none' }}>
            <Typography variant="h5" style={{ margin: '20px' }}>
              Lowest Daily Prices
            </Typography>
            <CardMedia>
              <DailyPriceChart priceHistory={favorite.price_history} />
            </CardMedia>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Favorite;
