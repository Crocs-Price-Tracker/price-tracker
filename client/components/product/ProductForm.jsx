import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import useStyles from '../../style/theme';
import useInput from '../hooks/useInput';
import { useAuth } from '../routes/useAuth';
import {
  Button,
  TextField,
  // IconButton,
  // Checkbox,
  DialogTitle,
  // Divider,
  Typography,
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import Response from '../alert/response';

const ProductForm = ({
  productId,
  productName,
  productUrl,
  formType,
  price,
  emailPreference,
  setOpen
}) => {
  const classes = useStyles();

  const auth = useAuth();
  const user = auth.getUser();

  if (!user) return auth.signout(() => history.push('/'));

  const token = user.token ? user.token : null;

  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  const [desiredPrice, updateDesiredPrice] = useInput(
    formType === 'add' ? '$0.0' : price
  );

  const [emailNotification, setEmailNotification] = useState(
    formType === 'add' ? false : emailPreference
  );
  const handleClose = () => setOpen(false);

  const [buttonDisabled, setButtonDisable] = useState(false);

  const handleChange = (event) => {
    console.log('handle change event', event.target.checked);
    setEmailNotification(event.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!desiredPrice) {
      // setAlert({
      //   type: 'error',
      //   message: 'Price input is required.',
      // });
      return;
    }

    const url =
      formType === 'add' ? '/api/products/' : `/api/products/${productId}`;

    setButtonDisable(true);
    fetch(url, {
      method: formType === 'add' ? 'POST' : 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        google_url: productUrl,
        desired_price: desiredPrice,
        email_preference: emailNotification,
      }),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 403) return auth.signout(() => history.push('/'));

        return res.json().then(({ err }) => {
          throw err;
        });
      })
      .then(({ message, email_preference, desired_price }) => {
        setButtonDisable(false);
        // setAlert({
        //   type: 'success',
        //   message: message,
        // });
        if (formType === 'edit') {
          setEmailNotification(email_preference);
          console.log('before :', desiredPrice);
          updateDesiredPrice(desired_price);
          console.log('after :', desiredPrice);
          return;
        }

        if(formType === 'add') {
          setOpen(false);
          return;
        }
      })
      .catch((err) => {
        setButtonDisable(false);
        // setAlert({
        //   type: 'error',
        //   message: err,
        // });
      });
  };
  // console.log(alert);

  return (
    <>
    {/* <Response alert={alert} /> */}
      <form className={classes.loginForm} onSubmit={handleSubmit}>
        {formType === 'add' && (
          <TextField
            className={classes.loginTextField}
            id="email"
            disabled
            label="Product Name"
            variant="filled"
            value={productName}
            style={{marginBottom: '20px'}}
          />
        )}
        <TextField
          className={classes.loginTextField}
          id="desiredPrice"
          label="Desired Price"
          variant="filled"
          value={desiredPrice}
          onChange={updateDesiredPrice}
          type="text"
          style={{marginBottom: '20px'}}
        />

        <FormControlLabel
          style={{ marginLeft: 0, alignItems: 'flex-start' }}
          control={
            <Switch
              checked={emailNotification}
              onChange={handleChange}
              name="emailNotification"
              aria-label="email notification"
            />
          }
          label="Send Email Notifications"
          labelPlacement="top"
          style={{marginBottom: '20px'}}
        />
        <Button
          className={classes.registerBtn}
          type="submit"
          variant="contained"
          color="primary"
          disabled={buttonDisabled}
        >
          {formType === 'add' ? 'Add Product' : 'Update Product'}
        </Button>
      </form>
    </>
  );
};

export default ProductForm;
