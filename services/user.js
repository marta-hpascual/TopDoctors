const User = require("../models/user");

async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (err) {
    throw new Error(err);
  }
}

async function getUserByEmail(email) {
  try {
    const users = await User.find({ email: email });
    if (!users) return null;
    if (users.lenght == 0) return null;
    return users[0];
  } catch (err) {
    throw new Error(err.toString());
  }
}

async function getUsersByGroup(group) {
  try {
    const users = await User.find({ group: group });
    return users;
  } catch (err) {
    throw new Error(err.toString());
  }
}

async function getAuthenticated(email, password) {
  try {
    const user = await User.getAuthenticated(email, password);
    return user;
  } catch (err) {
    throw new Error(err.toString());
  }
}

async function saveUser(user) {
  try {
    const userCreated = await user.save();
    return userCreated;
  } catch (err) {
    throw new Error(err.toString());
  }
}

function newUser(email, role, group, password) {
  const newuser = new User({
    email: email,
    role: role,
    password: password,
    group: group,
  });
  return newuser;
}

async function updateUser(userId, body) {
  try {
    const userUpdated = await User.findByIdAndUpdate(userId, update, {
      select: "-_id email",
      new: true,
    });
    return userUpdated;
  } catch (err) {
    throw new Error(err.toString());
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  getUsersByGroup,
  getAuthenticated,
  newUser,
  saveUser,
  updateUser,
};
