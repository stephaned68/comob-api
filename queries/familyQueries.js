const getAllFamilies = (knex, dbid) => {
  return knex
  .select().
  from(`${dbid}_familles`);
};

module.exports = {
  getAllFamilies
}