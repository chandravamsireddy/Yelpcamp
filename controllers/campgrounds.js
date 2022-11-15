const campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken});
const { cloudinary } = require("../cloudinaryConfig");


module.exports.index = async (req, res) => {
    const Campground = await campground.find({});
    res.render('campgrounds/index', { Campground });
};

module.exports.renderNewform = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const geoData=await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const Campground = new campground(req.body.campground);
    Campground.geometry = geoData.body.features[0].geometry;
    Campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    Campground.author = req.user._id;
    await Campground.save();
    console.log(Campground);
    req.flash('success', 'CampGround successfully created!!')
    res.redirect(`/campgrounds/${Campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const Campground = await campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //console.log(Campground);
    if (!Campground) {
        req.flash('error', 'Cannot find that CampGround!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { Campground });
}

module.exports.renderEditform = async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id)
    if (!Campground) {
        req.flash('error', 'Cannot find that CampGround!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { Campground });
}

module.exports.updateCampgrounds = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const Campground = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    Campground.images.push(...imgs);
    await Campground.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await Campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'CampGround successfully Updated!!')
    res.redirect(`/campgrounds/${Campground._id}`);
}

module.exports.deleteCampgrounds = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'CampGround successfully Deleted!!')
    res.redirect('/campgrounds');
}

