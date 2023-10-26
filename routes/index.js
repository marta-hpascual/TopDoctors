// file that contains the routes of the api
"use strict";

const express = require("express");

const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");

const api = express.Router();

const userCtrl = require("../controllers/user");
const patientCtrl = require("../controllers/patients");
const diagnosisCtrl = require("../controllers/diagnosis");
const GroupCntrl = require("../controllers/group");

// Group
api.get("/groups/", auth(roles.Admin), GroupCntrl.getGroups);
api.get("/groups/:groupName", auth(roles.Admin), GroupCntrl.getGroupByName);
api.post("/groups/:userId", auth(roles.Admin), GroupCntrl.saveGroup);
api.put("/groups/:userId", auth(roles.Admin), GroupCntrl.updateGroup);

// User
api.post("/users/new_admin", userCtrl.createAdmin);
api.post("/users/signup", userCtrl.signUp);
api.post("/users/signin", userCtrl.signIn);
api.get("/users/:userId", auth(roles.All), userCtrl.getUser);
api.put("/users/:userId", auth(roles.OnlyAdminOrUser), userCtrl.updateUser);
// User: Admin view (By Group)
api.get("/admin/users/:groupName", auth(roles.Admin), userCtrl.getUsersbyGroup);

// Patients
api.get("/patients/:userId", auth(roles.All), patientCtrl.getPatientsUser);
api.post(
  "/patients/:userId",
  auth(roles.OnlyAdminOrUser),
  patientCtrl.savePatient
);
api.put(
  "/patients/:patientId",
  auth(roles.OnlyAdminOrUser),
  patientCtrl.updatePatient
);
// Patients: Admin view (by group)
api.get(
  "/admin/patients/:groupName",
  auth(roles.Admin),
  patientCtrl.getPatientsByGroup
);

// Diagnosis of the patients created by user
api.get("/diagnosis/:patientId", auth(roles.All), diagnosisCtrl.getDiagnosis);
api.post(
  "/diagnosis/:patientId",
  auth(roles.OnlyAdminOrUser),
  diagnosisCtrl.saveDiagnosis
);

// Diagnosis: Admin view (by group)
api.get(
  "/admin/diagnosis/:groupName",
  auth(roles.Admin),
  diagnosisCtrl.getDiagnosisByGroup
);

module.exports = api;
