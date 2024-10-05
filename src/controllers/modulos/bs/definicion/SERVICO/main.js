const {log_error}       = require("../../../../../utils/logger");
const db                = require("../../../../../conection/conn");
const {generate_insert} = require("../../../../../utils/generate_inserte");
const {generate_update} = require("../../../../../utils/generate_update");
const {generate_delete} = require("../../../../../utils/generate_delete");
const tableData         = require('./tableDate');
const copyImg           = require('../../../../upload/main');
const {nvl}             = require('../../../../../utils/nvl')
const actualizarPrecio  = require('../PRECIOS/main')

exports.getServicioCab = async (req, res, next) => {
  let { cod_empresa = null }  = req.params;
  
  try {
    var sql = ` select coalesce(max(ad.cod_servicio),0) + 1 as id 
                  from servicioscab ad 
                 where ad.cod_empresa = ${cod_empresa}`;
    let valor   = [];
    const resul = await db.Open(sql,valor);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion getIdServicioCab ${error}`);
    console.log(`se produjo un error en la funcion getIdServicioCab ${error}`);
    next();
  }
}
exports.getServicioDet = async (req, res, next) => {
  let { cod_servicio = null }  = req.params;
  try {
    var sql = ` select coalesce(max(ad.nro_orden),0) + 1 as id 
                  from serviciosdet ad
                 where ad.cod_servicio = $1`;
    let valor   = [cod_servicio];
    const resul = await db.Open(sql,valor);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion getIdServicioDet ${error}`);
    console.log(`se produjo un error en la funcion getIdServicioDet ${error}`);
    next();
  }
}
exports.mainServicio = async(req, res, next)=>{
  var content     = req.body;
  var {usuario = '', cod_empresa = ''} = content.AditionalData;
  // CAB
  let data_insert    = {  cod_empresa, usuario:`'${usuario}'`, fecha_alta:'CURRENT_TIMESTAMP'}
  let data_update    = {  usuario_mod:`'${usuario}'`, fecha_mod:'CURRENT_TIMESTAMP'}

  let datosInserCab  = "";
  let datosUpdatCab  = "";
  let deleteCab      = "";
  if(content.updateInsertCab.length > 0 || content.delete_cab.length){
    let NameTableCab = 'servicioscab';
    let tableCab     = tableData.find( item => item.table === NameTableCab);
    datosInserCab    = await generate_insert(NameTableCab, content.updateInsertCab,data_insert,tableCab.column);
    datosUpdatCab    = await generate_update(NameTableCab, content.updateInsertCab, content.aux_updateInsertCab,{},{}, tableCab.column,tableCab.pk,data_update); 
    deleteCab        = await generate_delete(NameTableCab, content.delete_cab,{},tableCab.column,  tableCab.pk);
  }
  
  // DET
  let datosInserDet  = "";
  let datosUpdatDet  = "";
  let deleteDet      = "";
  if(content.updateInsertDet.length > 0 || content.delete_det.length){
    let NameTableDet = 'serviciosdet';
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
    else actualizarPrecio.activarImg(req,res,next)

    res.status(200).json({res:totalFilas, mensaje});
  } catch (error) {
    next()
    log_error.error({error, mensaje:'abm servicio'});
    console.log(error)
  }
}
exports.mainActivar = async(req, res, next)=>{
  let content        = req.body;
  let NameTableCab   = 'servicioscab';
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
      let dataRow     = { titulo         : content.titulo      ,
                          descripcion    : content.descripcion ,
                          nomb_empresa   : content.nomb_empresa,
                          extencion_img  : extencion           ,
                          detalle        : content.detalle     ,
                          cod_empresa
                        }
      try {
        const origen    = process.env.FILESTORE_PRIVATE+`\\${cod_empresa}\\SERVICIO\\servicio-img${content.cod_servicio}.${extencion}`;
        const destino   = process.env.FILESTORE_PUBLIC+`\\${cod_empresa}\\img\\servicio-img.${extencion}`;
        await copyImg.copiarImagen(origen,destino);  
        // codpia de datos
        await copyImg.saveData(dataRow,'SERVICIO',process.env.FILESTORE_PUBLIC+'\\'+cod_empresa+'\\data\\');
        actualizarPrecio.activarImg(req,res,next);
        data  = {res:1, mensaje:''}
      } catch (error) {
        
        data  = {res:0, mensaje:error}
        console.log(error)
        log_error.error(`copy img private in public servicio:`,error);
        next()
      }
    }
    res.status(200).json(data); 
  } catch (error) {
    log_error.error(`update activo servicio:`,error);
  }
}