import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Card, Badge } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useSelector } from 'react-redux';
import { useCustomerBlockToggleMutation, useGetCustomerQuery, useGetCustomerRecentOrdersQuery, useGetCustomerStatsQuery } from 'store/apis/customers';
import { format } from 'date-fns';
import { outlineColors } from 'views/orders/list/OrdersList';
import { MONEY_SIGN } from '../../../constants';

const CustomersDetail = () => {
  const title = 'Customer Detail';
  const description = 'Ecommerce Customer Detail Page';

  const customerId = useSelector((state) => state.global.customerId);

  const history = useHistory();
  if (!customerId) {
    history.push('/customers/list');
  }

  const { data: customerData } = useGetCustomerQuery(customerId);
  const { data: customerOrders } = useGetCustomerRecentOrdersQuery(customerId);
  const { data: customerStats } = useGetCustomerStatsQuery(customerId);
  const [toggleBlock] = useCustomerBlockToggleMutation();
  const handleToggleBlock = () => {
    toggleBlock(customerId);
  };

  const name = customerData?.name.split(' ');
  const avatarText = `${name?.[0][0]}${name?.[1]?.[0]}`.toUpperCase();

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row className="g-0">
          {/* Title Start */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/customers">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Customers</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title">
              {title}
            </h1>
          </Col>
          {/* Title End */}

          {/* Top Buttons Start */}
          <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto">
              <CsLineIcons icon="save" /> <span>Update</span>
            </Button>
            <Dropdown className="ms-1" align="end">
              <Dropdown.Toggle className="btn-icon btn-icon-only dropdown-toggle-no-arrow" variant="outline-primary">
                <CsLineIcons icon="more-horizontal" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Edit</Dropdown.Item>
                <Dropdown.Item>View Invoice</Dropdown.Item>
                <Dropdown.Item>Track Package</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          {/* Top Buttons End */}
        </Row>
      </div>

      <Row>
        <Col xl="4">
          <h2 className="small-title">Info</h2>
          <Card className="mb-5">
            <Card.Body className="mb-n5">
              <div className="d-flex align-items-center flex-column mb-5">
                <div className="mb-5 d-flex align-items-center flex-column">
                  <div className="sw-6 sh-6 mb-3 d-inline-block bg-primary d-flex justify-content-center align-items-center rounded-xl">
                    <div className="text-white">{avatarText} </div>
                  </div>
                  <div className="h5 mb-1 text-capitalize">{customerData?.name} </div>
                  <div className="text-muted">
                    <CsLineIcons icon="pin" className="me-1" />
                    <span className="align-middle">{customerData?.address} </span>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between w-100 w-sm-50 w-xl-100">
                  <Button variant="primary" className="w-100 me-2">
                    Edit
                  </Button>
                  <Button variant="outline-primary" className="w-100 me-2" onClick={handleToggleBlock}>
                    {customerData?.is_blocked ? 'Unblock' : ' Block'}
                  </Button>
                  <Button variant="outline-primary" className="btn-icon btn-icon-only">
                    <CsLineIcons icon="more-horizontal" />
                  </Button>
                </div>
              </div>
              <div className="mb-5">
                <Row className="g-0 align-items-center mb-2">
                  <Col xs="auto">
                    <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                      <CsLineIcons icon="credit-card" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="ps-3">
                    <Row className="g-0">
                      <Col>
                        <div className="sh-5 d-flex align-items-center lh-1-25">Lifetime Spent</div>
                      </Col>
                      <Col xs="auto">
                        <div className="sh-5 d-flex align-items-center">
                          {MONEY_SIGN} {customerStats?.lifetimeSpent.toFixed(2)}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="g-0 align-items-center mb-2">
                  <Col xs="auto">
                    <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                      <CsLineIcons icon="cart" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="ps-3">
                    <Row className="g-0">
                      <Col>
                        <div className="sh-5 d-flex align-items-center lh-1-25">Avarage Order</div>
                      </Col>
                      <Col xs="auto">
                        <div className="sh-5 d-flex align-items-center">
                          {MONEY_SIGN} {customerStats?.averageOrder.toFixed(2)}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="g-0 align-items-center mb-2">
                  <Col xs="auto">
                    <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                      <CsLineIcons icon="boxes" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="ps-3">
                    <Row className="g-0">
                      <Col>
                        <div className="sh-5 d-flex align-items-center lh-1-25">Order Count</div>
                      </Col>
                      <Col xs="auto">
                        <div className="sh-5 d-flex align-items-center">{customerStats?.orderCount} </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="mb-5">
                <p className="text-small text-muted mb-2"> ADDRESS</p>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="user" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{customerData?.name} </Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="pin" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{customerData?.address} </Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="phone" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{customerData?.number} </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl="8">
          {/* Recent Orders Start */}
          <div className="d-flex justify-content-between">
            <h2 className="small-title">Recent Orders</h2>
            <Button variant="background-alternate" size="xs" className="btn-icon btn-icon-end p-0 text-small">
              <span className="align-bottom">View All</span> <CsLineIcons icon="chevron-right" className="align-middle" size="12" />
            </Button>
          </div>
          <div className="mb-5">
            {customerOrders?.map((order) => (
              <Card className="mb-2" key={order.id}>
                <Card.Body className="sh-16 sh-md-8 py-0">
                  <Row className="g-0 h-100 align-content-center">
                    <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 h-md-100">
                      <div className="text-muted text-small d-md-none">Id</div>
                      <NavLink to="/orders/detail" className="text-truncate h-100 d-flex align-items-center">
                        **{order.id.slice(-4)}
                      </NavLink>
                    </Col>
                    <Col xs="6" md="4" className="d-flex flex-column justify-content-center mb-2 mb-md-0">
                      <div className="text-muted text-small d-md-none">Price</div>
                      <div className="text-alternate">
                        <span>
                          <span className="text-small">{MONEY_SIGN}</span>
                          {order.total_amount}
                        </span>
                      </div>
                    </Col>
                    <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0">
                      <div className="text-muted text-small d-md-none">Date</div>
                      <div className="text-alternate">{format(new Date(order.createdAt), 'dd.MM.yyyy')}</div>
                    </Col>
                    <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 align-items-md-end">
                      <div className="text-muted text-small d-md-none">Status</div>
                      <Badge bg={`outline-${outlineColors[order.status]}`}>{order.status}</Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
          {/* Recent Orders End */}

          {/* History Start */}
          {/* <h2 className="small-title">History</h2>
          <Card className="mb-5">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                  <div className="w-100 d-flex sh-1" />
                  <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                    <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                  </div>
                  <div className="w-100 d-flex h-100 justify-content-center position-relative">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                </Col>
                <Col className="mb-4">
                  <div className="h-100">
                    <div className="d-flex flex-column justify-content-start">
                      <div className="d-flex flex-column">
                        <Button variant="link" className="p-0 pt-1 heading text-start">
                          New Order
                        </Button>
                        <div className="text-alternate">21.12.2021</div>
                        <div className="text-muted mt-1">
                          Jujubes tootsie roll liquorice cake jelly beans pudding gummi bears chocolate cake donut. Jelly-o sugar plum fruitcake bonbon bear
                          claw cake cookie chocolate bar. Tiramisu soufflé apple pie.
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="g-0">
                <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                  <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                  <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                    <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                  </div>
                  <div className="w-100 d-flex h-100 justify-content-center position-relative">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                </Col>
                <Col className="mb-4">
                  <div className="h-100">
                    <div className="d-flex flex-column justify-content-start">
                      <div className="d-flex flex-column">
                        <Button variant="link" className="p-0 pt-1 heading text-start">
                          New Order
                        </Button>
                        <div className="text-alternate">15.10.2021</div>
                        <div className="text-muted mt-1">Biscuit donut powder sugar plum pastry. Chupa chups topping pastry halvah.</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="g-0">
                <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                  <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                  <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                    <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                  </div>
                  <div className="w-100 d-flex h-100 justify-content-center position-relative">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                </Col>
                <Col className="mb-4">
                  <div className="h-100">
                    <div className="d-flex flex-column justify-content-start">
                      <div className="d-flex flex-column">
                        <Button variant="link" className="p-0 pt-1 heading text-start">
                          New Order
                        </Button>
                        <div className="text-alternate">15.10.2021</div>
                        <div className="text-muted mt-1">Apple pie cotton candy tiramisu biscuit cake muffin tootsie roll bear claw cake.</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="g-0">
                <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                  <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                  <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                    <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                  </div>
                  <div className="w-100 d-flex h-100 justify-content-center position-relative">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                </Col>
                <Col className="mb-4">
                  <div className="h-100">
                    <div className="d-flex flex-column justify-content-start">
                      <div className="d-flex flex-column">
                        <Button variant="link" className="p-0 pt-1 heading text-start">
                          New Order
                        </Button>
                        <div className="text-alternate">15.10.2021</div>
                        <div className="text-muted mt-1">Marzipan muffin cheesecake. Caramels wafer jelly beans.</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="g-0">
                <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                  <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                  <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                    <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                  </div>
                  <div className="w-100 d-flex h-100 justify-content-center position-relative">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                </Col>
                <Col className="mb-4">
                  <div className="h-100">
                    <div className="d-flex flex-column justify-content-start">
                      <div className="d-flex flex-column">
                        <Button variant="link" className="p-0 pt-1 heading text-start">
                          New Order
                        </Button>
                        <div className="text-alternate">15.10.2021</div>
                        <div className="text-muted mt-1">Dragée macaroon lemon drops icing cupcake gingerbread. Apple pie caramels tart.</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="g-0">
                <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                  <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                  <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                    <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                  </div>
                  <div className="w-100 d-flex h-100 justify-content-center position-relative" />
                </Col>
                <Col>
                  <div className="h-100">
                    <div className="d-flex flex-column justify-content-start">
                      <div className="d-flex flex-column">
                        <Button variant="link" className="p-0 pt-1 heading text-start">
                          Registered
                        </Button>
                        <div className="text-alternate">08.06.2021</div>
                        <div className="text-muted mt-1">Marshmallow donut sweet roll. Wafer tootsie roll gingerbread croissant ice cream.</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card> */}
          {/* History End */}
        </Col>
      </Row>
    </>
  );
};

export default CustomersDetail;
