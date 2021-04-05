import React from "react";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
  CardImg,
} from "shards-react";
import classNames from "classnames";
import Store from "../flux/store";
import images from "../images/mfd/sign-sample/index";

const SignList = ({ filter }) => {
  const classes = classNames("mt-3");

  return (
    <div className={classes}>
      {Store.getSignItems()
        // eslint-disable-next-line array-callback-return
        .filter((val) => {
          if (filter === "") return val;
          else if (
            val.titleMalay.toLowerCase().includes(filter.toLowerCase()) ||
            val.title.toLowerCase().includes(filter.toLowerCase())
          )
            return val;
        })
        .map((val, key) => {
          return (
            <ListGroup key={key}>
              <ListGroupItem>
                <CardImg
                  className="mx-auto d-block float-right img-fluid"
                  style={{ maxWidth: "40%" }}
                  src={images.imgSrc[key]}
                  alt="sign"
                />
                <ListGroupItemText>{val.titleMalay}</ListGroupItemText>
                <ListGroupItemText>{val.title}</ListGroupItemText>
              </ListGroupItem>
            </ListGroup>
          );
        })}
    </div>
  );
};

export default SignList;
