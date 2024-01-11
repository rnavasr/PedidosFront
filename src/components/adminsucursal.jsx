import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Table, Select, Switch, message, Modal, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import MapaActual from './mapaactual';
import EditarEmpleado from './EditarEmpleado';
import CrearHorariosSemanales from './crearhorarioS';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

const AdminSucursal = ({ idsucursalx }) => {
    const [form] = Form.useForm();
    const [sucursalData, setSucursalData] = useState(null);
    const [ids, setID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [valorb, setvalor] = useState('Agregar horario');
    const [fileList, setFileList] = useState([]);
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const [mostrarComponenteB, setMostrarComponenteB] = useState(false);
    const [horarioDetails, setHorarioDetails] = useState([]);

    const handleHorarioClick = () => {
        if (mostrarComponenteB) {
            setMostrarComponenteB(false);
            setvalor('Agregar horario')
        } else { setMostrarComponenteB(true); setvalor('Cancelar'); }

    };
    const handleHorarioCreate = async (jsonHorario) => {
        try {
            const formData = await form.validateFields();
            const { nombreh, hordescripcion } = formData;
    
            const formDataObject = new FormData();
            console.log(JSON.stringify(jsonHorario));
            console.log(nombreh);
            formDataObject.append('nombreh', nombreh);
            formDataObject.append('hordescripcion', hordescripcion);
    
            formDataObject.append('detalle', JSON.stringify(jsonHorario));
            formDataObject.append('idsucursal', idsucursalx);
    
            const response = await fetch('http://127.0.0.1:8000/horarios/CrearHorarioSucursal/', {
                method: 'POST',
                body: formDataObject,
            });
    
            const responseData = await response.json();
    
            if (responseData.mensaje) {
                message.success(responseData.mensaje);
                fetchData();
                handleHorarioClick();

            } else {
                message.error('Error al crear el horario');
            }
        } catch (error) {
            message.error('Error al validar el formulario');
        }
    };

    useEffect(() => {

        fetchData();
    }, [idsucursalx]);

    const fetchHorarioDetails = async (idHorario) => {
        try {
            console.log(idHorario);
            const response = await fetch('http://127.0.0.1:8000/horarios/get/'+idHorario);
            const data = await response.json();

            if (data.detalles) {
                console.log(data.detalles);
                setHorarioDetails(data.detalles);
            } else {
                console.error('No se encontraron detalles del horario');
            }
        } catch (error) {
            console.error('Error al obtener los detalles del horario:', error);
            message.error('Error al obtener los detalles del horario');
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/sucursal/cargarSucursal/${idsucursalx}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const data = await response.json();
            if (data.mensaje && data.mensaje.length > 0) {

                setLoading(false);
                setSucursalData(data.mensaje[0]);

            } else {
                console.error('No se encontraron datos de la sucursal');
                setLoading(false);
            }
            fetchHorarioDetails(data.mensaje[0].id_horarios);
            setFileList([
                {
                    uid: '-1',
                    name: 'imagen',
                    status: 'done',
                    url: data.mensaje[0]?.imagensucursal
                        ? `data:image/png;base64,${data.mensaje[0].imagensucursal}`
                        : null,
                },
            ]);

            form.setFieldsValue(data.mensaje[0]);
        } catch (error) {
            console.error('Error al obtener los datos de la sucursal:', error);
            setLoading(false);
        }
    };

    const handleSwitchChange = (checked) => {
        const formData = new FormData();
        formData.append('id_sucursal', idsucursalx);
        formData.append('sestado', checked ? '1' : '0');

        fetch('http://127.0.0.1:8000/sucursal/actsucursal/', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                message.success('Actualizando...');
                console.log('Respuesta de la API:', data);
                fetchData();
            })
            .catch((error) => {
                console.error('Error al enviar la solicitud POST:', error);
            });
    };

    const handleGuardarClick = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            formData.append('id_sucursal', idsucursalx);
            formData.append('razonsocial', values.srazon_social);
            formData.append('sruc', values.sruc);
            formData.append('capacidad', values.scapacidad);
            formData.append('scorreo', values.scorreo);
            formData.append('ctelefono', values.stelefono);
            formData.append('sdireccion', values.sdireccion);
            formData.append('snombre', values.snombre);

            if (values.imagensucursal.fileList) {

                formData.append('imagensucursal', fileList[0].originFileObj);
            } else {
                console.error('Tipo de archivo no válido');
                // Puedes mostrar un mensaje de error o tomar otras acciones apropiadas.
            }
            const response = await fetch('http://127.0.0.1:8000/sucursal/EditarSucursal/' + idsucursalx, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            message.success(data.mensaje);
            fetchData();
        } catch (error) {
            console.error('Error al guardar los datos:', error);
        }
    };

    const handleSaveUbicacion = (latitud, longitud) => {
        Modal.confirm({
            title: 'Confirmar',
            content: '¿Estás seguro de que deseas actualizar la ubicación de esta sucursal?',
            onOk() {
                const formData = new FormData();
                formData.append('id_sucursal', idsucursalx);
                formData.append('latitud', latitud);
                formData.append('longitud', longitud);

                fetch('http://127.0.0.1:8000/sucursal/editarubicacion/', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => {
                        fetchData();
                        message.success('Ubicación actualizada con éxito');
                        console.log('Respuesta de la API:', data);
                        fetchData();
                    })
                    .catch(error => {
                        console.error('Error al enviar la solicitud POST:', error);
                        message.error('Error al actualizar la ubicación')
                    });
            },
            onCancel() {
                message.success('Actualización de ubicación cancelada');
            },
        });
    };

    const onFinish = (values) => {
        console.log('Valores del formulario:', values);
    };

    const renderFormItems = () => {
        if (loading) {
            return null;
        }

        return [
            {
                key: '1',
                Datos: 'Nombre*',
                Valor: <Form.Item name="snombre" rules={[
                    { max: 300, message: 'Maximo de caracteres' },
                    { required: true, message: 'Por favor, ingrese un nombre de sucursal' }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '2',
                Datos: 'Razón social*',
                Valor: <Form.Item name="srazon_social" rules={[{ required: true, message: 'Por favor, ingrese una razón social' },
                { max: 300, message: 'Maximo de caracteres' }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '3',
                Datos: 'Ruc*',
                Valor: <Form.Item name="sruc" rules={[{ required: true, message: 'Por favor, ingrese un RUC' },
                { max: 20, message: 'Maximo de caracteres' },
                {
                    pattern: /^[0-9]+$/,
                    message: 'Por favor, ingrese solo caracteres numéricos.',
                }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '4',
                Datos: 'Capacidad*',
                Valor: <Form.Item name="scapacidad" rules={[{ required: true, message: 'Por favor, seleccione una capacidad' },
                ]}>
                    <Select>
                        <Option value="P">Principal</Option>
                        <Option value="S">Secundaria</Option>
                    </Select>
                </Form.Item>,
            },
            {
                key: '5',
                Datos: 'Correo*',
                Valor: <Form.Item name="scorreo" rules={[{ required: true, message: 'Por favor, ingrese un correo' },
                { max: 300, message: 'Maximo de caracteres' }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '6',
                Datos: 'Telefono',
                Valor: <Form.Item name="stelefono" rules={[
                    { max: 300, message: 'Maximo de caracteres' },
                    {
                        pattern: /^[0-9]+$/,
                        message: 'Por favor, ingrese solo caracteres numéricos.',
                    }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '7',
                Datos: 'Direccion*',
                Valor: <Form.Item name="sdireccion" rules={[
                    { max: 300, message: 'Maximo de caracteres' },
                    { required: true, message: 'Por favor, ingrese una dirección' }
                ]}>
                    <Input />
                </Form.Item>,
            },
            {
                key: '8',
                Datos: 'Imagen*',
                Valor: <Form.Item name="imagensucursal" valuePropName="file">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={() => false}
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                </Form.Item>,
            },
        ];
    };


    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Subir</div>
        </div>
    );

    const columns = [
        { title: 'Datos', dataIndex: 'Datos', key: 'Datos' },
        {
            title: 'Valor',
            dataIndex: 'Valor',
            key: 'Valor',
            render: (text) => <span>{text}</span>,
        },
    ];

    return (
        <>

            <h1>Datos Generales</h1>
            <div style={{ display: 'flex', padding: '2px' }}>
                <div style={{ flex: 1, marginRight: '20px', padding: '2px' }}>

                    <Form form={form} name="adminSucursalForm" onFinish={onFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        <Table columns={columns} dataSource={renderFormItems()} pagination={false} size="middle" bordered />

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit" onClick={handleGuardarClick}>
                                Guardar
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div style={{ flex: 1, marginRight: '20px', padding: '2px' }}>
                    <div style={{ flex: 1, marginRight: '20px', padding: '2px' }}>
                        <Table
                            columns={[
                                { title: 'Estado', dataIndex: 'Estado', key: 'Estado' },
                            ]}
                            dataSource={[
                                {
                                    title: 'Estado',
                                    dataIndex: 'Estado',
                                    key: 'Estado',
                                    Estado:
                                        <Switch
                                            defaultChecked={sucursalData && sucursalData.sestado === '1'}
                                            checked={sucursalData && sucursalData.sestado === '1'}
                                            onChange={(checked) => handleSwitchChange(checked)}
                                        />
                                },
                            ]}
                            pagination={false}
                            size="middle"
                            bordered
                        />
                    </div>
                    <div style={{ flex: 1, marginRight: '20px', padding: '2px' }}>

                    </div>
                    <div >
                        <Table
                            columns={[
                                { title: 'Ubicacion', dataIndex: 'Ubicacion', key: 'Ubicacion' },
                            ]}
                            dataSource={[
                                {
                                    title: 'Ubicacion',
                                    dataIndex: 'Ubicacion',
                                    key: 'Ubicacion',
                                    Ubicacion: sucursalData ? (
                                        <MapaActual
                                            latitud={sucursalData.id_ubicacion.latitud}
                                            longitud={sucursalData.id_ubicacion.longitud}
                                            onSaveCoordinates={handleSaveUbicacion}
                                        />
                                    ) : (
                                        <div>
                                            <MapaActual
                                                onSaveCoordinates={handleSaveUbicacion}
                                            />
                                            <p>No hay ubicación agregada. Selecciona tu ubicación.</p>
                                        </div>
                                    ),
                                },
                            ]}
                            pagination={false}
                            size="middle"
                            bordered
                        />
                    </div>

                </div>

            </div>
            <div>
                <Table
                    columns={[
                        { title: 'Empleados', dataIndex: 'Empleados', key: 'Empleados' },
                    ]}
                    dataSource={[
                        {
                            title: 'Empleados',
                            dataIndex: 'Empleados',
                            key: 'Empleados',
                            Empleados: idsucursalx ? (
                                <EditarEmpleado idsucur={idsucursalx} />
                            ) : (
                                <div>
                                    <EditarEmpleado idsucur={idsucursalx} />
                                </div>
                            ),
                        },
                    ]}
                    pagination={false}
                    size="middle"
                    bordered
                />
            </div>
            <div>
                <h1>Horarios</h1>
                <Table
                columns={[
                    { title: 'Día', dataIndex: 'dia', key: 'dia' },
                    { title: 'Hora Inicio', dataIndex: 'hora_inicio', key: 'hora_inicio' },
                    { title: 'Hora Fin', dataIndex: 'hora_fin', key: 'hora_fin' },
                ]}
                dataSource={horarioDetails}
                pagination={false}
                size="middle"
                bordered
            />
                <Button onClick={handleHorarioClick}>{valorb}</Button>
                {mostrarComponenteB && <div>
                    <Form form={form}  layout="vertical">
                        <Form.Item
                            label="Nombre del horario"
                            name="nombreh"
                            rules={[{ required: true, message: 'Agrega un nombre al horario' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Descripcion del horario"
                            name="hordescripcion"
                        >
                            <TextArea />
                        </Form.Item>
                    </Form>
                    <CrearHorariosSemanales onHorarioCreate={handleHorarioCreate}/>
                </div>}

            </div>
        </>
    );
};

export default AdminSucursal;