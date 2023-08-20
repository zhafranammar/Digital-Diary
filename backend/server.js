const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const diaryRoutes = require('./routes/diary');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
