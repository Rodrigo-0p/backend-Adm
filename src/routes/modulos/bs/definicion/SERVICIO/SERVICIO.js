const express     = require('express');
const router      = express.Router();
const url_base    = '/admin/servicio' 
const lCabecera   = require('../../../../../controllers/modulos/bs/definicion/SERVICO/listar/listarCab')
const lDetalle    = require('../../../../../controllers/modulos/bs/definicion/SERVICO/listar/listarDet')
const main        = require('../../../../../controllers/modulos/bs/definicion/SERVICO/main')
const mainUpload  = require('../../../../../controllers/upload/main')

module.exports = ()=>{
  // LISTAR CAB
  router.post( url_base + '/listar/cabecera'                            , lCabecera.getListCab );
  router.post( url_base + '/listar/detalle'                             , lDetalle.getListDet  );
  router.get ( url_base + '/idserialCab/:cod_empresa'                   , main.getServicioCab  );
  router.get ( url_base + '/idserialDet/:cod_servicio'                  , main.getServicioDet  );
  router.post( url_base + '/upload/img/:nameFile/:cod_empresa/:nameImg' , mainUpload.main      );
  // ABM
  router.post( url_base                                                 , main.mainServicio    );
  // Activar
  router.post( url_base + '/activarForm'                                , main.mainActivar     );
  
  return router;
}