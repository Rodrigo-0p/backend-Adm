const {log_error}       = require("../../../../../utils/logger");
const db                = require("../../../../../conection/conn");

exports.main = async (req, res, next) => {
  let { cod_empresa = '',cod_configuracion = null, titulo = null, indice, limite }  = req.body;
  try {
    var sql = ` select c.*
                      , e.nombre  nomb_empresa
                      , c.cod_configuracion key_cab
                   from configuracion_cab c
                      , empresa e
                  where c.cod_empresa   = e.cod_empresa 
                    and c.cod_empresa   = $1
                    and (c.cod_configuracion = $2 OR $2 IS NULL)
                    and (c.titulo        ILIKE $3 OR $3 IS NULL)
                  order by c.activo desc
                  LIMIT $4 OFFSET $5`;
    let valor = [cod_empresa, cod_configuracion , titulo, limite, indice];
    const resul = await db.Open(sql,valor,next);
    res.status(200).json(resul ? resul.rows : []);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion configuracion: listarCab ${error}`);
    console.log(`se produjo un error en la funcion configuracion: listarCab ${error}`);
    next();
  }
}