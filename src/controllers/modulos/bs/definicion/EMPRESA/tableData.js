module.exports =[
    {
        table:'empresa',  
        column : [
            { column_name: 'cod_funcionario',  data_type: 'integer'                    },
            { column_name: 'cod_usuario'    ,  data_type: 'integer'                    },
            { column_name: 'fecha_alta'     ,  data_type: 'timestamp without time zone'},
            { column_name: 'cod_empresa'    ,  data_type: 'integer'                    },
            { column_name: 'tipo_empresa'   ,  data_type: 'character varying'          },
            { column_name: 'ruc'            ,  data_type: 'character varying'          },
            { column_name: 'direccion'      ,  data_type: 'character varying'          },
            { column_name: 'telefono'       ,  data_type: 'character varying'          },
            { column_name: 'correo'         ,  data_type: 'character varying'          },
            { column_name: 'timbrado'       ,  data_type: 'character varying'          },
            { column_name: 'name_img'       ,  data_type: 'character varying'          },
            { column_name: 'latitud'        ,  data_type: 'character varying'          },
            { column_name: 'longitud'       ,  data_type: 'character varying'          },
            { column_name: 'nombre'         ,  data_type: 'character varying'          },
            { column_name: 'descripcion'    ,  data_type: 'character varying'          },
            { column_name: 'activo'         ,  data_type: 'character varying'          },
            { column_name: 'usuario'        ,  data_type: 'character varying'          },
            { column_name: 'fecha_mod'      ,  data_type: 'timestamp'                  },
            { column_name: 'usuario_mod'    ,  data_type: 'character varying'          },              
                ],
        pk : [ { column_name: 'cod_empresa', position: 1} ]
    },

]

    