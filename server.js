const connectDB = require('./db/db');
const runFile = require('./routes');
require('dotenv').config();

connectDB();

runFile('./test.txt');



