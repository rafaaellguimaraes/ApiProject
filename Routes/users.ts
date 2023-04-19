// Rota com tratamento de dados de usuários

import express, { Router, Request, Response } from 'express';
import dadosController from '../controller/newController';

const router: Router = express.Router();

// Comentário de explicação sobre o router.get e post no arquivo app.js, mas basicamente o que acontece aqui é que quando bater na rota raiz, vai fazer a consulta de usuários.
router.get('/', async (req: Request, res: Response) => {
dadosController.getDados(req, res);
});

// Rota para buscar usuários únicos
router.get('/:id', async (req: Request, res: Response) => {
dadosController.getDadosUnicos(req, res);
});

// Aqui eu quero falar na rota de usuários e quero criar um usuário
router.post('/create', async (req: Request, res: Response) => {
dadosController.creatUser(req, res);
});

// Método de autenticação para saber se o usuário é ele mesmo
router.post('/auth', async (req: Request, res: Response) => {
    dadosController.autenticar(req, res);
});

// Update - atualização de dados (PUT: Espera que envie o corpo completo e PATCH atualização parcial, geralmente quando há atualização, atualizamos poucos campos e nao o campo completo, então vamos usar o PATCH)
router.patch('/:id', async (req: Request, res: Response) => {
dadosController.updateUsers(req, res);
});

// Delete - Deletar dados
router.delete('/:id', async (req: Request, res: Response) => {
dadosController.deleteUser(req, res);
});

export default router;

/*
200 - OK
201 - Created
202 - Accepted

400 - Bad request
401 - Not Authorized -- AUTENTICAÇÃO, tem caráter temporário.
403 - Forbidden -- AUTORIZAÇÃO, tem caráter permanente.
404 - Not found.

500 - Internal server error
501 - Not implemented -- a API não suporta essa funcionalidade
503 - Service unavailable - a API executa essa operação, mas no momento está indisponível
*/