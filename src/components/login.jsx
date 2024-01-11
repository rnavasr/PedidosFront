
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { Link } from 'react-router-dom';
import '../login.css';

const LoginForm = ({ onLogin }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pedidosbak-production.up.railway.app/Login/rol/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: localStorage.getItem('token'), // Obtener el token almacenado
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rol = data.rol;

          // Puedes realizar acciones con el rol recibido si es necesario

          // Ejemplo de redirección basada en el rol
          if (rol === 'S') {
            window.location.href = '/home';
          }
        } else {
          // Manejar errores de la solicitud a la API
          console.log('error');
        }
      } catch (error) {
        // Manejar errores de la solicitud
        console.error('Error en la solicitud:', error);
      }
    };

    // Llamar a la función fetchData al cargar el componente
    fetchData();
  }, []);
  const onFinish = async (values) => {
    try {
      // Realizar la solicitud a la API para iniciar sesión
      const response = await fetch('https://pedidosbak-production.up.railway.app/Login/iniciar_sesion/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreusuario: values.username,
          contrasenia: values.password,
        }),
      });

      const data = await response.json();
      console.log(data); // Verifica si el token está presente en la respuesta

      if (response.ok) {
        const token = data.token;
        console.log('Token almacenado:', token);

        localStorage.setItem('token', token);
        setTimeout(() => {
          localStorage.removeItem('token');
          console.log('Token eliminado después de 24 horas.');
        }, 24 * 60 * 60 * 1000);
        onLogin(data);
      } else {
        // Manejar errores de inicio de sesión
        console.error('Error en inicio de sesión:', data.mensaje);
        message.error(data.mensaje);
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  

  return (
    <Form
      name="loginForm"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="login-form-container"
    >
      <h2 className="login-form-title">Inicio de Sesión</h2>

      <Form.Item
        label="Usuario"
        name="username"
        rules={[{ required: true, message: 'Por favor, ingresa tu usuario' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="password"
        rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Iniciar sesión
        </Button>
      </Form.Item>

      {/* Nuevo botón para registro */}
      <Form.Item>
        <Link to={'/registro'}>
          <Button type="default" htmlType="button" className="register-form-button">
            Registrarse
          </Button>
        </Link>
      </Form.Item>

      {/* Mensaje invitando al registro */}
      <Alert
        message="¿No tienes cuenta? Regístrate para disfrutar de más funciones."
        type="info"
        showIcon
        style={{ marginTop: '10px' }}
      />
    </Form>
  );
};

export default LoginForm;
