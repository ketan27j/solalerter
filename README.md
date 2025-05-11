# SolAlerter: Blockchain Alerting Platform

SolAlerter is a blockchain alerting platform that enables users to seamlessly set alerts for tokens and nfts on Solana blockchain and get notified on Telegram using BLINKS. 

## Architecture
![SolIndexer Architecture](https://github.com/ketan27j/solalerter/blob/main/docs/architecture.png)

## Demo
[![Video Description](https://github.com/ketan27j/solalerter/blob/main/docs/play.jpg)](https://youtu.be/ZY6d54olTDo)

## Features

- **Simplified Blockchain Indexing**: Connect directly to your PostgreSQL database and start indexing blockchain data with minimal setup
- **Customizable Data Tracking**: Select specific data categories to track based on your application needs
- **Real-time Updates**: Leverages Helius webhooks for real-time blockchain data synchronization
- **User-friendly Interface**: Intuitive dashboard for managing database connections and indexing configurations
- **Scalable Architecture**: Designed to handle multiple users and high data throughput

## Project Structure

```
SOLALERTER/
├── backend/                # Main backend server
├── solalerter-web/         # Frontend web application
├── prisma-shared/          # Shared Prisma schema and DB utilities
├── .env                    # Environment variables
├── .env.example            # Example environment configuration
├── .gitignore              # Git ignore file
├── dockerfile              # Docker configuration
├── README.md               # Project documentation
```

## Technical Stack

- **Backend**: Node.js, Express
- **Frontend**: React, TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **Blockchain Integration**: Helius API, 
- **Authentication**: JWT, OAuth2
- **Deployment**: Docker, Kubernetes support

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v14+)
- Helius API key (get one at [https://helius.dev](https://helius.dev))
- Solana wallet (for submitting test transactions)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ketan27j/solalerter.git
   cd solalerter
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

3. Install dependencies:
   ```bash
   # Install root dependencies
   npm install
   
   # Install dependencies for each package
   cd backend && npm install
   cd ../solalerter-web && npm install
   ```

4. Set up the database:
   ```bash
   cd ../prisma-shared && npm install
   npx prisma migrate dev
   npm run build
   ```

5. Start the development servers:
   ```bash
   # In separate terminals
   cd backend && npm run dev
   cd SolAlerter-web && npm run dev
   ```

### Using Docker

Alternatively, you can use Docker to run the entire stack:

```bash
docker build -t solalerter .
docker run --name solalerter -p 3004:3004 -d solalerter
```

## Configuration

### Environment Variables

Key environment variables to configure:

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/solalerter

# Helius API
HELIUS_API_KEY=your_helius_api_key

# Authentication
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

## Usage Guide

### 1. Sign Up and Setup

1. Create an account on the SolAlerter platform
2. Navigate to the "Settings" section
3. Enter your Telegram Id
4. Save settings

### 2. Setting Up Subscription

1. Go to the "Subscription" on dashboard
2. Select data categories you want to track:
   - Token 
   - NFT
3. Configure specific parameters for each category
4. Click "Start Indexing" to begin the process

### 3. Monitoring and Management

1. View real-time indexing status on the dashboard
2. Modify indexing parameters as needed

## Development

### Architecture Overview

SolAlerter consists of three main components:

1. **Backend API Server**: Handles user authentication, telegram id management, and subscription setup
2. **Web Interface**: Provides an intuitive UI for managing the platform

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Helius](https://helius.dev) for providing the webhook infrastructure
- [Solana](https://solana.com) for the blockchain platform
- All contributors and supporters of this project