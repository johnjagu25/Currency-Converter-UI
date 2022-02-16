import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { countryTableCss } from "../../util/commonstyle";
import { baseCurrencyCode } from "../../util/config";
import { COUNTRYTABLECOLUMNS } from "../../constant/constant";

const columns = [
  {
    field: COUNTRYTABLECOLUMNS.name.field,
    headerName: COUNTRYTABLECOLUMNS.name.headerName,
    minWidth: 170,
    sortable: false,
  },
  {
    field: COUNTRYTABLECOLUMNS.population.field,
    headerName: COUNTRYTABLECOLUMNS.population.headerName,
    minWidth: 150,
    sortable: false,
  },
  {
    field: COUNTRYTABLECOLUMNS.currency.field,
    headerName: COUNTRYTABLECOLUMNS.currency.headerName,
    minWidth: 180,
    sortable: false,
    renderCell: (cellValues) => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {cellValues?.value?.length > 1 ? (
            cellValues?.value.map((currency,index) => (
              <span key={index} style={{ marginBottom: "5px" }}>
                {currency.code}&nbsp;({currency.name})
              </span>
            ))
          ) : (
            <span>{cellValues.value[0].code}</span>
          )}
        </div>
      );
    },
  },

  {
    field: COUNTRYTABLECOLUMNS.amount.field,
    headerName: COUNTRYTABLECOLUMNS.amount.headerName,
    minWidth: 180,
    sortable: false,
    renderHeader: (params) => (
      <div style={countryTableCss.convertedAmount}>
        <span style={{ fontWeight: 500 }}>Converted Amount</span>
        <span style={countryTableCss.localCurrency}>
          ({baseCurrencyCode} to Local Currency)
        </span>
      </div>
    ),
    renderCell: (cellValues) => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {cellValues?.row?.currencyDetails?.length > 1 ? (
            cellValues.row.currencyDetails.map((currency, index) => (
              <span key={index} style={countryTableCss.amountField}>
                {currency.amount}
                <span style={countryTableCss.amountShadow}>
                  {currency.amountShadow}
                </span>
                &nbsp;{currency.code}
              </span>
            ))
          ) : (
            <span style={countryTableCss.amountField}>
              {cellValues.row?.currencyDetails[0].amount}
              <span style={countryTableCss.amountShadow}>
                {cellValues.row?.currencyDetails[0].amountShadow}
              </span>
              &nbsp;{cellValues.row?.currencyDetails[0].code}
            </span>
          )}
        </div>
      );
    },
  },
];

export function CountryTable({dataSource}) {
  return (
    <div style={countryTableCss.tableStyle}>
      <div style={{ flexGrow: 1 }} className="apply-elevation">
        <DataGrid
          getRowId={(r) => r.name}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableColumnMenu={true}
          disableColumnFilter={true}
          disableSelectionOnClick={true}
        />
      </div>
    </div>
  );
}
