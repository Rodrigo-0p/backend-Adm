const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");
const {nvl}               = require("../../../../../../utils/nvl");
exports.main = async (req, res, next) => {
  const { cod_empresa = null, cod_sucursal = null, cod_articulo = null }  = req.body;
  try {
     var sql = ` select c.* 
                      , alm.nombre desc_almacen
                   from articulo_almacen c
                   LEFT JOIN 
                        almacen alm
                     ON c.cod_empresa  = alm.cod_empresa
                    AND c.cod_sucursal = alm.cod_sucursal
                    AND c.cod_almacen  = alm.cod_almacen
                  where c.cod_empresa  = $1
                    and c.cod_sucursal = $2
                    and c.cod_articulo = $3
                  order by c.cod_almacen asc`;
    let valor = [nvl(cod_empresa,null), nvl(cod_sucursal,null), nvl(cod_articulo,null)];
    const resul = await db.Open(sql,valor,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion ARTICULO_ALMACEN: listarDet ${error}`);
    console.log(`se produjo un error en la funcion ARTICULO_ALMACEN: listarDet ${error}`);
    next();
  }
}