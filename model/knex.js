function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const config = require("../config");

class Knex {
  static getInstance() {
    if (!this.instance) {
      this.instance = require("knex")({
        client: "mysql",
        connection: {
          host: config.db_host,
          user: config.db_user,
          password: config.db_password,
          database: config.db_database
        }
      });
    }

    return this.instance;
  }

  static destroy() {
    if (this.instance) {
      this.instance.destroy();
    }
  }

}

_defineProperty(Knex, "instance", void 0);

module.exports = Knex;