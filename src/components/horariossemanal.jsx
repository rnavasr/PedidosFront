import React, { useEffect, useState } from 'react';

const HorariosSemanales = () => {
    // Aquí puedes definir tus estados y lógica necesarios

    useEffect(() => {
        // Lógica que se ejecuta al montar o cambiar ciertos valores de dependencia
        // Puedes realizar fetch o cualquier operación asíncrona aquí
        return () => {
            // Limpieza si es necesario al desmontar el componente
        };
    }, []); // Asegúrate de poner las dependencias correctas

    // Aquí puedes definir más funciones o lógica necesaria

    return (
        <>
            <h1>Horarios Semanales</h1>
            <div style={{ flex: 1, marginRight: '50px', padding: '2px' }}>
                <Table
                    columns={[
                        { title: 'NombreH', dataIndex: 'Horarios', key: 'Horarios' },
                        { title: 'Horarios', dataIndex: 'Horarios', key: 'Horarios' },
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
            <div style={{ flex: 1, marginRight: '50px', padding: '2px' }}>
            </div>
        </>
    );
};

export default HorariosSemanales;