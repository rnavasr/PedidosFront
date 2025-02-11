import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select } from 'antd';

const { Option } = Select;

const CrearBodegaForm = () => {
  const [loading, setLoading] = useState(false);
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    // Obtener la lista de sucursales al cargar el componente
    const fetchSucursales = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/sucursal/sucusarleslist/');
        const data = await response.json();
        setSucursales(data.sucursales);
      } catch (error) {
        console.error('Error al obtener la lista de sucursales:', error);
      }
    };

    fetchSucursales();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/bodega/crear/', {
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
        message.error(data.error || 'Error al crear la bodega');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error al realizar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        label="Nombre de la Bodega"
        name="nombrebog"
        rules={[{ required: true, message: 'Por favor, ingrese el nombre de la bodega' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Descripción"
        name="descripcion"
        rules={[{ required: true, message: 'Por favor, ingrese la descripción de la bodega' }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Sucursal"
        name="id_sucursal"
        rules={[{ required: true, message: 'Selecciona la sucursal' }]}
      >
        <Select>
          {sucursales.map((sucursal) => (
            <Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
              {sucursal.snombre}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Crear Bodega
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CrearBodegaForm;
