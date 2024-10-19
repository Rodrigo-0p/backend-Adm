
module.exports = [
  {
    table: 'configuracion_cab',
    column: [ {column_name:'cod_configuracion', data_type:'integer'          },
              {column_name:'titulo'           , data_type:'character varying'},
              {column_name:'name_img'         , data_type:'character varying'},
              {column_name:'activo'           , data_type:'character varying'},
              {column_name:'cod_empresa'      , data_type:'integer'          },
              {column_name:'fecha_alta'       , data_type:'timestamp'        },
              {column_name:'usuario'          , data_type:'character varying'},
              {column_name:'fecha_mod'        , data_type:'timestamp'        },
              {column_name:'usuario_mod'      , data_type:'character varying'},
            ],
    pk:[
          {column_name: 'cod_configuracion', position: 1 },
          {column_name: 'cod_empresa'      , position: 2 }
      ]
  },
  {
    table: 'configuracion_det',
    column: [ {column_name:'nro_orden'         ,	data_type:'integer'          },
              {column_name:'cod_redes_sociales',	data_type:'integer'          },
              {column_name:'url'               ,	data_type:'character varying'},
              {column_name:'activo'            ,	data_type:'character varying'},
              {column_name:'cod_configuracion' ,	data_type:'integer'          },
              {column_name:'cod_empresa'       ,	data_type:'integer'          },
              {column_name:'fecha_mod'         ,	data_type:'timestamp'        },
              {column_name:'usuario_mod'       ,	data_type:'character varying'},
            ],
     pk: [
            {column_name: 'cod_empresa'      , position: 1 },
            {column_name: 'cod_configuracion', position: 2 },
            {column_name: 'nro_orden'        , position: 3 }
         ]
  }
]
