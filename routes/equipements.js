/**
 * Equipment routes
 */

const express = require("express");
const router = express.Router();

const knex = require("../dbknex");
const { errorNotFound } = require("../errors");
const { dsExists, stringOrDefault, Ok } = require("../lib");
const trace = require("../trace");

/**
 * Route : /equipments/{:dataset}/?profile=xxxx
 * Return the base equipment for a given profile
 */
router.get("/:ds", (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status: 404, message: "Unknown dataset" };
  }

  let profile = stringOrDefault(req.query.profile);

  if (profile === "")
    throw { status: 400, message: "Required URL argument not found" };

  let props = "";
  const serialized = Object.keys(req.query).indexOf("serialized") != -1;
  if (serialized) {
    props = "concat_ws(' : ', pr.intitule, pe.valeur)";
  } else {
    props =
      "json_object('id', pr.code, 'nom', pr.intitule, 'valeur', pe.valeur)";
  }

  const sql = [
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

  trace.output(sql);

  knex
    .raw(sql, [profile])
    .then(function (result) {
      result = result[0];
      if (result.length == 0) {
        errorNotFound(res);
      } else {
        if (!serialized) {
          result.forEach((dataRow) => {
            dataRow.props = dataRow.props.split("~");
            dataRow.props.forEach((item, ix) => {
              const prop = JSON.parse(item);
              if (prop.id !== null && prop.nom !== null && prop.valeur !== null)
                dataRow.props[ix] = prop;
              else dataRow.props.splice(ix, 1);
            });
          });
        }
        Ok(res, result);
      }
    })
    .catch(function (error) {
      if (error) throw { message: error.message };
    });
});

/**
 * Route : /equipments/{:dataset}/{:subcategory}
 * Return the equipments for a given subcategory
 */
router.get("/:ds/:category", (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status: 404, message: "Unknown dataset" };
  }

  const category = decodeURI(req.params.category);

  let props = "";
  let maitrise_par = "";
  const serialized = Object.keys(req.query).indexOf("serialized") !== -1;
  if (serialized) {
    props = "concat_ws(' : ', pe.intitule, ep.valeur)";
    maitrise_par = "pr.nom";
  } else {
    props =
      "json_object('id', pe.code, 'nom', pe.intitule, 'valeur', ep.valeur)";
    maitrise_par = "json_object('id', pr.profil, 'nom', pr.nom)";
  }

  const sql = [
    "select",
    [
      "eq.code as code",
      "eq.designation as designation",
      "ca.libelle as categorie",
      "eq.prix as prix",
      "eq.notes as notes",
      `group_concat(distinct ${props} separator '~') as props`,
      `group_concat(distinct ${maitrise_par} separator '~') as maitrise_par`,
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

  trace.output(sql);

  knex
    .raw(sql, [category])
    .then(function (result) {
      result = result[0];
      if (result.length == 0) {
        errorNotFound(res);
      } else {
        if (!serialized) {
          result.forEach((dataRow) => {
            dataRow.props = dataRow.props.split("~");
            dataRow.props.forEach((item, ix) => {
              dataRow.props[ix] = JSON.parse(item);
            });
            if (dataRow.props.length == 1 && dataRow.props[0].id == null) {
              dataRow.props = [];
            }
            dataRow.maitrise_par = dataRow.maitrise_par.split("~");
            dataRow.maitrise_par.forEach((item, ix) => {
              dataRow.maitrise_par[ix] = JSON.parse(item);
            });
          });
        }
        Ok(res, result);
      }
    })
    .catch(function (error) {
      if (error) throw { message: error.message };
    });
});

module.exports = router;
