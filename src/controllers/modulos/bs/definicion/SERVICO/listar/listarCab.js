const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");

exports.getListCab = async (req, res, next) => {
  let { cod_empresa = null, titulo = null, cod_servicio = null, indice, limite }  = req.body;
  
  try {
     var sql = ` select c.*
                      , e.nombre  nomb_empresa
                      , c.cod_servicio key_cab
                   from servicioscab c
                      , empresa e
                  where c.cod_empresa   = e.cod_empresa 
                    and c.cod_empresa   = $1
                    and (c.cod_servicio = $2 OR $2 IS NULL)
                    and (c.titulo       ILIKE $3 OR $3 IS NULL)
                  order by c.activo desc
                  LIMIT $4 OFFSET $5`;
    let valor = [cod_empresa, cod_servicio, titulo, limite, indice];
    const resul = await db.Open(sql,valor,res,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion SERVICIO: listarCab ${error}`);
    console.log(`se produjo un error en la funcion SERVICIO: listarCab ${error}`);
    next();
  }
}