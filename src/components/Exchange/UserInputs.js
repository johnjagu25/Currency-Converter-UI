import React, { useState, useCallback, useRef, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "../../styles/UserInputs.css";
import { Button, CircularProgress } from "@mui/material";
import { getCountryDetails } from "../../service/service";
import AlertDialog from "./RateLimitAlert";
import { debounce } from "../../util/common";
import { Box } from "@mui/system";
import { baseCurrencyCode,amountMinValue } from "../../util/config";

const trackAddedCountries = new Set();
export function UserInputs(props) {
  const textRef = useRef();
  const [countryInp, upCountryData] = useState({
    countryData: [],
    open: false,
    autoKey: new Date().toISOString(),
  });

  const [amount, setAmount] = useState(1);
  const [reqLimitDialog, openReqLimitDialog] = useState(false);

  const searchInpHandler = useCallback(
    debounce((value) => {
      getCountryDetails(value)
        .then((response) => {
          let data = response?.data?.countryDetails || [];
          for (let i = data.length - 1; i >= 0; i--) {
            let name = data[i].name;
            if (trackAddedCountries.has(name)) {
              data.splice(i, 1);
            }
          }
          upCountryData({ ...countryInp, open: true, countryData: data });
        })
        .catch((e) => {
          if (e.code === "limit_exceeded") {
            openReqLimitDialog(true);
          } else {
            upCountryData({ ...countryInp, open: true, countryData: [] });
          }
        });
    }, 500),
    []
  );

  useEffect(() => {
    if (!countryInp.open) {
      upCountryData({ ...countryInp, countryData: [] });
    }
  }, [countryInp.open]);

  const saveSelectedDetail = ({ name, population, currency, official,baseCurrencyValue }) => {
    try {
      let selectedCountry = {
        name,
        population: population?.toLocaleString(),
        currency: currency[0].code,
        currencyDetails: currency,
        currencySymbol: currency?.currencySymbol,
        official,
        baseCurrencyValue
      };
      sessionStorage.setItem(
        "selectedCountry",
        JSON.stringify(selectedCountry)
      );
    } catch (e) {}
  };

  const addCountry = (e) => {
    let getSelCountry = sessionStorage.getItem("selectedCountry");
    if (getSelCountry) {
      const obj = JSON.parse(getSelCountry);
      trackAddedCountries.add(obj.name);
      props.addNewCountry(obj, amount);
    }
    // it's to rerender the autocomplete
    upCountryData({ ...countryInp, autoKey: new Date().toISOString() });
  };
  const amtFieldChange = (amount) => {
    setAmount(amount);
    props.updateAmount(amount);
  };
  const updReqDialog = (isOpen) => {
    openReqLimitDialog(isOpen);
  };
  return (
    <section className="userCard" style={{ display: "flex" }}>
      <AlertDialog
        reqLimitDialog={reqLimitDialog}
        updReqDialog={updReqDialog}
      ></AlertDialog>
      <div className="userInputSection" style={{ marginBottom: "20px" }}>
        <Autocomplete
          key={countryInp.autoKey}
          className="autoComplete"
          open={countryInp.open}
          onOpen={() => {
            upCountryData({ ...countryInp, open: true });
          }}
          noOptionsText={"No country available"}
          onClose={() => upCountryData({ ...countryInp, open: false })}
          isOptionEqualToValue={(option, value) => {
            return option?.name === value?.name;
          }}
          filterOptions={(options, state) => options}
          onChange={(event, value) => {
            if (value) {
              saveSelectedDetail(value);
            } else {
              sessionStorage.removeItem("selectedCountry");
            }
          }}
          options={countryInp.countryData}
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
          style={{ width: 300, height: 45 }}
          renderInput={(params) => (
            <TextField
              inputRef={textRef}
              {...params}
              label="Select Country"
              variant="outlined"
              onChange={(ev, data) => {
                if (ev.target.value) {
                  searchInpHandler(ev.target.value);
                }
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {countryInp.open &&
                    !countryInp.countryData?.length &&
                    textRef.current.value ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        <Button
          style={{ width: 150, height: 45 }}
          onClick={() => {
            addCountry();
          }}
          variant="contained"
        >
          Add Country
        </Button>
      </div>
      <TextField
        style={{
          width: 470,
          height: 45,
          marginTop: "10px",
          marginBottom: "10px",
        }}
        min="0.01"
        id="outlined-number"
        label={`Enter Amount (${baseCurrencyCode})`}
        type="number"
        variant="outlined"
        value={amount}
        onKeyPress={(event) => {
          if (!/[0-9]\.?/.test(event.key)&& event.key !== '.') {
            event.preventDefault();
          }
        }}
        onBlur={(e) =>
          amtFieldChange(e.target.value < amountMinValue ? amountMinValue : e.target.value)
        }
        onChange={(e) => amtFieldChange(e.target.value)}
      />
    </section>
  );
}
