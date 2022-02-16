const USERINPUTS = {
  ADD_COUNTRY: "Add Country",
  ENTER_AMOUNT: "Enter Amount",
  NO_CTRY_AVAILABLE: "No country available",
};

const BTN = {
  LOG_OUT: "Log Out",
  CLOSE: "CLOSE",
};

const LOC_STORAGE = {
  USERNAME: "userName",
  TOKEN: "token",
  SELECTEDCOUNTRY: "selectedCountry",
};

const COUNTRYTABLECOLUMNS = {
  name: {
    field: "name",
    headerName: "Country Name",
  },
  population: {
    field: "population",
    headerName: "Population",
  },
  currency: {
    field: "currencyDetails",
    headerName: "Currency",
  },
  amount: {
    field: "amount",
    headerName: "Converted Amount",
  },
};

const RATE_LIMIT_DIALOG = {
  title: "Oh no, you've exceeded your request limit!",
  msg: "Please take a minute break and come back",
};

const RESPONSE_CODE = {
  LIMIT_EXCEEDED: "limit_exceeded",
  SUCCESS: "success",
  LOGGED_IN: "logged_in",
};

const PRIVATE_KEY = "exchange_25";
const UNAMEPWDMISSING = "Invalid username or password";
const UNAMEPWDREQUIRED = "Required username and password";

export {
  COUNTRYTABLECOLUMNS,
  RATE_LIMIT_DIALOG,
  BTN,
  RESPONSE_CODE,
  LOC_STORAGE,
  USERINPUTS,
  PRIVATE_KEY,
  UNAMEPWDMISSING,
  UNAMEPWDREQUIRED
};
