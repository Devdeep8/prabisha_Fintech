const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs/promises");
const userRouter= require("./userRouter");
const cors = require("cors");
const db = require("./db"); // Import the connection db
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const kycApi = require("./router/kyc")
const calculator = require("./router/calculator")
const stocks = require("./router/stock")
require("dotenv").config();
port = process.env.PORT || 8100
const app = express();

// API endpoint to create a meeting
 

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // replace with your client origin
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(kycApi)
app.use(calculator)
app.use(stocks)

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
app.use(userRouter);
// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: 'consulting.prabisha.com',
  port: 587,
  secure: false,
  auth: {
    user: 'info@prabisha.com',
    pass: 'ElzAeL6n',
  },
}); 

transporter.verify((error) => {
  if (error) {
    console.error('Nodemailer verification failed:', error);
  } else {
    console.log('Nodemailer transporter is ready');
  }
});

const generateToken = (user) => {
  const payload = {
    id: user.id,
    userId: user.userId,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Devdeep!");
});

function generateUserId(userIdentifier) {
  // Generate a simple hash code
  let hash = 0;
  for (let i = 0; i < userIdentifier.length; i++) {
    hash = (hash * 31 + userIdentifier.charCodeAt(i)) & 0xffffffff;
  }

  // Convert the hash to a positive number and get the last four digits
  let hashString = Math.abs(hash % 10000).toString();

  // Pad the hash string if necessary to ensure it is four digits
  while (hashString.length < 4) {
    hashString = "0" + hashString;
  }

  return `CS${hashString}`;
}

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const username = req.body.username;
      const userId = generateUserId(username);
      console.log(userId);
      const folderPath = path.join(__dirname, "uploads", username, userId);
      await fs.mkdir(folderPath, { recursive: true });
      cb(null, folderPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint for user signup
app.post("/api/signup", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password, Securityquestion } = req.body;
    // console.log(req.body);
    const role = "user";

    // Get a connection from the pool
    const connection = await db.getConnection();

    // Check if the username or email already exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }

    // Insert new user data into the users table

    const userId = generateUserId(username);
    const profileImage = req.file
      ? `${process.env.NEXT_PUBLIC_PORT}/uploads/${username}/${userId}/${req.file.filename}`
      : null;

    await connection.execute(
      "INSERT INTO users ( userId, username, email, password, Securityquestion, image, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, username, email, password, Securityquestion, profileImage, role]
    );

    // Send email with user credentials
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Our Service",
      text: ` UserId: ${userId}\nUsername: ${username}\nPassword: ${password}\nRole: ${role}`,
    };
    await transporter.sendMail(mailOptions);

    const user = { username, email, role, image: profileImage };
    const token = generateToken(user);

    res.status(201).json({ token, message: "User signed up successfully" });

    connection.release();
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint for user signin
app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password } = req.body; // Changed username to identifier

    const connection = await db.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?",
      [identifier, identifier, password]
    );
    connection.release();
    // console.log( rows)
    if (rows.length > 0) {
      const user = {
        id: rows[0].id,
        imagePath: rows[0].image,
        userId: rows[0].userId,
        username: rows[0].username,
        email: rows[0].email,
        role: rows[0].role,
        Securityquestion: rows[0].Securityquestion,
      };

      const token = generateToken(user);
      // console.log('token', token)
      res.status(200).json({ message: "Authenticated", token: token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error signing in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get('/api/decode-token', (req, res) => {
  const token = req.cookies;
  

  if (!token) {
    return res.status(401).json({ message: 'Token not found or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure you have a secret key
    return res.status(200).json({ user: decoded });
  } catch (error) {
    return res.status(401).json({ message: 'Token not found or invalid' });
  }
});

// Endpoint for checking user role
app.get("/api/role", ensureAuthenticated, (req, res) => {
  // Extract the user's role from the decoded JWT token
  const userRole = req.user.role;

  // Send the user's role in the response
  res.json({ user: { role: userRole } });
});


app.post('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params; // Changed from 'userid' to 'userId' for consistency
  const { firstname, lastname, contactno, country, state, city } = req.body;

  try {
    // Check if the user already exists
    const selectSql = `
      SELECT * FROM users WHERE userid = ?
    `;
    const selectValues = [userId];

    // Execute the select query
    const [rows] = await db.query(selectSql, selectValues);

    if (rows.length > 0) {
      // User already exists, update their profile
      const updateSql = `
        UPDATE users 
        SET firstname = ?, lastname = ?, contactno = ?, country = ?, state = ?, city = ?
        WHERE userid = ?
      `;
      const updateValues = [firstname, lastname, contactno, country, state, city, userId];

      // Execute the update query
      await db.query(updateSql, updateValues);

      console.log("User profile updated successfully");
      res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      // User does not exist, return an error
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error("Error querying/updating user profile:", error);
    res.status(500).json({ error: 'Error querying/updating user profile' });
  }
});
// Middleware function to ensure the request is authenticated
function ensureAuthenticated(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const tokenString = token.split(" ")[1];

  jwt.verify(tokenString, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
}

// In-memory storage for OTPs (in production, use a database or a more secure method)
const otpStore = new Map();

// Helper function to generate OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Fetch user from the database
const fetchUserByEmail = async (email) => {
  const connection = await db.getConnection();
  const [users] = await connection.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  connection.release();
  return users[0];
};

// Send OTP via email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };
  await transporter.sendMail(mailOptions);
};

// Endpoint to request OTP
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email, Securityquestion } = req.body;
    console.log(req.body);

    if (!email || !Securityquestion) {
      return res
        .status(400)
        .json({ message: "Email and security question answer are required" });
    }

    const user = await fetchUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (user.Securityquestion !== Securityquestion) {
      return res.status(400).json({ message: "Incorrect security answer" });
    }

    const otp = generateOtp();
    otpStore.set(email, otp);
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error requesting OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to verify OTP
app.post("/api/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const storedOtp = otpStore.get(email);
    if (storedOtp === otp) {
      otpStore.delete(email);
      res.status(200).json({ message: "OTP verified" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to reset password
app.post("/api/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const connection = await db.getConnection();
    // const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
    await connection.execute("UPDATE users SET password = ? WHERE email = ?", [
      newPassword,
      email,
    ]);
    connection.release();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
