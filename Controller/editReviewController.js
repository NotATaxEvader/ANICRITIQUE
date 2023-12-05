const Review = require('../Model/ReviewModel');

async function editReviewController(req, res) {
  const {
    title,
    description,
    score
  } = req.body;

  const revID = req.params.revID

  try {
    // Generate a dynamic date for currentdate
    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(currentDate);

    // Update a existing review
    await Review.findByIdAndUpdate(revID,
        {
            title: title,
            content: description,
            score: score,
            date: formattedDate + " (edited)",
        });

    res.redirect('/profile')
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while adding the review' });
  }
}

module.exports = editReviewController;
