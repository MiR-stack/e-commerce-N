import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React from 'react';
import { Badge, Card, Col } from 'react-bootstrap';
import { useDeleteSizeMutation, useGetSizesQuery } from 'store/apis/attributes';

function Sizes() {
  const { data } = useGetSizesQuery();

  const [deleteSize] = useDeleteSizeMutation();
  return (
    <Col xl="8">
      <h2 className="small-title">Sizes</h2>
      <Card className="mb-3">
        <Card.Body>
          {/* Label Section */}
          <div className="d-flex  gap-2 mb-3">
            {data?.map((size) => (
              <Badge key={size.id} className="size">
                <span
                  onClick={() => {
                    deleteSize(size.id);
                  }}
                >
                  <CsLineIcons icon="close" className="cursor-pointer" />
                </span>{' '}
                <span>{size.name}</span>
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Sizes;
