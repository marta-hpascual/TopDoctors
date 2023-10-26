const Diagnosis = require("../models/diagnosis");
const crypt = require("./crypt");

async function getPatientDiagnosis(
  patientId,
  filter_start_date,
  filter_end_date
) {
  let query = { createdBy: patientId };
  if (filter_start_date && filter_end_date) {
    query = {
      createdBy: patientId,
      date: { $gte: filter_start_date, $lt: filter_end_date },
    };
  }
  try {
    console.log("getPatientDiagnosis");
    console.log(query);
    const diagnosis_list = await Diagnosis.find(query);
    let listdiagnosis = [];
    diagnosis_list.forEach(function (u) {
      let id = u._id.toString();
      let idencrypt = crypt.encrypt(id);
      listdiagnosis.push({
        id: idencrypt,
        date: u.date,
        diagnosis: u.diagnosis,
        prescription: u.prescription,
      });
    });
    console.log(listdiagnosis);
    return listdiagnosis;
  } catch (err) {
    throw new Error(err.toString());
  }
}

function newDiagnosis(diagnosis, prescription, patientId) {
  let diagnosisObj = new Diagnosis();
  diagnosisObj.diagnosis = diagnosis;
  diagnosisObj.prescription = prescription;
  diagnosisObj.createdBy = patientId;
  return diagnosisObj;
}
async function saveDiagnosis(diagnosis) {
  try {
    const diagnosisStored = await diagnosis.save();
    let id = diagnosisStored._id.toString();
    let idencrypt = crypt.encrypt(id);
    let diagnosisInfo = {
      id: idencrypt,
      diagnosis: diagnosis.diagnosis,
      prescription: diagnosis.prescription,
      date: diagnosis.date,
    };
    return diagnosisInfo;
  } catch (err) {
    throw new Error(err.toString());
  }
}
module.exports = {
  getPatientDiagnosis,
  newDiagnosis,
  saveDiagnosis,
};
