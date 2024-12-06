import { EmailOptions } from "./options.interface";

export interface IEmailProvider {
    send(options: EmailOptions): Promise<void>;
}