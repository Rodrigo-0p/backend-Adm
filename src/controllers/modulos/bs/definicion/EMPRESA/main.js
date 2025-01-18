const fs                    = require('fs');
const db                    = require('../../../../../conection/conn')
const { generate_insert }   = require('../../../../../utils/generate_inserte');
const { generate_update }   = require('../../../../../utils/generate_update');
const { generate_delete }   = require('../../../../../utils/generate_delete');
const { log_error }         = require('../../../../../utils/logger');
const {nvl}                 = require('../../../../../utils/nvl')
const copyImg               = require('../../../../upload/main');
const tableData             = require('./tableData');
const mainUpload            = require('../../../../../controllers/upload/main');
const path              = require('path');
const filestorePrivate  =  path.join(__dirname,'..','..','..','..','..','..','filestore','private')//process.env.FILESTORE_PRIVATE
const filestorePublic   =  path.join(__dirname,'..','..','..','..','..','..','filestore','public')//process.env.FILESTORE_PRIVATE

exports.getEmpresa = async(req, res, next) => {
    try {
        let sql =`
                    SELECT max(cod_empresa) + 1 as id
                    from empresa
                `;
        let valor    = [];
        const result = await db.Open(sql, valor)
        res.status(200).json(result.rows);    
    } catch (error) {
        log_error.error(`se produjo un error en la funcion ${error}`)
        console.log(`se produjo un error en la funcion ${error}`);
        next();
    }
}

async function createDirectories(codigoEmpresa){
    try {
        // const codigoString = codigoEmpresa.toString();
        // const privateDir     = process.env.FILESTORE_PRIVATE+'/'+codigoString+'/EMPRESA'
        // const publicDir      = process.env.FILESTORE_PUBLIC+'/'+codigoString;

        const privateDir     = path.join(filestorePrivate,`${codigoEmpresa}`,'EMPRESA')
        const publicDir      = path.join(filestorePublic,`${codigoEmpresa}`,)
        
        const publicSubsDirs = ['data', 'img', 'user'];
        //crea el directorio privado
        if(!fs.existsSync(privateDir)){
            fs.mkdirSync(privateDir,{ recursive: true });
        }
        if(!fs.existsSync(publicDir)){
            fs.mkdirSync(publicDir,{ recursive: true });
        }
        publicSubsDirs.forEach(subDir =>{
            const fullPath = path.join(publicDir, subDir);
            if(!fs.existsSync(fullPath)){
                fs.mkdirSync(fullPath, { recursive: true});
            }
        });
    } catch (error) {
        log_error.error(`Error al crear los directorios : addDirectory.js, ${error}`)
        console.error('Error al crear los directorios:', error);
        throw new Error('Error al crear los directorios.');
    }
};
exports.mainEmpresa = async(req, res, next)=>{
    let content         = req.body;
    let cod_usuario     = content.AditionalData[0].cod_usuario;
    let cod_funcionario = content.AditionalData[0].cod_funcionario;
    let usuario         = content.AditionalData[0].usuario;
    let NameTableCab    = 'empresa';
    let tableCab        = tableData.find(item => item.table === NameTableCab);
    let data_insert     = { usuario:`'${usuario}'`, fecha_alta:'CURRENT_TIMESTAMP',cod_usuario,cod_funcionario}
    let data_update     = {usuario_mod:`'${usuario}'`, fecha_mod:'CURRENT_TIMESTAMP'}
    let datosInserCab   = await generate_insert(NameTableCab, content.updateInsert, data_insert, tableCab.column);//fecha_alta:'now()',
    let datosUpdatCab   = await generate_update(NameTableCab, content.updateInsert, content.aux_updateInsert,{},{}, tableCab.column, tableCab.pk, data_update);
    let deleteCab       = await generate_delete(NameTableCab, content.delete_cab  , {}, tableCab.column, tableCab.pk); // datos para tabla auditoria

    try {
        if (datosInserCab.length > 0 ){
            let codigoEmpresa = content.updateInsert[0].cod_empresa;
            await createDirectories(codigoEmpresa)
        }
        const resulInsert  = datosInserCab.length > 0 ? await db.Open(datosInserCab, [] , res) : [];
        const resulUpdate  = datosUpdatCab.length > 0 ? await db.Open(datosUpdatCab, [] , res) : [];
        const resulDelete  = deleteCab.length     > 0 ? await db.Open(deleteCab    , [] , res) : [];

        let totalFilas     =   (resulInsert[1] ? resulInsert[1].rowCount : 0 ) +
                               (resulUpdate[1] ? resulUpdate[1].rowCount : 0 ) +
                               (resulDelete[1] ? resulDelete[1].rowCount : 0 ) ;
        
        let message        =   (resulInsert[0] ? resulInsert[0].message : "" ) +
                               (resulUpdate[0] ? resulUpdate[0].message : "" ) +
                               (resulDelete[0] ? resulDelete[0].message : "" );
        if(nvl(message,null) === null && totalFilas === 0) totalFilas = -1;
        else await this.mainActivar(req,res,next)
        res.status(200).json({res:totalFilas, message});
    } catch (error) {
        log_error.error({error, mensaje:'abm empresa'});
        console.log(error);
    }
}
exports.uploadImage =  async (req, res, next) => {
    try {
      mainUpload.main(req,res,next).then(()=>{
        next();
      });    
    } catch (error) {
      log_error.error(`guardar img private in public empresa:`,error);
      next()
      res.status(400).json({res:0, mensaje:`La img no se ha guardado!!`});
    }
}

