const db                = require("../../../../../conection/conn");
const {log_error}       = require("../../../../../utils/logger");
const {generate_insert} = require("../../../../../utils/generate_inserte");
const {generate_update} = require("../../../../../utils/generate_update");
const {generate_delete} = require("../../../../../utils/generate_delete");
const tableData         = require('./tableDate');
const {nvl}             = require('../../../../../utils/nvl')

exports.getAlmacen = async (req, res, next) => {
  let { cod_empresa = null ,cod_sucursal =null}  = req.params;
  try {
    var sql = ` select coalesce(max(ad.cod_almacen),0) + 1 as id 
                  from almacen ad 
                 where ad.cod_empresa  = ${cod_empresa}
                   and ad.cod_sucursal = ${cod_sucursal}`;
    let valor   = [];
    const resul = await db.Open(sql,valor);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion getAlmacen ${error}`);
    console.log(`se produjo un error en la funcion getAlmacen ${error}`);
    next();
  }
}

exports.mainAlmacen = async(req, res, next)=>{
  var content     = req.body;
  var {usuario = '', cod_empresa = ''} = content.auditoria;
  // CAB
  let data_insert    = {  cod_empresa, usuario_alta:`'${usuario}'`, fecha_alta:'CURRENT_TIMESTAMP'}
  let data_update    = {  cod_empresa, usuario_mod: `'${usuario}'`, fecha_mod :'CURRENT_TIMESTAMP'}

  let datosInserDet  = "";
  let datosUpdatDet  = "";
  let deleteDet      = "";
  if(content.updateInsertDet.length > 0 || content.delete_det.length){
    let NameTable  = 'almacen';
    let table      = tableData.find( item => item.table === NameTable);
    datosInserDet  = await generate_insert(NameTable, content.updateInsertDet,data_insert,table.column);
    datosUpdatDet  = await generate_update(NameTable, content.updateInsertDet, content.aux_updateInsertDet,{},{}, table.column,table.pk,data_update);
    deleteDet      = await generate_delete(NameTable, content.delete_det,{},table.column, table.pk);
  }
 
  try {
    // Procesar inserciones y actualizaciones
    const resulInsert = datosInserDet.length > 0 ? await db.Open(datosInserDet, [], res) : [];
    const resulUpdate = datosUpdatDet.length > 0 ? await db.Open(datosUpdatDet, [], res) : [];
    const resulDelete = deleteDet.length     > 0 ? await db.Open(deleteDet    , [], res) : [];

    const totalFilas = (resulInsert[1] ? resulInsert[1].rowCount : 0) + 
                       (resulUpdate[1] ? resulUpdate[1].rowCount : 0) + 
                       (resulDelete[1] ? resulDelete[1].rowCount : 0);

    const mensaje    = (resulInsert[0]?.message ? resulInsert[0].message : "") +
                       (resulUpdate[0]?.message ? resulUpdate[0].message : "") +
                       (resulDelete[0]?.message ? resulDelete[0].message : "");
        
    if(nvl(mensaje,null) === null && totalFilas === 0) totalFilas = -1;    
    res.status(200).json({res:totalFilas, mensaje});
  } catch (error) {
    next()
    log_error.error({error, mensaje:'abm almacen'});
    console.log(error)
  }
}