db.getSiblingDB("db-accounts").auth("root", "rootpsw");
db.createUser({
  user: "user",
  pwd: "userpsw",
  roles: [
    {
      role: "readWrite",
      db: "db-accounts",
    },
  ],
});
