const getByRace = (knex, dbid, race) => {
  return knex
  .select('intitule', 'description')
  .from(`${dbid}_races_traits`)
  .where('race', race);
};

const getByProfile = (knex, dbid, profile) => {
  return knex
  .select('intitule', 'description')
  .from(`${dbid}_profils_traits`)
  .where('profil', profile);
};

module.exports = {
  getByRace,
  getByProfile
};