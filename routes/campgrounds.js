const express = require('express')
const router = express.Router();
const catchAsync = require('../Utilities/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgroundControl = require('../controllers/campgrounds')
const multer = require('multer')
const { storage } = require('../cloudinaryConfig');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgroundControl.index))
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync(campgroundControl.createCampground))
    

router.get('/new', isLoggedIn, campgroundControl.renderNewform)

router.route('/:id')
    .get(catchAsync(campgroundControl.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundControl.updateCampgrounds))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundControl.deleteCampgrounds))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundControl.renderEditform))

module.exports = router;
