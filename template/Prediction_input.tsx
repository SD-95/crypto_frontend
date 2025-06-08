import React, { useState, useCallback, useMemo } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';

const fields = ['price', 'price_1h', 'price_24h', 'price_7d', 'volume_24h', 'market_cap'] as const;
const initialFormData = Object.fromEntries(fields.map(f => [f, ''])) as Record<typeof fields[number], string>;

const styles = {
  buy: ['#d4edda', '#28a745', '#28a745', '✅ Recommended to Buy', 'bi bi-check-circle-fill text-success'],
  hold: ['#fff3cd', '#ffc107', '#856404', '⚠️ Recommended not to purchase', 'bi bi-exclamation-circle-fill text-warning'],
  sell: ['#f8d7da', '#dc3545', '#dc3545', '❌ Not Recommended to Buy', 'bi bi-x-circle-fill text-danger']
};

const Prediction_input = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState<any>(null);

  const handleChange = useCallback(({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handlePredict = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/predict`, formData);
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  }, [formData]);

  const summary = useMemo(() => !result ? [] : [
    ['Liquidity Level', result.liquidity_level || 'N/A', `fw-bold fs-5 text-${result.liquidity_level?.toLowerCase() === 'high' ? 'success' : 'danger'}`],
    ['Confidence Score', `${result.confidence_score}%`, 'fw-bold fs-5 text-warning'],
    ['Investment Advice', result.investment_advice, 'fw-bold fs-5', {
      color: result.investment_advice?.toLowerCase() === 'buy' ? '#28a745' : result.investment_advice?.toLowerCase() === 'hold' ? '#ffc107' : '#dc3545'
    }]
  ], [result]);

  const recBox = useMemo(() => {
    if (!result) return null;
    const key = result.investment_advice?.toLowerCase().trim();
    const [bg, border, color, msg, icon] = styles[key] || styles.sell;
    return <div className="mt-4 p-4 text-center rounded" style={{ backgroundColor: bg, border: `2px solid ${border}` }}>
      <h5 className="fw-bold" style={{ color }}>{msg}</h5>
      <i className={`fs-1 ${icon}`}></i>
    </div>;
  }, [result]);

  return (
    <section id="predict" className="py-5">
      <Container>
        <h2 className="mb-4">Enter Cryptocurrency Metrics</h2>
        <Form onSubmit={handlePredict}>
          <Row className="g-3">
            {fields.map(f => (
              <Col md={4} key={f}>
                <Form.Group controlId={f}>
                  <Form.Label>{f.replace(/_/g, ' ').toUpperCase()}</Form.Label>
                  <Form.Control type="number" step="any" name={f} value={formData[f]} onChange={handleChange} />
                </Form.Group>
              </Col>
            ))}
            <Col xs={12} className="mt-3">
              <Button type="submit" variant="primary" className="w-100">Predict Liquidity</Button>
            </Col>
          </Row>
        </Form>

        {result && <div className="mt-5">
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h4 className="mb-3 text-center">📊 Prediction Summary</h4>
              <Row className="text-center">
                {summary.map(([label, value, className, style], i) => (
                  <Col md={4} key={i} className="mb-3">
                    <div className="border rounded p-3 bg-light">
                      <h6>{label}</h6>
                      <p className={className as string} style={style as React.CSSProperties}>{value}</p>
                    </div>
                  </Col>
                ))}
              </Row>
              {recBox}
            </Card.Body>
          </Card>
        </div>}
      </Container>
    </section>
  );
};

export default Prediction_input;