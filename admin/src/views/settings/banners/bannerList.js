import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Tooltip, Card, Col, OverlayTrigger, Row } from 'react-bootstrap';
import { useDeleteBannerMutation, useGetBannersQuery } from 'store/apis/banner';
import { getImageUrl } from 'utils';

function BannerList({ handleId }) {
  const { data } = useGetBannersQuery();

  const [banners, setBanners] = useState();

  useEffect(() => {
    if (data) {
      setBanners(data);
    }
  }, [data]);

  const [deleteBanner] = useDeleteBannerMutation();

  return (
    <>
      {/* Banner List Start */}
      <Col xl="12" className="my-5">
        <h2 className="small-title">Banner List</h2>
        {banners?.map((banner) => {
          const { title, sub_title: subTitle, image_data: imageData, id } = banner;

          const image = getImageUrl(imageData?.url);

          return (
            <Card className="mb-2" key={id}>
              <Card.Body>
                <Row className="g-4">
                  <Col xs="12" xl="3">
                    <img src={image} className="card-img rounded-md h-100 sh-10 sw-15" alt={imageData?.alt_text} />
                  </Col>
                  <Col className="ps-4">
                    <div className="heading text-primary mb-2">{title}</div>
                    <div className="text-alternate">{subTitle}</div>
                  </Col>
                  <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-last order-lg-5">
                    <div>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Edit</Tooltip>}>
                        <div className="d-inline-block me-2 cursor-pointer" onClick={() => handleId(id)}>
                          <CsLineIcons icon="edit" className="text-primary" size="17" />
                        </div>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Delete</Tooltip>}>
                        <div className="d-inline-block me-2 cursor-pointer" onClick={() => deleteBanner(id)}>
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

export default BannerList;
