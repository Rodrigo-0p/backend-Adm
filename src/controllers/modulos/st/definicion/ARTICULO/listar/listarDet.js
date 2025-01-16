const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");
const {nvl}               = require("../../../../../../utils/nvl");
exports.main = async (req, res, next) => {
  const { cod_empresa = null, cod_articulo = null }  = req.body;
  try {
     var sql = ` select c.* 
                   from unidad_medida c
                  where c.cod_empresa  = $1
                    and c.cod_articulo = $2
                  order by c.cod_unidad asc`;
    let valor = [nvl(cod_empresa,null), nvl(cod_articulo,null)];
    const resul = await db.Open(sql,valor,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion UNIDAD_MEDIDA: listarDet ${error}`);
    console.log(`se produjo un error en la funcion UNIDAD_MEDIDA: listarDet ${error}`);
    next();
  }
}