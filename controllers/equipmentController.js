/**
 * Equipments data methods
 */

const knex = require("../core/dbknex");
const { errorNotFound } = require("../core/errors");
const { dsExists, stringOrDefault, Ok } = require("../core/lib");
const trace = require("../core/trace");

const equipmentQueries = require('../queries/equipmentQueries');

const getByProfile = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status: 404, message: "Unknown dataset" };
  }

  const profile = stringOrDefault(req.query.profile);

  if (profile === "")
    throw { status: 400, message: "Required URL argument not found" };

  const serialized = Object.keys(req.query).indexOf("serialized") != -1;
  
  const sql = equipmentQueries.getByProfile(dbid, serialized);
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
}

const getBySubCategory = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status: 404, message: "Unknown dataset" };
  }

  const category = decodeURI(req.params.category);

  const serialized = Object.keys(req.query).indexOf("serialized") !== -1;

  const sql = equipmentQueries.getBySubCategory(dbid, serialized);
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
};

module.exports = {
  getByProfile,
  getBySubCategory
}