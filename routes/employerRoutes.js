const router = require('express').Router();
const { Employer, Job } = require('../models');

//register new user
router.post('/new', async (req, res) => {
    //object specs: 
    // company_name
    // contact_name
    // contact_email
    // contact_phone
    // website
    try {
        console.log('you\'re in the route')
        if ((!req.body.company_name && req.body.contact_name && req.body.contact_email && req.body.contact_phone) || (req.body.company_name === '') || (req.body.contact_name === '') || (req.body.contact_email === '') || (req.body.contact_phone === '')) {
            res.status(400).json({ message: 'Please enter all required information' })
        } else {
            console.log('req body', req.body)
            const response = await Employer.create({
                company_name: req.body.company_name,
                contact_info: {
                    name: req.body.contact_name,
                    email: req.body.contact_email,
                    phone: req.body.contact_phone,
                    website: req.body.website || ''
                }
            })
            if (response) {
                res.status(200).json(response)
            }
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
})



module.exports = router;