exports.mainActivar = async(req, res, next)=>{
    setTimeout(async()=>{
        try {
            const { nameImg } = req.params
            let vcod_empresa  = req.params.cod_empresa;

            const extencion    = nameImg ? nameImg.split('.') : '';
            const {cod_usuario = null, cod_funcionario = null, cod_empresa = null} = req.body.AditionalData ? req.body.AditionalData[0] : {} 

            let sql =`  select e.* 
                          from empresa  e
                             , funcionario f
                         where e.cod_funcionario =f.cod_funcionario
                           and e.cod_empresa     =${cod_empresa}  
                           and e.cod_funcionario =${cod_funcionario}
                           and f.cod_usuario 	 =${cod_usuario}
                           and f.estado          = 'S'`;
            const result = await db.Open(sql,[],res,next);

            if(result.rows && result.rows.length > 0) {
                let vdata = result.rows[0];
                const extencion    = vdata.name_img  ? vdata.name_img.split('.')[1] : '';
                let dataRow   = { empresa       : vdata.nombre        ,
                                  telefono      : vdata.telefono      ,
                                  correo        : vdata.correo        ,
                                  direccion     : vdata.direccion     ,
                                  latitud       : vdata.latitud       ,
                                  longitud      : vdata.longitud      ,
                                  descripcion   : vdata.descripcion   ,
                                  extencion_img : extencion  
                                } 
                // process.env.FILESTORE_PUBLIC+`\\${cod_empresa}\\data\\
                await copyImg.saveData(dataRow,'EMPRESA', path.join(filestorePublic,`${cod_empresa}`,'data/'));                
            }
            if(nvl(extencion,null) !== null){
                const nameSinID = extencion[0].replace(/[0-9]/g, ''); // quita cualquier numero dentro el string
                // const origen    = process.env.FILESTORE_PRIVATE+`\\${vcod_empresa}\\EMPRESA\\${extencion[0]}.${extencion[1]}`;
                // const destino   = process.env.FILESTORE_PUBLIC+`\\${vcod_empresa}\\img\\${nameSinID}.${extencion[1]}`;
                const origen    = path.join(filestorePrivate,`${vcod_empresa}`,'EMPRESA',`${extencion[0]}.${extencion[1]}`)
                const destino   = path.join(filestorePublic,`${vcod_empresa}`,'img',`${nameSinID}.${extencion[1]}`)                        
                await copyImg.copiarImagen(origen,destino);
              }
        } catch (error) {
            console.log(error)
            log_error.error(`copy activar public empresa:`,error);
            next()
        }
    },200)
}