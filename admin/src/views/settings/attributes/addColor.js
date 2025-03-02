import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useState } from 'react';
import { Button, Card, Col, Form } from 'react-bootstrap';
import { useCreateColorMutation } from 'store/apis/attributes';

function AddColor() {
  // colors

  const initState = { name: '', hexCode: '' };

  const [color, setColor] = useState({ ...initState });
  const handleColor = (e) => {
    setColor({ ...color, [e.target.name]: e.target.value });
  };

  const [addColor] = useCreateColorMutation();

  const handleAddColor = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    addColor({ name: color.name, hex_code: color.hexCode });
    setColor({ ...initState });
  };

  return (
    <Col xl="4">
      <h2 className="small-title">Add Color</h2>
      <Card className="mb-5">
        <Card.Body>
          <Form className="mb-n3" onSubmit={handleAddColor}>
            <div className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="red" name="name" value={color.name} onChange={handleColor} required />
            </div>
            <div className="mb-3">
              <Form.Label>Hex Code</Form.Label>
              <Form.Control type="text" placeholder="#FF0000" name="hexCode" value={color.hexCode} onChange={handleColor} required />
            </div>
            <Button variant="primary" className="btn-icon btn-icon-start w-100 w-md-auto" type="submit">
              <CsLineIcons icon="plus" /> <span>Add</span>
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default AddColor;
