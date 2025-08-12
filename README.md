# CLAMM Ponder v2

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/your-org/clamm-ponder-v2-re)
[![Code Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen.svg)](https://github.com/your-org/clamm-ponder-v2-re)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/your-org/clamm-ponder-v2-re)
[![TypeScript](https://img.shields.io/badge/typescript-5.3%2B-blue.svg)](https://www.typescriptlang.org/)

## Overview

CLAMM Ponder v2 is a comprehensive blockchain indexing and analytics system built on the Ponder framework, designed to track and analyze DeFi options trading, liquidity management, and automated market making strategies on the Monad blockchain. The system provides real-time indexing of complex financial instruments including options markets, liquidity positions, and automated rebalancing strategies, enabling developers and analysts to build sophisticated DeFi applications with rich on-chain data insights.

## Core Features

- **Real-time Blockchain Indexing**: Live indexing of DeFi events across multiple contract types using Ponder's efficient event processing
- **Options Market Analytics**: Comprehensive tracking of option minting, exercise, settlement, and pricing across multiple markets
- **Liquidity Position Management**: Real-time monitoring of Uniswap V3 liquidity positions, usage patterns, and yield generation
- **Automated Strategy Tracking**: Indexing of automated market making strategies with rebalancing events and performance metrics
- **Multi-Contract Integration**: Unified indexing across Automator contracts, Option Markets, Liquidity Handlers, and Position Managers

## Architecture Overview & Flowcharts

This is a monolithic Node.js application built on the Ponder framework with a PostgreSQL database backend, designed as a blockchain indexing service that processes real-time events from multiple smart contracts and maintains normalized relational data for complex DeFi analytics.

### Request/Response Lifecycle

```mermaid
sequenceDiagram
    participant Client as Client Application
    participant Ponder as Ponder Indexer
    participant RPC as Blockchain RPC
    participant DB as PostgreSQL
    participant Contracts as Smart Contracts

    Client->>Ponder: Query indexed data
    Ponder->>DB: Execute GraphQL query
    DB-->>Ponder: Return normalized data
    Ponder-->>Client: Return structured response

    Note over Ponder,Contracts: Event Processing Loop
    Contracts->>Ponder: Emit blockchain events
    Ponder->>RPC: Fetch event details
    Ponder->>Ponder: Process event handlers
    Ponder->>DB: Update database schema
    DB-->>Ponder: Confirm persistence
```

### Core Data Flow

```mermaid
flowchart TD
    A[Blockchain Events] --> B[Ponder Event Handlers]
    B --> C{Event Type}
    
    C -->|Automator Events| D[Strategy Data Processing]
    C -->|Option Market Events| E[Options Data Processing]
    C -->|Liquidity Events| F[Position Management]
    
    D --> G[Update Strategy Tables]
    E --> H[Update Options Tables]
    F --> I[Update Liquidity Tables]
    
    G --> J[Database Schema]
    H --> J
    I --> J
    
    J --> K[GraphQL API]
    K --> L[Client Applications]
    
    subgraph "Event Types"
        M[Transfer Events]
        N[Rebalance Events]
        O[Mint/Burn Options]
        P[Exercise/Settle Options]
        Q[Liquidity Position Changes]
    end
    
    subgraph "Data Models"
        R[Account Balances]
        S[Strategy Configurations]
        T[Option Positions]
        U[Liquidity Positions]
        V[Market Statistics]
    end
```

## Tech Stack

### **Backend & Indexing**
- **Framework**: Ponder v0.9.23 - Blockchain indexing and GraphQL API
- **Language**: TypeScript 5.3+
- **Runtime**: Node.js 18.14+
- **Database**: PostgreSQL with Drizzle ORM

### **Blockchain Integration**
- **Networks**: Monad (Chain ID: 10143)
- **RPC**: HTTP transport with rate limiting (300 req/sec)
- **ABI Management**: Merged contract ABIs for complex integrations
- **Event Processing**: Real-time blockchain event indexing

### **Development Tools**
- **Package Manager**: npm with ES modules
- **Linting**: ESLint with Ponder-specific configuration
- **Type Checking**: TypeScript compiler
- **Database Tools**: Drizzle Kit for schema management

### **Dependencies**
- **Core**: viem v2.33.0, jsbi v3.2.5
- **Uniswap**: SDK Core v7.5.0, V3 SDK v3.24.0
- **Cryptography**: keccak v3.0.4
- **Web Framework**: Hono v4.5.0 (for API endpoints)

## Getting Started - Developer Onboarding

### Prerequisites

- **Node.js**: `v18.14` or higher
- **PostgreSQL**: `v13` or higher
- **Git**: Latest version
- **npm**: `v8` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/clamm-ponder-v2-re.git
cd clamm-ponder-v2-re

# Install dependencies
npm install

# Generate TypeScript types
npm run codegen
```

### Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/clamm_ponder_v2"

# Blockchain RPC Configuration
PONDER_RPC_URL_MONAD="https://rpc.monad.xyz"

# Optional: Development overrides
PONDER_LOG_LEVEL="info"
PONDER_MAX_BLOCK_RANGE=1000
```

**Environment Variables Explained:**
- `DATABASE_URL`: PostgreSQL connection string for the indexing database
- `PONDER_RPC_URL_MONAD`: RPC endpoint for Monad blockchain access
- `PONDER_LOG_LEVEL`: Logging verbosity (debug, info, warn, error)
- `PONDER_MAX_BLOCK_RANGE`: Maximum block range for historical indexing

### Running the Application

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm run start

# Serve GraphQL API
npm run serve

# Database management
npm run db
```

### Running Tests

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Note: Test suite configuration pending - add test scripts as needed
```

## Project Structure

```
clamm-ponder-v2-re/
├── abis/                    # Smart contract ABIs for indexing
├── src/                     # Source code directory
│   ├── api/                # API endpoints and GraphQL resolvers
│   ├── hooks/              # Custom Ponder hooks for data processing
│   ├── index.ts            # Main event handler orchestrator
│   ├── APY.ts             # APY calculation utilities
│   ├── autoExercise.ts    # Auto-exercise logic handlers
│   ├── optionMarket.ts    # Options market event processors
│   ├── optionPricing.ts   # Pricing model integrations
│   └── tvl.ts             # Total Value Locked calculations
├── generated/              # Auto-generated TypeScript types
├── ponder.config.ts        # Ponder configuration and contract mappings
├── ponder.schema.ts        # Database schema definitions
├── poolConfig.ts           # Pool configuration utilities
└── strategies.ts           # Strategy configuration and management
```

**Key Directories:**
- `/abis`: Contract ABIs for event parsing and contract interactions
- `/src/hooks`: Custom logic for complex data transformations and calculations
- `/generated`: Auto-generated files from Ponder codegen
- `/src/api`: GraphQL API endpoints and data access layer

## Contribution Guidelines

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes using conventional commits
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request with detailed description

### Coding Standards

- **TypeScript**: Strict mode enabled, no `any` types without justification
- **ESLint**: Follow Ponder-specific linting rules
- **Database**: Use Ponder schema definitions, avoid raw SQL
- **Events**: Implement proper error handling and logging for all event handlers

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Examples:**
- `feat(automator): add rebalancing event handler`
- `fix(options): resolve token ID parsing issue`
- `docs: update README with deployment instructions`
- `refactor(schema): optimize database relations`

### Pull Request Guidelines

- **Title**: Clear, descriptive title following conventional commits
- **Description**: Detailed explanation of changes, testing performed, and any breaking changes
- **Testing**: Include test coverage and manual testing steps
- **Documentation**: Update relevant documentation and add inline comments for complex logic

## License

Distributed under the MIT License. See `LICENSE` file for details.

---

**Note**: This project is actively maintained and may have breaking changes between major versions. Always check the changelog and test thoroughly before upgrading in production environments.
