const {log_error}       = require("../../../../../../utils/logger");
const db                = require("../../../../../../conection/conn");
const {nvl}             = require("../../../../../../utils/nvl");
exports.main = async (req, res, next) => {
  let { cod_empresa = '',cod_articulo = null, descripcion = null, stock_minimo = null, codigo_barras = null,indice, limite }  = req.body;
  try {
     var sql = ` SELECT c.*
                      , cat.descripcion AS desc_categoria
                      , int.descripcion AS desc_impuesto
                    FROM 
                        articulos c
                    LEFT JOIN 
                        categoria cat 
                        ON c.cod_empresa   = cat.cod_empresa
                       AND c.cod_categoria = cat.cod_categoria
                    LEFT JOIN 
                        impuesto int
                        ON c.cod_impuesto   = int.cod_impuesto
                    WHERE c.cod_empresa       = $1
                        AND (c.cod_articulo = $2 OR $2 IS NULL)
                        AND (c.descripcion ILIKE '%' || $3 || '%' OR $3 IS NULL)
                        AND (c.stock_minimo = $4 OR $4 IS NULL)
                        AND (c.codigo_barras = $5 OR $5 IS NULL)
                    ORDER BY c.cod_articulo DESC
                    LIMIT  $6 OFFSET $7;`;
    let valor = [nvl(cod_empresa,null), nvl(cod_articulo,null), descripcion,stock_minimo, codigo_barras, limite, indice];
    const resul = await db.Open(sql,valor,next);
    res.status(200).json(resul ? resul.rows : []);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion articulo: listarCab ${error}`);
    console.log(`se produjo un error en la funcion articulo: listarCab ${error}`);
    next();
  }
}