const app        = require('./app');
require('dotenv').config();
app.set('port', process.env.PORT || 8000);

app.listen(app.get('port'), () => {
  console.log(`Server is running on http://${process.env.DB_HOST}:${app.get('port')}`);
});