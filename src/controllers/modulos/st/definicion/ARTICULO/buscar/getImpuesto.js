const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");
exports.main = async (req, res, next) => {
  const { valor = null }  = req.body;
  try {
     var sql = `select c.cod_impuesto
                     , c.descripcion as desc_impuesto
                  from impuesto c
                 where c.estado = 'S'
                   and (cast(c.cod_impuesto as text) ILIKE '%' || $1 || '%'
                    or c.descripcion                 ILIKE '%' || $1 || '%' 
                    or $1 is null)`;
    let data = [valor];
    const resul = await db.Open(sql,data,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion : getImpuesto ${error}`);
    console.log(`se produjo un error en la funcion : getImpuesto ${error}`);
    next();
  }
}