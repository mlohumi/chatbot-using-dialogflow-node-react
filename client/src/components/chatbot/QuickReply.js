import React from "react";

const QuickReply = (props) => {
  if (props.reply.payload) {
    return (
      <a
        style={{ margin: 5 }}
        href="/"
        className="btn btn-outline-primary"
        onClick={(event) =>
          props.click(event, props.reply.payload, props.reply.text)
        }
      >
        {props.reply.text}
      </a>
    );
  } else {
    return (
      <a
        style={{ margin: 3 }}
        href={props.reply.link}
        className="btn btn-outline-primary"
      >
        {props.reply.text}
      </a>
    );
  }
};

export default QuickReply;
