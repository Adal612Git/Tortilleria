const express = require('express');
const app = express();
const path = require('path');
const db = require('./infrastructure/db/database');
const authRoutes = require('./presentation/routes/authRoutes');
const userRoutes = require('./presentation/routes/userRoutes');

app.use(express.json());

// ensure tables exist by executing schema if necessary
const fs = require('fs');
const schemaPath = path.join(__dirname, '../../Documentacion/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.serialize(() => {
  db.exec(schema, () => {});
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

module.exports = app;
