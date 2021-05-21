import React from "react";
import { Row } from "shards-react";
import GroupDetail from "./GroupDetail";

const GroupList = ({categories}) => {
  return(
      <Row>
        {categories.map((category, key) => (
          <GroupDetail category={category} key={key} />
        ))}
      </Row>        
  );
}

export default GroupList;
