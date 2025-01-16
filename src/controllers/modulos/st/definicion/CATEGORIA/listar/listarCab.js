const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");
const main              = require("../../../../../../utils/nvl");

exports.main = async (req, res, next) => {
  let {cod_empresa = '', cod_categoria = null, descripcion = null}  = req.body;
  try {
    var sql = `  select *
                   from categoria c
                  where c.cod_empresa      = $1
                    and (c.cod_categoria   = $2 OR $2 IS NULL)
                    and (c.descripcion ILIKE $3 OR $3 IS NULL)
                  order by c.cod_categoria desc`;
    let valor = [main.nvl(cod_empresa,null), main.nvl(cod_categoria,null), main.nvl(descripcion,null)];
    const resul = await db.Open(sql,valor,next);
    res.status(200).json(resul ? resul.rows : []);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion categoria: listarCab ${error}`);
    console.log(`se produjo un error en la funcion categoria: listarCab ${error}`);
    next();
  }
}