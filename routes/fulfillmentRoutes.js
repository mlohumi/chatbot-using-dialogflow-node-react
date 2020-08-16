const { WebhookClient, Payload } = require("dialogflow-fulfillment");

const mongoose = require("mongoose");
const Order = mongoose.model("order");

module.exports = (app) => {
  app.post("/", async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    async function final(agent) {
      const orderid = Math.floor(100000 + Math.random() * 900000).toString();
      const name = agent.parameters.name[0];
      const size = agent.parameters.size;
      const toppings = agent.parameters.toppings;
      const order = new Order({
        toppings: toppings,
        pizza: agent.parameters.pizza,
        name: name,
        phone: agent.parameters.phone[0],
        size: size,
        address: agent.parameters.Address[0],
        orderid: orderid,
      });
      const msg =
        "Awesome " +
        name +
        " your order " +
        size +
        " " +
        toppings +
        " " +
        "pizza has been placed. OrderId is " +
        orderid +
        ".";
      var payload = {
        quick_replies: [
          {
            text: "Track Order",
            payload: "track order",
          },
        ],
        text: msg,
      };
      try {
        let ord = await order.save();
        await agent.add(
          new Payload(agent.UNSPECIFIED, payload, {
            rawPayload: true,
            sendAsMessage: true,
          })
        );

        console.log(ord);
      } catch (err) {
        console.log(err);
      }
    }

    async function track(agent) {
      let ord = agent.parameters.order;
      const payload = {
        quick_replies: [
          {
            text: "Track Order",
            payload: "track order",
          },
        ],
        text: "No order found with this order id. Please try again",
      };
      let orderf = await Order.findOne({ orderid: ord });
      try {
        if (orderf !== null) {
          agent.add(
            "Your order is out for delivery. One of our delivery boy will contact you soon"
          );
        } else {
          await agent.add(
            new Payload(agent.UNSPECIFIED, payload, {
              rawPayload: true,
              sendAsMessage: true,
            })
          );
        }
      } catch (err) {
        console.log(err);
      }
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    let intentMap = new Map();
    intentMap.set("final", final);
    intentMap.set("track order", track);
    intentMap.set("order pizza", final);
    intentMap.set("Default Fallback Intent", fallback);

    agent.handleRequest(intentMap);
  });
};
