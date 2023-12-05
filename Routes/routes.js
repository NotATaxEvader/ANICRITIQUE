const express = require('express');
const router = express.Router();

router.use(express.json());

router.use(express.urlencoded({ extended: true }));

const User = require('../Model/UserModel');
const Anime = require('../Model/AnimeModel');
const Review = require('../Model/ReviewModel');

const loginCont = require('../Controller/loginCont');
const signupController = require('../Controller/signupController')
const editReviewController = require('../Controller/editReviewController');
const loginAdminCont = require('../Controller/loginAdminCont');
const addReviewController = require('../Controller/addReviewController');
const adminController = require('../Controller/admin-controller');

// Define the routes and associate them with their respective controller functions
router.get('/', async (req, res) => {
    // Handle the home page route here (if needed)
    try {
        const animeData = await Anime.find({});
        const reviews = await Review.find({})
            .populate('user')

        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        let oneReview;
        if (reviews.length > 0) {
            oneReview = reviews[0];
            oneReview.user.bio = oneReview.user.bio.substring(0, 100);
        }

        if (!req.session.username)
            var pfPic = "images/d-upic.png"
        else if (req.session.username) {
            var profile = await User.findOne({ username: req.session.username })
            var pfPic = profile.picture_url
        }

        res.render('home', { animeData, oneReview, pfp: pfPic })
    } catch (error) {
        // Handle any errors that may occur during login
        res.status(500).json({ success: false, message: error });
    }
});

router.get('/anime/:aniTitle', async function (req, res) {
    const aniTitle = req.params.aniTitle;

    try {
      // Check if the user exists in the database
      const anime = await Anime.findOne({ jp_title: aniTitle });
      const review = await Review.find({ anime: anime._id }).populate('user')
  
      if (!anime) {
        return res.status(404).json({ message: 'Anime not found' });
      }

      console.log(review)
  
      if (review.length > 0){
        var aveScore = review.reduce((total, review) => total + parseInt(review.score, 10), 0) / review.length;
        await Anime.updateOne({ jp_title: aniTitle }, {ave_score: aveScore})
      } else {
        var aveScore = 'TBD';
        await Anime.updateOne({ jp_title: aniTitle }, {ave_score: 0})
      }

      const cache = { jp_title: anime.jp_title, en_title: anime.en_title, image: anime.image };
  
      req.session.anicache = cache;

      if (!req.session.username)
        var pfPic = "../images/d-upic.png"
      else if (req.session.username) {
        var profile = await User.findOne({ username: req.session.username })
        var pfPic = profile.picture_url
      }
  
      // Login successful, send a success response
      res.render('anime', { anime, review, aveScore, pfp: pfPic });
    } catch (error) {
      // Handle any errors that may occur during login
      res.status(500).json({ success: false, message: 'An error occurred when fetching anime ' + aniTitle });
    }
});

router.get('/search', async function (req, res) {
    const searchQuery = req.query.search;

    console.log(searchQuery)
    try {
        var animeData = await Anime.find({ jp_title: { $regex: searchQuery, $options: 'i' } });

        if (animeData.length === 0)
            animeData = await Anime.find({ en_title: { $regex: searchQuery, $options: 'i' } });

        if (!req.session.username)
            var pfPic = "images/d-upic.png"
        else if (req.session.username) {
            var profile = await User.findOne({ username: req.session.username })
            var pfPic = profile.picture_url
        }
        
        res.render('search', { animeData, searchQuery, pfp: pfPic });
    } catch (error) {
        // Handle any errors that may occur during login
        res.status(500).json({ success: false, message: 'An error occurred when fetching anime'});
    }
});

router.get('/anime/:aniTitle/review', async function (req, res) {
    // Handle the home page route here (if needed)
    if (!req.session.username)
        var pfPic = "/images/d-upic.png"
    else if (req.session.username) {
        var profile = await User.findOne({ username: req.session.username })
        var pfPic = profile.picture_url
    }

    res.render('review', { anicache: req.session.anicache, pfp: pfPic }); // Assuming you have a `home.hbs` file in your `views` folder
});

router.get('/login', (req, res) => {
    // Handle the home page route here (if needed)
    if (!req.session.username)
        res.render('login'); // Assuming you have a `home.hbs` file in your `views` folder
    else
        res.redirect('/profile')
});

router.get('/signup', (req, res) => {
    // Handle the home page route here (if needed)
    res.render('signup'); // Assuming you have a `signup.hbs` file in your `views` folder
});

