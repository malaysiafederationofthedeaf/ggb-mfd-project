import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from "shards-react";

const BackButton = ({ history }) => <Button pill onClick={() => history.goBack()}>&larr; Go Back</Button>;

export default withRouter(BackButton);