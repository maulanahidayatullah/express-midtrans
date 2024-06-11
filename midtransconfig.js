const midtransClient = require('midtrans-client');

exports.coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: 'SB-Mid-server-uRIs6payfeCB_v40ZxCXh_tC',
    clientKey: 'SB-Mid-client-cj8yDNXWgfPZnNol'
});