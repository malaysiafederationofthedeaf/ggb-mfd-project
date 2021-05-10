import React from "react";
import { Breadcrumb, BreadcrumbItem } from "shards-react";
import { Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const BreadcrumbItems = ({vocab}) => {

  const { t } = useTranslation();

  const Breadcrumbs = (props) => (
    <div className="breadcrumbs">
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/browse-by-category">
            {t("category")}
          </Link>
        </BreadcrumbItem>
        <Route path='/:path' component={BreadcrumbsItem} />          
      </Breadcrumb>
    </div>
  )
  
  const BreadcrumbsItem = ({ match, ...rest }) => {
    return(
      <React.Fragment>
        <BreadcrumbItem className={match.isExact ? 'active' : undefined}>
          {match.isExact ? 
            i18next.language==="en" || vocab === undefined ?
              <>{t(match.params.path)}</> 
              :
              <>{vocab.wordMalay}</>
            : 
            <Link to={match.url || ''}>
                {t(match.params.path)}
            </Link>
          }
        </BreadcrumbItem>
        <Route path={`${match.url}/:path`} component={BreadcrumbsItem} />
      </React.Fragment>
    );
  }

  return(
    <Breadcrumbs />
  );

}

export default BreadcrumbItems;
