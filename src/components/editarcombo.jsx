import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Modal, Form, Input, Button, message, Select } from 'antd';

const EditarCombo = () => {
  const [combos, setCombos] = useState(null);
  const [categoriasCombos, setCategoriasCombos] = useState(null);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const responseCombos = await fetch('http://127.0.0.1:8000/combos/ver_combos/');
        if (!responseCombos.ok) {
          throw new Error('Error fetching combos');
        }
        const dataCombos = await responseCombos.json();
        setCombos(dataCombos.combos);
      } catch (error) {
        console.error('Error fetching combos:', error);
      }
    };

    const fetchCategoriasCombos = async () => {
      try {
        const responseCategoriasCombos = await fetch('http://127.0.0.1:8000/combos/listcategoria/');
        if (!responseCategoriasCombos.ok) {
          throw new Error('Error fetching categorias combos');
        }
        const dataCategoriasCombos = await responseCategoriasCombos.json();
        setCategoriasCombos(dataCategoriasCombos.categorias_combos);
      } catch (error) {
        console.error('Error fetching categorias combos:', error);
      }
    };

    fetchCombos();
    fetchCategoriasCombos();
  }, []);

  const handleComboClick = (combo) => {
    setSelectedCombo(combo);
    form.setFieldsValue(combo);
  };

  const handleCloseModal = () => {
    setSelectedCombo(null);
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('id_catcombo', values.id_catcombo);
      formData.append('puntoscb', values.puntoscb);
      formData.append('nombrecb', values.nombrecb);
      formData.append('descripcioncombo', values.descripcioncombo);
      formData.append('preciounitario', values.preciounitario);

      const response = await fetch(`http://127.0.0.1:8000/combos/editarcombo/${selectedCombo.id_combo}/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al editar combo');
      }

      message.success('Combo editado con éxito');
      // Actualizar la lista de combos después de la edición
      fetchCombos();
      handleCloseModal();

    } catch (error) {
      console.error('Error al editar combo:', error);
      message.error('Error al editar combo');
    }
  };

  const fetchCombos = async () => {
    try {
      const responseCombos = await fetch('http://127.0.0.1:8000/combos/ver_combos/');
      if (!responseCombos.ok) {
        throw new Error('Error fetching combos');
      }
      const dataCombos = await responseCombos.json();
      setCombos(dataCombos.combos);
    } catch (error) {
      console.error('Error fetching combos:', error);
    }
  };

  return (
    <div>
      <Row gutter={16}>
        {combos &&
          combos.map((combo, index) => (
            <Col span={8} key={index}>
              <Card
                style={{ marginBottom: '16px', cursor: 'pointer' }}
                onClick={() => handleComboClick(combo)}
              >
                <Card.Meta
                  avatar={<Avatar src={`data:image/jpeg;base64,${combo.imagen}`} size={100} />}
                  title={combo.nombrecb}
                  description={`Descripción: ${combo.descripcioncombo}\nPrecio Unitario: $${combo.preciounitario}`}
                />
              </Card>
            </Col>
          ))}
      </Row>
      <Modal
        title={`Editar Combo - ${selectedCombo ? selectedCombo.nombrecb : ''}`}
        visible={!!selectedCombo}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedCombo && (
          <Form
            form={form}
            name="editarComboForm"
            onFinish={onFinish}
            initialValues={selectedCombo}
          >
            <Form.Item
              label="Nombre del Combo"
              name="nombrecb"
              rules={[{ required: true, message: 'Ingrese el nombre del combo' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Puntos del Combo"
              name="puntoscb"
              rules={[{ required: true, message: 'Ingrese los puntos del combo' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Descripción del Combo"
              name="descripcioncombo"
              rules={[{ required: true, message: 'Ingrese la descripción del combo' }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Precio Unitario"
              name="preciounitario"
              rules={[{ required: true, message: 'Ingrese el precio unitario del combo' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Categoría del Combo"
              name="id_catcombo"
              rules={[{ required: true, message: 'Seleccione la categoría del combo' }]}
            >
              <Select placeholder="Seleccione una categoría">
                {categoriasCombos &&
                  categoriasCombos.map((categoria) => (
                    <Select.Option key={categoria.id_catcombo} value={categoria.id_catcombo}>
                      {categoria.catnombre}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar Cambios
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};
export default EditarCombo;