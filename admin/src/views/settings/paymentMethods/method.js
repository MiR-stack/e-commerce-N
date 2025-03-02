import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useGetMethodQuery } from 'store/apis/paymetnMethods';
import AddMethod from './addMethod';
import MethodList from './methodList';

const PaymentMethods = () => {
  const title = ' Payment Methods';
  const description = 'Ecommerce Payment methods Page';

  const [method, setMethod] = useState();
  const [id, setId] = useState();

  const { data } = useGetMethodQuery(id);

  useEffect(() => {
    if (data) {
      setMethod(data);
    }
  }, [data]);

  const handleId = (methodId) => {
    setId(methodId);
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

          <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto" type="submit" form="payment-method-form">
              <CsLineIcons icon={id ? 'save' : 'plus'} /> <span>{id ? 'Update' : 'Add'} Method</span>
            </Button>
          </Col>
        </Row>
      </div>

      <Row>
        <AddMethod methodData={method} />
        <MethodList handleId={handleId} />
      </Row>
    </>
  );
};

export default PaymentMethods;
