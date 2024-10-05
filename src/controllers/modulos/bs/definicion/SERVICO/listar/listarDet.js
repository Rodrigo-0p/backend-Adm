const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");
exports.getListDet = async (req, res, next) => {
  const { cod_servicio = null }  = req.body;
  try {
     var sql = ` select c.nro_orden as id
                      , c.*
                   from serviciosdet c
                  where c.cod_servicio = $1
                  order by c.nro_orden desc`;
    let valor = [cod_servicio];
    const resul = await db.Open(sql,valor,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion SERVICIO: listarDet ${error}`);
    console.log(`se produjo un error en la funcion SERVICIO: listarDet ${error}`);
    next();
  }
}