import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Question } from '../shared/models/questions';

@WebSocketGateway() // allow us to make use of the socket.io functionality
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server; // give us access to the server instance
    users: number = 0;

    async handleConnection() {
        // A client has connected
        this.users++;
        console.log('ids:', Object.keys(this.server.sockets.sockets));

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
        this.server.emit('question', this.getQuestion());
    }

    private getQuestion(): Question {
        const n = Math.floor(Math.random() * this.mockQuestions.length);
        console.log('question server ', this.mockQuestions[n]);
        return this.mockQuestions[n];
      }

    mockQuestions: Question[] = [
        {
          question: 'What did Alfred Nobel develop?',
          options: ['Dynamite', 'Gunpowder', 'Nobelium', 'Atomic bomb'],
          answer: 0,
         },
         {
          question: 'Which of these chess figures is closely related to "Bohemian Rhapsody"?',
          options: ['King', 'Pawn', 'Bishop', 'Queen'],
          answer: 3,
          },
         {
          question: 'What restaurant franchise advises you to "Eat Fresh"?',
          options: ['Taco Bell', 'McDonald\'s', 'KFC', 'Subway'],
          answer: 3,
         },
         {
          question: 'Which of these antagonist characters was created by novelist J.K. Rowling?',
          options: ['Lord Voldemort', 'Darth Vader', 'Professor Moriarty', 'Lord Farqaad'],
          answer: 3,
         },
      ];

}
