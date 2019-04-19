import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Question } from '../shared/models/questions';

@WebSocketGateway() // allow us to make use of the socket.io functionality
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server; // give us access to the server instance
    users: number = 0;

    async handleConnection() {
        // A client has connected
        this.users++;

        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }

    async handleDisconnect() {
        // A client has disconnected
        this.users--;
        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }

    // client.on() - event listener, can be called on client to execute on server
    // client.emit() - send to all connected clients
    // client.broadcast.emit() - send to all connected clients except the one that sent the message
    @SubscribeMessage('question')
    onGame(client, dataFromClient) {
        console.log('dataFromClient', dataFromClient);
        client.emit('question', this.getQuestion());
    }

    private getQuestion(): Question {
        const n = Math.floor(Math.random() * this.mockQuestions.length);
        console.log('question server ', this.mockQuestions[n]);
        return this.mockQuestions[n];
      }


    mockQuestions: Question[] = [
        {
          question: 'pregunta 1',
          options: ['1', '2', '3', '4'],
          answer: 0,
         },
         {
          question: 'pregunta 2',
          options: ['1', '2', '3', '4'],
          answer: 1,
         },
         {
          question: 'pregunta 3',
          options: ['1', '2', '3', '4'],
          answer: 2,
         },
         {
          question: 'pregunta 4',
          options: ['1', '2', '3', '4'],
          answer: 3,
         }
      ];

}