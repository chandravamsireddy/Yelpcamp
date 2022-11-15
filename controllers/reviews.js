const Review = require('../models/review');
const campground = require('../models/campground');


module.exports.createReview = async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log(review._id)
    Campground.reviews.push(review);
    await review.save();
    await Campground.save();
    req.flash('success', 'New Review successfully created!!')
    res.redirect(`/campgrounds/${Campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    console.log("trigerred")
    const { id, reviewId } = req.params;
    console.log(reviewId)
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review successfully deleted!!')
    res.redirect(`/campgrounds/${id}`);

}