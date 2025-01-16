const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");
const main              = require("../../../../../../utils/nvl");
exports.main = async (req, res, next) => {
  const { cod_empresa = null, cod_articulo }  = req.body;
  try {
     var sql = `select c.*
                     , a.nombre desc_almacen
                  from stock_disponible c
                     , almacen a 
                  where c.cod_empresa  = a.cod_empresa 
                    and c.cod_almacen  = a.cod_almacen 
                    and c.cod_empresa  = $1
                    and c.cod_articulo = $2`;
    let data = [main.nvl(cod_empresa,null),main.nvl(cod_articulo,null)];
    const resul = await db.Open(sql,data,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion : getStockDisp ${error}`);
    console.log(`se produjo un error en la funcion : getStockDisp ${error}`);
    next();
  }
}