const {log_error}       = require("../../../../../utils/logger");
const db                = require("../../../../../conection/conn");
exports.main = async (req, res, next) => {
  const { cod_empresa = null, cod_configuracion = null }  = req.body;
  try {
     var sql = ` select c.nro_orden as id
                      , rs.descripcion desc_redes_sociales
                      , c.*
                   from configuracion_det c
                      , redes_sociales rs 
                  where c.cod_redes_sociales = rs.cod_redes_sociales
                    --
                    and c.cod_empresa       = $1
                    and c.cod_configuracion = $2
                  order by c.nro_orden desc`;
    let valor = [cod_empresa, cod_configuracion];
    const resul = await db.Open(sql,valor,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion CODFIGURACION_DET: listarDet ${error}`);
    console.log(`se produjo un error en la funcion CODFIGURACION_DET: listarDet ${error}`);
    next();
  }
}