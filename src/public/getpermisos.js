
const {log_error} = require("../utils/logger");
const db          = require("../conection/conn");

exports.getPermisosMenu = async (p_usuario) =>{  
  try {
     var sql = ` select m.codigo id_modulo
                      , m.descripcion desc_modulo
                      , s.codigo||'_'||s.cod_submodulo id_submodulo
                      , s.descripcion desc_submodulo
                      , f.nombre cod_form
                      , f.descripcion desc_form
                      , f.ruta
                      , coalesce(m.codigo,'')||'_'||coalesce(s.codigo,'')||'_'||coalesce(f.nombre,'') id_menu
                    from permiso_form p
                    JOIN 
                        usuarios u ON p.cod_usuario = u.cod_usuario
                    JOIN 
                        formularios f ON p.cod_formulario = f.cod_formulario
                    LEFT JOIN 
                        modulos m ON f.cod_modulo = m.cod_modulo
                    LEFT JOIN 
                        subModulos s ON f.cod_submodulo = s.cod_submodulo
                    WHERE u.usuario = ($1)
                      and coalesce(f.habilitado,'N') = 'S'`;
      var valor   = [p_usuario];
      const resul = await db.Open(sql,valor);
      return resul.rows;
  } catch (error) {
    log_error.error(error);
    console.log(error)
  }
}