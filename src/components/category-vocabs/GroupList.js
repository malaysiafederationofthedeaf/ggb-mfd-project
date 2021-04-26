import React from "react";
import { Row } from "shards-react";
import GroupDetail from "./GroupDetail";

const GroupList = ({group, categories}) => {
  return(
      <Row>
        {categories.map((category, key) => (
          <GroupDetail group={group} category={category} key={key} />
        ))}
      </Row>        
  );
}

export default GroupList;
