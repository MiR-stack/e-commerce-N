import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form } from 'react-bootstrap';
import { useCreateDeliveryAreaMutation, useUpdateDeliveryAreaMutation } from 'store/apis/deliveryArea';

function AddDeliveryArea({ deliveryAreaData }) {
  const initState = { name: '', charge: 0 };

  const [deliveryArea, setDeliveryArea] = useState({ ...initState });
  const handleDeliveryArea = (e) => {
    setDeliveryArea({ ...deliveryArea, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (deliveryAreaData) {
      setDeliveryArea({
        name: deliveryAreaData.name,
        charge: deliveryAreaData.charge,
      });
    }
  }, [deliveryAreaData]);

  const [createArea] = useCreateDeliveryAreaMutation();
  const [updateArea] = useUpdateDeliveryAreaMutation();

  const handleCreateArea = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    if (!deliveryArea.name || !deliveryArea.charge) {
      return;
    }

    createArea({ ...deliveryArea, status: 'PUBLISED' });
    setDeliveryArea({ ...initState });
  };

  const handleUpdateArea = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    if (!deliveryArea.name && !deliveryArea.charge) {
      return;
    }

    const updatedArea = {};

    if (deliveryArea.name !== deliveryAreaData.name) {
      updatedArea.name = deliveryArea.name;
    }
    if (deliveryArea.charge !== deliveryAreaData.charge) {
      updatedArea.charge = deliveryArea.charge;
    }

    const { data: updatedData } = await updateArea({ id: deliveryAreaData.id, data: updatedArea });

    setDeliveryArea({ name: updatedData.name, charge: updatedData.charge });
  };

  return (
    <>
      <Col xl="6">
        <h2 className="small-title">Add Area</h2>
        <Card className="mb-5">
          <Card.Body>
            <Form id="area-form" className="mb-n3" onSubmit={deliveryAreaData ? handleUpdateArea : handleCreateArea}>
              <div className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={deliveryArea.name} onChange={handleDeliveryArea} required />
              </div>
              <div className="mb-3">
                <Form.Label>Charge</Form.Label>
                <Form.Control type="number" name="charge" value={deliveryArea.charge} onChange={handleDeliveryArea} required />
              </div>
              <Button variant="outline-primary" className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto" type="submit">
                <CsLineIcons icon={deliveryAreaData ? 'save' : 'plus'} /> <span>{deliveryAreaData ? 'Update' : 'Add'} Area</span>
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default AddDeliveryArea;
