import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React from 'react';
import { Badge, Card, Col } from 'react-bootstrap';
import { useDeleteColorMutation, useGetColorsQuery } from 'store/apis/attributes';

function Colors() {
  const { data } = useGetColorsQuery();

  const [deleteSize] = useDeleteColorMutation();

  return (
    <Col xl="8">
      <h2 className="small-title">Colors</h2>
      <Card className="mb-3">
        <Card.Body>
          {/* Label Section */}
          <div className="d-flex  gap-2 mb-3">
            {data?.map((color, idx) => (
              <Badge
                key={idx}
                bg=""
                style={{
                  backgroundColor: color.hex_code,
                  color: '#fff',
                  borderRadius: '9999px',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.9rem',
                }}
              >
                <span
                  onClick={() => {
                    deleteSize(color.id);
                  }}
                >
                  <CsLineIcons icon="close" className="cursor-pointer" />
                </span>{' '}
                <span>{color.name}</span>
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Colors;
