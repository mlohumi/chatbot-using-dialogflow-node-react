const { WebhookClient } = require("dialogflow-fulfillment");

const mongoose = require("mongoose");
const Demand = mongoose.model("demand");
const Coupon = mongoose.model("coupon");
const Registration = mongoose.model("registration");
const Lead = mongoose.model("lead");

module.exports = (app) => {
  app.post("/", async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });
    // console.log(agent);

    function snoopy(agent) {
      agent.add(`Welcome to my Snoopy fulfillment!`);
    }

    async function registration(agent) {
      const registration = new Registration({
        name: agent.parameters.name,
        address: agent.parameters.address,
        phone: agent.parameters.phone,
        email: agent.parameters.email,
        dateSent: Date.now(),
      });
      try {
        let reg = await registration.save();
        console.log(reg);
      } catch (err) {
        console.log(err);
      }
    }

    async function lead(fields) {
      const lead = new Lead({
        name: agent.parameters.name,
        email: agent.parameters.email,
        phone: agent.parameters.phone,
      });
      try {
        let lcap = await lead.save();
        console.log(lcap);
      } catch (err) {
        console.log(err);
      }
    }

    async function learn(agent) {
      Demand.findOne({ course: agent.parameters.courses }, function (
        err,
        course
      ) {
        if (course !== null) {
          course.counter++;
          course.save();
        } else {
          const demand = new Demand({ course: agent.parameters.courses });
          demand.save();
        }
      });
      let responseText = `You want to learn about ${agent.parameters.courses}. 
                    Here is a link to all of my courses: https://www.udemy.com/user/jana-bergant`;

      let coupon = await Coupon.findOne({ course: agent.parameters.courses });
      if (coupon !== null) {
        responseText = `You want to learn about ${agent.parameters.courses}. 
                Here is a link to the course: ${coupon.link}`;
      }

      agent.add(responseText);
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    let intentMap = new Map();
    intentMap.set("snoopy", snoopy);
    intentMap.set("learn courses", learn);
    intentMap.set("recommend - yes", registration);
    intentMap.set("More Details Yes - Lead Capture", lead);
    intentMap.set("Default Fallback Intent", fallback);

    agent.handleRequest(intentMap);
  });
};
