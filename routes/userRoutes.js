const router = require('express').Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { verifyToken } = require('../middleware/authJWT.js');
const { User, Job } = require('../models/');
const ObjectId = (require('mongoose').Types.ObjectId);

//check token data
router.get("/gettokendata", verifyToken, (req, res) => {
    console.log('req.headers', req.headers);
    console.log('req.userId', req.userId);
    console.log('req.username', req.username);
    res.status(200).json({
        username: req.username,
        userId: req.userId,
    })
});

//get user's profile
router.get('/:id', async (req, res) => {
    try {
        // if (req.userId === parseInt(req.params.id)) {
            const userData = await User.findOne({ _id: req.params.id });
            if (!userData) {
                res.status(404).json({ message: 'No users found!' })
            } else {
                res.status(200).json(userData);
            }
        // } else res.status(401).json({ message: 'you must signin to see that' })
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }

})

//get user's job letter
router.get('/:id/letter', async (req, res) => {
    try {
        // if (req.userId === parseInt(req.params.id)) {
            const userData = await User.findOne({ _id: req.params.id });
            if (!userData) {
                res.status(404).json({ message: 'No users found!' })
            } else {
                res.status(200).json(userData.job_letter);
            }
        // } else res.status(401).json({ message: 'you must signin to see that' })
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }

})

//get user's jobs
// router.get('/:id/jobs', async (req, res) => {
//     try {
        // if (req.userId === parseInt(req.params.id)) {
            // const userData = await User.findOne({ _id: req.params.id });
            // if (!userData) {
            //     res.status(404).json({ message: 'No users found!' })
            // } else {
                // const jobList = userData.job_list;
                // console.log('job list', jobList)
                // const jobs = []; 
                // userData.job_list.forEach(id=>{
                //     console.log('id', id)
                //     const job = Job.findById(id);
                //     console.log(job)
                //     jobs.push(job)

                // })
                // console.log('jobs', jobs)
            //     res.status(200).json({job_list: userData.job_list, jobs: jobs});
            // }
        // } else res.status(401).json({ message: 'you must signin to see that' })
//     } catch (err) {
//         res.status(500).json({ message: `There was an error: ${err}` });
//     }

// })

//register new user
router.post('/new', async (req, res) => {
    //object specs: 
    // username
    // email 
    // name
    // password
    // location
    // phone
    try {
        console.log('you\'re in the route')
        if ((!req.body.username && req.body.email && req.body.password && req.body.name && req.body.phone) || (req.body.username === '') || (req.body.email === '') || (req.body.password === '') || (req.body.name === '') || (req.body.phone === '')) {
            res.status(400).json({ message: 'Please enter all required information' })
        } else {
            const response = await User.create({
                username: req.body.username,
                email: req.body.email,
                name: req.body.name,
                password:  bcrypt.hashSync(req.body.password, 3),
                location: req.body.location || '',
                phone: req.body.phone
            })
            if (response) {
                res.status(200).json(response)
            }
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
})

//sign in
router.post('/signin', (req, res) => {
    User.findOne ({
        username: req.body.username
    })
    .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          return res.status(404).send({ message: "No user found." });
        }
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "password incorrect"
          });
        }
        var token = jwt.sign({ id: user.id }, "i love turtles", {
          expiresIn: 86400 // 24 hours
        });
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          accessToken: token
        });
      });
})

//add a job_letter to a user
router.post('/:userId/letter', (req, res)=>{
    User.findOneAndUpdate(
        //where
        {_id: req.params.userId},
        //new value: reactionBody & username
        {$addToSet: {job_letter: req.body}},
        //send back new
        {new: true},
        (err, response)=>{
            if(err){
                console.log(`Uhoh! There was an error: ${err}`)
                res.status(500).json(err);
            }
            if(!response){
                res.status(404).json({message:`A user with ID# ${req.params.userId} could not be found.`})
            }
            if(response){
                console.log(`Job letter was added to user's profile!`)
                res.status(200).json(response)
            }
        }
    )
})

//adds a job to an existing user's job_list
router.post('/:id/jobs/:jobId', (req, res) => {
    User.findOneAndUpdate(
        //where
        { _id: req.params.id },
        //add new value (friendId) to set
        { $addToSet: { job_list: req.params.jobId } },
        //send back new
        { new: true },
        (err, response) => {
            if (err) {
                console.log(`Uhoh! There was an error: ${err}`)
                res.status(500).json(err);
            } else if (!response) {
                res.status(404).json({ message: `There was a problem with an ID! Please check the IDs you use and try again.` })
            } else {
                console.log(`Job was added!`)
                res.status(200).json(response)
            }
        }
    )
        .populate('job_list')
        .select('-__v');
})



module.exports = router;