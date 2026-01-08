import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { validateJWT } from './utils/validateJWT';

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002', 
    'http://localhost:3003', 
    'http://localhost:3004'

  ],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Type',"X-Timestamp"],
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json({limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());

app.set('trust proxy', 1);

//appyly rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req:any)=> (validateJWT(req.cookies.refresh_token) ? 1000: 100), // Limit each IP to 100 requests per windowMs
  message: {error: 'Too many requests, please try again later.'},
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req:any, res:any) => {
    const decoded = validateJWT(req.cookies.refresh_token);
    return decoded ? decoded.id : req.ip;
  }
});

app.use(limiter);


app.get('/health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});


app.use("/auth", proxy("http://localhost:4002")); // auth service
app.use("/api", proxy("http://localhost:4001")); // api service


const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
