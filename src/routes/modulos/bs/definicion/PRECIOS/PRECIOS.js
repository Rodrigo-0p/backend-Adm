const express     = require('express');
const router      = express.Router();
const url_base    = '/admin/precios' 

const lCabecera   = require('../../../../../controllers/modulos/bs/definicion/PRECIOS/listar/listarCab')
const lDetalle    = require('../../../../../controllers/modulos/bs/definicion/PRECIOS/listar/listarDet')
const main        = require('../../../../../controllers/modulos/bs/definicion/PRECIOS/main')
// const mainUpload  = require('../../../../../controllers/upload/main')

module.exports = ()=>{
  // LISTAR CAB
  router.post( url_base + '/listar/cabecera'                            , lCabecera.getListCab );
  router.post( url_base + '/listar/detalle'                             , lDetalle.getListDet  );
  router.post( url_base + '/upload/img/:nameFile/:cod_empresa/:nameImg' , main.uploadImage
                                                                        , main.activarImg      );
  // ABM
  router.post( url_base                                                 , main.mainPrecios     );
  // Activar

  return router;
}