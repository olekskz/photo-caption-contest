const express = require('express')
const PORT  = 3000;
const app = express()
const path = require('path')


app.use(express.json())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})


app.listen(PORT, () => {
    console.log(`Server is listening on web: http://localhost:3000`)
})

