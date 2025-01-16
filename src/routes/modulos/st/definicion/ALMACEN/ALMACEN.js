const express     = require('express');
const router      = express.Router();
const url_base    = '/admin/almacen';

const lcabecera   = require('../../../../../controllers/modulos/st/definicion/ALMACEN/listar/listarCab')
const main        = require('../../../../../controllers/modulos/st/definicion/ALMACEN/main')
module.exports = ()=>{
  router.get ( url_base + '/idserialCab/:cod_empresa/:cod_sucursal', main.getAlmacen  );
  // LISTAR CAB
  router.post( url_base + '/listar/cabecera'                       , lcabecera.main   );
  // ABM 
  router.post( url_base                                            , main.mainAlmacen );
  return router;
}