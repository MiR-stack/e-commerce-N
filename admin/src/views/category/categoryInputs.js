import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Select from 'react-select';
import { useQuill } from 'react-quilljs';
import { format } from 'date-fns';

import 'quill/dist/quill.bubble.css';
import Active from 'components/quill/Active';
import { Row, Col, Button, Dropdown, Form, Card } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useGetCategoriesQuery } from 'store/apis/categories';
import DetailImage from 'components/detailGallery/DetailImage';
import { STATUS } from '../../constants';

const CategoryInputs = ({ categoryData, submit }) => {
  const title = 'Add Category';
  const description = 'Ecommerce Product Detail Page';

  // set parent category

  const { data } = useGetCategoriesQuery({});
  const [parent, setParent] = useState({ value: categoryData?.parent?.id || '', label: categoryData?.parent?.name || 'Select Category' });
  const categories = data?.data?.map((item) => ({ value: item.id, label: item.name })) || [];
  const categoryOptions = [{ value: '', label: 'Select Category' }, ...categories];

  //   category data

  const [category, setCategory] = useState({
    name: categoryData?.name || '',
    slug: categoryData?.slug || null,
  });

  const handleChange = (e) => {
    setCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //   set category status
  const [status, setStatus] = useState(categoryData?.status || STATUS.draft);
  const handleStatus = (text) => {
    setStatus(text);
  };

  // description editor
  const [categoryDescription, setCategoryDescription] = useState('');

  const theme = 'bubble';
  const modules = {
    toolbar: [['bold', 'italic', 'underline', 'strike'], [{ header: [1, 2, 3, 4, 5, 6, false] }], [{ list: 'ordered' }, { list: 'bullet' }], [{ align: [] }]],
    active: {},
  };
  const { quill, quillRef, Quill } = useQuill({ theme, modules });
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setCategoryDescription(quill.root.innerHTML);
      });
      quill.clipboard.dangerouslyPasteHTML(categoryData?.description || '');
      quill.blur();
    }
  }, [quill, categoryData]);
  if (Quill && !quill) {
    Quill.debug('error');
    Quill.register('modules/active', Active);
  }

  // handle image
  const [image, setImage] = useState();
  const handleImage = (file) => {
    setImage(file);
  };

  // organize category data
  const formData = new FormData();

  formData.append('file', image);

  const newCategory = { ...category, description: categoryDescription, status, parent_id: parent.value };

  Object.keys(newCategory).forEach((key) => {
    if (newCategory[key]) {
      formData.append(key, newCategory[key]);
    }
  });

  // handle category creation or update

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    const submitData = { data: formData };

    if (categoryData?.id) {
      submitData.id = categoryData.id;
    }

    submit(submitData);
  };

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row className="g-0">
          {/* Title Start */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/categories/list">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Categories</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title">
              {title}
            </h1>
          </Col>
          {/* Title End */}

          {/* Top Buttons Start */}
          <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-only ms-1" disabled={Boolean(!image)} type="submit" form="form">
              <CsLineIcons icon="save" />
            </Button>
            <div className="btn-group ms-1 w-100 w-sm-auto">
              <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-sm-auto">
                <CsLineIcons icon="send" /> <span>{status}</span>
              </Button>
              <Dropdown>
                <Dropdown.Toggle className="dropdown-toggle dropdown-toggle-split" variant="outline-primary" />
                <Dropdown.Menu>
                  {status === STATUS.draft ? (
                    <Dropdown.Item onClick={() => handleStatus(STATUS.published)}>Published</Dropdown.Item>
                  ) : (
                    <Dropdown.Item onClick={() => handleStatus(STATUS.draft)}>Draft</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          {/* Top Buttons End */}
        </Row>
      </div>

      <Row>
        <Col xl="8">
          {/* category Info Start */}
          <h2 className="small-title">Category Info</h2>
          <Card className="mb-5">
            <Card.Body>
              <Form id="form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={category.name} required onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control type="text" name="slug" value={category.slug} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Select classNamePrefix="react-select" options={categoryOptions} value={parent} onChange={setParent} placeholder="" />
                </div>

                <div>
                  <Form.Label>Description</Form.Label>
                  <div ref={quillRef} className="sh-25 html-editor html-editor-bubble pe-2" />
                </div>
              </Form>
            </Card.Body>
          </Card>
          {/* category Info End */}
        </Col>

        <Col xl="4">
          {/* Image Start */}
          <h2 className="small-title">Image</h2>
          <Card className="mb-5">
            <Card.Body>
              <DetailImage handleFile={handleImage} imageData={categoryData?.image_data} />
            </Card.Body>
          </Card>
          {/* Image End */}

          {/* History Start */}
          {categoryData && (
            <>
              <h2 className="small-title">History</h2>
              <Card className="mb-5">
                <Card.Body className="mb-n3">
                  <div className="mb-3">
                    <div className="text-small text-muted">STATUS</div>
                    <div>{categoryData.status}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-small text-muted">CREATED BY</div>
                    <div>{categoryData.createdBy?.name}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-small text-muted">CREATE DATE</div>
                    <div>{format(new Date(categoryData.createdAt), 'dd.MM.yyyy - HH:mm')}</div>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}
          {/* History End */}
        </Col>
      </Row>
    </>
  );
};

export default CategoryInputs;
