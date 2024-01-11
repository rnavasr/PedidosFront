import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form, Input, Select, InputNumber } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Item } = Form;
const { Option } = Select;

const EditarComponenteForm = () => {
  const [componentes, setComponentes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editComponente, setEditComponente] = useState({});
  const [unidadesMedida, setUnidadesMedida] = useState([]);

  useEffect(() => {
    const fetchComponentes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/producto/listarcomponentes/');
        if (response.ok) {
          const data = await response.json();
          const componentesWithDefaultCosto = data.componentes.map((componente) => ({
            ...componente,
            costo: componente.costo !== null ? componente.costo : '0.00',
          }));
          setComponentes(componentesWithDefaultCosto);
        } else {
          const errorData = await response.json();
          message.error(errorData.error);
        }
      } catch (error) {
        console.error('Error al cargar los componentes:', error);
        message.error('Hubo un error al cargar los componentes');
      }
    };

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

    fetchComponentes();
    fetchUnidadesMedida();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_componente',
      key: 'id_componente',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Costo',
      dataIndex: 'costo',
      key: 'costo',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (text) => (text === 'N' ? 'Normal' : text === 'F' ? 'Fabricado' : text),
    },
    {
      title: 'Unidad de Medida',
      dataIndex: 'nombre_um',
      key: 'nombre_um',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Editar
        </Button>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditComponente(record);
    setModalVisible(true);
  };

  const handleModalOk = async (values) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/producto/editarcomponente/${editComponente.id_componente}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: values.nombre,
          descripcion: values.descripcion,
          costo: values.costo,
          tipo: values.tipo,
          id_um: values.id_um,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.mensaje);
        setComponentes((prevComponentes) =>
          prevComponentes.map((c) =>
            c.id_componente === editComponente.id_componente ? { ...c, ...data.componente } : c
          )
        );
        setModalVisible(false);
      } else {
        message.error(data.error);
      }
    } catch (error) {
      console.error('Error al editar el componente:', error);
      message.error('Ocurrió un error al editar el componente');
    }
  };

  return (
    <div>
      <Table dataSource={componentes} columns={columns} />

      <Modal
        title="Editar Componente"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editComponente}
          onFinish={handleModalOk}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Por favor, ingrese el nombre del componente' }]}>
            <Input />
          </Item>

          <Item label="Descripción" name="descripcion" rules={[{ required: true, message: 'Por favor, ingrese la descripción del componente' }]}>
            <Input.TextArea />
          </Item>

          <Item label="Costo" name="costo" rules={[{ required: false }, { type: 'number', message: 'Por favor, ingrese un valor numérico válido para el costo' }]}>
            <InputNumber
              step={0.01}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Item>

          <Item label="Tipo" name="tipo" rules={[{ required: true, message: 'Por favor, seleccione el tipo del componente' }]}>
            <Select>
              <Option value="N">Normal</Option>
              <Option value="F">Fabricado</Option>
            </Select>
          </Item>

          <Item label="Unidad de Medida" name="id_um" rules={[{ required: true, message: 'Por favor, seleccione la unidad de medida' }]}>
            <Select>
              {unidadesMedida.map((um) => (
                <Option key={um.id_um} value={um.id_um}>
                  {um.nombre_um}
                </Option>
              ))}
            </Select>
          </Item>

          <Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Guardar Cambios
            </Button>
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditarComponenteForm;
