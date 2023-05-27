const getFiltered = (dbid, familyList, type) => {
  const wheres = [];

  let familyIn = '';
  if (familyList !== '') {
    families = familyList.split(',');
    for (const family of families) {
      familyIn += `,'${family}'`;
    }
    wheres.push(`pr.famille in (${familyIn.slice(1)})`);
  }

  if (type !== '') {
    wheres.push(`type='${type}'`);
  }

  let whereClause = '';
  if (wheres.length !== 0) {
    whereClause = 'where ' + wheres.join(' and ');
  }

  return [
    'select',
    [
      'pr.profil as profil',
      'pr.nom as nom',
      'pr.description as description',
      'json_object("id", fa.famille, "libelle", fa.description) as famille',
    ].join(','),
    `from ${dbid}_profils as pr`,
    `inner join ${dbid}_familles as fa on pr.famille = fa.famille`,
    whereClause,
    `order by profil`,
  ].join(' ');
};

module.exports = {
  getFiltered
};