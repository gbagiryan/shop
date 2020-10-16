const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const {requireAuth, checkUser, authedUser} = require('./middleware/authMiddleware');
const Product = require('./models/product');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

//disable caching
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    next()
});
app.set('view engine', 'ejs');
app.use(express.static('./public/'));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    }))
    .catch((err) => console.log(err));

app.get('*', checkUser);
app.get('/login', authedUser);
app.get('/signup', authedUser);

app.get('/', async (req, res) => {
    let products = await Product.find();
    res.render('index', {products})
});

app.use(authRoutes);
app.use(cartRoutes);

app.use((req, res) => {
    res.status(404).render('404')
});