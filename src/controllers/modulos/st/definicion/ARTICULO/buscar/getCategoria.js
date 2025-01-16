const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");
exports.main = async (req, res, next) => {
  const { valor = null, cod_empresa = null }  = req.body;

  console.log(req.body);

  try {
     var sql = `select c.cod_categoria
                     , c.descripcion as desc_categoria
                  from categoria c
                 where c.cod_empresa = $1
                   and c.estado      = 'S'
                   and (cast(c.cod_categoria as text) like '%' || $2 || '%' 
                          or c.descripcion            like '%' || $2 || '%' or $2 is null)`;
    let data = [cod_empresa,valor];
    const resul = await db.Open(sql,data,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion : getCategoria ${error}`);
    console.log(`se produjo un error en la funcion : getCategoria ${error}`);
    next();
  }
}