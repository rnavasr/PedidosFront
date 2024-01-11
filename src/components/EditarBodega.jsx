import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, Select, message } from 'antd';

const { Option } = Select;

const ListarEditarBodegas = () => {
  const [bodegas, setBodegas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingBodega, setEditingBodega] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'ID de Sucursal',
      dataIndex: 'id_sucursal',
      key: 'id_sucursal',
    },
    {
      title: 'Nombre de la Bodega',
      dataIndex: 'nombrebog',
      key: 'nombrebog',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleEditar(record)}>Editar</Button>
        </Space>
      ),
    },
  ];

  const handleEditar = (record) => {
    form.setFieldsValue(record);
    setEditingBodega(record);  // No necesitas comprobar record.id aquí
    setVisible(true);
  };

  const handleCancelar = () => {
    setVisible(false);
    setEditingBodega(null);
  };

  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(`http://127.0.0.1:8000/bodega/editar/${editingBodega.id_sucursal}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.mensaje);
        setVisible(false);
        setEditingBodega(null);
        cargarBodegas();
      } else {
        const data = await response.json();
        message.error(data.error || 'Error al editar la bodega');
      }
    } catch (error) {
      console.error('Error al editar la bodega:', error);
    }
  };

  const cargarBodegas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/bodega/listar/');
      const data = await response.json();
      setBodegas(data.bodegas);
    } catch (error) {
      console.error('Error al obtener la lista de bodegas:', error);
    }
  };

  const cargarSucursales = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sucursal/sucusarleslist/');
      const data = await response.json();
      setSucursales(data.sucursales);
    } catch (error) {
      console.error('Error al obtener la lista de sucursales:', error);
    }
  };

  useEffect(() => {
    cargarBodegas();
    cargarSucursales();
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={bodegas} rowKey="id_sucursal" />
      <Modal
        title="Editar Bodega"
        visible={visible}
        onCancel={handleCancelar}
        onOk={handleGuardar}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Nombre de la Bodega" name="nombrebog">
            <Input />
          </Form.Item>
          <Form.Item label="Descripción" name="descripcion">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="ID de Sucursal" name="id_sucursal">
            <Select>
              {sucursales.map((sucursal) => (
                <Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                  {sucursal.snombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListarEditarBodegas;
