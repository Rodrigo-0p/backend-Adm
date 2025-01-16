const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");
const {nvl}             = require("../../../../../../utils/nvl");
exports.main = async (req, res, next) => {
  const { valor = null }  = req.body;
  try {
    var sql = `SELECT * 
                 FROM valida_impuesto($1)`;
    let data = [nvl(valor,null)];    
    const resul = await db.Open(sql,data,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion : valida_impuesto ${error}`);
    console.log(`se produjo un error en la funcion : valida_impuesto ${error}`);
    next();
  }
}