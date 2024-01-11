import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';

const EditarBodegaForm = () => {
    const [bodegas, setBodegas] = useState([]);
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
        setEditingBodega(record.id ? record : null);  // Asegurémonos de que record tiene un ID válido
        setVisible(true);
    };

    const handleCancelar = () => {
        setVisible(false);
        setEditingBodega(null);
    };

    const handleGuardar = async () => {
        try {
            if (!editingBodega) {
                console.error('No se ha seleccionado ninguna bodega para editar.');
                return;
            }

            const values = await form.validateFields();
            const response = await fetch(`http://127.0.0.1:8000/bodega/editarBodega/${editingBodega.id}/`, {
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
            const response = await fetch('http://127.0.0.1:8000/bodega/listarBodega/');
            const data = await response.json();
            setBodegas(data.bodegas);
        } catch (error) {
            console.error('Error al obtener la lista de bodegas:', error);
        }
    };

    useEffect(() => {
        cargarBodegas();
    }, []);

    return (
        <div>
            <Table columns={columns} dataSource={bodegas} rowKey="id" />
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
                </Form>
            </Modal>
        </div>
    );
};

export default EditarBodegaForm;
