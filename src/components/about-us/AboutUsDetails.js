import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, ListGroup, ListGroupItem } from "shards-react";

const AboutUsDetails = ({ mfdDetails, t }) => (
  <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      <div className="mb-3 mx-auto">
        <img src={mfdDetails.logo} alt={t(mfdDetails.name)} width="110" />
      </div>
      <h4 className="mb-0">{t(mfdDetails.name)}</h4>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-4">
        <strong className="text-muted d-block mb-2">
          {t(mfdDetails.metaTitle)}
        </strong>
        <p>{t(mfdDetails.metaValue1)}</p>
        <p>{t(mfdDetails.metaValue2)}</p>
      </ListGroupItem>
    </ListGroup>
  </Card>
);

AboutUsDetails.propTypes = {
  /**
   * The user details object.
   */
  mfdDetails: PropTypes.object,
};

AboutUsDetails.defaultProps = {
  mfdDetails: {
    name: "mfd_name",
    logo: require("./../../images/mfd/mfd-logo.jpg"),
    metaTitle: "meta_title",
    metaValue1: "meta_value_1",
    metaValue2: "meta_value_2",
  },
};

export default AboutUsDetails;
