import React, { useState } from 'react';
import useInput from '../hooks/useInput';
import {
  Button,
  TextField,
  IconButton,
  Checkbox,
  DialogTitle,
  Divider,
  Typography,
} from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import ProductForm from './ProductForm';

import CloseIcon from '@material-ui/icons/Close';
import Response from '../alert/response';
import useStyles from '../../style/theme';
import { useAuth } from '../routes/useAuth';

const AddProduct = ({ setOpen, productId, productUrl, productName }) => {
  const classes = useStyles();

  const auth = useAuth();
  const user = auth.getUser();

  if (!user) return auth.signout(() => history.push('/'));

  const token = user.token ? user.token : null;

  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  const [desiredPrice, updateDesiredPrice, resetDesiredPrice] = useInput(0.0);
  const [emailNotification, setEmailNotification] = useState(false);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setEmailNotification(event.target.checked);
  };

  return (
    <div className={classes.registerForm}>
      {/* <Response alert={alert} /> */}
      <IconButton
        aria-label="close"
        onClick={handleClose}
        style={{ alignSelf: 'flex-end' }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle style={{ padding: '0' }}>Add Product</DialogTitle>
      <Divider className={classes.registerDivider} variant="middle" />
      <Typography variant="h6" style={{ fontSize: '.85rem', margin: '10px 0' }}>
        Enter desired price to get email notification and save it to favorites.
      </Typography>
      <ProductForm
        productId={productId}
        productUrl={productUrl}
        productName={productName}
        formType="add"
        setOpen={setOpen}
        price={null}
        emailPreference={false}
      />
    </div>
  );
};

export default AddProduct;
