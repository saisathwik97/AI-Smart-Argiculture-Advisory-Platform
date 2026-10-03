# 🌾 AI Smart Agriculture Advisory Platform

An AI-powered agriculture advisory platform for crop recommendation, soil classification, plant disease detection, fertilizer recommendation, weather-aware farming, and personalized agricultural assistance.

## Features

- 🌾 **Crop Recommendation** — TensorFlow/Keras neural network using N, P, K, temperature, humidity, pH, and rainfall.
- 🪨 **Soil Classification** — CNN-based image classification with 224×224 preprocessing and ResNet50 preprocessing.
- 🦠 **Disease Detection** — Multimodal AI for disease identification, causes, treatment, and prevention.
- 🌱 **Fertilizer Recommendation** — Random Forest classifier using soil, crop, environmental, and NPK features.
- 🌦️ **Weather Advisory** — Location-based weather information integrated into agricultural advice.
- 🤖 **AI Agricultural Chatbot** — Router-based specialized agents for soil, fertilizer, disease, weather, and general questions.
- 🧠 **Farmer Memory** — MongoDB-based farmer context and conversation history.
- 🌐 **Multilingual Support** — English, Hindi, and Telugu.
- 🎙️ **Voice Interaction** — Browser Speech Recognition and Speech Synthesis APIs.
- 🛒 **Marketplace and Community** — Integrated platform features for agricultural users.

## System Architecture

```text
React Frontend
      ↓
Express Backend :5000
      ├── MongoDB Atlas
      ├── Flask ML Service :5001
      ├── Groq API
      └── Weather / External Services
```

## AI Agent Architecture

```text
Farmer Question
      ↓
Router Agent
      ↓
 ┌────┬──────────┬─────────┬─────────┐
 ↓    ↓          ↓         ↓         ↓
Soil Fertilizer Disease  Weather  General
Agent   Agent     Agent    Agent    Agent
 └────┴──────────┴─────────┴─────────┘
                  ↓
               Groq LLM
                  ↓
          Agricultural Answer
```

## Machine Learning Models

| Feature | Model / Technology |
|---|---|
| Crop Recommendation | TensorFlow/Keras Neural Network |
| Crop Feature Scaling | StandardScaler |
| Crop Class Mapping | LabelEncoder |
| Soil Classification | CNN-based Image Classification |
| Soil Image Preprocessing | ResNet50 preprocessing |
| Fertilizer Recommendation | Random Forest Classifier |
| Disease Detection | Multimodal AI |
| Agricultural Chatbot | Large Language Model via Groq |
| Weather Advisory | Weather API + AI reasoning |

## Crop Recommendation

### Inputs

```text
N
P
K
Temperature
Humidity
pH
Rainfall
```

### Workflow

```text
Input Features
      ↓
StandardScaler
      ↓
Keras Neural Network
      ↓
Prediction
      ↓
Argmax
      ↓
LabelEncoder
      ↓
Recommended Crop
```

Example request:

```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 25.5,
  "humidity": 80,
  "ph": 6.5,
  "rainfall": 200
}
```

Example response:

```json
{
  "recommended_crop": "rice"
}
```

## Soil Classification

```text
Soil Image
    ↓
RGB Conversion
    ↓
224 × 224 Resize
    ↓
ResNet50 Preprocessing
    ↓
CNN Model
    ↓
Soil Type
```

Model files:

```text
soil_model_cnn.h5
soil_classes.pkl
```

> The current implementation does not use YOLO for soil classification.

## Fertilizer Recommendation

Inputs:

```text
Temperature
Humidity
Moisture
Soil Type
Crop Type
N
P
K
```

Workflow:

```text
Agricultural Features
       ↓
Feature Processing
       ↓
Random Forest Classifier
       ↓
Recommended Fertilizer
```

## Disease Detection

```text
Plant / Leaf Image
       ↓
Express Backend
       ↓
Multimodal AI
       ↓
Disease
Confidence
Causes
Treatments
Prevention
```

## Weather Advisory

```text
Farmer Location
      ↓
Weather Service
      ↓
Current Weather
      ↓
Weather Agent
      ↓
Weather-Aware Advice
```

## Farmer Memory

Farmer-specific information can include:

- Previous crops
- Soil type
- Fertilizer usage
- Location
- Conversation history

```text
Farmer Question
      ↓
Memory Extraction
      ↓
MongoDB
      ↓
Farmer Memory
      ↓
AI Agent
      ↓
Personalized Response
```

## Multilingual and Voice Support

Supported languages:

- English
- Hindi
- Telugu

Voice input uses the browser Speech Recognition API.

Voice output uses the browser Speech Synthesis API.

```text
Farmer Speech
      ↓
Speech Recognition
      ↓
Text
      ↓
AI Chatbot
      ↓
Response
      ↓
Speech Synthesis
      ↓
Voice
```

## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- Web Speech API

### Backend

- Node.js
- Express.js
- REST APIs
- MongoDB
- Mongoose
- JWT

### Machine Learning

- Python
- TensorFlow
- Keras
- Scikit-learn
- NumPy
- Pandas
- Pillow
- Joblib

### AI

