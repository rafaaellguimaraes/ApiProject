//Tratamento de usuário no banco, cria um escopo no banco de dados e criptografa a senha

import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt'; //bcrypt, biblioteca cryptografia

interface IUser extends Document {
email: string;
password: string;
created: Date;
}

//Esquema de usuário para criar um escopo
const UserSchema: Schema<IUser> = new Schema({
//email, tipo string, campo obrigatorio, email unico, sempre em minusculo
email: { type: String, required: true, unique: true, lowercase: true },
//Select false porque qnd fizer uma busca de usuário eu nao quero que esse campo seja selecionado na busca
password: { type: String, required: true, select: false },
//Campo created vai marcar a data e a hora que o usuário foi criado
created: { type: Date, default: Date.now },
});

//CRIPTOGRAFIA SENHA

//Função que é chamada antes de salvar o usuário. Antes de 'salvar', eu vou chamar uma função. Não usa arrow function porque o pre-save usa o this, que tem comportamento diferente em função regular e arrow
UserSchema.pre<IUser>('save', async function (next) {
const user = this;
//Se o usuário não for modificado no campo password, saimos da funct e passamos para o next
if (!user.isModified('password')) return next();

//Cryptografa sempre que for modificado
user.password = await bcrypt.hash(user.password, 10);
return next();
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;