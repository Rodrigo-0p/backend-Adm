
module.exports = [
  {
    table: 'servicioscab',
    column: [ { column_name: 'cod_servicio'           , data_type: 'integer'           },
              { column_name: 'titulo'                 , data_type: 'character varying' },
              { column_name: 'descripcion'            , data_type: 'character varying' },
              { column_name: 'name_img'               , data_type: 'character varying' },
              { column_name: 'cod_empresa'            , data_type: 'integer'           },
              { column_name: 'activo'                 , data_type: 'character'         },
              { column_name: 'titulo_precios'         , data_type: 'character varying' },
              { column_name: 'name_img_precios'       , data_type: 'character varying' },
              { column_name: 'name_img_fondo_precios' , data_type: 'character varying' },
              { column_name: 'usuario'                , data_type: 'character varying' },
              { column_name: 'fecha_alta'             , data_type: 'timestamp'         },
              { column_name: 'fecha_mod'              , data_type: 'timestamp'         },
              { column_name: 'usuario_mod'            , data_type: 'character varying' },
            ],
    pk:[{ column_name: 'cod_servicio', position: 1 }]
  },
  {
    table: 'serviciosdet',
    column: [ { column_name: 'nro_orden'   , data_type: 'integer'           },
              { column_name: 'titulo'      , data_type: 'character varying' },
              { column_name: 'descripcion' , data_type: 'character varying' },
              { column_name: 'cod_servicio', data_type: 'character varying' },
              { column_name: 'precios'     , data_type: 'float varying'     },
              { column_name: 'indpromo'    , data_type: 'character varying' },
              { column_name: 'fecha_mod'   , data_type: 'timestamp'         },
              { column_name: 'usuario_mod' , data_type: 'character varying' },
              { column_name: 'fecha_alta'  , data_type: 'timestamp'         },
              { column_name: 'usuario'     , data_type: 'character varying' },
            ],
    pk:[{ column_name: 'nro_orden'         , position: 1 },
        { column_name: 'cod_servicio', position: 2 }
        ]
  }
]