import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Form, Card, Tooltip, OverlayTrigger } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import CheckAll from 'components/check-all/CheckAll';
import { useGetCustomersQuery } from 'store/apis/customers';
import CustomPagination from 'components/pagination/pagination';
import { useDispatch } from 'react-redux';
import { setCustomerId } from 'store/slices/globalSlice';

import { MONEY_SIGN } from '../../../constants';

const CustomersList = () => {
  const title = 'Customer List';
  const description = 'Ecommerce Customer List Page';

  // handle search
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearch = () => {
    setSearch(searchTerm);
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

  const { data } = useGetCustomersQuery({ page, limit: pageLimit, search });
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (data) {
      setCustomers(data.data);
    }
  }, [data]);
  // handle seleciton

  const allItems = customers?.map((customer) => customer.id);
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

  // handle route

  const history = useHistory();
  const dispatch = useDispatch();

  const handleRoute = (id) => {
    dispatch(setCustomerId(id));
    history.push('/customers/detail');
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
            <Form.Control type="text" placeholder="Search" onChange={handleSearchTerm} />
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
              <Dropdown.Item href="#">Copy</Dropdown.Item>
              <Dropdown.Item href="#">Excel</Dropdown.Item>
              <Dropdown.Item href="#">Cvs</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Export Dropdown End */}

          {/* Length Start */}
          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Item Count</Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="shadow sw-13">
                {pageLimit} Items
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
        <Col lg="1" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
          <div className="text-muted text-small cursor-pointer sort">ID</div>
        </Col>
        <Col lg="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>
        <Col lg="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">LOCATION</div>
        </Col>
        <Col lg="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">SPENT</div>
        </Col>
        <Col lg="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">LAST ORDER</div>
        </Col>
        <Col lg="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">STATUS</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {customers?.map((customer) => {
        const { orders, id, name, number, address, is_blocked: isBlocked } = customer;

        const spent = orders.reduce((amount, order) => {
          amount += Number(order.total_amount);
          return amount;
        }, 0);

        return (
          <Card className={`mb-2 ${selectedItems.includes(id) && 'selected'}`} key={id}>
            <Card.Body className="pt-0 pb-0 sh-30 sh-lg-8">
              <Row className="g-0 h-100 align-content-center" onClick={() => checkItem(id)}>
                <Col xs="11" lg="1" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-1 order-lg-1 h-lg-100 position-relative">
                  <div className="text-muted text-small d-lg-none">Id</div>
                  <div className="text-truncate h-100 d-flex align-items-center cursor-pointer" onClick={() => handleRoute(id)}>
                    **{id.slice(-4)}
                  </div>
                </Col>
                <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-3 order-lg-2">
                  <div className="text-muted text-small d-lg-none">Name</div>
                  <div className="text-alternate">{name} </div>
                </Col>
                <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-3">
                  <div className="text-muted text-small d-lg-none">Location</div>
                  <div className="text-alternate">{address} </div>
                </Col>
                <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-4 order-lg-4">
                  <div className="text-muted text-small d-lg-none">Spent</div>
                  <div className="text-alternate">
                    <span>
                      <span className="text-small">{MONEY_SIGN} </span> {spent}
                    </span>
                  </div>
                </Col>
                <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-4">
                  <div className="text-muted text-small d-lg-none">Last Order</div>
                  <NavLink to="/customers/detail" className="text-truncate h-100 d-flex align-items-center body-link">
                    {orders[0]?.total_amount}
                  </NavLink>
                </Col>
                <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-last order-lg-5">
                  <div className="text-muted text-small d-lg-none mb-1">Status</div>
                  <div>
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Purchased</Tooltip>}>
                      <div className="d-inline-block me-2">
                        <CsLineIcons icon="boxes" className={spent ? 'text-primary' : ''} size="17" />
                      </div>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Trusted</Tooltip>}>
                      <div className="d-inline-block me-2">
                        <CsLineIcons icon="check-square" className={!isBlocked ? 'text-primary' : ''} size="17" />
                      </div>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Phone</Tooltip>}>
                      <div className="d-inline-block me-2">
                        <CsLineIcons icon="phone" className={number ? 'text-primary' : ''} size="17" />
                      </div>
                    </OverlayTrigger>
                  </div>
                </Col>
                <Col xs="1" lg="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
                  <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(id)} onChange={() => {}} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      })}

      {/* List Items End */}

      {/* Pagination Start */}
      {data?.pagination.totalPages > 1 && <CustomPagination totalPages={data?.pagination.totalPages} currentPage={page} onPageChange={handlePage} />}

      {/* Pagination End */}
    </>
  );
};

export default CustomersList;
