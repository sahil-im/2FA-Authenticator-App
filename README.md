# Two-Factor Authentication Node.js App

This Node.js application demonstrates the implementation of Two-Factor Authentication (2FA) using Express, Mongoose, bcrypt, jwt, body-parser, cookie-parser, otplib, qrcode, authMiddleware, and cors.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/2fa-node-app.git
   
2. Install dependencies:
   cd 2FA-Authenticator-App/server
   npm install

## Usage

1. Start the application:
    npm start
   
## Endpoints
    POST /register
    Register a new user with a unique username, hashed password, and generated TOTP secret.
  ![register](https://github.com/sahil-im/2FA-Authenticator-App/assets/70938244/c8acdee1-5c10-4afb-9f10-f370f33aaae9)

    GET /generateQR
    Generate a QR code for a user's TOTP secret to be scanned by a 2FA authenticator app.
![QRCode](https://github.com/sahil-im/2FA-Authenticator-App/assets/70938244/95e115a3-a4ed-476a-b3d6-cb12c0fa02a9)
    
    POST /loginTOTP
    Log in a user by verifying their credentials and the provided TOTP code.
  ![login](https://github.com/sahil-im/2FA-Authenticator-App/assets/70938244/e3d0dd52-93af-4e2a-bf2d-db7172151e73)

## Contributing
    Feel free to contribute by opening issues or submitting pull requests.
    
## License

This project is licensed under the MIT License.

