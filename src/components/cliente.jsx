import React from 'react';

const Cliente = ({ nombre, apellido }) => {
  return (
    <div>
      <h2>Bienvenido, {nombre} {apellido}</h2>
      {/* Agrega aquí el contenido específico para el cliente si es necesario */}
    </div>
  );
};

export default Cliente;
    