const Knex = require("./knex");

class Account {
  static async findUser(email) {
    const rows = await Knex.getInstance()
      .select("email", "password")
      .where({
        email: email
      })
      .from("users");

    if (rows.length == 0) {
      return null;
    } else {
      return {
        email: rows[0].email,
        password: rows[0].password
      };
    }
  }

  static async insertUser(email, password) {
    await Knex.getInstance()("users").insert({
      email: email,
      password: password
    });
  }
}

module.exports = Account;
