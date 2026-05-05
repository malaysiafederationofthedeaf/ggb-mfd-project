import React from "react";
import { Row } from "shards-react";
import GroupDetail from "./GroupDetail";

const GroupList = ({categories, group}) => {
  return(
      <Row>
        {categories.map((category) => (
          <GroupDetail category={category} group={group} key={category.category} />
        ))}
      </Row>        
  );
}

export default GroupList;
