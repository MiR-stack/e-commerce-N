import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useGetDeliveryAreaQuery } from 'store/apis/deliveryArea';
import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import AddDeliveryArea from './addDeliveryArea';
import AreaList from './areaList';

const DeliverArea = () => {
  const title = ' Delivery Area';
  const description = 'Ecommerce Delivery Area Page';

  const [area, setArea] = useState();
  const [id, setId] = useState();

  const { data } = useGetDeliveryAreaQuery(id);

  useEffect(() => {
    if (data) {
      setArea(data);
    }
  }, [data]);

  const handleId = (areaId) => {
    setId(areaId);
  };

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row className="g-0">
          {/* Title Start */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/settings">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Home</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title">
              {title}
            </h1>
          </Col>
          {/* Title End */}
        </Row>
      </div>

      <Row>
        <AddDeliveryArea deliveryAreaData={area} />
        <AreaList handleId={handleId} />
      </Row>
    </>
  );
};

export default DeliverArea;
