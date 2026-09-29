# Tomato Disease Classification

Tomato Health is a web-based tomato leaf disease classification application. Users can upload a tomato leaf image through the React frontend, which sends the image to a FastAPI backend for machine-learning classification. The system uses a trained TensorFlow model to identify the leaf condition and returns the predicted disease class together with the model's confidence score.

## Setup

Clone the repository and install the frontend dependencies:

```bash
git clone <repository-url>
cd <repository-directory>/frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000/predict
```

Install the api dependencies in the Python environment:

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Configure the backend with the trained model and required environment settings.

## Run

Start the FastAPI backend:

```bash
cd api
source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

In a separate terminal, start the React/Vite frontend:

```bash
cd frontend
npm run dev
```

Open the Vite development URL shown in the terminal, typically:

```text
http://localhost:5173
```

Upload a tomato leaf image to receive a disease classification and confidence score.
