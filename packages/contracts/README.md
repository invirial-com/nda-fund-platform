# NdaFundPlatform Smart Contracts 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C.svg)](https://hardhat.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4E5EE4?logo=openzeppelin&logoColor=fff)](#)

Decentralized fundraising platform with cross-chain support, staking rewards, and transparent governance.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Smart Contracts](#smart-contracts)
- [Deployment](#deployment)
- [Testing](#testing)
- [Security](#security)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- **Decentralized Fundraising**: Create and manage fundraising campaigns on-chain
- **Cross-Chain Donations**: Accept donations from multiple blockchain networks via Axelar
- **Auto Token Swapping**: Automatic conversion to USDT using Uniswap V4
- **Staking Rewards**: Donors can stake tokens and earn rewards (79/19/2 split)
- **Governance Voting**: Token-weighted voting on fundraiser proposals
- **Media Verification**: Integration with Numbers Protocol for content authenticity
- **Upgradeable Contracts**: UUPS proxy pattern for seamless upgrades
- **No Platform Fees**: 100% of donations go to fundraisers (minus staking rewards)

### Technical Features
- ✅ Fully upgradeable using UUPS proxies
- ✅ Reentrancy protection
- ✅ Pausable in emergencies
- ✅ Role-based access control
- ✅ Gas optimized
- ✅ Comprehensive test coverage
- ✅ Multi-chain support

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NdaFundPlatform Ecosystem                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │ FundraiserFactory│◄────────┤  NdaFundPlatformBridge │         │
│  │   (Upgradeable)  │         │     (Axelar)     │         │
│  └────────┬─────────┘         └──────────────────┘         │
│           │                              ▲                   │
│           │ creates                      │                   │
│           ▼                              │                   │
│  ┌──────────────────┐                   │                   │
│  │   Fundraiser     │                   │                   │
│  │  (Upgradeable)   │◄──────────────────┘                   │
│  │                  │                                        │
│  │  - Donations     │◄─────── Uniswap V3 Router            │
│  │  - Staking       │                                        │
│  │  - Proposals     │                                        │
│  │  - Media Archive │                                        │
│  └──────────────────┘                                        │
│           ▲                                                  │
│           │                                                  │
│  ┌────────┴─────────┐                                       │
│  │ NdaFundPlatformToken   │                                       │
│  │  (Upgradeable)   │                                       │
│  │   - Governance   │                                       │
│  │   - Rewards      │                                       │
│  └──────────────────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

See [QUICK_SETUP.md](./QUICK_SETUP.md) for step-by-step instructions.

## 🛠️ Development

### Project Structure

```
ndafundplatform-contracts/
├── contracts/
│   ├── Fundraiser.sol
│   ├── FundraiserFactory.sol
│   ├── NdaFundPlatformBridge.sol
│   ├── NdaFundPlatformToken.sol
│   └── mocks/
│       └── MockERC20.sol
├── scripts/
│   ├── deploy.js
│   ├── upgrade.js
│   └── verify.js
├── test/
│   ├── Fundraiser.test.js
│   ├── FundraiserFactory.test.js
│   └── NdaFundPlatformBridge.test.js
├── deployments/
│   └── sepolia-latest.json
├── hardhat.config.js
├── package.json
└── README.md
```

### Available Scripts

```bash
npm run compile       # Compile contracts
npm test              # Run tests
npm run test:gas      # Test with gas reporting
npm run test:coverage # Generate coverage report
npm run deploy:local  # Deploy to local network
npm run deploy:sepolia # Deploy to Sepolia
npm run upgrade:sepolia # Upgrade on Sepolia
npm run verify:sepolia # Verify on Etherscan
npm run node          # Start local node
npm run clean         # Clean artifacts
npm run size          # Check contract sizes
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use meaningful variable names
- Add NatSpec comments to all public functions
- Write tests for all new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- Website: [https://ndafundplatform.com](https://ndafundplatform.com)
- Documentation: [https://docs.ndafundplatform.com](https://docs.ndafundplatform.com)
- Twitter: [@NdaFundPlatform](https://twitter.com/ndafundplatform)
- Discord: [Join our community](https://discord.gg/ndafundplatform)

## 👥 Team

- **Core Team**: [GitHub Organization](https://github.com/ndafundplatform)
- **Contributors**: [Contributors List](https://github.com/ndafundplatform/contracts/graphs/contributors)

## 🙏 Acknowledgments

- OpenZeppelin for secure contract libraries
- Axelar Network for cross-chain infrastructure
- Uniswap for DEX integration
- Hardhat team for development tools

## 📞 Support

- Email: support@ndafundplatform.com
- Discord: [Community Server](https://discord.gg/ndafundplatform)
- GitHub Issues: [Report bugs](https://github.com/ndafundplatform/contracts/issues)

---

**Built with ❤️ by the NdaFundPlatform Team**

*Empowering transparent fundraising on the blockchain*
