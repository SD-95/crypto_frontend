import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import axios from 'axios';

type Coin = {
  id: string;
  symbol: string;
  name: string;
};

const fields = ['price', 'price_1h', 'price_24h', 'price_7d', 'volume_24h', 'market_cap'] as const;
type FormData = {
  coin: string;
  symbol: string;
  date: string;
} & Record<typeof fields[number], string>;

const initialFormData: FormData = {
  coin: '',
  symbol: '',
  date: '',
  ...Object.fromEntries(fields.map(f => [f, ''])) as Record<typeof fields[number], string>
};

const styles: Record<string, [string, string, string, string, string]> = {
  buy: ['#d4edda', '#28a745', '#28a745', '✅ Recommended to Buy', 'bi bi-check-circle-fill text-success'],
  hold: ['#fff3cd', '#ffc107', '#856404', '⚠️ Recommended not to purchase', 'bi bi-exclamation-circle-fill text-warning'],
  avoid: ['#f8d7da', '#dc3545', '#dc3545', '❌ Not Recommended to Buy', 'bi bi-x-circle-fill text-danger']
};

const PredictionInput = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/search/trending')
      .then(res => {
        const trending = res.data.coins.map((c: any) => ({
          id: c.item.id,
          name: c.item.name,
          symbol: c.item.symbol.toUpperCase()
        }));
        setCoins(trending);
      })
      .catch(() => {
        setError('Failed to fetch trending coins. Please check your internet connection.');
      });
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setResult(null);
    setError(null);
  }, []);

  const handleCoinSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCoin = coins.find(c => c.id === e.target.value);
    setFormData(prev => ({
      ...prev,
      coin: selectedCoin ? selectedCoin.name : '',
      symbol: selectedCoin ? selectedCoin.symbol.toUpperCase() : ''
    }));
    setResult(null);
    setError(null);
  }, [coins]);

  const handlePredict = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const payload = Object.fromEntries(
      fields.map(f => [f, parseFloat(formData[f])])
    );

    try {
      const { data } = await axios.post(`https://sd-95.github.io/crypto_frontend/predict`, payload);
      setResult(data);
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(err)) {
        if (err.response) {
          if (err.response.status === 405) {
            errorMessage = 'Method Not Allowed. Please check request method or path.';
          } else if (err.response.status === 400 && err.response.data?.error) {
            errorMessage = `Backend Error: ${err.response.data.error}`;
          } else if (err.response.status === 500) {
            errorMessage = 'Internal Server Error on Backend. Check backend logs.';
          } else {
            errorMessage = `Server Error (${err.response.status}): ${err.response.data?.error || 'Unknown error'}`;
          }
        } else if (err.request) {
          errorMessage = 'No response from server. Backend might be down or URL is incorrect.';
        } else {
          errorMessage = `Request setup error: ${err.message}`;
        }
      } else {
        errorMessage = `Network error: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const summary = useMemo(() => !result ? [] : [
    ['Liquidity Level', result.liquidity_level || 'N/A', `fw-bold fs-5 text-${result.liquidity_level?.toLowerCase() === 'high' ? 'success' : result.liquidity_level?.toLowerCase() === 'medium' ? 'warning' : 'danger'}`],
    ['Confidence Score', `${result.confidence_score}%`, 'fw-bold fs-5 text-warning'],
    ['Investment Advice', result.investment_advice, 'fw-bold fs-5', {
      color: result.investment_advice?.toLowerCase() === 'buy' ? '#28a745' : result.investment_advice?.toLowerCase() === 'hold' ? '#ffc107' : '#dc3545'
    }]
  ], [result]);

  const recBox = useMemo(() => {
    if (!result) return null;
    const key = result.investment_advice?.toLowerCase().trim();
    const [bg, border, color, msg, icon] = styles[key] || styles.avoid;
    return (
      <div className="mt-4 p-4 text-center rounded" style={{ backgroundColor: bg, border: `2px solid ${border}` }}>
        <h5 className="fw-bold" style={{ color }}>{msg}</h5>
        <i className={`fs-1 ${icon}`}></i>
      </div>
    );
  }, [result]);

  return (
    <section id="predict" className="py-5">
      <Container>
        <h2 className="mb-4">Enter Cryptocurrency Metrics</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handlePredict}>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group controlId="coin">
                <Form.Label>Cryptocurrency Coin</Form.Label>
                <Form.Select name="coin" value={coins.find(c => c.name === formData.coin)?.id || ''} onChange={handleCoinSelect} required>
                  <option value="">Select a coin</option>
                  {coins.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="symbol">
                <Form.Label>Cryptocurrency Symbol</Form.Label>
                <Form.Control type="text" name="symbol" value={formData.symbol} readOnly />
              </Form.Group>
            </Col>

            {fields.map(f => (
              <Col md={4} key={f}>
                <Form.Group controlId={f}>
                  <Form.Label>{f.replace(/_/g, ' ').toUpperCase()}</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    name={f}
                    value={formData[f]}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            ))}

            <Col md={4}>
              <Form.Group controlId="date">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} className="mt-3">
              <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? 'Predicting...' : 'Predict Liquidity'}
              </Button>
            </Col>
          </Row>
        </Form>

        {result && (
          <div className="mt-5">
            <Card className="shadow-lg border-0">
              <Card.Body>
                <h4 className="mb-3 text-center">📝 Your Input Data</h4>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Coin</th>
                      <td>{formData.coin} ({formData.symbol})</td>
                    </tr>
                    {fields.map(f => (
                      <tr key={f}>
                        <th>{f.replace(/_/g, ' ').toUpperCase()}</th>
                        <td>{formData[f]}</td>
                      </tr>
                    ))}
                    <tr>
                      <th>Date</th>
                      <td>{formData.date}</td>
                    </tr>
                  </tbody>
                </table>

                <h4 className="mb-4 text-center">📊 Prediction Summary</h4>
                <Row className="text-center">
                  {summary.map(([label, value, className, style], i) => (
                    <Col md={4} key={i} className="mb-3">
                      <div className="border rounded p-3 bg-light">
                        <h6>{label}</h6>
                        <p className={className as string} style={style as React.CSSProperties}>
                          {value}
                        </p>
                      </div>
                    </Col>
                  ))}
                </Row>

                {recBox}
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    </section>
  );
};

export default PredictionInput;