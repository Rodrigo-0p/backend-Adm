const {log_error}       = require("../../../../../utils/logger");
const db                = require("../../../../../conection/conn");
const {generate_insert} = require("../../../../../utils/generate_inserte");
const {generate_update} = require("../../../../../utils/generate_update");
const {generate_delete} = require("../../../../../utils/generate_delete");
const tableData         = require('./tableDate');
const copyImg           = require('../../../../upload/main');
const path              = require('path');
const filestorePrivate  =  path.join(__dirname,'..','..','..','..','..','..','filestore','private')//process.env.FILESTORE_PRIVATE
const filestorePublic   =  path.join(__dirname,'..','..','..','..','..','..','filestore','public')//process.env.FILESTORE_PRIVATE


exports.getAcercaDe = async (req, res, next) => {
  let { cod_empresa }  = req.params;
  try {
    var sql = ` select max(ad.cod_acercade) + 1 as id 
                  from acerca_de ad 
                 where ad.cod_empresa = ${cod_empresa}`;
    let valor   = [];
    const resul = await db.Open(sql,valor);
    res.status(200).json(resul.rows);
  } catch (error) {
    log_error.error(`se produjo un error en la funcion getIdAcercaDe ${error}`);
    console.log(`se produjo un error en la funcion getIdAcercaDe ${error}`);
    next();
  }
}
exports.mainAcercaDe = async(req, res, next)=>{
  var content     = req.body;
  var {usuario = '', cod_empresa = ''} = content.AditionalData;

  // CAB
  let NameTableCab   = 'acerca_de';
  let tableCab       = tableData.find( item => item.table === NameTableCab);
  let data_insert    = {cod_empresa, usuario:`'${usuario}'`, fecha_alta:'CURRENT_TIMESTAMP'}
  let data_update    = { usuario_mod:`'${usuario}'`, fecha_mod:'CURRENT_TIMESTAMP'}

  let datosInserCab  = await generate_insert(NameTableCab, content.updateInsert,data_insert,tableCab.column);
  let datosUpdatCab  = await generate_update(NameTableCab, content.updateInsert, content.aux_updateInsert,{},{}, tableCab.column,  tableCab.pk, data_update); 
  let deleteCab      = await generate_delete(NameTableCab, content.delete_cab,{},tableCab.column,tableCab.pk); 

  try {  
    // Procesar inserciones y actualizaciones
    const resulInsert = datosInserCab.length > 0 ? await db.Open(datosInserCab, [], res) : [];
    const resulUpdate = datosUpdatCab.length > 0 ? await db.Open(datosUpdatCab, [], res) : [];
    const resulDelete = deleteCab.length     > 0 ? await db.Open(deleteCab    , [], res) : [];

    const totalFilas = (resulInsert[1] ? resulInsert[1].rowCount : 0) + 
                       (resulUpdate[1] ? resulUpdate[1].rowCount : 0) + 
                       (resulDelete[1] ? resulDelete[1].rowCount : 0);

    const mensaje =    (resulInsert[0]?.message ? resulInsert[0].message : "") +
                       (resulUpdate[0]?.message ? resulUpdate[0].message : "") +
                       (resulDelete[0]?.message ? resulDelete[0].message : "");
                                 
    res.status(200).json({res:totalFilas, mensaje});
  } catch (error) {
    next()
    log_error.error({error, mensaje:'abm acerca_de'});
    console.log(error)
  }
}
exports.mainActivar = async(req, res, next)=>{
  let content        = req.body;
  let NameTableCab   = 'acerca_de';
  let tableCab       = tableData.find( item => item.table === NameTableCab);
  let datosUpdatCab  = await generate_update(NameTableCab, [content], content.aux_update,{},{}, tableCab.column,  tableCab.pk); 
  
  try {
    const resulInsert  = await db.Open(datosUpdatCab, [], res);
    let data           = { res     : resulInsert[1]          ? resulInsert[1].rowCount : 0, 
                           mensaje : resulInsert[0]?.message ? resulInsert[0].message  : ""};    

    if(data.res > 0 || datosUpdatCab === ""){
      
      const extencion = content.name_img.split('.')[1];
      let cod_empresa = content.cod_empresa;
      let dataRow   = { titulo         : content.titulo      ,
                        subtitulo      : content.subtitulo   ,
                        descripcion    : content.descripcion ,
                        extencion_img  : extencion           ,
                        cod_empresa
                      }
      try {
        // const origen    = process.env.FILESTORE_PRIVATE+`\\${cod_empresa}\\ACERCADE\\acercade-img${content.cod_acercade}.${extencion}`;
        // const destino   = process.env.FILESTORE_PUBLIC+`\\${cod_empresa}\\img\\acercade-img.${extencion}`;
        
        const origen    = path.join(filestorePrivate,`${cod_empresa}`,'ACERCADE',`acercade-img${content.cod_acercade}.${extencion}`)
        const destino   = path.join(filestorePublic,`${cod_empresa}`,'img',`acercade-img.${extencion}`)
                
        await copyImg.copiarImagen(origen,destino);  

        // codpia de datos
        await copyImg.saveData(dataRow,'ACERCADE',path.join(filestorePublic,`${cod_empresa}`,'data/'));
        if(datosUpdatCab === "") data = {res:1, mensaje:''};
      } catch (error) {
        console.log(error)
        log_error.error(`copy img private in public acercade:`,error);
        next()
      }      
    }
    res.status(200).json(data); 
  } catch (error) {
    log_error.error(`update activo acercade:`,error);
  }
}