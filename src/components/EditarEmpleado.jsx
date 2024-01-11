import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const EditarBodegaForm = () => {
  const [bodegas, setBodegas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [editingBodega, setEditingBodega] = useState(null);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseBodegas = await fetch('http://127.0.0.1:8000/bodega/listar/');
        const responseSucursales = await fetch('http://127.0.0.1:8000/sucursal/sucusarleslist/');

        if (!responseBodegas.ok || !responseSucursales.ok) {
          throw new Error('Error fetching data');
        }

        const dataBodegas = await responseBodegas.json();
        const dataSucursales = await responseSucursales.json();

        setBodegas(dataBodegas.bodegas);
        setSucursales(dataSucursales.sucursales);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (record) => {
    setEditingBodega(record);
    form.setFieldsValue({
      nombrebog: record.nombrebog,
      descripcion: record.descripcion,
      id_sucursal: record.id_sucursal,
    });
    setVisible(true);
  };

  const handleCancel = () => {
    setEditingBodega(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/bodega/editar/${editingBodega.id_bodega}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error updating bodega');
      }

      setVisible(false);
      const fetchData = async () => {
        try {
          const responseBodegas = await fetch('http://127.0.0.1:8000/bodega/listar/');

          if (!responseBodegas.ok) {
            throw new Error('Error fetching bodegas');
          }

          const dataBodegas = await responseBodegas.json();
          setBodegas(dataBodegas.bodegas);
        } catch (error) {
          console.error('Error fetching bodegas:', error);
        }
      };

      fetchData();
    } catch (error) {
      console.error('Error updating bodega:', error);
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombrebog',
      key: 'nombrebog',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Sucursal',
      dataIndex: 'id_sucursal',
      key: 'id_sucursal',
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Editar</Button>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={bodegas} columns={columns} />
      <Modal
        title="Editar Bodega"
        visible={visible}
        onCancel={handleCancel}
        onOk={form.submit}
      >
        <Form
          form={form}
          onFinish={handleSave}
          initialValues={{
            nombrebog: editingBodega?.nombrebog,
            descripcion: editingBodega?.descripcion,
            id_sucursal: editingBodega?.id_sucursal,
          }}
        >
          <Form.Item label="Nombre" name="nombrebog">
            <Input />
          </Form.Item>
          <Form.Item label="Descripción" name="descripcion">
            <Input />
          </Form.Item>
          <Form.Item label="Sucursal" name="id_sucursal">
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

export default EditarBodegaForm;
