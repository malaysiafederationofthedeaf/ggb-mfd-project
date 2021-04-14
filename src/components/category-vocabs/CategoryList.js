import React, { useEffect, useState } from "react";
import { Row } from "shards-react";
import ItemsCarousel from "react-items-carousel";

import PageTitle from "../common/PageTitle";
import CategoryDetail from "./CategoryDetail";
import { useTranslation } from "react-i18next";

const CategoryList = ({ category }) => {
  const [noOfCards, setNoOfCards] = useState((window.innerWidth > 768) ? 3 : 2);
  useEffect(() => {
    function handleResize() {
      setNoOfCards((window.innerWidth > 768) ? 3 : 2)  
    }
    window.addEventListener('resize', handleResize)

    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  })

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const { t } = useTranslation();

  return (
    <>
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title={t(category.categoryGroup)}
          className="text-sm-left"
        />
      </Row>
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
    </>
  );
};

export default CategoryList;
