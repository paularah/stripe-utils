import Stripe from "stripe";

/**
 * You can modify your idempoency configs and
 * network retries here.
 */

const stripe = new Stripe("your api keys here", {
  apiVersion: "2020-08-27",
});

/**
 * Subscription Payment Flow:  recieve your payment method
 * ideally from your client side or app, create a customer
 * from the payment method and then create a subscription
 * payment method -> create customer -> create subscription
 */

/**
 * @param PaymentMethod string
 * @param email string
 * @param productID string -> get this from stripe dashboard
 * @description creates a recoccuring
 * subscription to a product
 */

/**
 * certain scenerio require extra confirmation from the customer
 * you should problably offload the result from creating the webhook
 * to a message queue, and use the stripe hook to deque on sucessful
 * confirmstion of payment.
 */
const createSomeSubscription = async (
  paymentMethod: string,
  email: string,
  productID: string
): Promise<void> => {
  try {
    const customerParams: Stripe.CustomerCreateParams = {
      payment_method: paymentMethod,
      email: email,
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    };

    const customer: Stripe.Customer = await stripe.customers.create(
      customerParams
    );

    const subscriptionParams: Stripe.SubscriptionCreateParams = {
      customer: customer.id,
      items: [{ plan: productID }],
      expand: ["latest_invoice.payment_intent"],
    };
    const subscription: Stripe.Subscription = await stripe.subscriptions.create(
      subscriptionParams
    );
    if (!subscription) throw new Error("subscription error");

    // double check the values from the subsectiopn object to decide
    // suscrition needs an extra step. also drill down and ensure the
    //properties are correct.

    //log these stuff into your database.
  } catch (e) {
    console.error(e);
  }
};
