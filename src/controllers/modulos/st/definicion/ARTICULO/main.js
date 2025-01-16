const {log_error}       = require("../../../../../utils/logger");
const db                = require("../../../../../conection/conn");
const {generate_insert} = require("../../../../../utils/generate_inserte");
const {generate_update} = require("../../../../../utils/generate_update");
const {generate_delete} = require("../../../../../utils/generate_delete");
const {nvl}             = require('../../../../../utils/nvl')
const tableData         = require('./tableDate');

exports.getCodeCab = async (req, res, next) => {
  let { cod_empresa = null }  = req.params;
  try {
    var sql = ` select coalesce(max(ad.cod_articulo),0) + 1 as id 
                  from articulos ad 
                 where ad.cod_empresa = $1`;
    let valor   = [nvl(cod_empresa,null)];
    const resul = await db.Open(sql,valor);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion getCodeAtrticulo ${error}`);
    console.log(`se produjo un error en la funcion getCodeAtrticulo ${error}`);
    next();
  }
}

exports.getCodeDet = async (req, res, next) => {
  let { cod_empresa = null, cod_sucursal = null, cod_articulo = null }  = req.params;
  try {
    var sql = ` select coalesce(max(ad.cod_unidad),0) + 1 as id 
                  from unidad_medida ad
                 where ad.cod_empresa  = $1
                   and ad.cod_sucursal = $2
                   and ad.cod_articulo = $3`;
    let valor   = [nvl(cod_empresa,null)
                 , nvl(cod_sucursal,null)
                 , nvl(cod_articulo,null)];
    const resul = await db.Open(sql,valor);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion getCodeUnidadDeMedida ${error}`);
    console.log(`se produjo un error en la funcion getCodeUnidadDeMedida ${error}`);
    next();
  }
}

exports.mainArticulo = async(req, res, next)=>{
  var content     = req.body;
  var {usuario = '', cod_empresa = ''} = content.auditoria;
  // CAB
  let data_insert    = {  cod_empresa, usuario    :`'${usuario}'`, fecha_alta:'CURRENT_TIMESTAMP'}
  let data_update    = {  cod_empresa, usuario_mod:`'${usuario}'`, fecha_mod :'CURRENT_TIMESTAMP'}

  let datosInserCab  = "";
  let datosUpdatCab  = "";
  let deleteCab      = "";

  if(content.updateInsertCab.length > 0 || content.delete_cab.length){
    
    if(content.delete_cab?.length === 0){
      let sql1 = `SELECT * FROM valida_categoria($1,$2)`;
      let sql2 = `SELECT * FROM valida_impuesto($1)`;
      let mensaje = '';
      let bandera = false;
      for (let i = 0; i < content.updateInsertCab.length; i++) {
        if(bandera)break
        
        const element = content.updateInsertCab[i];

        let data      = [nvl(element.cod_empresa,null),nvl(element.cod_categoria,null)];    
        const resul1   = await db.Open(sql1,data,next); 

        if(nvl(resul1.rows[0].p_mensaje,null) !== null){
          mensaje = `${resul1.rows[0].p_mensaje} .- ${element.cod_categoria}`
          bandera = true;
        }
        
        if(!bandera){
          let params    = [nvl(element.cod_impuesto,null)];          
          const resul2   = await db.Open(sql2,params,next); 
          if(nvl(resul2.rows[0].p_mensaje,null) !== null){
            mensaje = `${resul2.rows[0].p_mensaje} .- ${element.cod_impuesto}`
            bandera = true;
          }
        }
      }      
      if(bandera){
        res.status(200).json({res:0,mensaje});
        return
      }
    }

    let NameTableCab = 'articulos';
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

    let NameTableDet = 'unidad_medida';
    let tableDet     = tableData.find( item => item.table === NameTableDet);
    datosInserDet    = await generate_insert(NameTableDet, content.updateInsertDet,data_insert,tableDet.column);
    datosUpdatDet    = await generate_update(NameTableDet, content.updateInsertDet, content.aux_updateInsertDet,{},{}, tableDet.column,tableDet.pk,{}); 
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
    log_error.error({error, mensaje:'abm articulo'});
    console.log(error)
  }
}