const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");

exports.getListCab = async (req, res, next) => {
  let { cod_empresa = '', titulo_precios = null, cod_servicio = null}  = req.body;
  
  try {
     var sql = ` select c.cod_empresa
                      , e.nombre 
                      , c.titulo_precios
                      , c.name_img_precios 
                      , c.name_img_fondo_precios                       
                      , c.activo
                      , c.cod_servicio 
                      , c.cod_servicio id
                    from servicioscab c
                       , empresa e
                   where c.cod_empresa   = e.cod_empresa
                     and c.cod_empresa   = $1
                     and (c.cod_servicio = $2 or $2 is null)
                     and (c.titulo_precios ilike $3 or $3 is null)
                   order by c.activo desc`;
    let valor = [cod_empresa, cod_servicio, titulo_precios];
    const resul = await db.Open(sql,valor,res,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion PRECIO: listarCab ${error}`);
    console.log(`se produjo un error en la funcion PRECIO: listarCab ${error}`);
    next();
  }
}