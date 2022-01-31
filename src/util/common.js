export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};


export const exchangeRateCalc = (data) => {
  try {
    let baseCurrencyValue = data.baseCurrencyValue;
    let baseToEur = 1 / baseCurrencyValue;
    data?.currencyDetails?.forEach(cur => {
      cur.exchangeAmount = cur.exchangeRate * baseToEur
    });
  } catch (e) {}
};
