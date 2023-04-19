// Verificação de token para autenticação

import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req: Request, res: Response, next: NextFunction): void => {
const token_header: string  = req.headers.auth!.toString();

// Se não existir o token_header, o usuário está tentando acessar a informação sem o token
if (!token_header) {
    res.status(401).send({ error: 'Token não enviado' });
    return;
}

// Se ele enviar o token_header, verificamos se o token_header é válido ou não
jwt.verify(token_header, process.env.JWT_PASS as string, (err, decoded ) => {
if (err) return res.status(401).send({ error: 'Token inválido' });
// Guardamos no locals quem é o usuário
res.locals.auth_data = decoded;
// Se o token não for inválido
return next();
});
};

export default auth;