import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap'; // Added Alert for error messages
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
} & Record<typeof fields[number], string>; // Correct type for formData

const initialFormData: FormData = {
  coin: '',
  symbol: '',
  date: '',
  ...Object.fromEntries(fields.map(f => [f, ''])) as Record<typeof fields[number], string>
};

const styles: Record<string, [string, string, string, string, string]> = { // More specific type for styles
  buy: ['#d4edda', '#28a745', '#28a745', '✅ Recommended to Buy', 'bi bi-check-circle-fill text-success'],
  hold: ['#fff3cd', '#ffc107', '#856404', '⚠️ Recommended not to purchase', 'bi bi-exclamation-circle-fill text-warning'],
  avoid: ['#f8d7da', '#dc3545', '#dc3545', '❌ Not Recommended to Buy', 'bi bi-x-circle-fill text-danger'] // Changed 'sell' to 'avoid' to match backend output
};

const Prediction_input = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Ensure API_BASE_URL is loaded correctly
  // In development, `import.meta.env.VITE_API_BASE_URL` will come from .env or .env.development
  // In production (GitHub Pages), it comes from .env.production or your build process.
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // Fallback for development if not set
  console.log('Frontend API Base URL:', API_BASE_URL); // Log for debugging in browser console

  useEffect(() => {
    // Fetch trending coins - ensure this is working
    axios.get('https://api.coingecko.com/api/v3/search/trending')
      .then(res => {
        const trending = res.data.coins.map((c: any) => ({
          id: c.item.id,
          name: c.item.name,
          symbol: c.item.symbol.toUpperCase()
        }));
        setCoins(trending);
        console.log('Successfully fetched trending coins.');
      })
      .catch(err => {
        console.error('Error fetching trending coins:', err);
        // Display an alert for the user if this initial fetch fails
        setError('Failed to fetch trending coins. Please check your internet connection.');
      });
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear previous results/errors when input changes
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
    setLoading(true); // Start loading
    setResult(null);   // Clear previous result
    setError(null);    // Clear previous error

    // Create a payload that only contains the numerical fields for the backend
    const payload = Object.fromEntries(
        fields.map(f => [f, parseFloat(formData[f])])
    );
    console.log('Sending payload to backend:', payload);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/predict`, payload);
      console.log('API response:', data);
      setResult(data);
    } catch (err: any) { // Catch the error object more explicitly
      console.error('Error during prediction:', err);

      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          if (err.response.status === 405) {
            errorMessage = `Backend returned 405 Method Not Allowed. This means your frontend is sending the wrong type of request (e.g., GET instead of POST) or to the wrong path. Please check the network tab.`;
          } else if (err.response.status === 400 && err.response.data && err.response.data.error) {
            errorMessage = `Backend Error: ${err.response.data.error}`;
          } else if (err.response.status === 500) {
            errorMessage = `Internal Server Error on Backend. Check Render logs.`;
          } else {
            errorMessage = `Server Error (${err.response.status}): ${err.response.data?.error || 'Unknown error'}`;
          }
        } else if (err.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          errorMessage = `No response from server. Backend might be down or URL is incorrect.`;
          console.error('Request data:', err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = `Request setup error: ${err.message}`;
        }
      } else {
        errorMessage = `Network error: ${err.message}`; // Generic error for non-Axios errors
      }
      setError(errorMessage);
    } finally {
      setLoading(false); // End loading
    }
  }, [formData, API_BASE_URL]);

  const summary = useMemo(() => !result ? [] : [
    // Ensure the keys here match exactly what the backend returns
    ['Liquidity Level', result.liquidity_level || 'N/A', `fw-bold fs-5 text-${result.liquidity_level?.toLowerCase() === 'high' ? 'success' : result.liquidity_level?.toLowerCase() === 'medium' ? 'warning' : 'danger'}`],
    ['Confidence Score', `${result.confidence_score}%`, 'fw-bold fs-5 text-warning'],
    ['Investment Advice', result.investment_advice, 'fw-bold fs-5', {
      color: result.investment_advice?.toLowerCase() === 'buy' ? '#28a745' : result.investment_advice?.toLowerCase() === 'hold' ? '#ffc107' : '#dc3545'
    }]
  ], [result]);

  const recBox = useMemo(() => {
    if (!result) return null;
    const key = result.investment_advice?.toLowerCase().trim();
    // Use the 'avoid' style for 'Avoid' advice.
    const [bg, border, color, msg, icon] = styles[key] || styles.avoid; // Fallback to 'avoid' style
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
        {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
        <Form onSubmit={handlePredict}>
          <Row className="g-3">
            {/* Coin selector */}
            <Col md={4}>
              <Form.Group controlId="coin">
                <Form.Label>Cryptocurrency Coin</Form.Label>
                <Form.Select name="coin" value={coins.find(c => c.name === formData.coin)?.id || ''} onChange={handleCoinSelect} required>
                  <option value="">Select a coin</option>
                  {coins.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.symbol.toUpperCase()})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Symbol input */}
            <Col md={4}>
              <Form.Group controlId="symbol">
                <Form.Label>Cryptocurrency Symbol</Form.Label>
                <Form.Control type="text" name="symbol" value={formData.symbol} readOnly />
              </Form.Group>
            </Col>

            {/* Other input fields */}
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

            {/* Date input (Note: date is not sent to backend, so it's only for display/frontend logic) */}
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

            {/* Submit */}
            <Col xs={12} className="mt-3">
              <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? 'Predicting...' : 'Predict Liquidity'}
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Result */}
        {result && (
          <div className="mt-5">
            <Card className="shadow-lg border-0">
              <Card.Body>
                <h4 className="mb-3 text-center">📝 Your Input Data</h4>

                {/* Display user inputs in a Bootstrap table */}
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

export default Prediction_input;