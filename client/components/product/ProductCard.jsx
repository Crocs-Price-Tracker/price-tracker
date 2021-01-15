import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import useStyles from '../../style/theme';
import { useAuth } from '../routes/useAuth';

const ProductCard = ({
  productId,
  productName,
  imageUrl,
  storeName,
  updateProductList,
  setAlert,
  lowestPrice,
  // deleteProduct={deleteProduct}
  storeUrl,
}) => {
  const classes = useStyles();
  const auth = useAuth();
  const user = auth.getUser();

  if (!user) return auth.signout(() => history.push('/'));

  const token = user.token ? user.token : null;

  const deleteProduct = (id, e) => {
    e.preventDefault();

    fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 403)
          return auth.signout(() => history.push('/'));

        return res.json().then(({ err }) => {
          throw err;
        });
      })
      .then(({ message }) => {
        setAlert({
          type: 'success',
          message: message,
        });

        updateProductList(id);
      })
      .catch((err) => {
        setAlert({
          type: 'error',
          message: err,
        });
      });
  };

  return (
    //flexDirection: 'column',
    <>
      <Grid container item xs={12} sm={6} md={4} lg={3} direction="column">
        <Card
          className={classes.productCard}
          // style={{
          //   display: 'flex',
          // }}
        >
          <CardActionArea style={{ height: 300 }}>
            <CardMedia
              className={classes.productCardMedia}
              image={imageUrl}
              title={productName}
            />
          </CardActionArea>
          <CardContent style={{ flexGrow: 1 }}>
            <Typography variant="h6">{productName}</Typography>
            <Typography
              className={classes.lowestPrice}
              variant="h4"
              color="primary"
            >
              Lowest Product Price: ${lowestPrice}
            </Typography>
            <Typography variant="subtitle1">
              <a href={storeName} target="_blank">
                {storeName}
              </a>
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={(e) => deleteProduct(productId, e)}
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
            <Link to={`/favorites/${productId}`}>
              <Button variant="contained" color="primary" size="small">
                View
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
};

export default ProductCard;
