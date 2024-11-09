const {log_error}       = require("../../../../utils/logger");
const db                = require("../../../../conection/conn");
const {generate_insert} = require("../../../../utils/generate_inserte");
const {generate_update} = require("../../../../utils/generate_update");
const {generate_delete} = require("../../../../utils/generate_delete");
const tableData         = require('./tableDate');
const copyImg           = require('../../../upload/main');
const {nvl}             = require('../../../../utils/nvl')

exports.getConfigurCab = async (req, res, next) => {
  let { cod_empresa = null }  = req.params;
  try {
    var sql = ` select coalesce(max(ad.cod_configuracion),0) + 1 as id 
                  from configuracion_cab ad 
                 where ad.cod_empresa = ${cod_empresa}`;
    let valor   = [];
    const resul = await db.Open(sql,valor);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion getConfigurCab ${error}`);
    console.log(`se produjo un error en la funcion getConfigurCab ${error}`);
    next();
  }
}
exports.getConfigurDet = async (req, res, next) => {
  let { cod_empresa = null, cod_configuracion = null }  = req.params;
  try {
    var sql = ` select coalesce(max(ad.nro_orden),0) + 1 as id 
                  from configuracion_det ad
                 where ad.cod_empresa       = $1
                   and ad.cod_configuracion = $2`;
    let valor   = [cod_empresa, cod_configuracion];
    const resul = await db.Open(sql,valor);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion getConfigurDet ${error}`);
    console.log(`se produjo un error en la funcion getConfigurDet ${error}`);
    next();
  }
}
exports.mainConfigur = async(req, res, next)=>{
  var content     = req.body;
  var {usuario = '', cod_empresa = ''} = content.AditionalData;
  // CAB
  let data_insert    = {  cod_empresa, usuario:`'${usuario}'`, fecha_alta:'CURRENT_TIMESTAMP'}
  let data_update    = {  cod_empresa, usuario_mod:`'${usuario}'`, fecha_mod:'CURRENT_TIMESTAMP'}

  let datosInserCab  = "";
  let datosUpdatCab  = "";
  let deleteCab      = "";
  if(content.updateInsertCab.length > 0 || content.delete_cab.length){
    let NameTableCab = 'configuracion_cab';
    let tableCab     = tableData.find( item => item.table === NameTableCab);
    datosInserCab    = await generate_insert(NameTableCab, content.updateInsertCab,data_insert,tableCab.column);
    datosUpdatCab    = await generate_update(NameTableCab, content.updateInsertCab, content.aux_updateInsertCab,{},{}, tableCab.column,tableCab.pk,data_update); 
    deleteCab        = await generate_delete(NameTableCab, content.delete_cab,{},tableCab.column, tableCab.pk);
  }
  
  // DET
  let datosInserDet  = "";
  let datosUpdatDet  = "";
  let deleteDet      = "";
  if(content.updateInsertDet.length > 0 || content.delete_det.length){

    if(content.delete_det?.length === 0){  
      let sql = `SELECT c.* FROM valida_redes_sociales($1) c`;
      let mensaje = '';
      let bandera = false;
      for (let i = 0; i < content.updateInsertDet.length; i++) {
        if(bandera)break
        const element = content.updateInsertDet[i];
        let data = [element.cod_redes_sociales];    
        const resul = await db.Open(sql,data,next); 
        if(nvl(resul.rows[0].p_mensaje,null) !== null){
          mensaje = `${resul.rows[0].p_mensaje} .- ${element.cod_redes_sociales}`
          bandera = true;
        }
      }      
      if(bandera){
        res.status(200).json({res:0,mensaje});
        return
      }
    }
    
    let NameTableDet = 'configuracion_det';
    let tableDet     = tableData.find( item => item.table === NameTableDet);
    datosInserDet    = await generate_insert(NameTableDet, content.updateInsertDet,data_insert,tableDet.column);
    datosUpdatDet    = await generate_update(NameTableDet, content.updateInsertDet, content.aux_updateInsertDet,{},{}, tableDet.column,tableDet.pk,data_update); 
    deleteDet        = await generate_delete(NameTableDet, content.delete_det,{},tableDet.column,  tableDet.pk);
  }
  
  try {
    // Procesar inserciones y actualizaciones
    const resulInsertCab = datosInserCab.length > 0 ? await db.Open(datosInserCab, [], res) : [];
    const resulUpdateCab = datosUpdatCab.length > 0 ? await db.Open(datosUpdatCab, [], res) : [];
    const resulDeleteCab = deleteCab.length     > 0 ? await db.Open(deleteCab    , [], res) : [];

    const totalFilasCab = (resulInsertCab[1] ? resulInsertCab[1].rowCount : 0) + 
                          (resulUpdateCab[1] ? resulUpdateCab[1].rowCount : 0) + 
                          (resulDeleteCab[1] ? resulDeleteCab[1].rowCount : 0);

    const mensajeCab    = (resulInsertCab[0]?.message ? resulInsertCab[0].message : "") +
                          (resulUpdateCab[0]?.message ? resulUpdateCab[0].message : "") +
                          (resulDeleteCab[0]?.message ? resulDeleteCab[0].message : "");
    
    // DET 
    const resulInsertDet = await db.Open(datosInserDet, [], res);
    const resulUpdateDet = await db.Open(datosUpdatDet, [], res);
    const resulDeleteDet = await db.Open(deleteDet    , [], res);

    const totalFilasDet = (resulInsertDet[1] ? resulInsertDet[1].rowCount : 0) + 
                          (resulUpdateDet[1] ? resulUpdateDet[1].rowCount : 0) + 
                          (resulDeleteDet[1] ? resulDeleteDet[1].rowCount : 0);

    const mensajeDet =    (resulInsertDet[0]?.message ? resulInsertDet[0].message : "") +
                          (resulUpdateDet[0]?.message ? resulUpdateDet[0].message : "") +
                          (resulDeleteDet[0]?.message ? resulDeleteDet[0].message : "");

    let totalFilas = totalFilasCab + totalFilasDet;
    let mensaje    = mensajeCab    + mensajeDet   ;    
    if(nvl(mensaje,null) === null && totalFilas === 0) totalFilas = -1;    
    res.status(200).json({res:totalFilas, mensaje});
  } catch (error) {
    next()
    log_error.error({error, mensaje:'abm configur'});
    console.log(error)
  }
}
exports.mainActivar = async(req, res, next)=>{
  let content        = req.body;
  let NameTableCab   = 'configuracion_cab';
  let data_update    = { usuario_mod:`'${content.usuario}'`, fecha_mod:'CURRENT_TIMESTAMP'}
  let tableCab       = tableData.find( item => item.table === NameTableCab);
  let datosUpdatCab  = await generate_update(NameTableCab, [content], content.aux_update,{},data_update, tableCab.column,  tableCab.pk); 

  try {
    const resulInsert  = await db.Open(datosUpdatCab, [], res);
    let data           = { res     : resulInsert[1]          ? resulInsert[1].rowCount : 0, 
                           mensaje : resulInsert[0]?.message ? resulInsert[0].message  : ""};    
    
    if(data.res > 0 || datosUpdatCab === ""){
      const extencion = content.name_img.split('.')[1];
      let cod_empresa = content.cod_empresa;
      let dataRow     = { titulo        : content.titulo      ,
                          extencion_img : extencion           ,
                          detalle       : content.detalle     ,                          
                        }
      try {
        const origen    = process.env.FILESTORE_PRIVATE+`\\${cod_empresa}\\CONFIGUR\\configur-img${content.cod_configuracion}.${extencion}`;
        const destino   = process.env.FILESTORE_PUBLIC+`\\${cod_empresa}\\img\\configur-img.${extencion}`;
        await copyImg.copiarImagen(origen,destino);  
        // codpia de datos
        await copyImg.saveData(dataRow,'CONFIGUR',process.env.FILESTORE_PUBLIC+'\\'+cod_empresa+'\\data\\');
        data  = {res:1, mensaje:''}
      } catch (error) {
        
        data  = {res:0, mensaje:error}
        console.log(error)
        log_error.error(`copy img private in public CONFIGUR:`,error);
        next()
      }
    }
    res.status(200).json(data); 
  } catch (error) {
    log_error.error(`update activo configur:`,error);
  }
}