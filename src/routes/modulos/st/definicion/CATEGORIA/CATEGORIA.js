const express     = require('express');
const router      = express.Router();
const url_base    = '/admin/categoria' 

const lCabecera   = require('../../../../../controllers/modulos/st/definicion/CATEGORIA/listar/listarCab')
const main        = require('../../../../../controllers/modulos/st/definicion/CATEGORIA/main')
module.exports = ()=>{
  router.get ( url_base + '/idserialCab/:cod_empresa/:cod_sucursal', main.getCategoria  );
  // LISTAR CAB
  router.post( url_base + '/listar/cabecera'                       , lCabecera.main     );
  // ABM 
  router.post( url_base                                            , main.mainCategoria );
  return router;
}