const positionOneBase = {
  account_id: 1,
  position_date: Date.now(),
  export_date: Date.now(),
  instrument_id: "5442",
  instrument_name: "Position One",
  instrument_type: "ETF",
  instrument_currency: "SEK",
  quantity: 12,
  price: 350,
  value: 0,
};
const positionTwoBase = {
  account_id: 2,
  position_date: Date.now(),
  export_date: Date.now(),
  instrument_id: "3221",
  instrument_name: "Position Two",
  instrument_type: "FUND",
  instrument_currency: "SEK",
  quantity: 22,
  price: 250,
  value: 0,
};

const positionThreeBase = {
  account_id: 3,
  position_date: Date.now(),
  export_date: Date.now(),
  instrument_id: "2421",
  instrument_name: "Position Three",
  instrument_type: "CASH",
  instrument_currency: "SEK",
  quantity: 0,
  price: 0,
  value: 0,
};

export default {
  async fetch(request, env, ctx) {
    // Handle preflight requests (OPTIONS)
    const PRESHARED_AUTH_HEADER_KEY = "X-Custom-PSK";
    if (request.method === "OPTIONS") {
      // Return a simple response to allow preflight requests
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": `${PRESHARED_AUTH_HEADER_KEY}, Content-Type`,
          "Access-Control-Max-Age": "86400", // 24 hours
        },
      });
    }
    /**
     * @param {string} PRESHARED_AUTH_HEADER_KEY Custom header to check for key
     * @param {string} PRESHARED_AUTH_HEADER_VALUE Hard coded key value
     */

    const PRESHARED_AUTH_HEADER_VALUE = "4a291a7572f99f069399cb5658ac2b80";
    const psk = request.headers.get(PRESHARED_AUTH_HEADER_KEY);

    if (psk !== PRESHARED_AUTH_HEADER_VALUE) {
      // Incorrect key supplied. Reject the request.
      return new Response("Sorry, you have supplied an invalid key.", {
        status: 403,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    // Generate some random data
    const generateRandomData = (basePosition, scale, range) => {
      const newPrice = scale + Math.random() * range;
      const newPosition = {
        ...basePosition,
        price: newPrice,
        value: basePosition.quantity * newPrice,
        position_date: Date.now(),
        export_date: Date.now(),
      };
      return newPosition;
    };
    const result = [
      generateRandomData(positionOneBase, positionOneBase.price, 100),
      generateRandomData(positionTwoBase, positionTwoBase.price, 50),
      generateRandomData(positionThreeBase, positionThreeBase.price, 150),
    ];

    const options = {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    return new Response(JSON.stringify(result), options);
  },
};
