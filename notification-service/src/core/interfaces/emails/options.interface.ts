export interface EmailOptions {
    to: string;
    subject?: string;
    templateName?: string;
    context?: Record<string, any>;
    html?: string;
    text?: string;
}