module.exports = [{
    table: 'categoria',
    column: [ {column_name:'cod_categoria' , data_type:'integer'          },
              {column_name:'descripcion'   , data_type:'character varying'},
              {column_name:'estado'        , data_type:'character varying'},
              {column_name:'fecha_alta'    , data_type:'timestamp'        },
              {column_name:'fecha_mod'     , data_type:'timestamp'        },
              {column_name:'usuario_alta'  , data_type:'character varying'},
              {column_name:'usuario_mod'   , data_type:'character varying'},
              {column_name:'cod_empresa'   , data_type:'integer'          },
              {column_name:'cod_sucursal'  , data_type:'integer'          },
            ],
    pk:[
        {column_name: 'cod_categoria' , position: 1 },
        {column_name: 'cod_empresa'   , position: 2 },
        {column_name: 'cod_sucursal'  , position: 3 },
      ]
  }]
