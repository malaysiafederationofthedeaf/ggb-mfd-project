import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
} from "shards-react";

const AboutUsDetails = ({ mfdDetails }) => (
  <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      <div className="mb-3 mx-auto">
        <img
          src={mfdDetails.logo}
          alt={mfdDetails.name}
          width="110"
        />
      </div>
      <h4 className="mb-0">{mfdDetails.name}</h4>
    </CardHeader>
    <ListGroup flush>
      <ListGroupItem className="p-4">
        <strong className="text-muted d-block mb-2">
          {mfdDetails.metaTitle}
        </strong>
        <p>{mfdDetails.metaValue1}</p>
        <p>{mfdDetails.metaValue2}</p>
      </ListGroupItem>
    </ListGroup>
  </Card>
);

AboutUsDetails.propTypes = {
  /**
   * The user details object.
   */
   mfdDetails: PropTypes.object
};

AboutUsDetails.defaultProps = {
  mfdDetails: {
    name: "Persekutuan Orang Pekak Malaysia",
    logo: require("./../../images/mfd/mfd-logo.jpg"),
    metaTitle: "Siapa Kami",
    metaValue1:
      "PERSEKUTUAN ORANG PEKAK MALAYSIA atau MALAYSIAN FEDERATION OF THE DEAF (MFD) ialah sebuah organisasi peringkat kebangsaan yang memayungi Persatuan Orang Pekak di Malaysia. MFD meletakkan matlamat untuk menyatupadukan semua organisasi orang Pekak dan berkaitan dengan pembangunan serta perkhidmatan orang Pekak untuk bekerjasama memperjuangkan hak dan keperluan orang Pekak serta membangunkan sosio-ekonomi orang Pekak agar dapat hidup setara dengan rakyat yang lain.",
    metaValue2:
      "MFD didaftar oleh Pendaftar Pertubuhan pada 8hb Disember 1997 dan merupakan PSK yang diiktiraf oleh Jabatan Kebajikan Masyarakat."
  }
};

export default AboutUsDetails;
