const fakeDataByPolitician = {
  "Nancy Smith": [
    {
      ticker: "NVDA",
      company: "NVIDIA Corp",
      tradeType: "Purchase",
      amountRange: "$1,001 - $15,000",
      txDate: "2026-05-26",
      currentPrice: 122.4,
      dayChange: 1.8,
    },
    {
      ticker: "AAPL",
      company: "Apple Inc",
      tradeType: "Sale",
      amountRange: "$15,001 - $50,000",
      txDate: "2026-05-26",
      currentPrice: 150.0,
      dayChange: -0.5,
    },
    {
      ticker: "TSLA",
      company: "Tesla Inc",
      tradeType: "Purchase",
      amountRange: "$50,001 - $100,000",
      txDate: "2026-05-26",
      currentPrice: 700.0,
      dayChange: 2.3,
    },
  ],
  "John Doe": [
    {
      ticker: "AMZN",
      company: "Amazon.com Inc",
      tradeType: "Sale",
      amountRange: "$1,001 - $15,000",
      txDate: "2026-05-26",
      currentPrice: 265.0,
      dayChange: -1.2,
    },
    {
      ticker: "MSFT",
      company: "Microsoft Corp",
      tradeType: "Purchase",
      amountRange: "$1,001 - $15,000",
      txDate: "2026-04-15",
      currentPrice: 410.0,
      dayChange: 0.9,
    },
  ],
};

export default fakeDataByPolitician;
