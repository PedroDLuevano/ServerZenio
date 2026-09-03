const http = require('http');
const app = require('./app');
const { processReminders } = require('./services/reminderService');

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => {
	console.log('El servidor se escucha en: ' + port);
});

setInterval(() => {
	processReminders().catch((error) => {
		console.error('Error procesando recordatorios:', error.message);
	});
}, 60 * 1000);

processReminders().catch((error) => {
	console.error('Error procesando recordatorios:', error.message);
});