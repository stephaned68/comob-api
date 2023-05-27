const getByType = (knex, dbid, typeList) => {
  let where = '';
  let typeIn = '';
  let types = [];
  let orNull = '';
  if (typeList !== '') {
    types = typeList.split(',');
    for (const type of types) {
      if (type === 'base') {
        orNull = ' or type_race is null';
      } else {
        typeIn += `,'${type}'`;
      }
    }
    where = `type_race in (${typeIn.slice(1)})${orNull}`;
  } else {
    where = 'type_race is null';
  }

  return knex.select().from(`${dbid}_races`).where(knex.raw(where));
};

const getOne = (knex, dbid, race) => {
  return knex
  .select()
  .from(`${dbid}_races`)
  .where('race', race);
};

module.exports = {
  getByType,
  getOne
}