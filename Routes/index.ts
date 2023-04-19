//Rota padrão quando não trata nem um dado específico

import express, {Router, Request, Response} from 'express'
import auth from '../middlewares/auth';

const router: Router = express.Router();


//Comentário de explicação sobre o router.get e post no arquivo app.js
//Só exibe a mensagem se ele passar pela validação do auth
router.get('/', auth,(req: Request, res: Response) => {
    console.log(res.locals.auth_data);
    return res.send({message: 'Essa informação é muito importante, usuários não autorizados não verão recebe-las'})
})

router.post('/',(req: Request, res: Response) => {
    return res.send({message: 'Tudo certo com o metodo post da raiz!'});
})

export default router;