import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import ComingSoon from "./ComingSoon";
import PageTitle from "../components/common/PageTitle";
import GroupList from "../components/category-vocabs/GroupList";
import Breadcrumbs from "../components/layout/Breadcrumbs/Breadcrumbs";
import { getCategoriesOfGroup, getGroupList} from "../services/api/categoryAPI";
import { Store } from "../flux";

const SelectedGroup = () => {
  const { group } = useParams();
  const { t, i18n } = useTranslation("group-category");
  const [groupCategories, setGroupCategories] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMalay = i18n.language === "ms";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allGroups, allGroupList] = await Promise.all([
          getCategoriesOfGroup(),
          getGroupList(),
        ]);
        
        setGroupList(allGroupList);

        const formattedGroup = Store.formatString(group); // format URL param
        const matchedKey = Object.keys(allGroups).find(
          (key) => Store.formatString(key) === formattedGroup
        );

        if (matchedKey && allGroups[matchedKey]) {
          setGroupCategories(allGroups[matchedKey]);
        } else {
          setGroupCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch group categories:", err);
        setGroupCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [group]);

  // return Error page if no Categories are returned
  if (loading) return null;
  if (!groupCategories || groupCategories.length === 0) return <ComingSoon />;

  // Find the group object to get the Malay or English name
  const currentGroupObj = groupList.find(
    (g) => Store.formatString(g.group) === Store.formatString(group)
  );

  return (
    <>
      <Breadcrumbs />
      <Container
        fluid
        className="main-content-container px-4 vocab-list-wrapper"
      >
        <Row noGutters className="page-header py-4">
          <PageTitle
            title={t(isMalay ? currentGroupObj.kumpulan : currentGroupObj.group)}
            md="12"
            className="ml-sm-auto mr-sm-auto"
          />
        </Row>
        <Row>
          <Col>
            <GroupList
              categories={groupCategories}
              group={group}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SelectedGroup;
