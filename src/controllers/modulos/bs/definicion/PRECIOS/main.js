const {log_error}       = require("../../../../../utils/logger");
const db                = require("../../../../../conection/conn");
const {generate_update} = require("../../../../../utils/generate_update");
const tableData         = require('./tableDate');
const copyImg           = require('../../../../upload/main');
const {nvl}             = require('../../../../../utils/nvl')
const mainUpload        = require('../../../../../controllers/upload/main')

exports.mainPrecios = async(req, res, next)=>{
  var content     = req.body;

  var {usuario = ''} = content.AditionalData;
  let data_update    = {  usuario_mod:`'${usuario}'`, fecha_mod:'CURRENT_TIMESTAMP'}

  // CAB
  let datosUpdatCab  = "";
  if(content.updateInsertCab.length > 0){
    let NameTableCab   = 'servicioscab';
    let tableCab       = tableData.find( item => item.table === NameTableCab);
    datosUpdatCab      = await generate_update(NameTableCab, content.updateInsertCab, content.aux_updateInsertCab,{},{}, tableCab.column,  tableCab.pk, data_update);     
  }
  // DET
  let datosUpdatDet  = "";
  if(content.updateInsertDet.length > 0){
    let NameTableDet = 'serviciosdet';
    let tableDet     = tableData.find( item => item.table === NameTableDet);
    datosUpdatDet    = await generate_update(NameTableDet, content.updateInsertDet, content.aux_updateInsertDet,{},{}, tableDet.column,  tableDet.pk, data_update); 
  }
  
  try {
    // Procesar inserciones y actualizaciones
    let resulUpdateCab = ''
    var totalFilasCab  = 0
    let mensajeCab     = ''
    if(nvl(datosUpdatCab,null) !== null){
      resulUpdateCab = await db.Open(nvl(datosUpdatCab,''), [], res);
      totalFilasCab  = (resulUpdateCab[1] ? resulUpdateCab[1].rowCount : 0);
      mensajeCab     = (resulUpdateCab[0]?.message ? resulUpdateCab[0].message : "");
    }
    // DET 
    let resulUpdateDet = '';
    var totalFilasDet  = 0;
    let mensajeDet     = '';
    if(nvl(datosUpdatDet,null) !== null){
      resulUpdateDet = await db.Open(nvl(datosUpdatDet,''), [], res);
      totalFilasDet  = (resulUpdateDet[1]          ? resulUpdateDet[1].rowCount : 0 );
      mensajeDet     = (resulUpdateDet[0]?.message ? resulUpdateDet[0].message  : "");  
    }
    
    let totalFilas     = totalFilasCab + totalFilasDet;
    let mensaje        = mensajeCab    + mensajeDet   ;  
    if(nvl(mensaje,null) === null && totalFilas === 0) totalFilas = -1;
    try {
      if(totalFilas > 0){
        this.activarImg(req,res,next);
      } 
    } catch (error) {
      log_error.error(`mainPrecios img private in public precios:`,error);
      next();
    }

    res.status(200).json({res:totalFilas, mensaje});
  } catch (error) {
    next()
    log_error.error({error, mensaje:'abm Precios servicio'});
    console.log(error)
  }
}
exports.uploadImage =  async (req, res, next) => {
  try {
    mainUpload.main(req,res,next).then(()=>{
      next();
    });    
  } catch (error) {
    log_error.error(`guardar img private in public precios:`,error);
    next()
    res.status(400).json({res:0, mensaje:`La img no se ha guardado!!`});
  }
  
}
exports.activarImg = async(req, res, next)=>{
  setTimeout(async()=>{
    try {
      const { nameImg } = req.params
      const extencion = nameImg ? nameImg.split('.') : '';
      let sql = `select s.cod_empresa
                      , e.nombre as nomb_empresa
                      , s.titulo_precios 
                      , s.name_img_precios
                      , s.name_img_fondo_precios
                      , s.cod_servicio
                   from servicioscab s
                      , empresa e 
                  where s.cod_empresa = e.cod_empresa
                    and s.activo  = 'S' `;
      const resul = await db.Open(sql,[],res,next);
      if(resul.rows && resul.rows.length > 0){

        let vdata = resul.rows[0];
        var cod_empresa         = vdata.cod_empresa;
        const extencion_img     = vdata.name_img_precios       ? vdata.name_img_precios.split('.')[1]       : '';
        const extencion_img_fon = vdata.name_img_fondo_precios ? vdata.name_img_fondo_precios.split('.')[1] : ''; 

        let dataRow   = { titulo           : vdata.titulo_precios  ,
                          nomb_empresa     : vdata.nomb_empresa    ,
                          extencion_img    : extencion_img         ,
                          extencion_img_fon: extencion_img_fon     ,
                        }
        let sqlD = `select d.titulo 
                         , d.precios
                         , d.indpromo
                      from serviciosdet d
                     where d.cod_servicio = ${vdata.cod_servicio} 
                     order by d.cod_servicio desc`;
        const resul_det = await db.Open(sqlD,[],res,next);
        if(resul_det.rows && resul_det.rows.length > 0) dataRow.detalle = resul_det.rows;
        else dataRow.detalle = []
        await copyImg.saveData(dataRow,'PRECIOS',process.env.FILESTORE_PUBLIC+`\\${cod_empresa}\\data\\`);
      }
      if(nvl(extencion,null) !== null){
        const origen    = process.env.FILESTORE_PRIVATE+`\\${cod_empresa}\\PRECIOS\\${extencion[0]}.${extencion[1]}`;
        const nameSinID = extencion[0].replace(/[0-9]/g, ''); // quita cualquier numero dentro el string
        const destino   = process.env.FILESTORE_PUBLIC+`\\${cod_empresa}\\img\\${nameSinID}.${extencion[1]}`;
        await copyImg.copiarImagen(origen,destino);
      }
    } catch (error) {
      console.log(error)
      log_error.error(`copy img private in public precios:`,error);
      next()
    } 
  },200)  
}

