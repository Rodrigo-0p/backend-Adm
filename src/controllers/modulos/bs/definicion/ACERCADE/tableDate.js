
module.exports = [
  {
    table: 'acerca_de',
    column: [ { column_name: 'cod_acercade', data_type: 'integer'           },
              { column_name: 'titulo'      , data_type: 'character varying' },
              { column_name: 'subtitulo'   , data_type: 'character varying' },
              { column_name: 'descripcion' , data_type: 'character varying' },
              { column_name: 'name_img'    , data_type: 'character varying' },
              { column_name: 'activo'      , data_type: 'character'         },
              { column_name: 'cod_empresa' , data_type: 'integer'           },
              { column_name: 'fecha_alta'  , data_type: 'timestamp'         },
              { column_name: 'usuario'     , data_type: 'character varying' },
              { column_name: 'fecha_mod'   , data_type: 'timestamp'         },
              { column_name: 'usuario_mod' , data_type: 'character varying' },              
            ],
    pk:[  {column_name: 'cod_empresa' , position: 1 },
          {column_name: 'cod_acercade', position: 2 }
        ]
  }
]