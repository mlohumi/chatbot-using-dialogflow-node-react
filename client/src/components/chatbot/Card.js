import React from "react";

const Card = (props) => {
  return (
    <div style={{ paddingRight: 10, float: "left" }}>
      <div className="card" style={{ width: "18rem", borderRadius: 8 }}>
        <img
          className="card-img-top"
          style={{ borderRadius: 8 }}
          src={props.payload.image}
          alt={props.payload.header}
        />

        <div className="card-body">
          <h5 className="card-title">{props.payload.header}</h5>
          <p className="card-text">{props.payload.description}</p>
          <a href={props.payload.link} class="btn btn-primary">
            GET NOW
          </a>
        </div>
      </div>
    </div>
  );

  //     return (
  //         <div  style={{ height: 270, paddingRight:30, float: 'left'}}>
  //             <div className="card">
  //                 <div className="card-image" style={{ width: 240}}>
  //                     <img alt={props.payload.header} src={props.payload.image} />
  //                     <span className="card-title">{props.payload.header}</span>
  //                 </div>
  //                 <div className="card-content">
  //                     {props.payload.description}
  //                     <p> <a href="/">{props.payload.price}</a></p>
  //                 </div>
  //                 <div className="card-action">
  //                     <a target="_blank" rel="noopener noreferrer" href={props.payload.link}>GET NOW</a>
  //                 </div>
  //             </div>
  //         </div>
  //     );
};

export default Card;
