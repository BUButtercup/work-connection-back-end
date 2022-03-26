const { Schema, model } = require('mongoose');

// Schema to create Post model
const jobSchema = new Schema(
  {
    
    job_title: {
        type: String,
        required: [true, 'Job title is required!'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please describe the job duties'],
    },
    skills_req: [{ type: String}],
    pay: {
        type: Number,
        required: [true, 'Please share the pay rate'],
    },
    location: {
        type: String,
        required: [true, 'Please share the location'],
    },
    employer: {
        company_name: {
            type: String,
            required: [true, 'Please enter the company name'],
        },
        employer_id: {
            type: Schema.Types.ObjectId, 
            ref: 'employer'
        },
        contact: {
            //who to contact about the role
            name: {
                type: String,
                required: [true, 'Please share who to contact about the position'],
            },
            email: {
                type: String,
                validate: {
                    validator: v => {
                        return /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v)
                    },
        
                },
                required: [true, 'Please share their email'],
            },
            website: {
                type: String
            },
            phone: {
                type: String,
                required: [true, 'Please share their phone number'],
            }
        }

    }
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Job = model('job', jobSchema);

module.exports = Job;