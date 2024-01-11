import React, { useState } from 'react';
import { Table, TimePicker, Tag, message, Button } from 'antd';

const CrearHorariosSemanales = ({ onHorarioCreate }) => {
    const [lunesData, setLunesData] = useState([{ time: null }]);
    const [martesData, setMartesData] = useState([{ time: null }]);
    const [miercolesData, setMiercolesData] = useState([{ time: null }]);
    const [juevesData, setJuevesData] = useState([{ time: null }]);
    const [viernesData, setViernesData] = useState([{ time: null }]);
    const [sabadoData, setSabadoData] = useState([{ time: null }]);
    const [domingoData, setDomingoData] = useState([{ time: null }]);
    const [jsonHorario, setJsonHorario] = useState(null);

    const handleCreateHorario = () => {
        const horarioData = {
            L: lunesData,
            M: martesData,
            X: miercolesData,
            J: juevesData,
            V: viernesData,
            S: sabadoData,
            D: domingoData,
        };

        const formattedData = [];
        Object.keys(horarioData).forEach((day) => {
            const dayData = horarioData[day];
            for (let i = 0; i < dayData.length; i += 2) {
                const horaInicio = dayData[i]?.time?.format('HH:mm');
                const horaFin = dayData[i + 1]?.time?.format('HH:mm');

                if (horaInicio && horaFin) {
                    formattedData.push({
                        dia: day,
                        hora_inicio: horaInicio,
                        hora_fin: horaFin,
                    });
                }
            }
        });

        // Puedes imprimir el JSON en la consola o enviarlo a tu backend
        console.log('JSON de Horario:', formattedData);

        // Puedes almacenar el JSON en el estado o realizar cualquier otra acción necesaria
        onHorarioCreate({ Detalles: formattedData });

        // Agrega el mensaje de éxito o cualquier otra lógica de manejo
        message.success('Horario creado exitosamente');
    };

    const handleTimeChange = (index, value, setDayData) => {
        setDayData((prevData) => {
            const updatedData = [...prevData.slice(0, index), { time: value }];

            if (value !== null && index === prevData.length - 1) {
                updatedData.push({ time: null });
            }

            if (index > 0) {
                const prevTime = prevData[index - 1]?.time;
                if (prevTime && value && value.isBefore(prevTime)) {
                    message.error('La nueva hora debe ser mayor que la anterior');
                    return prevData;
                }

                const prevTag = prevData[index - 1]?.tag;
                const currentTag = prevTag === 'Abrir' ? 'Cerrar' : 'Abrir';
                updatedData[index] = { time: value, tag: currentTag };
            } else {
                updatedData[index] = { time: value, tag: value ? 'Abrir' : 'Sin especificar' };
            }

            return updatedData;
        });
    };

    const renderDayTable = (dayName, dayData, setDayData) => {
        const columns = [
            {
                dataIndex: dayName,
                key: dayName,
                render: (_, record, index) => (
                    <div style={{ verticalAlign: 'top' }}>
                        {record.time ? (
                            <>
                                <Tag color={record.tag === 'Abrir' ? '#52c41a' : '#f5222d'}>{record.tag}</Tag>
                                <TimePicker format="HH:mm" value={record.time} onChange={(value) => handleTimeChange(index, value, setDayData)} />
                            </>
                        ) : (
                            <>
                                <Tag color="#858585">Sin especificar</Tag>
                                <TimePicker format="HH:mm" onChange={(value) => handleTimeChange(index, value, setDayData)} />
                            </>
                        )}
                    </div>
                ),
            },
        ];

        return (
            <>
                <Table columns={columns} dataSource={dayData} pagination={false} size="middle" bordered showHeader={false} />
            </>
        );
    };

    return (
        <>
            <h1>Crear Horario</h1>
            <Table style={{ verticalAlign: 'top' }}
                columns={[
                    { title: 'Horario', dataIndex: 'Horario', key: 'Horario' },
                ]}
                dataSource={[{
                    dataIndex: 'Horario',
                    key: 'Horario',
                    Horario:
                        <>
                            <Table style={{ verticalAlign: 'top' }}
                                columns={[
                                    { title: 'Domingo', dataIndex: 'Domingo', key: 'Domingo' },
                                    { title: 'Lunes', dataIndex: 'Lunes', key: 'Lunes' },
                                    { title: 'Martes', dataIndex: 'Martes', key: 'Martes' },
                                    { title: 'Miercoles', dataIndex: 'Miercoles', key: 'Miercoles' },
                                    { title: 'Jueves', dataIndex: 'Jueves', key: 'Jueves' },
                                    { title: 'Viernes', dataIndex: 'Viernes', key: 'Viernes' },
                                    { title: 'Sabado', dataIndex: 'Sabado', key: 'Sabado' },
                                ]}
                                dataSource={[
                                    {
                                        dataIndex: 'Horarios',
                                        key: 'Horarios',
                                        Domingo:
                                            <>
                                                {renderDayTable('Domingo', lunesData, setDomingoData)}
                                            </>,
                                        Lunes:
                                            <>
                                                {renderDayTable('Lunes', lunesData, setLunesData)}
                                            </>,
                                        Martes:
                                            <>
                                                {renderDayTable('Martes', martesData, setMartesData)}
                                            </>,
                                        Miercoles:
                                            <>
                                                {renderDayTable('Miércoles', miercolesData, setMiercolesData)}
                                            </>,
                                        Jueves:
                                            <>
                                                {renderDayTable('Jueves', juevesData, setJuevesData)}

                                            </>,
                                        Viernes:
                                            <>
                                                {renderDayTable('Viernes', viernesData, setViernesData)}

                                            </>,
                                        Sabado:
                                            <>
                                                {renderDayTable('Sábado', sabadoData, setSabadoData)}
                                            </>,
                                        Domingo:
                                            <>
                                                {renderDayTable('Domingo', domingoData, setDomingoData)}
                                            </>,
                                    },
                                ]}
                                pagination={false}

                            />
                        </>
                }
                ]}
                pagination={false}
                size="middle"
                bordered></Table >
             <br/>
            <Button type="primary" onClick={handleCreateHorario}>
                Crear horario
            </Button>
        </>
    );
};

export default CrearHorariosSemanales;
