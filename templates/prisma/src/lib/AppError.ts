import HttpStatusCode from "@/lib/HttpStatusCode.js";

type HttpStatus = (typeof HttpStatusCode)[keyof typeof HttpStatusCode];
export interface AppErrorParams {
  status: HttpStatus;
  type: string;
  message: string;
  highlight?: string;
  details?: unknown;
}

/* Extended Error class object */
class AppError extends Error {
  public readonly status: HttpStatus;
  public readonly type: string;
  public readonly highlight?: string;
  public readonly details?: unknown;

  constructor({ status, type, message, highlight, details }: AppErrorParams) {
    super(message);
    this.name = "AppError";

    this.status = status;
    this.type = type;
    this.highlight = highlight || "";
    this.details = details || {};
  }
}

export default AppError;
