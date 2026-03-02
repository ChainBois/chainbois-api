const formatNumber = function (num, decimals = 2, style = "decimal") {
  if (typeof num !== "number" || isNaN(num)) {
    return style === "currency" ? "$0.00" : "0";
  }
  return num.toLocaleString("en-US", {
    style,
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const formatDynamicAmount = function (amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0.00";
  if (amount === 0) return "0.00";
  if (amount >= 1) {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  const amountStr = amount.toFixed(8);
  const firstSignificantDigitIndex = amountStr.search(/[1-9]/);
  if (firstSignificantDigitIndex !== -1) {
    const decimalsToShow = firstSignificantDigitIndex;
    return parseFloat(amount.toFixed(decimalsToShow)).toString();
  }
  return "0.00";
};

const formatCompactAmount = function (amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0";
  if (amount === 0) return "0";
  const absAmount = Math.abs(amount);
  if (absAmount < 1) {
    if (absAmount < 0.0001) return amount.toExponential(2);
    return parseFloat(amount.toPrecision(4)).toString();
  }
  if (absAmount < 1000) {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
  const suffixes = ["", "K", "M", "B", "T"];
  const i = Math.floor(Math.log(absAmount) / Math.log(1000));
  if (i >= suffixes.length) return amount.toExponential(2);
  const shortValue = (amount / Math.pow(1000, i)).toFixed(2);
  return shortValue.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1") + suffixes[i];
};

const formatLargeNumber = function (num, decimals = 2, style = "decimal") {
  if (typeof num !== "number" || isNaN(num)) {
    return style === "currency" ? "$0" : "0";
  }
  const prefix = style === "currency" ? "$" : "";
  const absNum = Math.abs(num);
  if (absNum < 1000) {
    const formattedNum = num.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return prefix + formattedNum;
  }
  const suffixes = ["", "K", "M", "B", "T", "Q"];
  const i = Math.floor(Math.log(absNum) / Math.log(1000));
  if (i >= suffixes.length) return prefix + num.toExponential(2);
  const shortValue = (num / Math.pow(1000, i)).toFixed(2);
  return prefix + shortValue.replace(/\.00$/, "") + suffixes[i];
};

module.exports = {
  formatCompactAmount,
  formatDynamicAmount,
  formatLargeNumber,
  formatNumber,
};
