export const fetchCoinRate = async (coin:string) => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
    const data = await response.json();

    return data[coin].usd;
  } catch (error) {
    console.error("Error fetching coin rate:", error);
    return null;
  }
};


  // fetch current coin rate
 export  const getRate = async (rr:string) => {
    try {
      const rate = await fetchCoinRate(rr?.toLowerCase());
      return rate;
        } catch (error) {
      console.error("Error fetching coin rate:", error);
      return null;
      }

  };
  