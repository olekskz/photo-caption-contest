const express = require('express');

const {User, Photo} = require('../models');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcrypt');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'photo-contest',
    allowed_formats: ['jpg', 'png'],
  },
});


const upload = multer({ storage: storage });

router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
      // Перевірка на відповідність паролів
      if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Паролі не співпадають!' });
      }

      // Перевірка на наявність користувача з таким самим username
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
          return res.status(400).json({ message: 'Користувач з таким username вже існує!' });
      }

      // Хешування паролю
      const hashedPassword = await bcrypt.hash(password, 10);

      // Створення нового користувача
      const newUser = await User.create({
          username,  // Використовуємо username
          email,
          password: hashedPassword,
      });

      // Авторизація користувача після реєстрації
      req.login(newUser, (err) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Помилка авторизації' });
          }
          return res.json({ redirectUrl: '/auth/main' });
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Помилка при реєстрації' });
  }
});


router.post('/login', (req, res, next) => {

  if (!validator.isAlphanumeric(username)) {
    return res.status(400).json({ message: 'Username must be alphanumeric' });
  }
  if (!validator.isLength(password, { min: 6 })) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: 'Неправильний логін або пароль' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ redirectUrl: '/auth/main' });
    });
  })(req, res, next);
});


router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err); // Додано логування для перевірки помилок
      return res.status(500).json({ message: 'Помилка при виході' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err); // Додано логування для перевірки помилок
        return res.status(500).json({ message: 'Помилка при знищенні сесії' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ redirectUrl: '/login' });
    });
  });
});


router.get('/addPost', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.render('addPost');
  
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Шукаємо користувача в базі даних за ім'ям користувача
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: 'There is no user with this username' });
    }

    // Порівнюємо введений пароль з захешованим паролем в базі даних
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Якщо пароль невірний, повертаємо помилку
      return res.status(400).json({ message: 'Login or password do not match' });
    }

    // Якщо пароль правильний, відправляємо редирект
     res.redirect('/auth/main'); // або res.json({ redirectUrl: '/auth/main' }) - для клієнтського коду
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



  


router.post('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Помилка при виході' });
      }
      res.redirect('/login');  // Перенаправлення після виходу
    });
});


router.get('/main', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');  // Якщо не авторизований, перенаправляємо на сторінку входу
  }
  res.render('main');  // Якщо авторизований, рендеримо головну сторінку
});


router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
  
    res.render('account', { user: req.user });
});

router.get('/register', (req ,res) => {
  res.render('register')
})

module.exports = router;
