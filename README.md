# Map Application Demo

A professional map application demo built with modern technology stack, showcasing full-stack development capabilities.

## Tech Stack

### Frontend
- React 18
- JavaScript (ES6+)
- Material-UI
- Google Maps API
- Axios
- React Router

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- JavaScript (ES6+)

## Features

- User Authentication System (Login/Logout)
- Session Management (60-minute timeout)
- Google Maps Integration
- Responsive Design
- Real-time Search Functionality

## Project Structure

```
map-demo/
├── client/          # React Frontend
├── server/          # Node.js Backend
└── README.md        # Project Documentation
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Google Maps API Key

### Installation Steps

1. Clone the project
```bash
git clone [repository-url]
cd map-demo
```

2. Install frontend dependencies
```bash
cd client
npm install
```

3. Install backend dependencies
```bash
cd ../server
npm install
```

4. Configure environment variables
- Create `.env` file in client directory
- Create `.env` file in server directory

5. Start development servers
```bash
# Start backend server
cd server
npm run dev

# Start frontend development server
cd client
npm start
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/map-demo
JWT_SECRET=your_jwt_secret
```

## Development Guide

- Frontend development server runs on http://localhost:3000
- Backend API server runs on http://localhost:5000
- API documentation available at http://localhost:5000/api-docs

## Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

## Deployment

The project includes Docker configuration and can be built and run using:

```bash
docker-compose up --build
```

## Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 