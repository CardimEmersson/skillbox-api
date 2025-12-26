import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Resend } from 'resend';

const resend = new Resend(process.env.MAIL_API_KEY);

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor() {}

  async enviarEmailConfirmacao(usuario: Usuario) {
    const token = usuario.token_confirmacao;
    this.logger.log(`Código de confirmação (DEV): ${token}`);

    const deepLink = `skillbox://confirm-account?email=${usuario.email}&token=${token}`;

    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM ?? 'skillbox',
      to: [usuario?.email],
      // to: [process.env.MAIL_TO ?? ''],
      subject: 'Bem-vindo ao SkillBox! Código de Confirmação',
      html: `
        <p>Olá ${usuario.nome},</p>
        <p>Obrigado por se cadastrar no SkillBox. Use o código abaixo para confirmar seu cadastro no aplicativo:</p>
        <h2 style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${token}</h2>
        <p>Ou clique no botão abaixo para abrir o aplicativo:</p>
        <a href="${deepLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirmar no App</a>
        <p>Se você não se cadastrou, por favor ignore este e-mail.</p>
      `,
    });

    if (error) {
      return console.error({ error });
    }
  }

  async enviarEmailRecuperacaoSenha(usuario: Usuario) {
    const token = usuario.token_recuperacao_senha;
    this.logger.log(`Código de recuperação (DEV): ${token}`);

    const deepLink = `skillbox://reset-password?email=${usuario.email}&token=${token}`;

    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM ?? 'skillbox',
      to: [usuario.email],
      // to: [process.env.MAIL_TO ?? ''],
      subject: 'Recuperação de Senha - SkillBox',
      html: `
        <p>Olá ${usuario.nome},</p>
        <p>Você solicitou a recuperação de senha. Use o código abaixo para redefinir sua senha no aplicativo:</p>
        <h2 style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${token}</h2>
        <p>Ou clique no botão abaixo para abrir o aplicativo:</p>
        <a href="${deepLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Senha no App</a>
        <p>Se você não solicitou essa alteração, por favor ignore este e-mail.</p>
      `,
    });

    if (error) {
      return console.error({ error });
    }
  }
}
