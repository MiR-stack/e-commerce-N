import DetailImage from 'components/detailGallery/DetailImage';
import React, { useEffect, useState } from 'react';
import { Card, Col, Form } from 'react-bootstrap';
import { useCreateMethodMutation, useUpdateMethodMutation } from 'store/apis/paymetnMethods';

function AddMethod({ methodData }) {
  const initState = { name: '', number: '', description: '' };

  const [method, setMethod] = useState({ ...initState });
  const handleMethod = (e) => {
    setMethod({ ...method, [e.target.name]: e.target.value });
  };

  const [image, setImage] = useState();
  const handleImage = (img) => {
    setImage(img);
  };

  useEffect(() => {
    if (methodData) {
      setMethod({
        name: methodData.name,
        number: methodData.number,
        description: methodData.description,
      });
    }
  }, [methodData]);

  const [createMethod] = useCreateMethodMutation();
  const [updateMethod] = useUpdateMethodMutation();

  const handleCreateBanner = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    if (!method.name || !method.number) {
      return;
    }

    const formData = new FormData();

    formData.append('file', image);
    formData.append('name', method.name);
    formData.append('number', method.number);

    if (method.description) {
      formData.append('description', method.description);
    }

    createMethod(formData);
    setMethod({ ...initState });
    setImage();
  };

  const handleUpdate = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    if (!method.name && !method.number && !image && method.description) return;

    const formData = new FormData();

    if (method.name !== methodData.name) {
      formData.append('name', method.name);
    }

    if (method.number !== methodData.number) {
      formData.append('number', method.number);
    }

    if (method.description !== methodData.description) {
      formData.append('description', method.description);
    }

    if (image.name !== methodData.image_data.name) {
      formData.append('file', image);
    }

    const { data: updatedData } = await updateMethod({ id: methodData.id, data: formData });

    setMethod({ name: updatedData.name, number: updatedData.number, description: updatedData.description });
  };

  return (
    <>
      <Col xl="6">
        <h2 className="small-title">Add Texts</h2>
        <Card className="mb-5">
          <Card.Body>
            <Form id="payment-method-form" className="mb-n3" onSubmit={methodData ? handleUpdate : handleCreateBanner}>
              <div className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={method.name} onChange={handleMethod} required />
              </div>
              <div className="mb-3">
                <Form.Label>Number</Form.Label>
                <Form.Control type="text" name="number" value={method.number} onChange={handleMethod} required />
              </div>
              <div className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" name="description" value={method.description} onChange={handleMethod} />
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col xl="6">
        <h2 className="small-title">Add Image</h2>
        <DetailImage handleFile={handleImage} imageData={methodData?.image_data || image} />
      </Col>
    </>
  );
}

export default AddMethod;
