const router = require('express').Router();
const { Employer, Job } = require('../models');



//register new job
router.post('/:empId/new', async (req, res) => {
    //object specs: 
    // job_title
    // description 
    // skills_req []
    // pay
    // location
    // employer.company_name
    // employer.employer_id
    // employer.contact.name
    // employer.contact.email
    // employer.contact.phone
    // employer.contact.website
    try {
        console.log('you\'re in the route')
        if ((!req.body.title && req.body.description && req.body.pay && req.body.location && req.body.company_name && req.body.contact_name && req.body.contact_email && req.body.contact_phone) || (req.body.title === '') || (req.body.description === '') || (req.body.pay === '') || (req.body.location === '') || (req.body.company_name === '') || (req.body.contact_name === '') || (req.body.contact_email === '') || (req.body.contact_phone === '')) {
            res.status(400).json({ message: 'Please enter all required information' })
        } else {
            console.log('req body', req.body)
            const response = await Job.create({
                job_title: req.body.title,
                description: req.body.description,
                skills_req: req.body.skills_req || [],
                pay: req.body.pay,
                location: req.body.location,
                employer: {
                    company_name: req.body.company_name,
                    employer_id: req.params.empId,
                    contact: {
                        name: req.body.contact_name,
                        email: req.body.contact_email,
                        phone: req.body.contact_phone,
                        website: req.body.contact_website || ''
                    }
                }
            })
            if (response) {
                console.log('There was a response:', response._id)
                const resp = await Employer.findOneAndUpdate(
                    //where
                    { _id: req.params.empId },
                    //new value
                    { $addToSet: { jobs: response._id } },
                    //send back new
                    { new: true }
                )
                if (resp) {
                    res.status(200).json(resp)
                }
            }
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
})

//get all jobs
router.get('/all', async (req, res) => {
    try {
            const jobData = await Job.find({});
            if (!jobData) {
                res.status(404).json({ message: 'No jobs found!' })
            } else {
                res.status(200).json(jobData)
            }
       
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }

})

//get one job
router.get('/:jobId', async (req, res) => {
    try {
            const jobData = await Job.findOne({ _id: req.params.jobId });
            if (!jobData) {
                res.status(404).json({ message: 'No jobs found!' })
            } else {
                res.status(200).json(jobData);
            }
       
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }

})



module.exports = router;