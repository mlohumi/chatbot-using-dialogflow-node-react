"use strict";
const dialogflow = require("dialogflow");
const structjson = require("./structjson.js");
const config = require("../config/keys");
const mongoose = require("mongoose");
const axios = require("axios");

const googleAuth = require("google-oauth-jwt");

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey,
};

const sessionClient = new dialogflow.SessionsClient({ projectId, credentials });

// const Registration = mongoose.model("registration");
// const Lead = mongoose.model("lead");

module.exports = {
  getToken: async function () {
    return new Promise((resolve) => {
      googleAuth.authenticate(
        {
          email: config.googleClientEmail,
          key: config.googlePrivateKey,
          scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        },
        (err, token) => {
          resolve(token);
        }
      );
    });
  },

  // analytics: async function (userId, user_msg, agent_msg, intent, not_handled) {
  //   var data1 = JSON.stringify({
  //     messages: [
  //       {
  //         api_key: "YOUR API KEY",
  //         type: "user",
  //         user_id: userId,
  //         time_stamp: Date.now().toString(),
  //         platform: "dezinee",
  //         message: user_msg,
  //         intent: intent,
  //         not_handled: not_handled,
  //       },
  //       {
  //         api_key: "c83c75d4-7ce5-4a0a-be3e-a1d803b8d01c",
  //         type: "agent",
  //         user_id: userId,
  //         time_stamp: Date.now().toString(),
  //         platform: "dezinee",
  //         message: agent_msg,
  //       },
  //     ],
  //   });
  //   let config1 = {
  //     method: "post",
  //     url: "https://chatbase-area120.appspot.com/api/messages",
  //     headers: {
  //       "cache-control": "no-cache",
  //       "content-type": "application/json",
  //     },
  //     data: data1,
  //   };

  //   const json = await axios(config1);
  //   const responses = JSON.stringify(json.data);
  //   return responses;
  // },

  // textQuery: async function (text, userID, parameters = {}) {
  //   let self = module.exports;
  //   const sessionPath = sessionClient.sessionPath(
  //     projectId,
  //     sessionId + userID
  //   );

  //   const request = {
  //     session: sessionPath,
  //     queryInput: {
  //       text: {
  //         text: text,
  //         languageCode: languageCode,
  //       },
  //     },
  //     queryParams: {
  //       payload: {
  //         data: parameters,
  //       },
  //     },
  //   };

  //   let responses = await sessionClient.detectIntent(request);
  //   responses = await self.handleAction(responses);
  //   return responses;
  // },

  // eventQuery: async function (event, userID, parameters = {}) {
  //   let self = module.exports;
  //   let sessionPath = sessionClient.sessionPath(projectId, sessionId + userID);

  //   const request = {
  //     session: sessionPath,
  //     queryInput: {
  //       event: {
  //         name: event,
  //         parameters: structjson.jsonToStructProto(parameters), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
  //         languageCode: languageCode,
  //       },
  //     },
  //   };

  //   let responses = await sessionClient.detectIntent(request);
  //   responses = self.handleAction(responses);
  //   return responses;
  // },

  // handleAction: function (responses) {
  //   let self = module.exports;
  //   let queryResult = responses[0].queryResult;

  //   switch (queryResult.action) {
  //     case "recommendcourses-yes":
  //       if (queryResult.allRequiredParamsPresent) {
  //         self.saveRegistration(queryResult.parameters.fields);
  //       }
  //       break;
  //     case "leadcapture-yes":
  //       console.log("1");
  //       if (queryResult.allRequiredParamsPresent) {
  //         console.log(queryResult.parameters.fields);
  //         self.saveLead(queryResult.parameters.fields);
  //       }
  //       break;
  //   }

  //   return responses;
  // },

  // saveRegistration: async function (fields) {
  //   const registration = new Registration({
  //     name: fields.name.stringValue,
  //     address: fields.address.stringValue,
  //     phone: fields.phone.stringValue,
  //     email: fields.email.stringValue,
  //     dateSent: Date.now(),
  //   });
  //   try {
  //     let reg = await registration.save();
  //     console.log(reg);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  // saveLead: async function (fields) {
  //   const lead = new Lead({
  //     name: fields.name.stringValue,
  //     email: fields.email.stringValue,
  //     phone: fields.phone.stringValue,
  //   });
  //   try {
  //     let lcap = await lead.save();
  //     console.log(lcap);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
};
