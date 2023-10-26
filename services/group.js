const Group = require("../models/group");

async function getGroups() {
  try {
    const groups = await Group.find({});
    return groups;
  } catch (err) {
    throw new Error(err.toString());
  }
}

async function getGroupByName(groupName) {
  try {
    const group = await Group.findOne({ name: groupName });
    return group;
  } catch (err) {
    throw new Error(err.toString());
  }
}

function newGroup(name, email) {
  let group = new Group();
  group.name = name;
  group.email = email;
  return group;
}

async function saveGroup(group) {
  try {
    const groupStored = await group.save();
    return groupStored;
  } catch (err) {
    throw new Error(err.toString());
  }
}

async function updateGroup(groupId, updateData) {
  try {
    const groupUpdated = await Group.findOneAndUpdate(
      { _id: groupId },
      {
        $set: {
          email: updateData.email,
        },
      },
      { new: true }
    );
    return groupUpdated;
  } catch (err) {
    throw new Error(err.toString());
  }
}

module.exports = {
  getGroups,
  getGroupByName,
  newGroup,
  saveGroup,
  updateGroup,
};
