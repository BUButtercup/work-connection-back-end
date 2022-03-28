const { Schema, model } = require('mongoose');

// Schema to create Post model
const employerSchema = new Schema(
  {
    company_name: {
        type: String,
        required: [true, 'Please enter the company\'s name'],
        trim: true
    },
    contact_info:{
      name: {
        type: String,
        required: [true, 'Please share who to contact about the position'],
        },
        phone: {
            type: Number,
            required: [true, 'Phone number is required'],
        },
        email: {
            type: String,
            validate: {
                validator: v => {
                    return /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v)
                },
            },
            required: [true, 'Email is required'],
            unique: true,
        },
        website: {
            type: String
        }
    },
    jobs: { 
      type: [Schema.Types.ObjectId], 
      ref: 'job',
      default: undefined
  }
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Employer = model('employer', employerSchema);

module.exports = Employer;