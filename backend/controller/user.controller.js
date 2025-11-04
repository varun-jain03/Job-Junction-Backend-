const bcrypt = require('bcrypt');
const { UserModel } = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, phoneNumber, password, role } = req.body;
  try {
    bcrypt.hash(password, Number(process.env.SALT_ROUNDS), async (err, hashed) => {
      if (!hashed) {
        console.log('there has been a problem while hashing', err);
        res.json({ msg: 'problem while hashing', err });
      } else {
        const newUser = new UserModel({ name, email, phoneNumber, password: hashed, role });
        await newUser.save();
        console.log('new user hase been added');
        res.json({ msg: 'new user has been added', newUser });
      }
    })
  } catch (error) {
    console.log(error);
    res.json({ msg: "not able to register user", error })
  }
}

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const userMatching = await UserModel.findOne({ email });
    if (userMatching) {
      const comparedUser = await bcrypt.compare(password, userMatching.password);
      if (!comparedUser) {
        console.log('incorrect password entered...');
        return res.json({ msg: 'incorrect password entered...' });
      }

      if (role !== userMatching.role) {
        console.log('incorrect role seclected...');
        return res.json({ msg: 'incorrect role selected...' });
      }

      const payload = {
        userId: userMatching._id,
        userName: userMatching.name,
        userRole: userMatching.role
      }

      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });

      const { password: _, ...userWithoutPassword } = userMatching.toObject();

      console.log('the user has been logged in successfully...');
      return res.json({
        msg: 'the user has been logged in successfully...',
        token,
        user: userWithoutPassword
      });
    } else {
      console.log('incorrect email entered...');
      res.json({ msg: 'incorrect email entered...' });
    }
  } catch (error) {
    console.log('not able to login into the database', error);
    res.json({ msg: "not able to connect to the data base", error });
  }
}

// const profile = async (req, res) => {
//   try {
//     const userId = req.userId;
//     let { bio, skills, resume, resumeName, company, profilePhoto } = req.body;

//     // Convert skills if it's a comma-separated string or array with one comma-separated string
//     if (typeof skills === 'string') {
//       skills = skills.split(',').map(s => s.trim());
//     } else if (Array.isArray(skills) && skills.length === 1 && skills[0].includes(',')) {
//       skills = skills[0].split(',').map(s => s.trim());
//     }

//     const user = await UserModel.findById(userId);
//     if (!user) return res.json({ msg: 'User not found...' });

//     user.profile = {
//       ...user.profile,
//       ...(bio && { bio }),
//       ...(skills && { skills }),
//       ...(resume && { resume }),
//       ...(resumeName && { resumeName }),
//       ...(company && { company }),
//       ...(profilePhoto && { profilePhoto })
//     };

//     await user.save();

//     res.json({ msg: 'Profile created/updated successfully...', profile: user.profile });
//   } catch (error) {
//     console.log('not able to login into the database');
//     res.json({ msg: "not able to connect to the data base", error });
//   }
// }

const profile = async (req, res) => {
  try {
    const userId = req.userId;
    let { bio, skills, company, profilePhoto } = req.body;

    if (typeof skills === 'string') {
      skills = skills.split(',').map(s => s.trim());
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.json({ msg: 'User not found...' });

    // File upload handled here
    let resumePath = user.profile.resume; // keep old if not uploading new
    if (req.file) {
      resumePath = req.file.path; // multer saves path like "uploads/resumes/12345-myresume.pdf"
    }

    user.profile = {
      ...user.profile,
      ...(bio && { bio }),
      ...(skills && { skills }),
      ...(company && { company }),
      ...(profilePhoto && { profilePhoto }),
      ...(resumePath && { resume: resumePath })
    };

    await user.save();

    res.json({ msg: 'Profile created/updated successfully...', profile: user.profile });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Error while updating profile", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, phoneNumber, role } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ msg: "User not found..." });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (role) user.role = role;

    await user.save();

    res.json({ msg: "User updated successfully...", user });

  } catch (error) {
    console.log('not able to login into the database');
    res.json({ msg: "not able to connect to the data base", error });
  }
}

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error', error });
  }
};

module.exports = { register, login, profile, updateUser, getMe };