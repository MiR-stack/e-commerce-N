import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.bubble.css';
import Active from 'components/quill/Active';
import { useCreateImageMutation, useDeleteImageMutation } from 'store/apis/products';
import { Row, Col, Button, Dropdown, Form, Card } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { format } from 'date-fns';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import DetailImage from 'components/detailGallery/DetailImage';
import DetailGallery from 'components/detailGallery/DetailGallery';
import { useDispatch } from 'react-redux';
import { setProductId } from 'store/slices/globalSlice';
import { STATUS } from '../../../constants';

const ProductInputs = ({ InputData, defaultData, submit, productId }) => {
  const title = 'Product Detail';
  const description = 'Ecommerce Product Detail Page';

  // product status
  const productStatusOptions = [
    { value: 'IN_STOCK', label: 'in stock' },
    { value: 'OUT_OF_STOCK', label: 'out of stock' },
    { value: 'COMMING_SOON', label: 'comming soon' },
  ];

  const initProductStatus = productStatusOptions.find((item) => item.value === defaultData?.stock_status) || productStatusOptions[0];
  const [productStatus, setProductStatus] = useState({ ...initProductStatus });

  // product

  const [product, setProduct] = useState({
    name: defaultData?.name || '',
    slug: defaultData?.slug || '',
    sku: defaultData?.sku || '',
    base_price: defaultData?.base_price || 0,
    sale_price: defaultData?.sale_price || 0,
    stock_quantity: defaultData?.stock_quantity || 1,
    meta_title: defaultData?.meta_title || '',
    meta_description: defaultData?.meta_description || '',
    status: defaultData?.status || STATUS.draft,
  });

  const handleChange = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // handle status
  const [status, setStatus] = useState(defaultData?.status || STATUS.draft);
  const handleStatus = (text) => {
    setStatus(text);
  };

  //   handle description
  const [productDescription, setProductDescription] = useState();

  // Editor
  const theme = 'bubble';
  const modules = {
    toolbar: [['bold', 'italic', 'underline', 'strike'], [{ header: [1, 2, 3, 4, 5, 6, false] }], [{ list: 'ordered' }, { list: 'bullet' }], [{ align: [] }]],
    active: {},
  };
  const { quill, quillRef, Quill } = useQuill({ theme, modules });
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setProductDescription(quill.root.innerHTML);
      });
      quill.clipboard.dangerouslyPasteHTML(defaultData?.description || '');
      quill.blur();
    }
  }, [quill]);
  if (Quill && !quill) {
    Quill.debug('error');
    Quill.register('modules/active', Active);
  }

  //   handle speacial and fetured
  const [features, setFeatures] = useState({
    is_special: defaultData?.is_special || false,
    is_featured: defaultData?.is_featured || false,
  });
  const handleFeatures = (e) => {
    setFeatures({
      ...features,
      [e.target.name]: !features[e.target.name],
    });
  };

  // handle categories
  const initSelectValues = defaultData?.categories?.map((category) => ({ label: category.name, value: category.id })) || [];

  const [selectValues, setSelectValues] = useState(initSelectValues || []);
  const categoryOptions = InputData?.categories?.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  // handle Sizes
  const initSizes = defaultData?.sizes?.map((size) => ({ label: size.name, value: size.id })) || [];

  const [sizesSelect, setSizesSelect] = useState(initSizes || []);
  const SizesOptions = InputData?.sizes?.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  // handle categories
  const initColors = defaultData?.colors?.map((color) => ({ label: color.name, value: color.id })) || [];

  const [colorsSelect, setColorsSelect] = useState(initColors || []);
  const colorOptions = InputData?.colors?.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  //   constract product data

  const categoryIds = selectValues.map((category) => category.value);
  const colorIds = colorsSelect.map((color) => color.value);
  const sizeIds = sizesSelect.map((size) => size.value);
  const productData = {
    ...product,
    id: defaultData?.id,
    base_price: Number(product.base_price),
    sale_price: Number(product.sale_price),
    stock_quantity: Number(product.stock_quantity),
    description: productDescription,
    categoryIds,
    colorIds,
    sizeIds,
    status,
    ...features,
  };

  // handle product images

  const [delteImage] = useDeleteImageMutation();

  const defaultMainImage = defaultData?.images.find((image) => image.is_main);

  const [mainImage, setMainImage] = useState();
  const handleMainImage = (image, uploadStatus) => {
    if (uploadStatus === 'done') {
      setMainImage(image);
    }
    if (uploadStatus === 'removed') {
      const imageData = defaultData?.images.find((item) => item.image_data.name === image.name);
      if (imageData?.id) {
        delteImage(imageData.id);
      }
      setMainImage();
    }
  };

  const [gallery, setGallery] = useState([]);
  const handleGallery = (image, uploadStatus) => {
    if (uploadStatus === 'done') {
      setGallery([...gallery, image]);
    }
    if (uploadStatus === 'removed') {
      const imageData = defaultData?.images.find((item) => item.image_data.name === image.name);
      if (imageData?.id) {
        delteImage(imageData.id);
      }
      setGallery(gallery.filter((img) => img.name !== image.name));
    }
  };

  // push into details page
  const history = useHistory();
  const dispatch = useDispatch();

  // create product image

  const [createImage] = useCreateImageMutation();

  useEffect(() => {
    if (productId) {
      const formData = new FormData();
      formData.append('file', mainImage);
      formData.append('isMain', true);
      formData.append('product_id', productId);

      createImage({ data: formData });

      gallery.forEach((image) => {
        const imageData = new FormData();
        imageData.append('file', image);
        imageData.append('product_id', productId);
        createImage({ data: imageData });
      });

      dispatch(setProductId(productId));
      history.push('/products/detail');
    }
  }, [productId]);

  // handle product submission
  const handleCreateProduct = () => {
    submit(productData);
    if (defaultData?.id) {
      // check if main image exist
      const isMainExist = defaultData.images.find((item) => item.image_data.name === mainImage.name);
      if (!isMainExist) {
        const formData = new FormData();
        formData.append('file', mainImage);
        formData.append('isMain', true);
        formData.append('product_id', defaultData.id);

        createImage({ data: formData });
      }

      // filter images those doesn't exist
      const imagesName = defaultData.images.map((item) => item.image_data.name);
      const updatableImages = gallery.filter((item) => !imagesName.includes(item.name));
      updatableImages.forEach((image) => {
        const imageData = new FormData();
        imageData.append('file', image);
        imageData.append('product_id', defaultData.id);
        createImage({ data: imageData });
      });
    }
  };

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row className="g-0">
          {/* Title Start */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/products/list">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Products</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title">
              {title}
            </h1>
          </Col>
          {/* Title End */}

          {/* Top Buttons Start */}
          <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button
              variant="outline-primary"
              className="btn-icon btn-icon-only ms-1"
              disabled={Boolean(!mainImage)}
              type="submit"
              form="form"
              onClick={handleCreateProduct}
            >
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
          {/* Product Info Start */}
          <h2 className="small-title">Product Info</h2>
          <Card className="mb-5">
            <Card.Body>
              <Form>
                <div className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={product.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control type="text" name="slug" value={product.slug} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <Form.Label>Categories</Form.Label>
                  <Select
                    isMulti
                    name="colors"
                    defaultValue={selectValues}
                    options={categoryOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={setSelectValues}
                  />
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <div ref={quillRef} className="sh-25 html-editor html-editor-bubble pe-2" />
                </div>
                <div className="d-flex items-center gap-3">
                  <Form.Check type="switch" id="featured" name="is_featured" label="Fetured" defaultChecked={features.is_featured} onChange={handleFeatures} />
                  <Form.Check type="switch" id="special" name="is_special" label="Special" defaultChecked={features.is_special} onChange={handleFeatures} />
                </div>
              </Form>
            </Card.Body>
          </Card>
          {/* Product Info End */}
          {/* Inventory Start */}
          <h2 className="small-title">Inventory</h2>
          <Card className="mb-5">
            <Card.Body>
              <Form>
                <div className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control type="text" name="sku" value={product.sku} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Select classNamePrefix="react-select" options={productStatusOptions} value={productStatus} onChange={setProductStatus} placeholder="" />
                </div>
                <div className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control type="text" name="stock_quantity" value={product.stock_quantity} onChange={handleChange} />
                </div>
                {/* <div className="mb-n1">
                  <Form.Label>Settings</Form.Label>
                  <Form.Check type="switch" id="quantitySwitch1" label="Allow out of stock purchase" />
                  <Form.Check type="switch" id="quantitySwitch2" label="Notify low stock" defaultChecked />
                  <Form.Check type="switch" id="quantitySwitch3" label="Display quantity at storefront" />
                </div> */}
              </Form>
            </Card.Body>
          </Card>
          {/* Inventory End */}

          {/* Attributes Start */}
          <h2 className="small-title">Attributes</h2>
          <Card className="mb-5">
            <Card.Body>
              <div className="mb-3">
                <Form.Label>Sizes</Form.Label>
                <Select
                  isMulti
                  name="colors"
                  defaultValue={sizesSelect}
                  options={SizesOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={setSizesSelect}
                />
              </div>
              <div className="mb-3">
                <Form.Label>Colors</Form.Label>
                <Select
                  isMulti
                  name="colors"
                  defaultValue={colorsSelect}
                  options={colorOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={setColorsSelect}
                />
              </div>
              <div className="text-center">
                <NavLink to="/settings/attributes">
                  <CsLineIcons icon="plus" /> <span>Add New</span>
                </NavLink>
              </div>
            </Card.Body>
          </Card>
          {/* Attributes End */}
          {/* seo Start */}
          <h2 className="small-title">SEO</h2>
          <Card className="mb-5">
            <Card.Body>
              <Form className="mb-n3">
                <div className="mb-3">
                  <Form.Label>Meta Title</Form.Label>
                  <Form.Control type="string" name="meta_title" value={product.meta_title} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <Form.Label>Meta Description</Form.Label>
                  <Form.Control type="string" name="meta_description" value={product.meta_description} onChange={handleChange} />
                </div>
              </Form>
            </Card.Body>
          </Card>
          {/* seo End */}
        </Col>

        <Col xl="4">
          {/* Price Start */}
          <h2 className="small-title">Price</h2>
          <Card className="mb-5">
            <Card.Body>
              <Form className="mb-n3">
                <div className="mb-3">
                  <Form.Label>Base price</Form.Label>
                  <Form.Control type="number" name="base_price" value={product.base_price} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <Form.Label>Sale Price</Form.Label>
                  <Form.Control type="number" name="sale_price" value={product.sale_price} onChange={handleChange} />
                </div>
              </Form>
            </Card.Body>
          </Card>
          {/* Price End */}

          {/* Image Start */}
          <h2 className="small-title">Image</h2>
          <Card className="mb-5">
            <Card.Body>
              <DetailImage handleFile={handleMainImage} imageData={defaultMainImage?.image_data} />
            </Card.Body>
          </Card>
          {/* Image End */}

          {/* Gallery Start */}
          <h2 className="small-title">Gallery</h2>
          <Card className="mb-5">
            <Card.Body>
              <DetailGallery handleFile={handleGallery} images={defaultData?.images} />
            </Card.Body>
          </Card>
          {/* Gallery End */}
          {/* History Start */}
          {defaultData && (
            <>
              <h2 className="small-title">History</h2>
              <Card className="mb-5">
                <Card.Body className="mb-n3">
                  <div className="mb-3">
                    <div className="text-small text-muted">STATUS</div>
                    <div>{productData.status}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-small text-muted text-capitalize">CREATED BY</div>
                    <div>{defaultData.createdBy?.name}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-small text-muted">CREATE DATE</div>
                    <div>{format(new Date(defaultData.createdAt), 'dd.MM.yyyy - HH:mm')}</div>
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

export default ProductInputs;
