import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Tooltip, Card, Col, OverlayTrigger, Row } from 'react-bootstrap';
import { useDeleteDeliveryAreaMutation, useGetDeliveryAreasQuery } from 'store/apis/deliveryArea';

function AreaList({ handleId }) {
  const { data } = useGetDeliveryAreasQuery();

  const [areas, setAreas] = useState();

  useEffect(() => {
    if (data) {
      setAreas(data);
    }
  }, [data]);

  const [deleteArea] = useDeleteDeliveryAreaMutation();

  return (
    <>
      {/* Delivery Area List Start */}
      <Col xl="12" className="my-5">
        <h2 className="small-title">Delivery Area List</h2>
        {areas?.map((area) => {
          const { id, name, charge } = area;

          return (
            <Card className="mb-2" key={id}>
              <Card.Body>
                <Row className="g-4">
                  <Col className="ps-4">
                    <div className="heading text-primary mb-2">{name}</div>
                    <div className="text-alternate">{charge}</div>
                  </Col>
                  <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-last order-lg-5">
                    <div>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Edit</Tooltip>}>
                        <div className="d-inline-block me-2 cursor-pointer" onClick={() => handleId(id)}>
                          <CsLineIcons icon="edit" className="text-primary" size="17" />
                        </div>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Delete</Tooltip>}>
                        <div className="d-inline-block me-2 cursor-pointer" onClick={() => deleteArea(id)}>
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

export default AreaList;
