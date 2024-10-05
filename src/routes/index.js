

const express        = require('express');
const router         = express.Router();
// const upload      = require('./modulos/upload');

// BASE DEFINICION
const acercade    = require('./modulos/bs/definicion/ACERCADE/ACERCADE');
const servicio    = require('./modulos/bs/definicion/SERVICIO/SERVICIO');
const precios     = require('./modulos/bs/definicion/PRECIOS/PRECIOS'  );

module.exports = ()=>{
  // ADMIN

  // BASE DEFINICION
  router.use( acercade() );
  router.use( servicio() );
  router.use( precios()  );
  
  return router;
}