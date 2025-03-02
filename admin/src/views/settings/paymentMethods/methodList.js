import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Tooltip, Card, Col, OverlayTrigger, Row } from 'react-bootstrap';
import { useDeleteMethodMutation, useGetMethodsQuery } from 'store/apis/paymetnMethods';
import { getImageUrl } from 'utils';

function MethodList({ handleId }) {
  const { data } = useGetMethodsQuery();

  const [methods, setMethods] = useState();

  useEffect(() => {
    if (data) {
      setMethods(data);
    }
  }, [data]);

  const [deleteMethod] = useDeleteMethodMutation();

  return (
    <>
      {/* Banner List Start */}
      <Col xl="12" className="my-5">
        <h2 className="small-title">Banner List</h2>
        {methods?.map((method) => {
          const { name, number, description, image_data: imageData, id } = method;

          const image = getImageUrl(imageData?.url);

          return (
            <Card className="mb-2" key={id}>
              <Card.Body>
                <Row className="g-4 align-items-center">
                  <Col xs="12" xl="3">
                    <img src={image} className="card-img rounded-md h-100 sh-10 sw-15" alt={imageData?.alt_text} />
                  </Col>
                  <Col xs="12" lg="5" className="ps-4">
                    <div className="heading text-primary mb-2">{name}</div>
                    <div className="text-alternate">{description}</div>
                  </Col>
                  <Col xs="8" lg="3">
                    <div className="heading">{number}</div>
                  </Col>
                  <Col className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-last order-lg-5">
                    <div>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Edit</Tooltip>}>
                        <div className="d-inline-block me-2 cursor-pointer" onClick={() => handleId(id)}>
                          <CsLineIcons icon="edit" className="text-primary" size="17" />
                        </div>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Delete</Tooltip>}>
                        <div className="d-inline-block me-2 cursor-pointer" onClick={() => deleteMethod(id)}>
                          <CsLineIcons icon="close" className="text-primary" size="17" />
                        </div>
                      </OverlayTrigger>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })}
      </Col>
    </>
  );
}

export default MethodList;
