import React, { useState } from 'react';
import { Form, Input, Button, Alert, Select, message } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import '../login.css';

const { Option } = Select;

const RegistroForm = () => {
    const [showOptionalFields, setShowOptionalFields] = useState(false);

    const showError = (errorMessage) => {
        message.error({
            content: errorMessage,
        });
    };


    const toggleOptionalFields = () => {
        setShowOptionalFields(!showOptionalFields);
    };
    const onFinish = async (values) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/Login/crear/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreusuario: values.username,
                    contrasenia: values.password,
                    ctelefono: values.phone,
                    crazon_social: values.rsocial,
                    tipocliente: values.docu,
                    snombre: values.sname,
                    capellido: values.lastname,
                    ruc_cedula: values.doc,
                    correorecuperacion: values.email,
                    ubicacion: values.adress,
                }),
            });

            const data = await response.json();
            console.log("aqui a 1 " + data); // Verifica si el token está presente en la respuesta

            if (response.ok) {
                console.log("uwu");
            } else {
                // Manejar errores de inicio de sesión
                const errorMessage = data && data.message ? data.message : 'Error desconocido';
                showError(errorMessage);
            }
        } catch (error) {
            showError('Error en la solicitud de inicio de sesión');
            console.error('Error en la solicitud de inicio de sesión:', error);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        showError('Por favor, completa todos los campos correctamente');
    };


    return (

        <Form
            name="registroForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="login-form-container"
        >



            <h2 className="login-form-title">Registrate</h2>

            {/* Campos obligatorios */}



            <Form.Item
                label="Usuario"
                name="username"
                rules={[{ required: true, message: 'Por favor, ingresa un nombre de usuario' },
                { max: 300, message: 'El nombre de usuario no puede tener más de 300 caracteres' },
                {
                    validator: async (_, value) => {
                        try {
                            const response = await fetch('http://127.0.0.1:8000/Login/cuentaexist/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    nombreusuario: value,
                                }),
                            });
        
                            const data = await response.json();
        
                            if (data.mensaje === '1') {
                                throw new Error('El nombre de usuario ya está en uso');
                            }
                        } catch (error) {
                            throw error.message;
                        }
                    },
                },
                ]}
            >
                <Input prefix={<UserOutlined />} placeholder="Usuario" />
            </Form.Item>

            <Form.Item
                label="Telefono"
                name="phone"
                rules={[{ required: true, message: 'Por favor, ingresa su numero de telefono' },
                { max: 300, message: 'El número de teléfono no puede tener más de 300 caracteres' },
                {
                    pattern: /^[0-9]+$/, // Expresión regular que permite solo números
                    message: 'Por favor, ingresa solo números en el teléfono',
                },
                {
                    validator: async (_, value) => {
                        try {
                            const response = await fetch('http://127.0.0.1:8000/Login/phoneExist/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    ctelefono: value,
                                }),
                            });
        
                            const data = await response.json();
        
                            if (data.mensaje === '1') {
                                throw new Error('El número de telefono ya está registrado');
                            }
                        } catch (error) {
                            throw error.message;
                        }
                    },
                },
        
                ]}
            >
                <Input placeholder="Telefono" />
            </Form.Item>

            <Form.Item
                label="Contraseña"
                name="password"
                rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' },
                { max: 20, message: 'La contraseña no puede tener más de 20 caracteres' },
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },]}
            >
                <Input.Password placeholder="Contraseña" />
            </Form.Item>

            <Form.Item
                label="Repite tu contraseña"
                name="repeat_password"
                rules={[{ required: true, message: 'Por favor, repite tu contraseña' },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        const password = getFieldValue('password');
                        if (password && password !== value) {
                            return Promise.reject('Las contraseñas no coinciden');
                        }
                        return Promise.resolve();
                    },
                }),
                ]}
            >
                <Input.Password placeholder="Repite contraseña" />
            </Form.Item>

            <Form.Item>
                <Button type="default" onClick={toggleOptionalFields} className="login-form-button">
                    {showOptionalFields ? 'Ocultar campos opcionales' : 'Mostrar campos opcionales'}
                </Button>
            </Form.Item>

            {showOptionalFields && (
                <>
                    <Form.Item
                        label="Razón social"
                        name="rsocial"
                        rules={[
                            { max: 300, message: 'La razón social no puede tener más de 300 caracteres' }
                        ]}
                    >
                        <Input placeholder="Razón Social" />
                    </Form.Item>

                    <Form.Item
                        label="Nombre"
                        name="sname"
                        rules={[
                            { max: 300, message: 'La razón social no puede tener más de 300 caracteres' }
                        ]}
                    >
                        <Input placeholder="Nombre" />
                    </Form.Item>

                    <Form.Item
                        label="Apellido"
                        name="lastname"
                        rules={[
                            { max: 300, message: 'El apellido no puede tener más de 300 caracteres' }
                        ]}
                    >
                        <Input placeholder="Apellido" />
                    </Form.Item>

                    <Form.Item
                        label="T. de documento:"
                        name="docu"
                    >
                        <Select placeholder="Selecciona">
                            <Option value="04">RUC</Option>
                            <Option value="05">Cedula</Option>
                            <Option value="06">Pasaporte</Option>
                            <Option value="07">Idt. del exterior</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Documento"
                        name="doc"
                        rules={[
                            { max: 300, message: 'El documento no puede tener más de 300 caracteres' },
                            {
                                pattern: /^[0-9]+$/, // Expresión regular que permite solo números
                                message: 'Por favor, ingresa solo números en el documento',
                            },
                            {
                                validator: async (_, value) => {
                                    try {
                                        const response = await fetch('http://127.0.0.1:8000/Login/DocumentExist/', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                ruc_cedula: value,
                                            }),
                                        });
                    
                                        const data = await response.json();
                    
                                        if (data.mensaje === '1') {
                                            throw new Error('El documento de identidad ya está registrado');
                                        }
                                    } catch (error) {
                                        throw error.message;
                                    }
                                },
                            },
                    
                        ]}
                    >
                        <Input placeholder="Documento" />
                    </Form.Item>



                    <Form.Item
                        label="Correo electronico"
                        name="email"
                        rules={[
                            { type: 'email', message: 'Por favor, ingresa un correo electrónico válido' },
                            { max: 300, message: 'El correo no puede tener más de 20 caracteres' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Correo electrónico" />
                    </Form.Item>

                    <Form.Item
                        label="Dirección"
                        name="adress"
                        rules={[
                            { max: 300, message: 'El dirección no puede tener más de 300 caracteres' }
                        ]}
                    >
                        <Input placeholder="Dirección" />
                    </Form.Item>
                </>
            )}

            <Form.Item>
                <Button type="primary" htmlType="submit" className="register-form-button">
                    Registrarse
                </Button>
            </Form.Item>

            <Form.Item>
                <Link to={'/'}>
                <Button type="default" htmlType="button" className="login-form-button">
                    Iniciar sesión
                </Button>
                </Link>
            </Form.Item>

            <Alert
                message="¿Ya tienes una cuenta? Inicia sesión para disfrutar de nuestros productos."
                type="info"
                showIcon
                style={{ marginTop: '10px' }}
            />
        </Form>
    );
};

export default RegistroForm;