const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const otplib = require('otplib');
const qrcode = require('qrcode');
const authMiddleware = require('./middleware/auth');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5500;
const MONGODB_URI = 'mongodb://localhost:27017/2FA';
app.use(express.static('public'));

app.use(cors());


mongoose.connect(MONGODB_URI);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(cookieParser());

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  secret: String,
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const totpSecret = otplib.authenticator.generateSecret();

    const newUser = new User({
      username,
      password: hashedPassword,
      secret: totpSecret,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/generateQR', async (req, res) => {
    try {
      const  user  = req.query.user;

      const getUser = await User.findOne({ username: user });
      if (!getUser) {
        return res.status(404).json({ error: 'User not found11' });
      }
  
      const generatedCode = otplib.authenticator.generate(getUser.secret);
      
      const otpAuthUrlWithCode = `${otplib.authenticator.keyuri(user, 'Test', getUser.secret)}&code=${generatedCode}`;
  
      // Generate QR code image
      const image = await qrcode.toDataURL(otpAuthUrlWithCode);
  
      res.status(200).json({ image });
    } catch (error) {
      console.error('Error:', error.message); // Log the error message
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.post('/loginTOTP', async (req, res) => {
  try {
    const { username, password, code } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const totpVerified = otplib.authenticator.check(code, user.secret);

    if (!totpVerified) {
      return res.status(401).json({ error: 'Invalid TOTP code' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
