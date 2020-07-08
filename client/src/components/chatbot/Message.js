import React from 'react';

import avatar from "./bot.jpg"

const Message = (props) => {
    return (

        <div className="chat-page">
            <div className="panel panel-default bot-msg">
                {props.speaks === "bot" && (
                    <div className="bot-text">
                        <img style={{ width: '45px', height: '45px', borderRadius: "50%" }} src={avatar} alt="avatar"></img>
                        <div className='msg-text-bot'>
                            <span>{props.text}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="panel panel-default user-msg">
                {props.speaks === "user" &&
                    <div className="user-text">
                        {/* <img style={{ width: '45px', height: '45px', borderRadius: "50%" }} src={avatar} alt="avatar"></img> */}
                        <div className="msg-text-user">
                            <span>{props.text}</span>
                        </div>
                    </div>
                }
            </div>
        </div>




        // <div className="col s12 m8 offset-m2 l6 offset-l3">
        //     <div className="card-panel grey lighten-5 z-depth-1">
        //         <div className="row valign-wrapper">
        //             {props.speaks==='bot' &&
        //             <div className="col s2">
        //                 <a href="/" className="btn-floating btn-large waves-effect waves-light red">{"army"}</a>
        //             </div>
        //             }
        //             <div className="col s10">
        //               <span className="black-text">
        //                 {props.text}
        //               </span>
        //             </div>
        //             {props.speaks==='user' &&
        //             <div className="col s2">
        //                 <a href="/" className="btn-floating btn-large waves-effect waves-light red">{props.speaks}</a>
        //             </div>
        //             }
        //         </div>
        //     </div>
        // </div>

    );
};

export default Message;
