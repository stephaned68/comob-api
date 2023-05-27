const getByType = (dbid, type) => {
  return [
    `select vo.* from ${dbid}_voies as vo`,
    type === ' ' ?
      "where vo.type is null or vo.type = '' or vo.type = ?"
      : `where vo.type = ?`,
  ].join(' ');
};

const getByProfile = (dbid, withAbilities) => {
  if (withAbilities) {
    return [
      'select',
      [
        'pr.nom as profil',
        'vo.*',
        [
          'case vo.pfx_deladu',
          "when 0 then 'du '",
          "when 1 then 'de la '",
          "when 2 then 'de l\u2019'",
          "when 3 then 'des '",
          'end as voie_deladu',
        ].join(' '),
        'tv.type_voie_intitule',
        'cv.rang as rang',
        'ca.nom as capacite',
      ].join(', '),
      `from ${dbid}_voies_profils as vp`,
      `inner join ${dbid}_profils as pr on pr.profil = vp.profil`,
      `inner join ${dbid}_voies as vo on vo.voie = vp.voie`,
      `left join ${dbid}_types_voie as tv on tv.type_voie = vo.type`,
      `left join ${dbid}_capacites_voies as cv on cv.voie = vo.voie`,
      `inner join ${dbid}_capacites as ca on ca.capacite = cv.capacite`,
      'where vp.profil = ?',
      'order by vo.type, vo.voie, cv.rang',
    ].join(' ');
  } else {
    return [
      'select',
      ['vo.*', 'tv.type_voie_intitule'].join(', '),
      `from ${dbid}_voies_profils as vp`,
      `inner join ${dbid}_voies as vo on vp.voie = vo.voie`,
      `left join ${dbid}_types_voie as tv on vo.type = tv.type_voie`,
      `where vp.profil = ?`,
      `order by vo.type, vo.voie`,
    ].join(' ');
  }
};

module.exports = {
  getByType,
  getByProfile
};