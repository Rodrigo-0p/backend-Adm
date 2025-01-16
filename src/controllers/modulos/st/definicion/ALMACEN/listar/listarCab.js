const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");
const main              = require("../../../../../../utils/nvl");
exports.main = async (req, res, next) => {
  let {cod_empresa = null, cod_almacen = null, nombre = null}  = req.body;
  try {
    var sql = `  select *
                   from almacen c
                  where c.cod_empresa    = $1
                    and (c.cod_almacen   = $2 OR $2 IS NULL)
                    and (c.nombre    ILIKE $3 OR $3 IS NULL)
                  order by c.cod_almacen desc`;
    let valor = [main.nvl(cod_empresa,null), main.nvl(cod_almacen,null), main.nvl(nombre,null)];
    const resul = await db.Open(sql,valor,next);
    res.status(200).json(resul ? resul.rows : []);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion almacen: listarCab ${error}`);
    console.log(`se produjo un error en la funcion almacen: listarCab ${error}`);
    next();
  }
}