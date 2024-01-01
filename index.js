const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Routes = require('./routes/Routes');
dotenv.config();
const app = express();
const path = require('path');


app.use(cors({ origin: true, credentials: true,  exposedHeaders: ['Authorization'],
allowedHeaders: ['Content-Type', 'Authorization'],}));

app.use(express.json(
  {
    type: ['application/json', 'text/plain']
  }
));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  
app.use('/api', Routes);
app.use('/upload', express.static(path.join(__dirname, 'upload', 'images')));
app.use('/files', express.static(path.join(__dirname, 'upload', 'files')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
