db.getSiblingDB("db-data").auth("root", "rootpsw");
db.createUser({
  user: "user",
  pwd: "userpsw",
  roles: [
    {
      role: "readWrite",
      db: "db-data",
    },
  ],
});
