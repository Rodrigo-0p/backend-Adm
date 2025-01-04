const { log_error } = require('../../../../../../utils/logger');
const db            = require('../../../../../../conection/conn');

exports.getListCab = async (req, res, next) =>{
    let { cod_funcionario   = null
        , cod_empresa       = null
        , nombre            = null
        , descripcion       = null
        , tipo_empresa      = null
        , ruc               = null
        , direccion         = null
        , telefono          = null
        , correo            = null
        , timbrado          = null
        , limite            = null
        , indice            = null }= req.body;
    try {
        let sql = `SELECT e.cod_empresa
                        , e.nombre
                        , e.descripcion
                        , e.activo
                        , e.tipo_empresa
                        , e.ruc
                        , e.direccion
                        , e.telefono
                        , e.correo
                        , e.timbrado
                        , e.name_img
                        , e.latitud
                        , e.longitud
                    FROM empresa    e 
                   WHERE e.activo          = 'S'
                     AND (e.cod_empresa  in (select f.cod_empresa from funcionario f 
						                      where f.cod_funcionario  = $2 
                                                AND f.estado           = 'S') or e.cod_empresa = $1)
                      AND (e.nombre 		ILIKE $3 OR $3	IS NULL)
                      AND (e.descripcion  	ILIKE $4 OR $4 	IS NULL)
                      AND (e.correo 		ILIKE $5 OR $5 	IS NULL)
                      AND (e.direccion 	 	ILIKE $6 OR $6 	IS NULL)
                      AND (e.tipo_empresa 	= $7  	 OR $7 	IS NULL)
                      AND (e.ruc 		 	= $8 	 OR $8 	IS NULL)
                      AND (e.telefono 	 	= $9 	 OR $9 	IS NULL)
                      AND (e.timbrado 		= $10	 OR $10 IS NULL)
                    ORDER BY e.cod_empresa
                  LIMIT $11 OFFSET $12`;
        let valor = [cod_funcionario,cod_empresa,  nombre, descripcion, tipo_empresa, ruc, direccion, telefono, correo, timbrado,limite,indice];
        const result = await db.Open(sql, valor, next);
        res.status(200).json(result.rows);
    } catch (error) {
        log_error.error(`Se produjo un error en la funcion Empresas: listarCab ${error}`)
        console.log(`Se produjo un error en la funcion Empresas: listarCab ${error}`);
        next();
    }
}