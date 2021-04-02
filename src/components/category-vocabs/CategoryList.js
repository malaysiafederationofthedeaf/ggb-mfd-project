import React, { useState } from "react";
import { Row } from "shards-react";
import ItemsCarousel from 'react-items-carousel';

import PageTitle from "../common/PageTitle";
import CategoryDetail from "./CategoryDetail";

const CategoryList = ({category}) => {
    const [activeItemIndex, setActiveItemIndex] = useState(0);

    return (
        <>
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle sm="4" title={category.categoryGroupMalay} subtitle={category.categoryGroup} className="text-sm-left" /> 
            </Row>         
            <ItemsCarousel
                // Carousel configurations
                numberOfCards={2}
                gutter={12}
                showSlither={true}
                firstAndLastGutter={true}
                freeScrolling={false}

                // Active item configurations
                requestToChangeActive={(activeItemIndex) => setActiveItemIndex(activeItemIndex)}
                activeItemIndex={activeItemIndex}
                activePosition={'center'}

                chevronWidth={30}
                rightChevron={'>'}
                leftChevron={'<'}
                outsideChevron={false}
            >
                {category.categories.map(categoryItem => <CategoryDetail categoryItem={categoryItem} />)}                    
            </ItemsCarousel>  
        </>
    );
};

export default CategoryList;