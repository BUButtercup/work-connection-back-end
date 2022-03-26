const { Schema, model } = require('mongoose');


const jobLetterSchema = new Schema({
    job_duration: {
        type: String,
        required:  [true, 'Please choose job length'],
    },
    will_reloc: {
        type: Boolean
    },
    need_childcare: {
        type: Boolean
    },
    need_housing: {
        type: Boolean
    },
    need_visa: {
        type:Boolean
    },
    bio: {
        type: String,
        required: [true, 'Write about yourself'],
        maxlength: 280,
    },
    skills: [{ type: String}],
    start_date: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
})

// Schema to create User model
const userSchema = new Schema(
  {
    name: {
        type: String,
        trim: true,
        required: [true, 'Please enter name'],
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required!'],
        trim: true
    },
    password: {
        type: String,
        required:  [true, 'Please choose a password']
    },
    location: {
        type: String
    },
    email: {
        type: String,
        validate: {
            validator: v => {
                return /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v)
            },

        },
        required: [true, 'Please enter email'],
        unique: true,
    },
    phone: {
        type: Number,
        required: [true, 'Please enter phone'],
    },
    employed: {
        type: Boolean,
        default: false
    },
    job_list: [{ type: Schema.Types.ObjectId, ref: 'job' }],
    job_letter: [jobLetterSchema]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const User = model('user', userSchema);

module.exports = User;