import * as fs from "fs";
import * as path from "path";

class Logger {
  private logFile: string;

  constructor(filename: string = "mcp-server.log") {
    // Store logs in the user's home directory
    const homeDir = process.env.HOME || process.env.USERPROFILE || ".";
    const logsDir = path.join(homeDir, ".promptz", "logs");

    // Create logs directory if it doesn't exist
    fs.mkdirSync(logsDir, { recursive: true });

    this.logFile = path.join(logsDir, filename);
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level}] ${message}\n`;
  }

  private writeToFile(message: string): void {
    fs.appendFileSync(this.logFile, message);
  }

  info(message: string): void {
    const formattedMessage = this.formatMessage("INFO", message);
    this.writeToFile(formattedMessage);
  }

  error(message: string): void {
    const formattedMessage = this.formatMessage("ERROR", message);
    this.writeToFile(formattedMessage);
  }

  debug(message: string): void {
    const formattedMessage = this.formatMessage("DEBUG", message);
    this.writeToFile(formattedMessage);
  }
}

// Export a singleton instance
export const logger = new Logger();
