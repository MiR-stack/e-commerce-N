import React from "react";

const TabDescription = ({ description }) => {
  return (
    <div
      className="ltn__shop-details-tab-content-inner"
      dangerouslySetInnerHTML={{ __html: description }}
    ></div>
  );
};

export default TabDescription;
