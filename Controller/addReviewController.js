const Anime = require('../Model/AnimeModel');
const Review = require('../Model/ReviewModel');
const User = require('../Model/UserModel');

async function addReviewController(req, res) {
  const {
    title,
    description,
    score
  } = req.body;

  try {
    // Ensure that the referenced documents (User, Anime) exist before creating the Anime
    const user = await User.findOne({username: req.session.username});
    const anime = await Anime.findOne({jp_title: req.session.anicache.jp_title});

    if (!user) {
      return res.status(400).json({ success: false, message: 'Must be Signed In!'});
    }

    // Generate a dynamic date for currentdate
    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(currentDate);

    // Create a new review
    const newReview = await Review.create({
      user: user._id,
      anime: anime._id,
      content: description,
      score: score,
      date: formattedDate,
      title: title,
    });

    // Save to the database
    await newReview.save();

    res.redirect('/anime/' + req.session.anicache.jp_title)
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while adding the review' });
  }
}

module.exports = addReviewController;
