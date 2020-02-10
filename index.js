var Knex = require("./model/knex");

function query1() {
  return this.select("area")
    .sum({ total: "assault" })
    .from("offences")
    .groupBy("area")
    .where({
      year: 2012
    })
    .as("t1");
}

const query2 = Knex.getInstance()
  .from(query1)
  .join("areas", "t1.area", "=", "areas.area")
  .select("t1.area", "t1.total", "areas.lat", "areas.lng");

console.log(query2.toString());
