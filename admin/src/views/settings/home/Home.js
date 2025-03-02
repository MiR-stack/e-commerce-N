import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const Home = () => {
  const title = 'Settings';
  const description = 'Ecommerce Settings Page';

  return (
    <>
      <HtmlHead title={title} description={description} />
      {/* Title Start */}
      <div className="page-title-container">
        <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
          <CsLineIcons icon="chevron-left" size="13" />
          <span className="align-middle text-small ms-1">Home</span>
        </NavLink>
        <h1 className="mb-0 pb-0 display-4" id="title">
          {title}
        </h1>
      </div>
      {/* Title End */}

      {/* Settings List Start */}
      <Row className="row-cols-1 row-cols-md-2 g-2">
        <Col>
          <Card className="hover-scale-up h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                    <CsLineIcons icon="board-2" className="text-primary" />
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-column ps-card justify-content-start">
                    <div className="d-flex flex-column justify-content-center mb-2">
                      <NavLink to="/settings/general" className="heading text-primary stretched-link">
                        General Settings
                      </NavLink>
                    </div>
                    <div className="text-alternate">
                      Easily update your website's core identity in this section. Customize your site name, logo, description, and social media links to ensure
                      your brand remains consistent and engaging across all channels.
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="hover-scale-up h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                    <CsLineIcons icon="image" className="text-primary" />
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-column ps-card justify-content-start">
                    <div className="d-flex flex-column justify-content-center mb-2">
                      <NavLink to="/settings/banners" className="heading text-primary stretched-link">
                        Banners
                      </NavLink>
                    </div>
                    <div className="text-alternate">
                      Manage and update the banners that appear on your website. This section allows you to easily add, modify, or remove banner images and
                      configure their display options to keep your content fresh and engaging.
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="hover-scale-up h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                    <CsLineIcons icon="tool" className="text-primary" />
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-column ps-card justify-content-start">
                    <div className="d-flex flex-column justify-content-center mb-2">
                      <NavLink to="/settings/attributes" className="heading text-primary stretched-link">
                        Attributes
                      </NavLink>
                    </div>
                    <div className="text-alternate">
                      Easily customize the color and size attributes with this editing section. Choose your preferred color and adjust the size to match your
                      needs. Your changes will be applied instantly for a seamless experience.
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="hover-scale-up h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                    <CsLineIcons icon="pin" className="text-primary" />
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-column ps-card justify-content-start">
                    <div className="d-flex flex-column justify-content-center mb-2">
                      <NavLink to="/settings/delivery-area" className="heading text-primary stretched-link">
                        Delivery Area
                      </NavLink>
                    </div>
                    <div className="text-alternate">
                      Manage and customize the geographical regions where your service operates. In this section, you can define delivery zones, set specific
                      boundaries, configure pricing, and adjust availability based on location to ensure efficient and timely service
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="hover-scale-up h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                    <CsLineIcons icon="wallet" className="text-primary" />
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-column ps-card justify-content-start">
                    <div className="d-flex flex-column justify-content-center mb-2">
                      <NavLink to="/settings/payment-methods" className="heading text-primary stretched-link">
                        Payment Methods
                      </NavLink>
                    </div>
                    <div className="text-alternate">
                      Manage and configure all your payment options from a single dashboard. This section lets you add, remove, or update payment gateways, set
                      up transaction parameters, and adjust settings such as currency and limits to ensure smooth and secure transactions.
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="hover-scale-up h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                    <CsLineIcons icon="coin" className="text-primary" />
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-column ps-card justify-content-start">
                    <div className="d-flex flex-column justify-content-center mb-2">
                      <NavLink to="/settings/general" className="heading text-primary stretched-link">
                        Currencies
                      </NavLink>
                    </div>
                    <div className="text-alternate">
                      Halvah jujubes bonbon gummies caramels. Carrot cake pie caramels caramels. Wafer tootsie roll gingerbread croissant ice cream.
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="hover-scale-up h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                    <CsLineIcons icon="file-text" className="text-primary" />
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-column ps-card justify-content-start">
                    <div className="d-flex flex-column justify-content-center mb-2">
                      <NavLink to="/settings/general" className="heading text-primary stretched-link">
                        Billing
                      </NavLink>
                    </div>
                    <div className="text-alternate">
                      Macaroon candy ice cream candy canes chocolate bar sesame snaps jelly pudding caramels. Dragée macaroon lemon drops icing cupcake
                      gingerbread.
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="hover-scale-up h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                    <CsLineIcons icon="content" className="text-primary" />
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-column ps-card justify-content-start">
                    <div className="d-flex flex-column justify-content-center mb-2">
                      <NavLink to="/settings/general" className="heading text-primary stretched-link">
                        Taxes
                      </NavLink>
                    </div>
                    <div className="text-alternate">
                      Dragée macaroon lemon drops icing cupcake gingerbread. Apple pie caramels tart. Caramels brownie gummies.
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Settings List End */}
    </>
  );
};

export default Home;
