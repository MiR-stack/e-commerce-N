import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Form, Card, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CustomPagination from 'components/pagination/pagination';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import CheckAll from 'components/check-all/CheckAll';
import { useGetOrdersQuery } from 'store/apis/order';
import { useExport } from 'utils';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { setCustomerId, setOrderId } from 'store/slices/globalSlice';

import { MONEY_SIGN } from '../../../constants';

export const outlineColors = {
  PENDING: 'warning',
  PROCESSING: 'primary',
  SHIPPING: 'info',
  DELIVERED: 'success',
  RETURNED: 'dark',
  CANCELLED: 'danger',
};

const OrdersList = () => {
  const title = 'Orders List';
  const description = 'Ecommerce Orders List Page';

  // handle search
  const [serachTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearch = () => {
    setSearch(serachTerm);
  };

  // pagination
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const handlePage = (newPage) => {
    setPage(newPage);
  };

  const handleLimit = (limit) => {
    setPageLimit(limit);
  };

  const { data } = useGetOrdersQuery({ page, pageLimit, search });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (data) {
      setOrders(data.data);
    }
  }, [data]);

  // handle seleciton

  const allItems = orders?.map((order) => order.id);
  const [selectedItems, setSelectedItems] = useState([]);
  const checkItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((x) => x !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const toggleCheckAll = (allSelect) => {
    if (allSelect) {
      setSelectedItems(allItems);
    } else {
      setSelectedItems([]);
    }
  };

  // handle download

  const selectedOrders = orders?.filter((order) => selectedItems.includes(order.id));

  const downloadData = selectedOrders?.map((item) => ({
    name: item.customer.name,
    address: item.shipping_address,
    number: item.number,
    amount: item.total_amount,
  }));

  const { handleExcelDownload, handleCopy, handleCSVDownload } = useExport(downloadData);

  // handle route

  const history = useHistory();
  const dispatch = useDispatch();

  const handleRoute = (type, id) => {
    if (type === 'customer') {
      dispatch(setCustomerId(id));
      history.push('/customers/detail');
    }

    if (type === 'order') {
      dispatch(setOrderId(id));
      history.push('/orders/detail');
    }
  };

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row className="g-0">
          {/* Title Start */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Home</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title">
              {title}
            </h1>
          </Col>
          {/* Title End */}

          {/* Top Buttons Start */}
          <Col xs="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-only ms-1 d-inline-block d-lg-none">
              <CsLineIcons icon="sort" />
            </Button>
            <div className="btn-group ms-1 check-all-container">
              <CheckAll
                allItems={allItems}
                selectedItems={selectedItems}
                onToggle={toggleCheckAll}
                inputClassName="form-check"
                className="btn btn-outline-primary btn-custom-control py-0"
              />
              <Dropdown align="end">
                <Dropdown.Toggle className="dropdown-toggle dropdown-toggle-split" variant="outline-primary" />
                <Dropdown.Menu>
                  <Dropdown.Item>Move</Dropdown.Item>
                  <Dropdown.Item>Archive</Dropdown.Item>
                  <Dropdown.Item>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          {/* Top Buttons End */}
        </Row>
      </div>

      <Row className="mb-3">
        <Col md="5" lg="3" xxl="2" className="mb-1">
          {/* Search Start */}
          <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
            <Form.Control type="text" placeholder="Search" value={serachTerm} onChange={handleSearchTerm} />
            <span className="search-magnifier-icon" onClick={handleSearch}>
              <CsLineIcons icon="search" />
            </span>
            <span className="search-delete-icon d-none">
              <CsLineIcons icon="close" />
            </span>
          </div>
          {/* Search End */}
        </Col>
        <Col md="7" lg="9" xxl="10" className="mb-1 text-end">
          {/* Print Button Start */}
          <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Print</Tooltip>}>
            <Button variant="foreground-alternate" className="btn-icon btn-icon-only shadow">
              <CsLineIcons icon="print" />
            </Button>
          </OverlayTrigger>
          {/* Print Button End */}

          {/* Export Dropdown Start */}
          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export</Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow">
                <CsLineIcons icon="download" />
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu className="shadow dropdown-menu-end">
              <Dropdown.Item onClick={handleCopy}>Copy</Dropdown.Item>
              <Dropdown.Item onClick={handleExcelDownload}>Excel</Dropdown.Item>
              <Dropdown.Item onClick={handleCSVDownload}>Cvs</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Export Dropdown End */}

          {/* Length Start */}
          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Item Count</Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="shadow sw-13">
                10 Items
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu className="shadow dropdown-menu-end">
              <Dropdown.Item onClick={() => handleLimit(5)}>5 Items</Dropdown.Item>
              <Dropdown.Item onClick={() => handleLimit(10)}>10 Items</Dropdown.Item>
              <Dropdown.Item onClick={() => handleLimit(20)}>20 Items</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Length End */}
        </Col>
      </Row>

      {/* List Header Start */}
      <Row className="g-0 h-100 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
        <Col md="3" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
          <div className="text-muted text-small cursor-pointer sort">ID</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">PURCHASE</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">DATE</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">STATUS</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {orders?.map((order) => (
        <Card className={`mb-2 ${selectedItems.includes(order.id) && 'selected'}`} key={order.id}>
          <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(order.id)}>
              <Col xs="11" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                <div className="text-muted text-small d-md-none">Id</div>
                <div
                  className="text-truncate h-100 d-flex align-items-center text-bold text-primary cursor-pointer"
                  onClick={() => handleRoute('order', order.id)}
                >
                  {order.id}
                </div>
              </Col>
              <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                <div className="text-muted text-small d-md-none">Name</div>
                <div className="text-alternate text-bold cursor-pointer" onClick={() => handleRoute('customer', order.customer.id)}>
                  {order.customer.name}
                </div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
                <div className="text-muted text-small d-md-none">Purchase</div>
                <div className="text-alternate">
                  <span>
                    <span className="text-small">{MONEY_SIGN}</span>
                    {order.total_amount}
                  </span>
                </div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
                <div className="text-muted text-small d-md-none">Date</div>
                <div className="text-alternate">{format(new Date(order.createdAt), 'dd.MM.yyyy')} </div>
              </Col>
              <Col xs="6" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>
                  <Badge bg={`outline-${outlineColors[order.status]}`}>{order.status}</Badge>
                </div>
              </Col>
              <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
                <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(order.id)} onChange={() => {}} />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* List Items End */}

      {/* Pagination Start */}
      {data?.pagination.totalPages > 1 && <CustomPagination totalPages={data?.pagination.totalPages} currentPage={page} onPageChange={handlePage} />}
      {/* Pagination End */}
    </>
  );
};

export default OrdersList;
