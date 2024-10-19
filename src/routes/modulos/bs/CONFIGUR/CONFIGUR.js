const express     = require('express');
const router      = express.Router();
const url_base    = '/admin/configur' 

// LISTAR
const lCabecera   = require('../../../../controllers/modulos/bs/CONFIGUR/listar/listarCab');
const lDetalle    = require('../../../../controllers/modulos/bs/CONFIGUR/listar/listarDet');
// BUSCAR
const bRedesSoc   = require('../../../../controllers/modulos/bs/CONFIGUR/buscar/getRedes');
// VALIDAR

const vRedesSoc   = require('../../../../controllers/modulos/bs/CONFIGUR/validar/validaRedes');
const main        = require('../../../../controllers/modulos/bs/CONFIGUR/main')
const mainUpload  = require('../../../../controllers/upload/main')


module.exports = ()=>{
  // GET NRO AUTO
  router.get ( url_base + '/idserialCab/:cod_empresa'                     , main.getConfigurCab  );
  router.get ( url_base + '/idserialDet/:cod_empresa/:cod_configuracion'  , main.getConfigurDet  );
  router.post( url_base + '/upload/img/:nameFile/:cod_empresa/:nameImg'   , mainUpload.main      );
  // LISTAR CAB
  router.post( url_base + '/listar/cabecera'  , lCabecera.main   );
  router.post( url_base + '/listar/detalle'   , lDetalle.main    );
  // BUSCAR
  router.post( url_base + '/buscar/resdes'    , bRedesSoc.main   );
  // VALIDA
  router.post( url_base + '/validar/resdes'   , vRedesSoc.main   );
  // ABM
  router.post( url_base                       , main.mainConfigur);
  // Activar
  router.post( url_base + '/activarForm'      , main.mainActivar );
  
  
  return router;
}