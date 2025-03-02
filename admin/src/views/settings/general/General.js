import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useGetSettingsQuery, useUpdateSettingsMutation } from 'store/apis/setting';
import DetailImage from 'components/detailGallery/DetailImage';
import Swal from 'sweetalert2';

const General = () => {
  const title = ' Attributes';
  const description = 'Ecommerce Attributes Page';

  const { data } = useGetSettingsQuery();

  const [socialMedias, setSocialMedias] = useState({
    facebook: '',
    twitter: '',
    youtube: '',
    instagram: '',
    fpc: '',
  });

  const handleSocialMedias = (e) => {
    setSocialMedias({ ...socialMedias, [e.target.name]: e.target.value });
  };

  const [settings, setSetting] = useState({
    websiteName: 'unicorn',
    contactEmail: 'habibmir811@gmail.com',
    description: '',
  });
  const handleSettings = (e) => {
    setSetting({ ...settings, [e.target.name]: e.target.value });
  };

  const [logo, setLogo] = useState();
  const handleLogo = (img) => {
    setLogo(img);
  };

  const [updateSettings] = useUpdateSettingsMutation();

  const handleUpdate = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    const formData = new FormData();

    Object.keys(settings).forEach((key) => {
      formData.append([key], settings[key]);
    });

    formData.append('socialMedia', JSON.stringify(socialMedias));

    if (logo) {
      formData.append('logo', logo);
    }

    updateSettings(formData);
    Swal.fire({ icon: 'success', text: 'settings updated successfully' });
  };

  useEffect(() => {
    if (data) {
      if (data.socialMedia) {
        setSocialMedias({ ...JSON.parse(data.socialMedia) });
      }

      setSetting({ websiteName: data.websiteName, contactEmail: data.contactEmail, description: data.description });
    }
  }, [data]);
  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row className="g-0">
          {/* Title Start */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/settings">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Home</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title">
              {title}
            </h1>
          </Col>
          {/* Title End */}
          <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto" type="submit" form="settings-form">
              <CsLineIcons icon="save" /> <span>Update</span>
            </Button>
          </Col>
        </Row>
      </div>
      <Form id="settings-form" onSubmit={handleUpdate}>
        <Row>
          <Col>
            <h2 className="small-title">Website settings</h2>
            <Card className="mb-5">
              <Card.Body>
                <div className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="texarea" name="websiteName" value={settings.websiteName} onChange={handleSettings} required />
                </div>
                <div className="mb-3">
                  <Form.Label>contactEmail</Form.Label>
                  <Form.Control type="email" name="contactEmail" value={settings.contactEmail} onChange={handleSettings} required />
                </div>
                <div className="mb-3">
                  <Form.Label>description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={settings.description} onChange={handleSettings} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl="6">
            <h2 className="small-title">logo</h2>
            <Card className="mb-5">
              <Card.Body>
                <DetailImage handleFile={handleLogo} imageData={data?.logo} />
              </Card.Body>
            </Card>
            <h2 className="small-title">Social media</h2>
            <Card className="mb-5">
              <Card.Body>
                <div className="mb-3">
                  <Form.Label>Facebok Pixel Code</Form.Label>
                  <Form.Control as="textarea" rows={5} name="fpc" value={socialMedias.fpc} onChange={handleSocialMedias} />
                </div>
                <div className="mb-3">
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control type="text" name="facebook" value={socialMedias.facebook} onChange={handleSocialMedias} />
                </div>
                <div className="mb-3">
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control type="text" name="twitter" value={socialMedias.twitter} onChange={handleSocialMedias} />
                </div>
                <div className="mb-3">
                  <Form.Label>Youtube</Form.Label>
                  <Form.Control type="text" name="youtube" value={socialMedias.youtube} onChange={handleSocialMedias} />
                </div>
                <div className="mb-3">
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control type="text" name="instagram" value={socialMedias.youtube} onChange={handleSocialMedias} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default General;
