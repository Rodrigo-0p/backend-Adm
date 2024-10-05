const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");

exports.getListCab = async (req, res, next) => {
  let { cod_empresa = '', titulo = null, subtitulo = null, cod_acercade = null, indice, limite }  = req.body;
  try {
    var sql = ` select * 
                  from acerca_de c
                 where c.cod_empresa = $1
                   and c.cod_acercade =  COALESCE($2, c.cod_acercade)
                   and c.titulo     like COALESCE($3, c.titulo)
                   and c.subtitulo  like COALESCE($4, c.subtitulo)
                 order by c.activo desc
                 LIMIT $5 OFFSET $6`;
    let valor = [cod_empresa, cod_acercade, titulo,subtitulo, limite, indice];
    const resul = await db.Open(sql,valor,next);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion Acercade: listarCab ${error}`);
    console.log(`se produjo un error en la funcion Acercade: listarCab ${error}`);
    next();
  }
}