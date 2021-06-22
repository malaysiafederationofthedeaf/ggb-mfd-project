import React from "react";
import i18next from "i18next";

const VocabWordPerkataan = ({word, perkataan}) => {
  return(
      <div className="vocab-word-perkataan">
            <div className="vocab-word-perkataan-title">
                {i18next.language==="en" ? word : perkataan}
            </div>
            <div className="vocab-word-perkataan-subtitle">
                {i18next.language==="en" ? perkataan : word}
            </div>
      </div>        
  );
}

export default VocabWordPerkataan;
