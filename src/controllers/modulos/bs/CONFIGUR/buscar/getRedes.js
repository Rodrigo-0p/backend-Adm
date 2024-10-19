const {log_error}       = require("../../../../../utils/logger");
const db                = require("../../../../../conection/conn");
exports.main = async (req, res, next) => {
  const { valor = null }  = req.body;
  try {
     var sql = `select rs.cod_redes_sociales
                     , rs.descripcion as desc_redes_sociales
                  from redes_sociales rs
                 where (cast(rs.cod_redes_sociales as text) like '%' || $1        || '%' 
                    or upper(rs.descripcion)                like '%' || upper($1) || '%' 
                    or $1 is null)`;
    let data = [valor];
    const resul = await db.Open(sql,data,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion : getRedes ${error}`);
    console.log(`se produjo un error en la funcion : getRedes ${error}`);
    next();
  }
}