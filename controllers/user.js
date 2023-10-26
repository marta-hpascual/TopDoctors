const serviceAuth = require("../services/auth");
const UserSrv = require("../services/user");
const GroupSrv = require("../services/group");
const crypt = require("../services/crypt");

async function createAdmin(req, res) {
  try {
    const newUser = UserSrv.newUser(
      req.body.email.toLowerCase(),
      "Admin",
      req.body.group,
      req.body.password
    );
    let user = await UserSrv.getUserByEmail(req.body.email.toLowerCase());
    if (user) return res.status(202).send({ message: "user exists" });
    let group = await GroupSrv.getGroupByName(req.body.group);
    if (!group) {
      let newGroup = GroupSrv.newGroup(
        req.body.group,
        req.body.email.toLowerCase()
      );
      await GroupSrv.saveGroup(newGroup);
    }
    let usersaved = await UserSrv.saveUser(newUser);
    let result = serviceAuth.createToken(usersaved);
    return res.status(200).send({
      result,
    });
  } catch (err) {
    return res.status(500).send({ message: `Error creating the user: ${err}` });
  }
}
async function signUp(req, res) {
  try {
    const newUser = UserSrv.newUser(
      req.body.email.toLowerCase(),
      "User",
      req.body.group,
      req.body.password
    );
    let user = await UserSrv.getUserByEmail(req.body.email.toLowerCase());
    if (user) return res.status(202).send({ message: "user exists" });
    let group = await GroupSrv.getGroupByName(req.body.group);
    if (!group)
      return res
        .status(500)
        .send({ message: `Error finding the group: ${err}` });
    await UserSrv.saveUser(newUser);
    let result = serviceAuth.createToken(newUser);
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({ message: `Error creating the user: ${err}` });
  }
}

async function signIn(req, res) {
  // attempt to authenticate user
  req.body.email = req.body.email.toLowerCase();
  try {
    let user = await UserSrv.getAuthenticated(
      req.body.email.toLowerCase(),
      req.body.password
    );
    if (!user)
      return res.status(202).send({
        message: "Login failed",
      });
    let result = serviceAuth.createToken(user);
    return res.status(200).send({
      result,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
}

async function getUser(req, res) {
  let userId = crypt.decrypt(req.params.userId);
  try {
    let user = await UserSrv.getUserById(userId);
    if (!user)
      return res
        .status(404)
        .send({ code: 208, message: `The user does not exist` });
    return res.status(200).send({ user });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

async function updateUser(req, res) {
  let userId = crypt.decrypt(req.params.userId);
  let update = req.body;
  try {
    let userUpdated = await UserSrv.updateUser(userId, update);
    res.status(200).send({ userUpdated });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

async function getUsersbyGroup(req, res) {
  let group = req.params.groupName;
  let listUsers = [];
  try {
    let users = await UserSrv.getUsersByGroup(group);
    for (const user of users) {
      let idUserDecrypt = user._id.toString();
      let userId = crypt.encrypt(idUserDecrypt);
      listUsers.push({
        userId: userId,
        email: user.email,
        signupDate: user.signupDate,
        role: user.role,
      });
    }
    return res.status(200).send(listUsers);
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

module.exports = {
  createAdmin,
  signUp,
  signIn,
  getUser,
  updateUser,
  getUsersbyGroup,
};
