import express, { Application } from 'express';
import mongoose from 'mongoose';
import indexRoute from "./Routes/index";
import usersRoute from "./Routes/users";
import dotenv from 'dotenv';
import './model/dataBase';

dotenv.config();

const app: Application = express();
const url: string = process.env.BD_STRING!;

mongoose.connect(url, {
maxPoolSize: 6
})

mongoose.connection.on('error', (err: string) => {
console.log(`Erro na conexão com o banco de dados: ${err}`);
})

mongoose.connection.on('disconnected', () => {
console.log('Aplicação desconectada do banco de dados!')
})

mongoose.connection.on('connected', () => {
console.log('Aplicação conectada ao Banco de dados');
})

app.use(express.json());

app.use('/', indexRoute);
app.use('/users', usersRoute);

app.listen(process.env.PORT, () => {
console.log(`Aplicação rodando na porta ${process.env.PORT}`)
});