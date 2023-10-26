const GroupSrv = require("../services/group");
const UserSrv = require("../services/user");
const serviceAuth = require("../services/auth");

const crypt = require("../services/crypt");

async function getGroups(req, res) {
  // #swagger.tags = ['Groups']
  // #swagger.description  = 'Get all groups. You can only perform this action if you have an Admin account.'
  try {
    let listGroups = await GroupSrv.getGroups();
    return res.status(200).send(listGroups);
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

async function getGroupByName(req, res) {
  let groupName = req.params.groupName;
  try {
    let group = await GroupSrv.getGroupByName(groupName);
    if (!group)
      return res.status(202).send({ message: `The group does not exist` });
    return res.status(200).send({ group });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

async function saveGroup(req, res) {
  let userId = crypt.decrypt(req.params.userId);
  try {
    let user = await UserSrv.getUserById(userId);
    if (!user)
      return res
        .status(404)
        .send({ code: 208, message: "The user does not exist" });
    if (user.role != "Admin")
      return res.status(401).send({ message: "without permission" });
    let userEmail = await UserSrv.getUserByEmail(req.body.email);
    if (userEmail) return res.status(202).send({ message: "user exists" });
    let group = GroupSrv.newGroup(req.body.name, req.body.email);
    let groupSaved = await GroupSrv.saveGroup(group);
    let randompass = Math.random().toString(36).slice(-12);
    let newUser = UserSrv.newUser(
      groupSaved.email,
      "Admin",
      groupSaved.name,
      randompass
    );
    let userSaved = await UserSrv.saveUser(newUser);
    res.status(200).send({
      token: serviceAuth.createToken(userSaved),
      message: "New Group created",
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

async function updateGroup(req, res) {
  let userId = crypt.decrypt(req.params.userId);
  try {
    let user = await UserSrv.getUserById(userId);
    if (!user)
      return res
        .status(404)
        .send({ code: 208, message: "The user does not exist" });
    if (user.role != "Admin")
      return res.status(401).send({ message: "without permission" });
    await GroupSrv.updateGroup(req.body._id, { email: req.body.email });
    return res.status(200).send({ message: "Group updated" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

module.exports = {
  getGroups,
  getGroupByName,
  saveGroup,
  updateGroup,
};
