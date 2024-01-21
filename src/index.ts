import express, { Express } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { socketEventsConfig } from './socket/events-config';
import { appConfig } from './utils/app-config';

const app: Express = express();

app.use(cors());

const server: http.Server = http.createServer(app);

const io: SocketIOServer = new SocketIOServer(server, {
    cors: {
        origin: ['http://localhost:4200'],
    },
});

appConfig(app);
socketEventsConfig(io);
setInterval(() => console.log('i\'m  alive'), 10 * 1000)
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});