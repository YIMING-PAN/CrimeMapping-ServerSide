const Knex = require("./knex");

class Offences {
  static async search(offence, filters) {
    let offence_name = await Knex.getInstance()
      .select("column")
      .from("offence_columns")
      .where({
        pretty: offence
      });

    if (offence_name.length == 0) {
      return [];
    }

    offence_name = offence_name[0].column;
    // console.log("offence_name", offence_name);

    function sub_query() {
      this.select("area")
        .sum({ total: offence_name })
        .from("offences")
        .groupBy("area");

      if (filters) {
        for (let name of ["area", "age", "gender", "year", "month"]) {
          if (filters[name]) {
            const filter_range = filters[name].split(",");
            this.whereIn(name, filter_range);
          }
        }
      }

      this.as("t1");
    }

    const query = Knex.getInstance()
      .from(sub_query)
      .join("areas", "t1.area", "=", "areas.area")
      .select("t1.area", "t1.total", "areas.lat", "areas.lng");

    // console.log("query sql:", query.toString());

    const rows = await query;

    return rows.map(item => ({
      LGA: item.area,
      total: item.total,
      lat: item.lat,
      lng: item.lng
    }));
  }

  static async getOffences() {
    const rows = await Knex.getInstance()
      .select("pretty")
      .from("offence_columns");

    return rows.map(item => item.pretty);
  }

  static async getAreas() {
    const rows = await Knex.getInstance()
      .select()
      .from("areas");

    return rows.map(item => item.area);
  }

  static async getAges() {
    const rows = await Knex.getInstance()
      .select("age")
      .distinct()
      .from("offences");

    return rows.map(item => item.age);
  }

  static async getGenders() {
    const rows = await Knex.getInstance()
      .select("gender")
      .distinct()
      .from("offences");

    return rows.map(item => item.gender);
  }

  static async getYears() {
    const rows = await Knex.getInstance()
      .select("year")
      .distinct()
      .from("offences");

    return rows.map(item => item.year);
  }
}

module.exports = Offences;
