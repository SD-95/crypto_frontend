import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Footer from './Footer';

const About = () => {
  return (
    <React.Fragment>
      <Container className="py-5">
        <h2 className="mb-4 text-center">About Cryptocurrency Liquidity Prediction</h2>

        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>About This Project</Card.Title>
                <Card.Text>
                  Welcome to <strong>Cryptocurrency Liquidity Prediction</strong>, a data-driven platform designed to analyze and predict liquidity levels across various cryptocurrency markets using historical market factors.
                </Card.Text>
                <Card.Text>
                  Our project leverages advanced machine learning techniques and time-series analysis to forecast liquidity fluctuations, helping traders, investors, and exchanges make informed decisions in an ever-evolving market.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card bg="light" className="shadow-sm">
              <Card.Body>
                <Card.Title>Why Liquidity Matters</Card.Title>
                <Card.Text>
                  Liquidity is a crucial metric in cryptocurrency trading, representing the ease with which an asset can be bought or sold without causing significant price changes. Low liquidity can lead to higher volatility and increased risk, whereas high liquidity often indicates a stable market environment.
                </Card.Text>
                <Card.Text>
                  By accurately predicting liquidity changes, our platform aims to:
                </Card.Text>
                <ul>
                  <li>Detect potential liquidity crises before they impact the market</li>
                  <li>Provide actionable insights for risk management</li>
                  <li>Improve trading strategies and portfolio management</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>How It Works</Card.Title>
                <Card.Text>
                  Our system analyzes multiple market factors such as:
                </Card.Text>
                <ul>
                  <li>Historical price movements and trends</li>
                  <li>Volume and market capitalization dynamics</li>
                  <li>Rolling statistical features (moving averages, volatility)</li>
                  <li>Liquidity ratios including Amihud Illiquidity Ratio</li>
                  <li>Time-based features (daily, weekly, monthly patterns)</li>
                </ul>
                <Card.Text>
                  Using these engineered features, we train and deploy machine learning models that output reliable liquidity predictions.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card bg="light" className="shadow-sm">
              <Card.Body>
                <Card.Title>Technologies Used</Card.Title>
                <ul>
                  <li><strong>Frontend:</strong> React.js with Bootstrap for a responsive and user-friendly interface</li>
                  <li><strong>Backend:</strong> Python (Flask/FastAPI) serving ML models saved in <code>.pkl</code> format</li>
                  <li><strong>Machine Learning:</strong> Models trained on historical crypto market data from 2016–2017</li>
                  <li><strong>Data Processing:</strong> Feature engineering including rolling statistics, lag features, and liquidity metrics</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={{ span: 10, offset: 1 }}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Our Vision</Card.Title>
                <Card.Text>
                  We envision a transparent cryptocurrency market where liquidity risks are minimized through proactive monitoring and prediction. This empowers all stakeholders to navigate the market with confidence and enhances overall market stability.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <Card bg="light" className="shadow-sm">
              <Card.Body>
                <Card.Title>Get in Touch</Card.Title>
                <Card.Text>
                  We welcome feedback, collaborations, and inquiries. Please reach out if you want to contribute or learn more about the project.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default About;
