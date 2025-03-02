import React, { useState } from 'react';
import { Button, Card, Col, Form, InputGroup } from 'react-bootstrap';
import { useCreateSizeMutation } from 'store/apis/attributes';

function AddSize() {
  // sizes
  const [size, setSize] = useState('');
  const handleSize = (e) => {
    setSize(e.target.value);
  };

  const [addSize] = useCreateSizeMutation();

  const handleAddSize = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    addSize({ name: size });
    setSize('');
  };

  return (
    <Col xl="4">
      {/* Sizes Start */}
      <h2 className="small-title">Add Size</h2>
      <Card className="mb-5">
        <Card.Body>
          <Form className="mb-n3" onSubmit={handleAddSize}>
            <InputGroup className="mb-3">
              <Form.Control placeholder="M" aria-label="size input" aria-describedby="basic-addon2" value={size} onChange={handleSize} required />
              <Button variant="primary" id="button-addon2" type="submit">
                Add Size
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>
      {/* Location End */}
    </Col>
  );
}

export default AddSize;