- Groq API
- Large Language Model
- Multimodal AI

### External Services

- Weather API
- Reddit contextual information
- Cloudinary

## Project Structure

```text
agri-ai-advisory-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── agents/
│   │   ├── routerAgent.js
│   │   ├── soilAgent.js
│   │   ├── fertilizerAgent.js
│   │   ├── diseaseAgent.js
│   │   ├── weatherAgent.js
│   │   └── generalAgent.js
│   │
│   ├── models/
│   │   ├── FarmerMemory.js
│   │   └── ChatbotHistory.js
│   │
│   ├── routes/
│   │   └── agentRoutes.js
│   │
│   ├── services/
│   │   ├── weatherService.js
│   │   ├── translateService.js
│   │   └── ...
│   │
│   ├── server.js
│   └── package.json
│
├── ml-service/
│   ├── app.py
│   ├── crop_model.h5
│   ├── scaler.pkl
│   ├── label_encoder.pkl
│   ├── soil_model_cnn.h5
│   ├── soil_classes.pkl
│   └── ...
│
├── train_data/
├── test/
└── README.md
```

## API Endpoints

### Crop Prediction

```http
POST /predict
```

Flask ML service:

```text
http://localhost:5001/predict
```

### Soil Prediction

```http
POST /predict-soil
```

Flask ML service:

```text
http://localhost:5001/predict-soil
```

### AI Chatbot

```http
POST /agent/query
```

Example:

```json
{
  "farmerId": "farmer1",
  "question": "What fertilizer is good for rice?",
  "language": "English"
}
```

### Agent Test

```http
GET /agent/test
```

Response:

```text
Agent route working
```

## Installation

### 1. Clone

```bash
git clone <YOUR_REPOSITORY_URL>
cd agri-ai-advisory-system
```

### 2. Backend

```bash
cd server
npm install
```

### 3. Frontend

```bash
cd ../frontend
npm install
```

### 4. Python Environment

From the project root:

```bash
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 5. Python Dependencies

```bash
pip install flask flask-cors tensorflow numpy pandas scikit-learn pillow joblib
```

## Environment Variables

Create `server/.env`:

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

GROQ_API_KEY=YOUR_GROQ_API_KEY

WEATHER_API_KEY=YOUR_WEATHER_API_KEY

JWT_SECRET=YOUR_JWT_SECRET
```

Never commit real credentials.

Recommended `.gitignore`:

```gitignore
node_modules/
.env
venv/
__pycache__/
*.pyc
```

## Running the Project

### 1. Flask ML Service

```powershell
cd ml-service
..\venv\Scripts\python.exe app.py
```

Runs on:

```text
http://localhost:5001
```

### 2. Express Backend

In another terminal:

```powershell
cd server
node server.js
```

Runs on:

```text
http://localhost:5000
```

### 3. React Frontend

In another terminal:

```powershell
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal.

## Complete Chatbot Workflow

```text
User Question
      ↓
/agent/query
      ↓
Farmer Memory
      ↓
Conversation History
      ↓
Router Agent
      ↓
Specialized Agent
      ↓
Weather / Context
      ↓
Groq LLM
      ↓
AI Response
      ↓
Translation
      ↓
MongoDB History
      ↓
React Frontend
```

## Example Questions

```text
What crop is suitable for my soil?

What fertilizer is suitable for rice?

What is the weather in my location?

How can I control pests?

Which soil is suitable for cotton?

How can I improve crop growth?

What should I do if my plant leaves are turning yellow?
```

## Security

The application uses:

- JWT-based authentication
- Environment variables for credentials
- MongoDB authentication
- Backend API validation
- CORS configuration
- Separate ML service
- API key protection

Never commit API keys, passwords, database credentials, or `.env` files.

## Limitations

- ML predictions depend on training-data quality.
- Soil classification depends on image quality and available classes.
- Disease detection depends on the multimodal AI model and supplied image.
- Weather information depends on the external weather service.
- AI-generated agricultural recommendations are advisory information.
- The current soil classification implementation does not directly predict soil pH.
- External AI and weather services require internet connectivity.

## Future Enhancements

- Crop yield prediction
- ML-based irrigation scheduling
- Improved soil parameter estimation
- Dedicated computer-vision disease models
- Larger region-specific agricultural datasets
- Additional Indian regional languages
- Mobile application
- Offline / low-connectivity support
- Model explainability
- Improved farmer personalization
- More detailed location-based recommendations

## Project Objectives

1. Provide data-driven crop recommendations.
2. Help classify soil from images.
3. Assist farmers in identifying plant diseases.
4. Recommend suitable fertilizers.
5. Provide weather-aware agricultural guidance.
6. Provide personalized AI-based agricultural assistance.
7. Support multilingual interaction.
8. Improve accessibility through voice interaction.
9. Store farmer context for personalized recommendations.
10. Integrate multiple agricultural services into a single platform.

## Author

### Pasupula Sai Sathwik

**B.Tech – Computer Science and Engineering**  
**Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)**

---

## 🌾 AI Smart Agriculture Advisory Platform

> An integrated AI and Machine Learning platform for intelligent, personalized, and accessible agricultural assistance.