router.get('/profile', async function (req, res) {
    try {
      // Get the username from the post
      const username = req.session.username;
      const profile = await User.findOne({ username: username })
      const review = await Review.find({ user: profile._id }).populate(['user', 'anime'])
  
      // Pass the username to the view template
      res.render('profile', { prof: profile, review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching the user profile' });
    }
  });

  router.get('/profile/editRev', async function (req, res) {
    try {
      // Get the username from the post
      const username = req.session.username;
      const profile = await User.findOne({ username: username })
  
      // Pass the username to the view template
      res.render('profile-edit', { prof: profile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching the user profile' });
    }
  });

router.get('/logout', async function (req, res) {
    try {
        console.log('Logout controller reached');
        // Clear the session data
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ success: false, message: 'An error occurred during logout' });
            }
            // Respond with a success message
            res.redirect('/login');
        });
    } catch (error) {
        // Handle any errors that may occur during logout
        console.error('Error during logout:', error);
        res.status(500).json({ success: false, message: 'An error occurred during logout' });
    }
});

router.get('/profile/:revID/delRev', async function (req, res) {
    const revID = req.params.revID

    try {
        await Review.findByIdAndDelete(revID)

        res.redirect('/profile')
        
    } catch (error) {
        // Handle any errors that may occur during logout
        console.error('Error during logout:', error);
        res.status(500).json({ success: false, message: 'An error occurred during logout' });
    }
});

router.get('/profile/:anime/:revID/editRev', async function (req, res) {
    const revID = req.params.revID
    const anime = req.params.anime

    try {
        const curRev = await Review.findById(revID)
        const curAnime = await Anime.findOne({ jp_title: anime });

        res.render('review-edit', { curRev, curAnime })
    } catch (error) {
        // Handle any errors that may occur during logout
        console.error('Error during logout:', error);
        res.status(500).json({ success: false, message: 'An error occurred during logout' });
    }
});




router.get('/admin', async (req,res)=>{
    try {
        const animes = await Anime.find();

        const anime = animes.map(anime => {
            return {
                _id: anime._id,
                jp_title: anime.jp_title,
                en_title: anime.en_title,
                synopsis: anime.synopsis.substring(0, 100) + "...",
                studio: anime.studio,
                type: anime.type,
                genre: anime.genre,
                premiere: anime.premiere,
                episode_count: anime.episode_count,
                rating: anime.rating,
                ave_score: anime.ave_score,
                image: anime.image,
                summ: anime.summ
            };
        });

        res.render('index', { anime })
    } catch (error) {
        // Handle any errors that may occur during login
        res.status(500).json({ success: false, message: error });
    }
})

/**
 * @description add anime
 * @method GET /add-anime
 */
//route.get('/add-anime', services.add_anime);
router.get('/add-anime', (req,res)=>{
    res.render('add_anime');
})
/**
 * @description update user
 * @method GET /update-user
 */
//route.get('/update-anime', services.update_anime);
router.get('/update-anime/:id', async (req,res)=>{
    try {
        const anime = await Anime.findById(req.params.id);

        res.render('update_anime', { anime })
    } catch (error) {
        // Handle any errors that may occur during login
        res.status(500).json({ success: false, message: error });
    }
})

router.get('/del/:id', async (req, res)=>{
    const id = req.params.id;

    console.log(id)

    await Anime.findByIdAndDelete(id)
        
    res.redirect('/admin')
});

router.get('/add-logout', async (req, res)=>{
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ success: false, message: 'An error occurred during logout' });
        }
        // Respond with a success message
        res.render('loginadmin')
    });
});

// API
router.post('/add/anime', adminController.create);
router.post('/edit/:id', adminController.update);
 

router.get('/logadmin', (req, res) => {
    // Handle the home page route here (if needed)
    res.render('loginadmin'); // Assuming you have a `profile.hbs` file in your `views` folder
});

router.post('/profile/editRev', async function (req, res) {
    const {
        pfp,
        name,
        bio
    } = req.body


    try {
      // Get the username from the post
      const username = req.session.username;
      const profile = await User.findOne({ username: username })
  
      await User.findByIdAndUpdate(profile._id,
        {
            picture_url: pfp,
            username: name,
            bio: bio,
        });

      req.session.username = name;

      // Pass the username to the view template
      res.redirect('/profile');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching the user profile' });
    }
  });

router.post('/editRev/:revID', editReviewController)

router.post('/anime/review', addReviewController)

router.post('/login', loginCont);

router.post('/signup', signupController);

router.post('/logadmin', loginAdminCont);

module.exports = router;
