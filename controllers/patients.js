const PatientSrv = require("../services/patient");
const UserSrv = require("../services/user");
const crypt = require("../services/crypt");

async function getPatientsUser(req, res) {
  let userId = crypt.decrypt(req.params.userId);
  try {
    let user = await UserSrv.getUserById(userId);
    if (!user)
      return res
        .status(404)
        .send({ code: 208, message: "The user does not exist" });
    let listpatients = await PatientSrv.getPatientsUser(userId, null);
    return res.status(200).send({ listpatients });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

async function getPatientsByGroup(req, res) {
  let group = req.params.groupName;
  try {
    let listUsers = await UserSrv.getUsersByGroup(group);
    let listPatients = [];
    for (const user of listUsers) {
      let listPatientsOfUser = await PatientSrv.getPatientsUser(user._id, null);
      listPatients.push(listPatientsOfUser);
    }
    return res.status(200).send(listPatients);
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

async function savePatient(req, res) {
  let userId = crypt.decrypt(req.params.userId);
  try {
    let patient = PatientSrv.newPatient(
      req.body.name,
      req.body.lastName,
      req.body.email,
      req.body.phone,
      req.body.identifierDoc,
      userId
    );
    let newPatient = await PatientSrv.savePatient(patient);
    return res.status(200).send({ newPatient });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

async function updatePatient(req, res) {
  let patientId = crypt.decrypt(req.params.patientId);
  let update = req.body;
  try {
    let patientUpdated = await PatientSrv.updatePatient(patientId, update);
    return res.status(200).send({ patientUpdated });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}

module.exports = {
  getPatientsUser,
  getPatientsByGroup,
  savePatient,
  updatePatient,
};
