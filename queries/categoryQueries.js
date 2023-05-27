const getAllCategories = (knex, dbid) => {
  return knex
  .select()
  .from(`${dbid}_categories_equipement`)
  .whereNull('parent')
  .orWhere('parent', '')
  .orderBy('sequence', 'code');
};

const getByParent = (knex, dbid, parent) => {
  return knex
  .select()
  .from(`${dbid}_categories_equipement`)
  .where('parent', parent)
  .where('sequence', '<', '90000')
  .orderBy('sequence', 'code')
}

module.exports = {
  getAllCategories,
  getByParent
}