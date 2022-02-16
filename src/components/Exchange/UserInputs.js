import React, {
  Fragment,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import styles from "../../styles/UserInputs.module.css";
import { Button, CircularProgress } from "@mui/material";
import { getCountryDetails } from "../../service/service";
import RateLimitDialog from "./RateLimitDialog";
import { debounce } from "../../util/common";
import { Box } from "@mui/system";
import { baseCurrencyCode, amountMinValue } from "../../util/config";
import {
  RESPONSE_CODE,
  LOC_STORAGE,
  USERINPUTS,
} from "../../constant/constant";

const trackAddedCountries = new Set();
export function UserInputs({ onAddNewCountry, onUpdateAmount }) {
  const selCountry = useRef({
    data: null,
  });
  const [countryInp, upCountryData] = useState({
    dataSource: [],
    showDropdown: false,
    autoKeyId: new Date().toISOString(),
    searchTxt: "",
  });
  const [amount, setAmount] = useState(1);
  const [reqLimitDialog, openReqLimitDialog] = useState(false);
  const getCtrydetails = (searchTxt) => {
    getCountryDetails(searchTxt)
      .then((response) => {
        let data = response?.data?.countryDetails || [];
        for (let i = data.length - 1; i >= 0; i--) {
          let name = data[i].name;
          if (trackAddedCountries.has(name)) {
            data.splice(i, 1);
          }
        }
        upCountryData({
          ...countryInp,
          showDropdown: true,
          dataSource: data,
        });
      })
      .catch((e) => {
        upCountryData({ ...countryInp, showDropdown: false, dataSource: [] });
        if (e.code === RESPONSE_CODE.LIMIT_EXCEEDED) {
          openReqLimitDialog(true);
        }
      });
  };
  const searchInpHandler = useCallback(debounce(getCtrydetails, 500), []);
  // unmount
  useEffect(
    () => () => {
      trackAddedCountries?.clear();
      upCountryData({});
    },
    []
  );

  useEffect(() => {
    if (!countryInp.showDropdown) {
      upCountryData(() => ({ ...countryInp, dataSource: [] }));
    }
  }, [countryInp.showDropdown]);

  const saveSelectedDetail = ({
    name,
    population,
    currency,
    official,
    baseCurrencyValue,
  }) => {
    try {
      const selectedCountry = {
        name,
        population: population?.toLocaleString(),
        currency: currency[0].code,
        currencyDetails: currency,
        currencySymbol: currency?.currencySymbol,
        official,
        baseCurrencyValue,
      };
      selCountry.current.data = selectedCountry;
    } catch (e) {}
  };

  const addCountry = (e) => {
    if (selCountry.current.data) {
      trackAddedCountries.add(selCountry.current.data.name);
      onAddNewCountry(selCountry.current.data, amount);
      selCountry.current.data = null;
    }
    // it's to rerender the autocomplete
    upCountryData({ ...countryInp, autoKeyId: new Date().toISOString() });
  };
  const amtFieldChange = (amount) => {
    onUpdateAmount(amount);
    setAmount(amount);
  };
  const updReqDialog = (isOpen) => {
    openReqLimitDialog(isOpen);
  };
  return (
    <section className={styles.userCard}>
      <RateLimitDialog
        onReqLimitDialog={reqLimitDialog}
        onUpdReqDialog={updReqDialog}
      ></RateLimitDialog>
      <div className={styles.userInputSection}>
        <Autocomplete
          key={countryInp.autoKeyId}
          className={styles.autoComplete}
          open={countryInp.showDropdown}
          onOpen={() => {
            upCountryData({ ...countryInp, showDropdown: true });
          }}
          noOptionsText={USERINPUTS.NO_CTRY_AVAILABLE}
          onClose={() => upCountryData({ ...countryInp, showDropdown: false })}
          isOptionEqualToValue={(option, value) => {
            return option?.name === value?.name;
          }}
          filterOptions={(options, state) => options}
          onChange={(event, value) => {
            if (value) {
              saveSelectedDetail(value);
            } else {
              sessionStorage.removeItem(LOC_STORAGE.SELECTEDCOUNTRY);
            }
          }}
          clearOnBlur = {true}
          options={countryInp.dataSource}
          renderOption={(props, option) => (
            <Box key={option.name} component="li" {...props}>
              <span>
                {" "}
                {option.name} ({option.official}){" "}
              </span>
            </Box>
          )}
          getOptionLabel={(option) => {
            return option?.name;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Country"
              variant="outlined"
              onChange={(ev, data) => {
                let searchTxt = ev.target.value;
                if (searchTxt) {
                  searchInpHandler(searchTxt);
                }
                upCountryData({ ...countryInp, searchTxt: searchTxt });
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
                    {
                    !countryInp.dataSource?.length &&
                    countryInp.searchTxt ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ),
              }}
            />
          )}
        />
        <Button
          className={styles.addCountry}
          onClick={() => {
            addCountry();
          }}
          variant="contained"
        >
          {USERINPUTS.ADD_COUNTRY}
        </Button>
      </div>
      <TextField
        className={styles.amountField}
        min="0.01"
        id="outlined-number"
        label={`${USERINPUTS.ENTER_AMOUNT} (${baseCurrencyCode})`}
        type="number"
        variant="outlined"
        value={amount}
        onKeyPress={(e) => {
          if (!/^\d+|\.$/.test(e.key)) {
            e.preventDefault();
          }
        }}
        onBlur={(e) =>
          amtFieldChange(
            e.target.value < amountMinValue ? amountMinValue : e.target.value
          )
        }
        onChange={(e) => amtFieldChange(e.target.value)}
      />
    </section>
  );
}
