const mqtt = require('mqtt');
const mongoose = require('mongoose');

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb+srv://rabbiafacundo:FACUNDO@cluster0.yy82i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB:', err);
    });

// Definir el esquema y modelo
const temperaturaSchema = new mongoose.Schema({
    valor: { type: Number, required: true }, // Temperatura
    humedad: { type: Number, required: true }, // Humedad
    estado: { type: String, required: true },
    fecha: { type: Date, default: Date.now }  // Timestamp por defecto
});

const Temperatura = mongoose.model('Temperatura', temperaturaSchema);

// Conectar al broker MQTT
const client = mqtt.connect('mqtt://broker.hivemq.com');

// Umbrales de temperatura
const THRESHOLD_COLD = 15;  // Menor o igual a 15°C = Frío
const THRESHOLD_HOT = 30;   // Mayor o igual a 30°C = Caluroso

client.on('connect', () => {
    console.log('Conectado al broker MQTT');
    
    client.subscribe('prueba', (err) => {
        if (!err) {
            console.log('Suscrito al tema prueba');
        }
    });
});

client.on('message', async (topic, message) => {
    if (topic === 'prueba') {
        const msgString = message.toString().trim();
        
        try {
            // Parsear el mensaje JSON
            const data = JSON.parse(msgString);
            const temperatura = parseFloat(data.temperatura); // Extraer la temperatura
            const humedad = parseFloat(data.humedad); // Extraer la humedad

            if (isNaN(temperatura) || isNaN(humedad)) {
                console.error(`Mensaje recibido no es un número válido: '${msgString}'`);
                return;
            }

            console.log(`Temperatura recibida: ${temperatura}°C, Humedad recibida: ${humedad}%`);

            // Determinar el estado de la temperatura
            let estado;
            if (temperatura <= THRESHOLD_COLD) {
                estado = 'frio';
            } else if (temperatura >= THRESHOLD_HOT) {
                estado = 'caluroso';
            } else {
                estado = 'normal';
            }

            // Publicar el estado
            client.publish('sensor/estado', `El estado es: ${estado}`);
            console.log(`Estado publicado: ${estado}`);

            // Almacenar en la base de datos
            const nuevaTemperatura = new Temperatura({ valor: temperatura, humedad, estado });
            try {
                await nuevaTemperatura.save();
                console.log(`Temperatura ${temperatura}°C y Humedad ${humedad}% almacenadas en la base de datos con estado '${estado}'`);
            } catch (error) {
                console.error('Error al almacenar la temperatura en la base de datos:', error);
            }
        } catch (error) {
            console.error(`Error al parsear el mensaje: ${msgString}`, error);
        }
    }
});

client.on('error', (error) => {
    console.error('Error en la conexión MQTT:', error);
});
