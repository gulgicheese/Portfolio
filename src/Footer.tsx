function Footer() {
  return (
    <footer>
      <ol>
        <li>
          Data Sources: Financial Modeling Prep (FMP); API endpoints: Latest
          Senate Financial Disclosures, Stock Batch Quote Short
        </li>
        <li>
          This dashboard is meant for informational purposes only, not for
          investment advice.
        </li>
        <li>
          In order to preserve the API quota on free tier, the Stock prices and
          dayChange information only available after filtering to selected
          member.
        </li>
        <li>
          Due to the limitation of using FMP free tier, some features may have
          reduced functionality, for example, some tickers prices and dayChange
          information may not be available for all stocks.
        </li>
      </ol>
    </footer>
  );
}

export default Footer;
