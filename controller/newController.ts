import Users from '../model/dataBase';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

//Quando um usuário se cadastrar, ele recebe um token para poder ver as informações
const createUserToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_PASS!, { expiresIn: process.env.JWT_EXPIRES_IN });
};

class dadosController {
  //Aqui pega todos os usuários, da um get geral. Objeto passa sem parametro.
  //Se existir erro, retorna uma mensagem de erro, se não retorna res.send(user) que são os usuários
  async getDados(req: express.Request, res: express.Response) {
    try {
      const users = await Users.find({});
      return res.send(users);
    } catch (err) {
      return res.status(500).send({ error: 'Erro na consulta de usuários' });
    }
  }

  //Função para buscar um único usuário pelo id
  async getDadosUnicos(req: express.Request, res: express.Response) {
    //O id vem através da req de parametros
    const id = req.params.id;
    try {
      //findOne filtra apenas um único parâmetro, que no caso vem de id da req.params e adiciona em _id que vem do banco
      const user = await Users.findOne({ _id: id });
      if (!user) {
        return res.status(422).json({ message: 'ID de usuário não encontrado' });
      }
      res.status(200).json(user);
    } catch (err) {
      return res.status(500).send({ error: 'Erro na consulta de usuários' });
    }
  }

  async creatUser(req: express.Request, res: express.Response) {
    //Desestrutura e recebe o email e senha, email e senha vem do body
    const { email, password } = req.body;

    //Se não existir email e senha, retorna um erro.
    if (!email || !password) return res.status(400).send({ error: 'Dados insuficientes' });

    try {
      //Busca o usuário para ver se ele já não está cadastrado. Ele atribui o email ao email para ver se tem duplicidade e quando terminar essa busca eu vou receber erro ou user
      if (await Users.findOne({ email })) return res.status(400).send({ error: 'Usuário já existe no nosso banco de dados' });

      //Se não houver erros, vai criar o usuário, que esta sendo recebido de req.body
      const user = await Users.create(req.body);
      user.password = '';
      //Na criação de usuário, antes de enviar o usuário, vou enviar tbm o token dele
      //userEmail: user.email para retornar só o email sem o ID do usuário. se eu quiser ver o ID é só deixar apenas user
      return res.send({ userEmail: user.email, token: createUserToken(user.id) });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: 'Erro ao buscar usuário' });
    }
  }

  //Função para atualizar os dados do usuário
  async updateUsers(req: express.Request, res: express.Response) {
    const id = req.params.id;
    const { email, password } = req.body;

    const user = {
      email,
      password,
    };
    try {
      const updateUser = await Users.updateOne({ _id: id }, user);
      if (updateUser.matchedCount === 0){
        return res.status(500).send({error: 'Erro ao atualizar usuário'})
      }
      return res.status(200).json(user)
    } catch(err){
        return res.status(500).json({err: err})
    }
}

// Função para deletar usuário
    async deleteUser(req: express.Request, res: express.Response): Promise<express.Response> {
    const id = req.params.id;

    try {
        const user = await Users.findOne({_id: id});
        if (!user) {
           return res.status(422).json({message: 'ID de usuário não encontrado'});
        }
        await Users.deleteOne({_id: id});
         return res.status(200).json({message: 'Usuário removido com sucesso!'});
    } catch (err) {
        return res.status(500).json({ err });
    }
}

  // Função de autenticação
  async autenticar(req: express.Request, res: express.Response): Promise<express.Response> {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: 'Dados insuficientes' });
    }

    try {
      // Busca o usuário
      const user = await Users.findOne({ email }).select('+password');

      // Se não tem usuário, retorna erro
      if (!user) {
        return res.status(400).send({ error: 'Usuário não registrado!' });
      }

      // Verifica se a senha enviada é a mesma que a do banco de dados, como o banco esta criptografado, usamos o bcrypt para comparar
      const pass_ok = await bcrypt.compare(password, user.password);
      if (!pass_ok) {
        return res.status(401).send({ error: 'Erro ao autenticar usuário' });
      }

      user.password = '';
      return res.send({ user, token: createUserToken(user.id) });
      
    } catch (err) {
      return res.status(500).send({ error: 'Erro ao buscar usuário!' });
      
    }
  }
}

export default new dadosController();