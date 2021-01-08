import React, { useState, useEffect, useRef } from 'react';
import useInput from '../hooks/useInput';
import SearchList from './SearchList';
import useToggler from '../hooks/useToggler';
import Loader from './Loader';
import { Button, TextField, Dialog } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Spinner from './Spinner';
import useStyles from '../../style/theme';
import Response from '../alert/response';

const Search = ({ userId, addProduct, startSpinner, getAllProducts }) => {
  const firstRender = useRef(true);
  const [searchVal, handleSearchVal, resetSearch] = useInput('');
  const [urlInput, setUrl, resetUrl] = useInput('');
  const [results, setResults] = useState([]);
  const [isFetching, toggler] = useToggler(false);
  const [open, setOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const classes = useStyles();
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
	if (!searchVal) {
		setAlert({type: 'error', message: 'Please fill in the search bar input!'});
		return;
	}

    toggler();

    // latest api
    const url = `https://api.scaleserp.com`;
    const apikey = `B49C8108639B49E8B42DB696E6591130`;

    // old url
    // `https://api.scaleserp.com/search?search_type=shopping&price_low_to_high&num=10&api_key=20DB36619863498CA57DDD3B41EB1AFA&q=${searchVal}`
    //   `${url}/search?search_type=shopping&price_low_to_high&num=10&api_key=${apikey}&q=${searchVal}`
    fetch(
		'../dummyB./new-results.json'
    )
      .then((response) => response.json())
      .then((response) => {
        const goodUrl = 'google.com/shopping/product/';

        const items = response.shopping_results
          .filter((item) => {
            return item.link.includes(goodUrl);
          })
          .slice(0, 10);

        console.log('items: ', items);
        setOpen(true);
        setResults(items);
        console.log('open: ', open);
        firstRender.current = false;
      })
      .catch((err) => console.log(err));

    resetSearch();
  };

  const clearResults = () => {
    setOpen(false);
    setResults([]);
  };

  //   const handleUrl = (e) => {
  //     e.preventDefault();

  //     const goodUrl = 'google.com/shopping/product/';

  //     if (!urlInput.includes(goodUrl)) {
  //       resetUrl();
  //       return alert('Invalid product url. Please try again');
  //     }

  //     setSpinner(true);
  //   };

  useEffect(() => {
    if (firstRender.current) return;
    if (results.length < 1) return; // maybe render a component for no products
    toggler();
  }, [results]);

  useEffect(() => {
    if (!spinner) return;

    const google_url = urlInput;

    // fetch(`/api/products/${userId}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     google_url,
    //     userId,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     getAllProducts();
    //     setSpinner(false);
    //     resetUrl();
    //   })
    //   .catch((err) => {
    //     console.log('main ue addProduct', err);
    //     setSpinner(false);
    //     alert('Uh oh! Seems like the link is broken. Please try again.');
    //     resetUrl();
    //   });
  }, [spinner]);

  if (isFetching) return <Loader />;
  if (spinner) return <Spinner />;

  return (
    //   results.length > 0 ? (
    //     <Dialog open={open} onClose={clearResults}>
    //       <SearchList
    //         startSpinner={startSpinner}
    //         results={results}
    //         clearResults={clearResults}
    //         addProduct={addProduct}
    //         setOpen={setOpen}
    //       />
    //     </Dialog>
    //   ) : (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          className={classes.searchBar}
          variant="outlined"
          label="Search for a product"
          value={searchVal}
          onChange={handleSearchVal}
          inputProps={{ className: classes.searchBar }}
        />
      </form>
      <Button
        type="submit"
        className={classes.searchBtn}
        variant="contained"
        color="primary"
        endIcon={<SearchIcon />}
      >
        Search
      </Button>
      {/* <TextField
					className={classes.searchBar}
					variant="outlined"
					label="Enter Product URL"
					value={urlInput}
					onChange={setUrl}
					inputProps={{ className: classes.searchBar }}
				/> */}
      {/* <Button
					className={classes.searchBtn}
					variant="contained"
					color="primary"
					onClick={handleUrl}
					endIcon={<SearchIcon />}
				>
					Enter Url
				</Button> */}
    </>
  );
};

export default Search;
