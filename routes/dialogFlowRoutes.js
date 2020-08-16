"use strict";

const chatbot = require("../chatbot/chatbot");

module.exports = (app) => {
  // app.get('/', (req, res) => {
  //     res.send({'hello': 'Johnny'})
  // });

  app.post("/api/df_text_query", async (req, res) => {
    let responses = await chatbot.textQuery(
      req.body.text,
      req.body.userID,
      req.body.parameters
    );
    res.send(responses[0].queryResult);
  });

  app.post("/api/df_event_query", async (req, res) => {
    let responses = await chatbot.eventQuery(
      req.body.event,
      req.body.userID,
      req.body.parameters
    );
    res.send(responses[0].queryResult);
  });

  // app.post("/api/analytics", async (req, res) => {
  //   let responses = await chatbot.analytics(
  //     req.body.userId,
  //     req.body.user_msg,
  //     req.body.agent_msg,
  //     req.body.intent,
  //     req.body.not_handled
  //   );
  //   res.send(responses);
  //   // console.log(responses);
  // });

  app.get("/api/get_client_token", async (req, res) => {
    let token = await chatbot.getToken();
    res.send({ token });
  });
};
