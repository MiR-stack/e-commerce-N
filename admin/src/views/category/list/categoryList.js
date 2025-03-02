import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Form, Card, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import CheckAll from 'components/check-all/CheckAll';
import { useDispatch } from 'react-redux';
import { setCategoryId } from 'store/slices/globalSlice';
import { useGetCategoriesQuery } from 'store/apis/categories';
import { getImageUrl } from 'utils';
import CustomPagination from 'components/pagination/pagination';

const CategoryList = () => {
  const title = 'Category List';
  const description = 'Ecommerce Category List Page';

  // pagination
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const handlePage = (pageNumber) => {
    setPage(pageNumber);
  };

  const [sorting, setSorting] = useState({
    sortBy: null,
    sortOrder: null,
  });

  // handle status
  const [status, setStatus] = useState(null);
  const handleStatus = () => {
    setStatus(status === 'DRAFT' ? 'PUBLISED' : 'DRAFT');
  };

  // handle sorting
  const handleSort = (name) => {
    if (sorting.sortBy === name) {
      setSorting({
        sortBy: name,
        sortOrder: sorting.sortOrder === 'desc' ? 'asc' : 'desc',
      });
    } else {
      setSorting({
        sortBy: name,
        sortOrder: 'asc',
      });
    }
  };

  // handle search
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setSearch(searchTerm);
  };

  // get Categories
  const { data } = useGetCategoriesQuery({ page, limit: pageLimit, search, status, ...sorting });

  // handle pagination

  // handle limit

  const handleLimit = (limit) => {
    setPageLimit(Number(limit));
  };

  // handle select
  const allItems = data?.data.map((item) => item.id);
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

  const handleNavigation = (id) => {
    dispatch(setCategoryId(id));
    history.push('/categories/detail');
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
          <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
              <NavLink to="/categories/add">
                <CsLineIcons icon="plus" /> <span>Add Category</span>
              </NavLink>
            </Button>
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
            <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={handleSearchTerm} />
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
          {/* <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Print</Tooltip>}>
            <Button variant="foreground-alternate" className="btn-icon btn-icon-only shadow">
              <CsLineIcons icon="print" />
            </Button>
          </OverlayTrigger> */}
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
      <Row className="g-0 mb-2 d-none d-lg-flex">
        <Col xs="auto" className="sw-11 d-none d-lg-flex" />
        <Col>
          <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 h-100">
            <Col xs="2" lg="3" className="d-flex flex-column pe-1 justify-content-center">
              <div className="text-muted text-small cursor-pointer ">ID</div>
            </Col>
            <Col xs="3" lg="6" className="d-flex flex-column mb-lg-0 pe-3 d-flex" onClick={() => handleSort('name')}>
              <div className="text-muted text-small cursor-pointer sort">TITLE</div>
            </Col>
            <Col xs="2" lg="3" className="d-flex flex-column pe-1 justify-content-center">
              <div className="text-muted text-small cursor-pointer sort" onClick={handleStatus}>
                STATUS
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}

      {data?.data.map((category) => {
        const { name, id, status: categoryStatus, image_data: imageData } = category;

        const image = getImageUrl(imageData?.url);

        return (
          <Card className={`mb-2 ${selectedItems.includes(id) && 'selected'}`} key={id}>
            <Row className="g-0 h-100 sh-lg-9 position-relative">
              <Col xs="auto" className="positio-relative h-100">
                <div onClick={() => handleNavigation(id)}>
                  <img src={image} alt={imageData?.name} className="card-img card-img-horizontal sw-11 h-100" />
                </div>
              </Col>
              <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                <Row className="g-0 h-100 align-content-center">
                  <Col xs="11" lg="3" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                    <div className="lh-1 text-alternate cursor-pointer" onClick={() => handleNavigation(id)}>
                      {id}
                    </div>
                  </Col>
                  <Col lg="6" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                    <div className="lh-1 text-alternate">{name}</div>
                  </Col>
                  <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-5">
                    <Badge bg="outline-primary">{categoryStatus}</Badge>
                  </Col>
                  <Col xs="1" className="d-flex flex-column mb-2 mb-lg-0 align-items-end order-2 order-lg-last justify-content-lg-center">
                    <Form.Check className="form-check mt-2 ps-7 ps-md-2" type="checkbox" checked={selectedItems.includes(id)} onChange={() => checkItem(id)} />
                  </Col>
                </Row>
              </Col>
            </Row>
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

export default CategoryList;
