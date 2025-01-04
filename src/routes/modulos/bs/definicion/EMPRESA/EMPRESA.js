const express = require('express');
const router  = express.Router();
const url_base      = '/admin/empresas';
const list_cabecera = require('../../../../../controllers/modulos/bs/definicion/EMPRESA/listar/listarCab');
const main          = require('../../../../../controllers/modulos/bs/definicion/EMPRESA/main');
const mainUpload    = require('../../../../../controllers/upload/main');


module.exports = () => {
    router.post(url_base+'/cabecera'                       , list_cabecera.getListCab  );
    router.get( url_base+'/idserial/:cod_empresa'          , main.getEmpresa           );
    // router.post(url_base+'/upload/img/:nameFile/:cod_empresa/:nameImg', mainUpload.main);
    router.post( url_base + '/upload/img/:nameFile/:cod_empresa/:nameImg' , main.uploadImage, main.mainActivar);
    //abm
    router.post( url_base                                  , main.mainEmpresa          );
    router.post( url_base+'/activaForm'                    , main.mainActivar          );
    //activar
    return router;
}