import React, { Component } from "react";
import axios from "axios/index";
import { withRouter } from "react-router-dom";

import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";

import Message from "./Message";
import Card from "./Card";
import QuickReplies from "./QuickReplies";

import "./global.css";
import avatar from "./bot.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const cookies = new Cookies();

class Chatbot extends Component {
  messagesEnd;
  talkInput;

  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);

    this.state = {
      messages: [],
      showBot: true,
      shopWelcomeSent: false,
      clientToken: false,
      regenerateToken: 0,
    };
    if (cookies.get("userID") === undefined) {
      cookies.set("userID", uuid(), { path: "/" });
    }
  }

  /* Chatbase Analytics API call */
  async cb_analytics(userId, user_msg, agent_msg, intent, not_handled) {
    let ss = await axios.post("/api/analytics", {
      userId,
      user_msg,
      agent_msg,
      intent,
      not_handled,
    });
    console.log(ss);
  }
  /*End*/

  async df_text_query(text) {
    let says = {
      speaks: "user",
      msg: {
        text: {
          text: text,
        },
      },
    };
    this.setState({ messages: [...this.state.messages, says] });
    const request = {
      queryInput: {
        text: {
          text: text,
          languageCode: "en-US",
        },
      },
    };
    await this.df_client_call(request);
  }

  async df_event_query(event) {
    const request = {
      queryInput: {
        event: {
          name: event,
          languageCode: "en-US",
        },
      },
    };

    await this.df_client_call(request);
  }

  async df_client_call(request) {
    try {
      if (this.state.clientToken === false) {
        const res = await axios.get("/api/get_client_token");
        this.setState({ clientToken: res.data.token });
      }

      var config = {
        headers: {
          Authorization: "Bearer " + this.state.clientToken,
          "Content-Type": "application/json; charset=utf-8",
        },
      };
      const res = await axios.post(
        "https://dialogflow.googleapis.com/v2/projects/" +
          process.env.REACT_APP_GOOGLE_PROJECT_ID +
          "/agent/sessions/" +
          process.env.REACT_APP_DF_SESSION_ID +
          cookies.get("userID") +
          ":detectIntent",
        request,
        config
      );
      let says = {};
      // console.log(cookies.get("userID"))
      console.log(res);

      if (res.data.queryResult.fulfillmentMessages) {
        for (let msg of res.data.queryResult.fulfillmentMessages) {
          says = {
            speaks: "bot",
            msg: msg,
          };
          this.setState({ messages: [...this.state.messages, says] });
        }

        /*Chatbase Analytics variables - START*/

        let userId = cookies.get("userID").toString();
        let user_msg = res.data.queryResult.queryText;
        let agent_msg = res.data.queryResult.fulfillmentText;
        let intent;
        let not_handled;
        if (Object.keys(res.data.queryResult.intent).length === 0) {
          intent = "smalltalk";
          not_handled = false;
        } else if (
          res.data.queryResult.intent.isFallback &&
          res.data.queryResult.intent.isFallback === true
        ) {
          intent = "Fallback Intent";
          not_handled = true;
        } else {
          intent = res.data.queryResult.intent.displayName;
          not_handled = false;
        }

        this.cb_analytics(userId, user_msg, agent_msg, intent, not_handled);

        /* END */
      }
    } catch (e) {
      console.log(e);
      if (e.response.status === 401 && this.state.regenerateToken < 1) {
        this.setState({ clientToken: false, regenerateToken: 1 });
        this.df_client_call(request);
      } else {
        let says = {
          speaks: "bot",
          msg: {
            text: {
              text:
                "I'm having troubles. I need to terminate. will be back later",
            },
          },
        };
        this.setState({ messages: [...this.state.messages, says] });
        let that = this;
        setTimeout(function () {
          that.setState({ showBot: false });
        }, 2000);
      }
    }
  }

  resolveAfterXSeconds(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, x * 1000);
    });
  }

  async componentDidMount() {
    this.df_event_query("Welcome");

    if (window.location.pathname === "/shop" && !this.state.shopWelcomeSent) {
      await this.resolveAfterXSeconds(1);
      this.df_event_query("WELCOME_SHOP");
      this.setState({ shopWelcomeSent: true, showBot: true });
    }

    this.props.history.listen(() => {
      if (
        this.props.history.location.pathname === "/shop" &&
        !this.state.shopWelcomeSent
      ) {
        this.df_event_query("WELCOME_SHOP");
        this.setState({ shopWelcomeSent: true, showBot: true });
      }
    });
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    if (this.talkInput) {
      this.talkInput.focus();
    }
  }

  show(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showBot: true });
  }

  hide(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showBot: true });
  }

  _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    switch (payload) {
      case "recommended_yes":
        this.df_event_query("SHOW_RECOMMENDATIONS");
        break;
      case "training_masterclass":
        this.df_event_query("MASTERCLASS");
        break;
      default:
        this.df_text_query(text);
        break;
    }
  }

  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card} />);
  }

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.cards
    ) {
      //message.msg.payload.fields.cards.listValue.values

      return (
        <div key={i}>
          <div className="card-panel grey lighten-5 z-depth-1">
            <div style={{ overflow: "hidden" }}>
              <div className="col s2">
                <a
                  href="/"
                  className="btn-floating btn-large waves-effect waves-light red"
                >
                  {message.speaks}
                </a>
              </div>
              <div style={{ overflow: "auto", overflowY: "scroll" }}>
                <div
                  style={{
                    height: 300,
                    width: message.msg.payload.cards.length * 270,
                  }}
                >
                  {this.renderCards(message.msg.payload.cards)}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.quick_replies
    ) {
      return (
        <QuickReplies
          text={message.msg.payload.text ? message.msg.payload.text : null}
          key={i}
          replyClick={this._handleQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.quick_replies}
        />
      );
    }
  }

  renderMessages(returnedMessages) {
    if (returnedMessages) {
      return returnedMessages.map((message, i) => {
        return this.renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  }

  _handleInputKeyPress(e) {
    if (e.key === "Enter") {
      this.df_text_query(e.target.value);
      // e.target.value = "";
      this.setState({ input: "" });
    }
  }

  _handleChange(e) {
    this.setState({ input: e.target.value });
  }

  _handleClick(e) {
    this.df_text_query(this.state.input);
    this.setState({ input: "" });
  }
  render() {
    // if (this.state.showBot) {
    return (
      <div className="bot-outline">
        <nav className="navbar navbar-light bg-light top-nav">
          <div className="logo-img">
            <img src={avatar} alt="avatar"></img>
          </div>
          <div className="active">
            <h4>Lavanya</h4>
            <h6>Virtual Assistant</h6>
          </div>
        </nav>
        <div className="bot-check">
          {/* <div className = "chat-page"> */}
          {this.renderMessages(this.state.messages)}
          <div
            ref={(el) => {
              this.messagesEnd = el;
            }}
            // style={{ float: "left", clear: "both" }}
          ></div>
        </div>
        {/* <div className="input-group mb-3">
          <input type="text" className="form-control msg-input" placeholder="Write a message..."
            ref={(input) => {
              this.talkInput = input;
            }}
            onKeyPress={this._handleInputKeyPress}
            id="user_says">
          </input>
        </div> */}
        <div className="input-group mb-3">
          <input
            type="text"
            value={this.state.input}
            onChange={this._handleChange}
            className="form-control msg-input"
            placeholder="Write a message..."
            ref={(input) => {
              this.talkInput = input;
            }}
            onKeyPress={this._handleInputKeyPress}
            id="user_says"
          ></input>
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="icon-inp"
            onClick={this._handleClick}
          />
          {/* <div class="input-group-append"> */}
          {/* <button class="btn btn-outline-secondary" onClick={this._handleClick} type="button">Button</button> */}
          {/* </div> */}
        </div>
      </div>
    );
    // } else {
    //   return (
    //     <div
    //       style={{
    //         minHeight: 40,
    //         maxHeight: 500,
    //         width: 400,
    //         position: "center",
    //         bottom: 0,
    //         right: 0,
    //         border: "1px solid lightgray",
    //       }}
    //     >
    //       <nav>
    //         <div className="nav-wrapper">
    //           <a href="/" className="brand-logo">
    //             ChatBot
    //           </a>
    //           <ul id="nav-mobile" className="right hide-on-med-and-down">
    //             <li>
    //               <a href="/" onClick={this.show}>
    //                 Show
    //               </a>
    //             </li>
    //           </ul>
    //         </div>
    //       </nav>
    //       <div
    //         ref={(el) => {
    //           this.messagesEnd = el;
    //         }}
    //         style={{ float: "left", clear: "both" }}
    //       ></div>
    //     </div>
    //   );
    // }
  }
}

export default withRouter(Chatbot);
