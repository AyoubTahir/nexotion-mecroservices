import { CONTAINER_TYPES } from "@notifications/core/interfaces/constants/container.types";
import { IEmailProvider } from "@notifications/core/interfaces/emails/email.interface";
import { ILogger } from "@notifications/core/interfaces/logger/logger.interface";
import { ConfigService } from "@notifications/infrastructure/config/config.service";
import { inject, injectable } from "inversify";
import EmailTemplate from 'email-templates';
import nodemailer from 'nodemailer';
import path from 'path';
import { EmailOptions } from "@notifications/core/interfaces/emails/options.interface";

@injectable()
export class NodemailerEmailProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;
  private emailTemplate: EmailTemplate;
  private logger: ILogger;

  constructor(
    @inject(ConfigService) private config: ConfigService,
    @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: any) => ILogger
  ) {
    this.logger = loggerFactory({ name: "notificationsNodemailerEmailProvider" });

    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST', 'smtp.example.com'),
      port: this.config.get('SMTP_PORT', 587),
      auth: {
        user: this.config.get('SMTP_USER', ''),
        pass: this.config.get('SMTP_PASS', '')
      }
    });

    // Configure email templates
    this.emailTemplate = new EmailTemplate({
        views: {
          root: path.join(process.cwd(), 'src', 'infrastructure', 'emails', 'templates'),
          options: {
            extension: 'ejs'
          }
        }
    });
  }

  async send(options: EmailOptions): Promise<void> {
    try {
      // If a template is specified, render it first
      let emailContent = {
        html: options.html,
        text: options.text,
        subject: options.subject
      };

      if (options.templateName) {
        // Render template if provided
        const renderedTemplate = await this.emailTemplate.renderAll(
          options.templateName, 
          options.context || {}
        );

        emailContent = {
          html: renderedTemplate.html,
          text: renderedTemplate.text,
          subject: options.subject || renderedTemplate.subject
        };

        this.logger.info(`Rendered email template ${options.templateName}`, { context: options.context });
      }

      // Validate required fields
      if (!options.to) {
        throw new Error('Recipient email address is required');
      }

      if (!emailContent.subject) {
        throw new Error('Email subject is required');
      }

      if (!emailContent.html && !emailContent.text) {
        throw new Error('Email must have either HTML or text content');
      }

      // Send the email
      await this.transporter.sendMail({
        from: this.config.get('EMAIL_FROM', 'noreply@nexotion.com'),
        to: options.to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      this.logger.info(`Email sent`, { 
        to: options.to, 
        subject: emailContent.subject,
        templateName: options.templateName 
      });
    } catch (error) {
      this.logger.error('Failed to send email', { 
        error, 
        to: options.to, 
        subject: options.subject,
        templateName: options.templateName
      });
      throw error;
    }
  }
}