const getByProfile = (dbid, serialized) => {

  let props = '';
  if (serialized) {
    props = "concat_ws(' : ', pr.intitule, pe.valeur)";
  } else {
    props =
      "json_object('id', pr.code, 'nom', pr.intitule, 'valeur', pe.valeur)";
  }
  return [
    "select",
    [
      "eq.code as code",
      "eq.designation as designation",
      "ep.nombre as nombre",
      "ep.special as special",
      `group_concat(${props} separator '~') as props`,
    ].join(", "),
    `from ${dbid}_equipement_profils as ep`,
    `inner join ${dbid}_equipement as eq on eq.code = ep.equipement`,
    `left join ${dbid}_equipement_proprietes as pe on pe.code_equipement = eq.code`,
    `left join ${dbid}_proprietes_equipement as pr on pr.code = pe.code_propriete`,
    "where ep.profil = ?",
    "group by",
    ["ep.sequence", "eq.code"].join(", "),
    "order by",
    ["ep.sequence", "eq.code"].join(", "),
  ].join(" ");
};

const getBySubCategory = (dbid, serialized) => {

  let props = "";
  let masteredBy = "";
  if (serialized) {
    props = "concat_ws(' : ', pe.intitule, ep.valeur)";
    masteredBy = "pr.nom";
  } else {
    props =
      "json_object('id', pe.code, 'nom', pe.intitule, 'valeur', ep.valeur)";
    masteredBy = "json_object('id', pr.profil, 'nom', pr.nom)";
  }

  return [
    "select",
    [
      "eq.code as code",
      "eq.designation as designation",
      "ca.libelle as categorie",
      "eq.prix as prix",
      "eq.notes as notes",
      `group_concat(distinct ${props} separator '~') as props`,
      `group_concat(distinct ${masteredBy} separator '~') as maitrise_par`,
    ].join(", "),
    `from ${dbid}_equipement as eq`,
    `inner join ${dbid}_categories_equipement as ca on eq.categorie = ca.code`,
    `left join ${dbid}_equipement_proprietes as ep on eq.code = ep.code_equipement`,
    `left join ${dbid}_proprietes_equipement as pe on ep.code_propriete = pe.code`,
    `left join ${dbid}_profils_maitrises as pm on pm.equipement = eq.code`,
    `inner join ${dbid}_profils as pr on pr.profil = pm.profil`,
    "where eq.categorie = ?",
    "group by",
    ["ca.code", "eq.code"].join(", "),
    "order by",
    ["ca.parent", "ca.sequence", "ca.code", "eq.sequence", "eq.code"].join(
      ", "
    ),
  ].join(" ");
}

module.exports = {
  getByProfile,
  getBySubCategory
}