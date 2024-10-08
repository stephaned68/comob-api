const getByType = (dbid, type) => {
  return [
    `select ca.* from ${dbid}_capacites as ca`,
    `where ca.type = '${type}'`,
  ].join(' ');
};

const getByProfile = (dbid, profile) => {
  return [
    'select',
    [
      'pr.nom as profil',
      'vo.nom as voie',
      'cv.rang as rang',
      'ca.nom as capacite',
      'ca.limitee as limitee',
      'ca.sort as sort',
      'ca.action as action',
      'ca.description as description',
      'ca.utilisations as utilisations',
      'ca.utilisations_freq as frequence',
      [
        'case pfx_deladu',
        "when 0 then 'du '",
        "when 1 then 'de la '",
        "when 2 then 'de l\u2019'",
        "when 3 then 'des '",
        'end as voie_deladu',
      ].join(' '),
      'vo.notes as voie_notes'
    ].join(', '),
    `from ${dbid}_voies_profils as vp`,
    `join ${dbid}_profils as pr on pr.profil = vp.profil`,
    `join ${dbid}_capacites_voies as cv on cv.voie = vp.voie`,
    `join ${dbid}_voies as vo on vo.voie = cv.voie`,
    `join ${dbid}_capacites as ca on ca.capacite = cv.capacite`,
    `where pr.profil = '${profile}'`,
    'order by vp.profil, vp.voie, cv.rang',
  ].join(' ');
};

const getByRace = (dbid, race) => {
  return [
      'select',
      [
        'ca.nom as capacite',
        'ca.description as description',
        'ca.limitee as limitation',
      ].join(', '),
      `from ${dbid}_races_capacites as cr`,
      `join ${dbid}_capacites as ca on ca.capacite = cr.capacite`,
      `where cr.race = '${race}'`,
      'order by limitation, capacite',
    ].join(' ');
};

const getByPath = (dbid) => {
  let rang;
  if (dbid === 'cof2') {
    rang = [
      'case',
      "when json_extract(`type_voie_config`, concat('$.first_rank.', replace(vo.voie,'-','_'))) = 3 then cv.rang + 2",
      "when json_extract(`type_voie_config`,'$.first_rank.default') = 4 then cv.rang + 3",
      'else cv.rang',
      'end as rang',
    ].join(' ');
  } else {
    rang = 'cv.rang as rang';
  }

  return [
    'select',
    [
      rang,
      'ca.*',
      'vo.nom as voie',
      [
        'case vo.pfx_deladu',
        "when 0 then 'du '",
        "when 1 then 'de la '",
        "when 2 then 'de l\u2019'",
        "when 3 then 'des '",
        'end as voie_deladu',
      ].join(' '),
    ].join(', '),
    `from ${dbid}_capacites_voies as cv`,
    `inner join ${dbid}_capacites as ca on cv.capacite = ca.capacite`,
    `inner join ${dbid}_voies as vo on vo.voie = cv.voie`,
    `left join ${dbid}_types_voie as tv on tv.type_voie = vo.type`,
    `where cv.voie = ?`,
    `order by cv.rang`,
  ].join(' ');
}

module.exports = {
  getByType,
  getByProfile,
  getByRace,
  getByPath
}