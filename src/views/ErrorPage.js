import React from "react";
import { Container } from "shards-react";
import { useTranslation } from "react-i18next";
import BackButton from "../components/common/BackButton";
import StopwatchIcon from "../images/general/icon/stopwatch-coming-soon-icon";

const ErrorPage = ({ title, body, buttonLabel, onButtonClick }) => {
    const { t } = useTranslation();

    return (
        <Container fluid className="main-content-container px-4 pb-4">
            <div className="error">
                <div className="error__content">
                    <StopwatchIcon height={150} width={150} />
                    <h1>{title}</h1>
                    {body && <h2>{body}</h2>}
                    {buttonLabel && onButtonClick ? (
                        <button className="btn btn-primary" onClick={onButtonClick}>
                            {buttonLabel}
                        </button>
                    ) : (
                        <BackButton />
                    )}
                </div>
            </div>
        </Container>
    );
};

export default ErrorPage;
