module.exports = [
  {
    table: 'articulos',
    column: [ {column_name:'cod_articulo'   , data_type:'integer'          },
              {column_name:'descripcion'    , data_type:'character varying'},
              {column_name:'stock_minimo'   , data_type:'integer'          },
              {column_name:'inventariar'    , data_type:'character varying'},
              {column_name:'estado'         , data_type:'character varying'},
              {column_name:'codigo_barras'  , data_type:'character varying'},
              {column_name:'cod_categoria'  , data_type:'integer'          },
              {column_name:'fecha_alta'     , data_type:'timestamp'        },
              {column_name:'usuario'        , data_type:'character varying'},
              {column_name:'fecha_mod'      , data_type:'timestamp'        },
              {column_name:'usuario_mod'    , data_type:'character varying'},
              {column_name:'name_img'       , data_type:'character varying'},
              {column_name:'cod_empresa'    , data_type:'integer'          },
              {column_name:'stock_inicial'  , data_type:'integer'          },
              {column_name:'cod_sucursal'   , data_type:'integer'          },
              {column_name:'cod_impuesto'   , data_type:'integer'          },
              {column_name:'cod_almacen'    , data_type:'integer'          },              
          ],
    pk:[
          {column_name: 'cod_articulo' , position: 1 },
          {column_name: 'cod_empresa'  , position: 2 },
      ]
  },{
    table: 'unidad_medida',
    column: [ {column_name:'cod_unidad'    , data_type:'integer'           },
              {column_name:'descripcion'   , data_type:'character varying' },
              {column_name:'cod_articulo'  , data_type:'integer'           },
              {column_name:'cod_empresa'   , data_type:'integer'           },
              {column_name:'cantidad'      , data_type:'integer'           },
              {column_name:'cod_sucursal'  , data_type:'integer'           }
            ],
    pk:[
          {column_name: 'cod_empresa'  , position: 1 },
          {column_name: 'cod_unidad'   , position: 2 },
          {column_name: 'cod_articulo' , position: 3 },
          {column_name: 'cod_sucursal' , position: 4 },
      ]
  },{
    table: 'articulo_almacen',
    column: [ {column_name:'cod_empresa'   , data_type:'integer'          },
              {column_name:'cod_sucursal'  , data_type:'integer'          },
              {column_name:'cod_articulo'  , data_type:'integer'          },
              {column_name:'cod_almacen'   , data_type:'integer'          },
              {column_name:'cod_proveedor' , data_type:'integer'          },              
              {column_name:'usuario'       , data_type:'character varying'},
              {column_name:'fecha_alta'    , data_type:'timestamp'        },
              {column_name:'usuario_mod'   , data_type:'character varying'},
              {column_name:'fecha_mod'     , data_type:'timestamp'        },
            ],
    pk:[
          {column_name: 'cod_empresa'  , position: 1 },
          {column_name: 'cod_sucursal' , position: 2 },
          {column_name: 'cod_articulo' , position: 3 },
          {column_name: 'cod_almacen'  , position: 4 },
      ]
  }
]