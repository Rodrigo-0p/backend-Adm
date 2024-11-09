

const express     = require('express');
const router      = express.Router();

// CONFIGURACION
const configur    = require('./modulos/bs/CONFIGUR/CONFIGUR');

// BASE DEFINICION
const acercade    = require('./modulos/bs/definicion/ACERCADE/ACERCADE');
const servicio    = require('./modulos/bs/definicion/SERVICIO/SERVICIO');
const precios     = require('./modulos/bs/definicion/PRECIOS/PRECIOS'  );
const empresa     = require('./modulos/bs/definicion/EMPRESA/EMPRESA')

module.exports = ()=>{
  // ADMIN

  // CONFIGURACION
  router.use( configur() );
  // BASE DEFINICION
  router.use( acercade() );
  router.use( servicio() );
  router.use( precios()  );
  router.use( empresa()  );
  return router;
}