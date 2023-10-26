const Patient = require("../models/patient");
const User = require("../models/user");
const crypt = require("./crypt");

async function getPatientsUser(userId, patientName) {
  let query = { createdBy: userId };
  if (patientName) {
    query = { createdBy: userId, name: patientName };
  }
  console.log("getPatientsUser");
  console.log(query);
  try {
    let patients = await Patient.find(query);
    patients = await User.populate(patients, { path: "createdBy" });
    let listpatients = [];
    patients.forEach(function (u) {
      let id = u._id.toString();
      let idencrypt = crypt.encrypt(id);
      listpatients.push({
        _id: idencrypt,
        name: u.name,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        identifierDoc: u.identifierDoc,
      });
    });
    return listpatients;
  } catch (err) {
    throw new Error(err.toString());
  }
}
function newPatient(name, lastName, email, phone, identifierDoc, userId) {
  let patient = new Patient();
  patient.name = name;
  patient.lastName = lastName;
  patient.email = email;
  patient.phone = phone;
  patient.identifierDoc = identifierDoc;
  patient.createdBy = userId;
  return patient;
}
async function savePatient(patient) {
  try {
    // when you save, returns an id in patientStored to access that patient
    const patientStored = await patient.save();
    let id = patientStored._id.toString();
    let idencrypt = crypt.encrypt(id);
    let patientInfo = {
      sub: idencrypt,
      name: patient.name,
      lastName: patient.lastName,
    };
    return patientInfo;
  } catch (err) {
    throw new Error(err.toString());
  }
}

async function updatePatient(patientId, update) {
  try {
    const patientUpdated = await Patient.findByIdAndUpdate(patientId, update, {
      new: true,
    });
    let id = patientUpdated._id.toString();
    let idencrypt = crypt.encrypt(id);
    let patientInfo = {
      sub: idencrypt,
      name: patientUpdated.name,
      lastName: patientUpdated.lastName,
    };
    return patientInfo;
  } catch (err) {
    throw new Error(err.toString());
  }
}

module.exports = {
  getPatientsUser,
  newPatient,
  savePatient,
  updatePatient,
};
