import React from "react";
import { Breadcrumb, BreadcrumbItem } from "shards-react";
import { Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BreadcrumbItems = ({ vocab }) => {
  const { t } = useTranslation(["word", "group-category"]);

  const Breadcrumbs = (props) => (
    <div className="breadcrumbs">
      <Breadcrumb>
        <Route path="/:path" component={BreadcrumbsItem} />
      </Breadcrumb>
    </div>
  );

  const BreadcrumbsItem = ({ match, ...rest }) => {
    return (
      <React.Fragment>
        <BreadcrumbItem className={match.isExact ? "active" : undefined}>
          {match.isExact ? (
            vocab === undefined ? (
              <>{t(`group-category:${match.params.path}`)}</>
            ) : (
              <>{t(`word:${match.params.path}`)}</>
            )
          ) : (
            <Link to={match.url || ""}>
              <>{t(`group-category:${match.params.path}`)}</>
            </Link>
          )}
        </BreadcrumbItem>
        <Route path={`${match.url}/:path`} component={BreadcrumbsItem} />
      </React.Fragment>
    );
  };

  return <Breadcrumbs />;
};

export default BreadcrumbItems;
