import DetailImage from 'components/detailGallery/DetailImage';
import React, { useEffect, useState } from 'react';
import { Card, Col, Form } from 'react-bootstrap';
import { useCreateBannerMutation, useUpdateBannerMutation } from 'store/apis/banner';

function AddBanner({ bannerData }) {
  const initState = { title: '', sub_title: '' };

  const [banner, setBanner] = useState({ ...initState });
  const handleBanner = (e) => {
    setBanner({ ...banner, [e.target.name]: e.target.value });
  };

  const [image, setImage] = useState();
  const handleImage = (img) => {
    setImage(img);
  };

  useEffect(() => {
    if (bannerData) {
      setBanner({
        title: bannerData.title,
        sub_title: bannerData.sub_title,
      });
    }
  }, [bannerData]);

  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();

  const handleCreateBanner = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    if (!banner.title || !banner.sub_title || !image) {
      return;
    }

    const formData = new FormData();

    formData.append('file', image);
    formData.append('title', banner.title);
    formData.append('sub_title', banner.sub_title);

    createBanner(formData);
    setBanner({ ...initState });
    setImage();
  };

  const handleUpdate = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    if (!banner.title && !banner.sub_title && !image) {
      return;
    }

    const formData = new FormData();

    if (banner.title !== bannerData.title) {
      formData.append('title', banner.title);
    }

    if (banner.sub_title !== bannerData.sub_title) {
      formData.append('sub_title', banner.sub_title);
    }

    if (image.name !== bannerData.image_data.name) {
      formData.append('file', image);
    }

    const { data: updatedData } = await updateBanner({ id: bannerData.id, data: formData });

    setBanner({ title: updatedData.title, sub_title: updatedData.sub_title });
  };

  return (
    <>
      <Col xl="6">
        <h2 className="small-title">Add Texts</h2>
        <Card className="mb-5">
          <Card.Body>
            <Form id="banner-form" className="mb-n3" onSubmit={bannerData ? handleUpdate : handleCreateBanner}>
              <div className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" value={banner.title} onChange={handleBanner} required />
              </div>
              <div className="mb-3">
                <Form.Label>Sub Title</Form.Label>
                <Form.Control type="text" name="sub_title" value={banner.sub_title} onChange={handleBanner} required />
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col xl="6">
        <h2 className="small-title">Add Image</h2>
        <DetailImage handleFile={handleImage} imageData={bannerData?.image_data || image} />
      </Col>
    </>
  );
}

export default AddBanner;
