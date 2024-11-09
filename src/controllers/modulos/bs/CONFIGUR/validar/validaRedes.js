const {log_error}       = require("../../../../../utils/logger");
const db                = require("../../../../../conection/conn");
// const _                 = require('underscore')

exports.main = async (req, res, next) => {
  // let dependencia = _.extend( ...req.body.dependencia);
  const { valor = null }  = req.body;
  try {
    var sql = `SELECT * 
                 FROM valida_redes_sociales($1)`;
    let data = [valor];    
    const resul = await db.Open(sql,data,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion : getRedes ${error}`);
    console.log(`se produjo un error en la funcion : getRedes ${error}`);
    next();
  }
}