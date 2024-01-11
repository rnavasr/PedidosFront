import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Item } = Form;
const { Option } = Select;

const CrearComponenteForm = () => {
  const [loading, setLoading] = useState(false);
  const [unidadesMedida, setUnidadesMedida] = useState([]);

  useEffect(() => {
    const fetchUnidadesMedida = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/producto/listarum/');
        if (response.ok) {
          const data = await response.json();
          setUnidadesMedida(data.unidades_medida);
        } else {
          const errorData = await response.json();
          message.error(errorData.error);
        }
      } catch (error) {
        console.error('Error al cargar las unidades de medida:', error);
        message.error('Hubo un error al cargar las unidades de medida');
      }
    };

    fetchUnidadesMedida();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);

    // Verificar si el campo costo está vacío y establecerlo en 0.00 si es así
    if (values.costo === undefined || values.costo === null || values.costo === '') {
      values.costo = 0.00;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/producto/crearcomponente/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.mensaje);
      } else {
        message.error(data.error);
      }
    } catch (error) {
      message.error('Ocurrió un error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      onFinish={onFinish}
      labelCol={{ span: 2.5 }}
      wrapperCol={{ span: 16 }}
    >
      <Item
        label="Nombre"
        name="nombre"
        rules={[{ required: true, message: 'Por favor, ingrese el nombre del componente' }]}
      >
        <Input />
      </Item>

      <Item
        label="Descripción"
        name="descripcion"
        rules={[{ required: true, message: 'Por favor, ingrese la descripción del componente' }]}
      >
        <Input.TextArea />
      </Item>

      <Item
        label="Costo"
        name="costo"
        rules={[
          { required: false },
          { type: 'number', message: 'Por favor, ingrese un valor numérico válido para el costo' },
        ]}
      >
        <InputNumber
          step={0.01}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
        />
      </Item>

      <Item
        label="Tipo"
        name="tipo"
        rules={[{ required: true, message: 'Por favor, seleccione el tipo del componente' }]}
      >
        <Select>
          <Option value="N">Normal</Option>
          <Option value="F">Fabricado</Option>
        </Select>
      </Item>

      <Item
        label="Unidad de Medida"
        name="id_um"
        rules={[{ required: true, message: 'Por favor, seleccione la unidad de medida' }]}
      >
        <Select>
          {unidadesMedida.map((um) => (
            <Option key={um.id_um} value={um.id_um}>
              {um.nombre_um}
            </Option>
          ))}
        </Select>
      </Item>

      <Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
          Crear Componente
        </Button>
      </Item>
    </Form>
  );
};

export default CrearComponenteForm;
