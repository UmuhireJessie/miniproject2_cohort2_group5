const functions = require("firebase-functions");
const stripe = require('stripe')(functions.config().stripe.testkey);

const calculateOrderAmount = (items) => {
    prices = [];
    catalog = [
        {'id': '0', 'price': 2.99},
        {'id': '1', 'price': 3.99},
        {'id': '2', 'price': 4.99},
        {'id': '3', 'price': 5.99},
        {'id': '4', 'price': 6.99},
    ];
items.forEach(item => {
    price = catalog.find(x => x.id == item.id).prices;
    price.push(price);
});
return parseInt(prices.reduce((a, b) => a + b ) * 100);
}
const generateResponse = function (intent) {
    switch (intent.status) {
        case 'requires_action':
            return {               clientSecret: intent.clientSecret,
               requiresAction: true,
               status: intent. status,
            };
            case 'requires_payment_method':
                return {
                    'error': 'your card was denied, please provide a new payment method',
                };
                case 'succeeded':
                        console.log("payment succeeded");
                        return{
                            clientSecret: intent.clientSecret,
                            status: intent. status 
                        };
    }
    return {error: 'Failed'};
}

exports.StripePayEndpointMethodId = functions.https.onRequest(async (req, res) => {
    const { paymentMothodId, items, currency, useStripeSdk, } = req.body;

    const orderAmount = calculateOrderAmount(items);

    try{
       if  (paymentMethodId){
        const params = {amount: orderAmount,
        confirm: true,
        confirmation_method:'manual',
        currency: currency,
        payment_method: paymentMethodId,
        use_stripe_skd: useStripeSdk,
    }
    const intent = await stripe.paymentIntents.create(params);
    console.log(`Intent ${intent}`);
    return res.send(generateResponse(intent));
       }
       return res.sendStatus(400);
    }
    catch (e) {
        return res.send({error: e.message});
    }
});

exports.StripePayEndpointIntentId = functions.https.onRequest(async (req, res) => {
    const { paymentIntentId } = req.body;

    try {
        if (paymentIntentId){
            const intent = await stripe.paymentIntents.confirm(paymentIntentId);
            return res.send(generateResponse(intent));
        }
        return res.sendStatus(400)
    } catch (e) {
        return res.send({error:e.message});
    }
});