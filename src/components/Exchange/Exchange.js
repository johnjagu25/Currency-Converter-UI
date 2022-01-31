import { UserInputs } from "./UserInputs";
import { CountryTable } from "./CountryTable";
import { Fragment, useState } from "react";
import "../../styles/Exchange.css";
import { Button, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { titleStyle,logOutStyle } from "../../util/commonstyle";
import { exchangeRateCalc } from "../../util/common";
import { useEffect } from "react";
export default function Exchange() {
  const navigate = useNavigate();
  let userName = sessionStorage.getItem("userName");
  useEffect(() => {
    let authToken = sessionStorage.getItem("token");
    if (!authToken) {
      navigate("/");
    }
  }, []);

  const [countriesData, updateCountriesData] = useState([]);
  const addNewCountry = (data,amount) => {
    updateAmount(amount,data);    
  };

  const updateAmount = (amount,data = null) => {
    exchangeRateCalc(data);
    let newCountryList = [...countriesData]
    data && newCountryList.push(data)
    newCountryList.forEach((countryData) => {
      countryData.currencyDetails.forEach(currency => {
        let calcAmount = (
          currency.exchangeAmount * amount
        ).toFixed(7);
        currency.amount = calcAmount.slice(0, -5);
        currency.amountShadow = parseFloat(calcAmount.split(".")?.[1]?.slice(2, 7)) || '';
      })
     
    });
    updateCountriesData([...newCountryList]);
  };

  const logOut = () => {
    sessionStorage.clear();
    navigate("/");
  };
  return (
    <Fragment>
      <div className="navBar">
        <span style={titleStyle}>Hi {userName}, Welcome to Anyfin Currency Converter</span>
        <Button
          variant="outlined"
          style={logOutStyle}
          onClick={() => {
            logOut();
          }}
        >
          Log out
        </Button>
      </div>
      <div className="container">
        <Card variant="outlined" sx={{ padding: "20px",maxWidth: 800 , minWidth:700 ,margin:"auto"}}>
          <UserInputs
            updateAmount={updateAmount}
            addNewCountry={addNewCountry}
          ></UserInputs>
        </Card>
        {!!countriesData?.length && (
          <Card variant="outlined" sx={{  maxWidth: 800 , minWidth:700, padding: "20px", margin: "20px auto" }}>
            <CountryTable dataSource={countriesData}></CountryTable>
          </Card>
        )}
      </div>
    </Fragment>
  );
}

