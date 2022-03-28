const router = require('express').Router();
const userRoutes = require('./userRoutes');
const jobRoutes = require('./jobRoutes');
const employerRoutes = require('./employerRoutes');

router.use('/user', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/employer', employerRoutes);


// router.use('/api', apiRoutes);

router.use((req, res) => {
  return res.send('Wrong route!');
});

module.exports = router;
