## ✅ Project: **Cryptocurrency Liquidity Predictor**  
> 🧠 Predict crypto liquidity levels using market factors like volume, price trends, listings, and social sentiment to detect early liquidity crises.

---

<p align="center">
  <img src="/liquidity_flow.png" alt="Liquidity Prediction Flow" width="800"/>
</p>

---

### 📌 Table of Contents
- [🔍 About the Project](#about-the-project)
- [🚀 Features](#features)
- [🛠️ Tech Stack](#️tech-stack)
- [📂 Project Structure](#project-structure)
- [📊 Model & Data](#model--data)
- [📦 Setup & Installation](#setup--installation)
- [🧪 Usage](#usage)
- [📄 License](#license)
- [👤 Author](#Author)

---

## 🔍 #about-the-project
In volatile crypto markets, liquidity is critical. This project uses machine learning to predict liquidity levels (High / Medium / Low) of cryptocurrencies based on:
- Market indicators (volume, price)
- Exchange listings
- Transaction behavior
- Social media sentiment

The frontend is built with React using TypeScript in a Vite environment for fast development and optimized builds. The backend is powered by Flask, serving the ML prediction API.

🎯 Goal: Detect early signs of liquidity crises to help traders and platforms manage risks effectively.

---

## 🚀 #features
- 🔎 Real-time cryptocurrency liquidity prediction
- 📈 Trained on historical crypto market data
- 🤖 Ensemble of LSTM, Random Forest Regressor, and Decision Tree Regressor used as meta-models for regression
- 📊 Interactive dashboard (optional)
- 🧪 Confidence score with actionable trading suggestions

---

### 🛠️ #tech-stack
```
| Tech                   | Use                                  |
|------------------------|--------------------------------------|
| Python                 | ML modeling, data processing         |
| Flask                  | Backend REST API for prediction      |
| Scikit-learn / PyTorch | Machine learning & LSTM models       |
| Pandas / NumPy         | Data preprocessing                   |
| Matplotlib / Seaborn   | Data visualization                   |
| React with TypeScript  | Frontend UI development              |
| Vite                   | Frontend build tool and dev server   |
| Bootstrap              | Frontend styling and responsive UI   |
| Axios                  | Frontend HTTP client for API calls   |
| Git                    | Version control                      |
```
---

### 📂 	#project-structure

```
crypto-liquidity-predictor/
│
├── backend/                       # Flask backend and ML models
│   ├── crypto/                    # Virtual environment (should be in .gitignore)
│   ├── ml_pipeline/               # ML training scripts, Jupyter notebooks, CSV data(ORIGINAL DATA)
│   ├── models/                    # Trained model files (e.g., model.pkl)
│   ├── app.py                     # Flask app main entrypoint with Backend configuration
│   ├── requirements.txt           # Python dependencies
│
├── frontend/                      # React frontend (Vite + TypeScript)
│   ├── node_modules/              # Node dependencies (in .gitignore)
│   ├── templates/                 # React templates
│   ├── App.css                    # templates cssc files
│   ├── App.tsx                    # main React component that defines the core UI components
│   ├── routing.tsx                # The React entry point script(main.tsx routing file).
│   ├── index.html                 # The root HTML file served by Vite.
│   ├── package.json               # Node dependencies and scripts
│   ├── package-lock.json          # Dependency lock file
│   ├── tsconfig.json              # TypeScript config
│   ├── vite.config.ts             # Vite config
│
├── README.md                    # Project overview, setup, usage, etc.
└── .gitignore                   # Root-level .gitignore for repo-wide ignores
```
### 📊 #model--data

* The model predicts cryptocurrency liquidity levels using key market features:

* Input Features: Trading volume, price lag, rolling stats, volume-to-market cap ratio, social media sentiment, and exchange listing indicators.

* Target Variable:Liquidity level (e.g., low, medium, high), derived from volume and Amihud ratio.

* Models Used:
    - RandomForestRegressor
    - DecisionTreeRegressor
    - LSTM (Long Short-Term Memory)
    - Combined using meta-regressor for improved accuracy

### 📦 #setup--installation

Requirements:

* Python 3.9.10
* Flask, sklearn, PyTorch, Pandas, Numpy, Matplotlib, statsmodels etc.
* react 19.1.0
* axios: 1.9.0, bootstrap: 5.3.6,react-bootstrap: 2.10.10,react-dom": 19.1.0


Backend Setup:
# Clone repo
git clone https://github.com/yourusername/crypto-liquidity-predictor.git
cd crypto-liquidity-predictor/backend

# Create & activate virtual environment
python -m venv crypto
source crypto/bin/activate   # Windows: crypto\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask API server
python app.py


Frontend Setup (React + Vite + TypeScript):

cd ../frontend

# Install npm packages (includes React, Vite, TypeScript dependencies)
npm install

# Run React + Vite dev server
npm run dev



### 🧪 #usage

* Launch the Flask app.
* Enter feature inputs like recent price, volume, social score, etc.
* Click Predict Liquidity.
* View predicted liquidity level with a confidence score and trading suggestion.

### 📄 	#license

This project is released under the MIT License, a permissive open-source license.
You are free to use, modify, and distribute this code for personal or commercial purposes without restrictions.
Please include the original copyright and license notice in any copies or substantial portions of the software.

### 👤 #author
Somes Dash
[GitHub Profile](https://github.com/SD-95)
[Gmail](somes.dash1995@gmail.com)"# Cryptocurrency-Liquidity-Predictior" 
