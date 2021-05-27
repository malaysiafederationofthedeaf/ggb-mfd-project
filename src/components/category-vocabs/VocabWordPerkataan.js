import React from "react";
import i18next from "i18next";

const VocabWordPerkataan = ({word, perkataan}) => {
  return(
      <div className="vocab-word-perkataan">
            <strong className="text-muted d-block mb-2">
                {i18next.language==="en" ? word : perkataan}
            </strong>
            <strong className="text d-block mb-2">
                {i18next.language==="en" ? perkataan : word}
            </strong>
      </div>        
  );
}

export default VocabWordPerkataan;
