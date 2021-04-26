import React from 'react';
import { withRouter } from 'react-router-dom';

const BackButton = ({ history }) => 
<button className="btn-primary scrollto d-inline-flex align-items-center justify-content-center align-self-center" onClick={() => history.goBack()}>
    <span>&larr; Go Back</span>
    <i className="bi bi-arrow-right"></i>
</button>

export default withRouter(BackButton);