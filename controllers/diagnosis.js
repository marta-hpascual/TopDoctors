const DiagnosisSrv = require("../services/diagnosis");
const PatientSrv = require("../services/patient");
const UserSrv = require("../services/user");
const crypt = require("../services/crypt");

async function getDiagnosis(req, res) {
  let patientId = crypt.decrypt(req.params.patientId);

  try {
    let listdiagnosis = await DiagnosisSrv.getPatientDiagnosis(
      patientId,
      null,
      null
    );
    return res.status(200).send({ listdiagnosis });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}
async function getDiagnosisByGroup(req, res) {
  let group = req.params.groupName;
  let filter_patient_name = req.query.patient_name || null;
  let filter_start_date = req.query.start_date || null;
  let filter_end_date = req.query.end_date || null;
  if (filter_start_date && !filter_end_date) {
    return res.status(400).send({
      message: "You must provide end date if you want to filter by dates",
    });
  }
  if (!filter_start_date && filter_end_date) {
    return res.status(400).send({
      message: "You must provide start date if you want to filter by dates",
    });
  }

  try {
    let userList = await UserSrv.getUsersByGroup(group);
    console.log(userList);
    let listdiagnosis = [];
    for (const user of userList) {
      let listPatients = await PatientSrv.getPatientsUser(
        user._id,
        filter_patient_name
      );
      console.log(listPatients);
      for (const patient of listPatients) {
        let patientId = crypt.decrypt(patient._id);
        let patientDiagnosisList = await DiagnosisSrv.getPatientDiagnosis(
          patientId,
          filter_start_date,
          filter_end_date
        );
        console.log(patientDiagnosisList);
        listdiagnosis.push({
          patientId: patientId,
          patientName: patient.name,
          patientLastName: patient.lastName,
          patientEmail: patient.email,
          patientPhone: patient.phone,
          patientidentifierDoc: patient.identifierDoc,
          patientDiagnosis: patientDiagnosisList,
        });
      }
    }
    return res.status(200).send(listdiagnosis);
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}
async function saveDiagnosis(req, res) {
  let patientId = crypt.decrypt(req.params.patientId);
  try {
    let diagnosis = DiagnosisSrv.newDiagnosis(
      req.body.diagnosis,
      req.body.prescription,
      patientId
    );
    let newDiagnosis = await DiagnosisSrv.saveDiagnosis(diagnosis);
    return res.status(200).send({ newDiagnosis });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Error making the request: ${err}` });
  }
}
module.exports = {
  getDiagnosis,
  getDiagnosisByGroup,
  saveDiagnosis,
};
