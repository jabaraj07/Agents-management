const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const protect = require('./middlewares/authMiddleware');


dotenv.config();

// enable CORS for development front-end; adjust origin as needed
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
// agent endpoints are protected
app.use("/api/agents", protect, agentRoutes);


app.listen(process.env.PORT ,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
});