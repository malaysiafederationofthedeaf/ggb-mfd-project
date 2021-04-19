import React, { useEffect, useState } from "react";
import { Col } from "shards-react";
import ItemsCarousel from "react-items-carousel";

import PageTitle from "../common/PageTitle";
import CategoryDetail from "./CategoryDetail";
import { useTranslation } from "react-i18next";

const CategoryList = ({ category }) => {
  const [noOfCards, setNoOfCards] = useState((window.innerWidth > 1200 && Object.keys(category.categories).length >= 3) ? 3 : 2);
  useEffect(() => {
    function handleResize() {
      setNoOfCards((window.innerWidth > 1200 && Object.keys(category.categories).length >= 3) ? 3 : 2)  
    }
    window.addEventListener('resize', handleResize)

    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  })

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const { t } = useTranslation();

  return (
      <Col sm="12" md="6" lg="4">
        <div className="category-card-wrapper">
          <PageTitle title={t(category.categoryGroup)}/>     
          <ItemsCarousel
            // Carousel configurations
            numberOfCards={noOfCards}
            gutter={12}
            showSlither={true}
            firstAndLastGutter={true}
            freeScrolling={false}
            // Active item configurations
            requestToChangeActive={(activeItemIndex) =>
              setActiveItemIndex(activeItemIndex)
            }
            activeItemIndex={activeItemIndex}
            activePosition={"center"}
            chevronWidth={30}
            rightChevron={">"}
            leftChevron={"<"}
            outsideChevron={false}
          >
            {category.categories.map((categoryItem, key) => (
              <CategoryDetail categoryItem={categoryItem} key={key} />
            ))}
          </ItemsCarousel>
        </div>
      </Col>
  );
};

export default CategoryList;
