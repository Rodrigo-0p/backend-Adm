const express     = require('express');
const router      = express.Router();
const url_base    = '/admin/articulo' 

const lCabecera   = require('../../../../../controllers/modulos/st/definicion/ARTICULO/listar/listarCab');
const lDetalle    = require('../../../../../controllers/modulos/st/definicion/ARTICULO/listar/listarDet');
const lAlmacen    = require('../../../../../controllers/modulos/st/definicion/ARTICULO/listar/listarAlm');
// VALDA
const vcategoria  = require('../../../../../controllers/modulos/st/definicion/ARTICULO/validar/validaCategoria');
const vimpuesto   = require('../../../../../controllers/modulos/st/definicion/ARTICULO/validar/valiaImpuesto');
// BUSCADO
const bcategoria  = require('../../../../../controllers/modulos/st/definicion/ARTICULO/buscar/getCategoria');
const bimpuesto   = require('../../../../../controllers/modulos/st/definicion/ARTICULO/buscar/getImpuesto');
const bstockDisp  = require('../../../../../controllers/modulos/st/definicion/ARTICULO/buscar/getStockDisp');

const main        = require('../../../../../controllers/modulos/st/definicion/ARTICULO/main')
const mainUpload  = require('../../../../../controllers/upload/main')

module.exports = ()=>{
  // GET NRO AUTO
  router.get ( url_base + '/idserialCab/:cod_empresa'                              , main.getCodeCab  );
  router.get ( url_base + '/idserialDet/:cod_empresa/:cod_sucursal/:cod_articulo'  , main.getCodeDet  );
  // IMG
  router.post( url_base + '/upload/img/:nameFile/:cod_empresa/:nameImg'            , mainUpload.main  );
  // LISTAR CAB
  router.post( url_base + '/listar/cabecera'   , lCabecera.main   );
  router.post( url_base + '/listar/detalle'    , lDetalle.main    );
  router.post( url_base + '/listar/almacen'    , lAlmacen.main    );
  // VALIDA
  router.post( url_base + '/valida/categoria'  , vcategoria.main  );
  router.post( url_base + '/valida/impuesto'   , vimpuesto.main   );
  // BUSCADORES
  router.post( url_base + '/buscar/categoria'  , bcategoria.main  );
  router.post( url_base + '/buscar/impuesto'   , bimpuesto.main   );  
  router.post( url_base + '/buscar/stockDisp'  , bstockDisp.main  );  
  
  // ABM
  router.post( url_base                        , main.mainArticulo);
  
  return router;
}