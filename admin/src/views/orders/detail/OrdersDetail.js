import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Row, Col, Dropdown, Card } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useSelector } from 'react-redux';
import { useGetOrderQuery, useUpdateStatusMutation, useCancelOrderMutation } from 'store/apis/order';
import { getImageUrl } from 'utils';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { MONEY_SIGN } from '../../../constants';

const OrdersDetail = () => {
  const title = 'Order Detail';
  const description = 'Ecommerce Order Detail Page';

  const orderId = useSelector((state) => state.global.orderId);

  const { data } = useGetOrderQuery(orderId);

  const initOrder = {
    createdAt: new Date(),
    customer: {},
    id: '',
    number: '',
    shippingAddress: '',
    deliveryArea: '',
    deliveryCharge: 0,
    items: [],
    paymentMethod: '',
    status: '',
    total: 0,
  };

  const [order, setOrder] = useState({ ...initOrder });
  // handle status
  const [currentStatus, setCurrentStatus] = useState();
  const [updateStatus, { error }] = useUpdateStatusMutation();
  const [cancelOrder, { isSuccess: cancelSuccess, error: cancelError }] = useCancelOrderMutation();

  useEffect(() => {
    if (error) {
      Swal.fire({ icon: 'error', text: error.data.msg });
    }
    if (cancelSuccess) {
      Swal.fire('order cancelled successfully');
    }
    if (cancelError) {
      Swal.fire({ icon: 'error', text: cancelError.data.msg });
    }
  }, [error, cancelSuccess, cancelError]);

  const handlecurrentStatus = (status) => {
    if (status === 'CANCELLED') {
      Swal.fire({
        icon: 'warning',
        title: 'Cancel Order',
        text: 'Are you sure you want to cancel order?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          cancelOrder(order.id);
        }
      });
      return;
    }

    updateStatus({ id: order.id, status });
    setCurrentStatus(status);
    Swal.fire({ icon: 'success', text: 'status updated successfully' });
  };

  useEffect(() => {
    if (data) {
      const {
        createdAt,
        customer: { name, number: customerNumber, address },
        delivery_area: { name: deliveryArea, charge },
        id,
        items,
        payment: {
          method: { name: paymentMethod },
        },
        shipping_address: shippingAddress,
        status,
        number,
      } = data;

      let subTotal = 0;
      let discount = 0;
      const products = items.map((item) => {
        const total = item.quantity * Number(item.price);
        subTotal += total;
        discount += item.discount;

        return {
          color: item.color,
          size: item.size,
          price: Number(item.price),
          image: getImageUrl(item.product.images[0].image_data.url),
          name: item.product.name,
          id: item.id,
          quantity: item.quantity,
          total,
        };
      });

      const orderData = {
        createdAt,
        customer: { name, number: customerNumber, address },
        id,
        number,
        shippingAddress,
        deliveryArea,
        deliveryCharge: charge,
        items: products,
        paymentMethod,
        status,
        total: subTotal,
        discount,
      };

      setOrder(orderData);
      setCurrentStatus(status);
    }
  }, [data]);

  const history = useHistory();
  if (!orderId) {
    history.push('/orders/list');
    return <></>;
  }

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row className="g-0">
          {/* Title Start */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/orders">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Orders</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title">
              {title}
            </h1>
          </Col>
          {/* Title End */}

          {/* Top Buttons Start */}
          <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Dropdown className="w-100 w-md-auto">
              <Dropdown.Toggle className="w-100 w-md-auto text-capitalize" variant="outline-primary">
                Status: {currentStatus}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handlecurrentStatus('PENDING')}>Status: Pending</Dropdown.Item>
                <Dropdown.Item onClick={() => handlecurrentStatus('PROCESSING')}>Status: Processing</Dropdown.Item>
                <Dropdown.Item onClick={() => handlecurrentStatus('SHIPPED')}>Status: Shipped</Dropdown.Item>
                <Dropdown.Item onClick={() => handlecurrentStatus('DELIVERED')}>Status: Delivered</Dropdown.Item>
                <Dropdown.Item onClick={() => handlecurrentStatus('CANCELLED')}>Status: cancelled</Dropdown.Item>
                <Dropdown.Item onClick={() => handlecurrentStatus('RETURNED')}>Status: Returned</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="ms-1">
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
        <Col xl="8" xxl="9">
          {/* Status Start */}
          <h2 className="small-title">Status</h2>
          <Row className="g-2 mb-5">
            <Col sm="6">
              <Card className="sh-13 sh-lg-15 sh-xl-14">
                <Card.Body className="h-100 py-3 d-flex align-items-center">
                  <Row className="g-0 align-items-center">
                    <Col xs="auto" className="pe-3">
                      <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                        <CsLineIcons icon="tag" className="text-primary" />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center lh-1-25">Order Id</div>
                      <div className="text-primary">{order.id} </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6">
              <Card className="sh-13 sh-lg-15 sh-xl-14">
                <Card.Body className="h-100 py-3 d-flex align-items-center">
                  <Row className="g-0 align-items-center">
                    <Col xs="auto" className="pe-3">
                      <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                        <CsLineIcons icon="clipboard" className="text-primary" />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center lh-1-25">Order Status</div>
                      <div className="text-primary">{order.status} </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6">
              <Card className="sh-13 sh-lg-15 sh-xl-14">
                <Card.Body className="h-100 py-3 d-flex align-items-center">
                  <Row className="g-0 align-items-center">
                    <Col xs="auto" className="pe-3">
                      <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                        <CsLineIcons icon="calendar" className="text-primary" />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center lh-1-25">Delivery Date</div>
                      <div className="text-primary">{format(new Date(order.createdAt), 'dd.MM.yyyy')}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6">
              <Card className="sh-13 sh-lg-15 sh-xl-14">
                <Card.Body className="h-100 py-3 d-flex align-items-center">
                  <Row className="g-0 align-items-center">
                    <Col xs="auto" className="pe-3">
                      <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                        <CsLineIcons icon="shipping" className="text-primary" />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center lh-1-25">Delivery Area</div>
                      <div className="text-primary">{order.deliveryArea}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Status End */}

          {/* Cart Start */}
          <h2 className="small-title">Cart</h2>
          <Card className="mb-5">
            <Card.Body>
              <div className="mb-5">
                {order.items.map((item) => (
                  <Row className="g-0 sh-9 mb-3" key={item.id}>
                    <Col xs="auto" className="h-100">
                      <img src={item.image} className="card-img rounded-md h-100 sw-13" alt="thumb" />
                    </Col>
                    <Col>
                      <div className="ps-4 pt-0 pb-0 pe-0 h-100">
                        <Row className="g-0 h-100 align-items-start align-content-center">
                          <Col xs="12" className="d-flex flex-column mb-2">
                            <div>{item.name}</div>
                            <div className="text-muted text-small">
                              {item.color?.name || ''} {item.size?.name || ''}{' '}
                            </div>
                          </Col>
                          <Col xs="12" className="d-flex flex-column mb-md-0 pt-1">
                            <Row className="g-0">
                              <Col xs="6" className="d-flex flex-row pe-2 align-items-end text-alternate">
                                <span>{item.quantity} </span>
                                <span className="text-muted ms-1 me-1">x</span>
                                <span>
                                  <span className="text-small">{MONEY_SIGN} </span>
                                  {item.price.toFixed(2)}
                                </span>
                              </Col>
                              <Col xs="6" className="d-flex flex-row align-items-end justify-content-end text-alternate">
                                <span>
                                  <span className="text-small">{MONEY_SIGN} </span>
                                  {item.total.toFixed(2)}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                ))}
              </div>
              <div>
                <Row className="g-0 mb-2">
                  <Col xs="auto" className="ms-auto ps-3 text-muted">
                    Total
                  </Col>
                  <Col xs="auto" className="sw-13 text-end">
                    <span>
                      <span className="text-small text-muted">{MONEY_SIGN}</span>
                      {order.total.toFixed(2)}
                    </span>
                  </Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto" className="ms-auto ps-3 text-muted">
                    Shipping
                  </Col>
                  <Col xs="auto" className="sw-13 text-end">
                    <span>
                      <span className="text-small text-muted">{MONEY_SIGN}</span>
                      {order.deliveryCharge}
                    </span>
                  </Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto" className="ms-auto ps-3 text-muted">
                    Sale
                  </Col>
                  <Col xs="auto" className="sw-13 text-end">
                    <span>
                      <span className="text-small text-muted"> -{MONEY_SIGN} </span>0
                    </span>
                  </Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto" className="ms-auto ps-3 text-muted">
                    Grand Total
                  </Col>
                  <Col xs="auto" className="sw-13 text-end">
                    <span>
                      <span className="text-small text-muted">{MONEY_SIGN} </span>
                      {(order.total + order.deliveryCharge).toFixed(2)}
                    </span>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
          {/* Cart End */}

          {/* Activity Start */}
          {/* <h2 className="small-title">Activity</h2>
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
                          Delivered
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
                          Shipped
                        </Button>
                        <div className="text-alternate">15.10.2021</div>
                        <div className="text-muted mt-1">Chocolate apple pie powder tart chupa chups bonbon. Donut biscuit chocolate cake pie topping. </div>
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
                          Order Received
                        </Button>
                        <div className="text-alternate">08.06.2021</div>
                        <div className="text-muted mt-1">Chocolate apple pie powder tart chupa chups bonbon. Donut biscuit chocolate cake pie topping.</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card> */}
          {/* Activity End */}
        </Col>

        <Col xl="4" xxl="3">
          {/* Address Start */}
          <h2 className="small-title">Address</h2>
          <Card className="mb-5">
            <Card.Body className="mb-n5">
              <div className="mb-5">
                <p className="text-small text-muted mb-2">CUSTOMER</p>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="user" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{order.customer?.name} </Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="pin" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{order.customer?.address} </Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="phone" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{order.customer?.number}</Col>
                </Row>
              </div>
              <div className="mb-5">
                <p className="text-small text-muted mb-2">SHIPPING ADDRESS</p>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="user" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{order.customer?.name} </Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="pin" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{order.shippingAddress} </Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="phone" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{order.number}</Col>
                </Row>
              </div>
              <div className="mb-5">
                <p className="text-small text-muted mb-2">PAYMENT METHOD</p>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="credit-card" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{order.paymentMethod} </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
          {/* Address End */}
        </Col>
      </Row>
    </>
  );
};

export default OrdersDetail;
