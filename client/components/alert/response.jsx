import React, { useState } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    top: 0,
    zIndex: 1200
  },
}));

const Response = ({ alert }) => {
  const { type, message } = alert;
  const classes = useStyles();

  const [open, setOpen] = useState(true);

  return (
    <div className={classes.root}>
      {type && (
        <Collapse in={open}>
        <Alert severity={type} elevation={6} variant="filled" action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>{type}</AlertTitle>
          {message}
        </Alert>
        </Collapse>
      )}
    </div>
  );
};

export default Response;
