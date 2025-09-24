import _morgan, { TokenIndexer } from "morgan";
import chalk from "chalk";
import env from "@/config/env.js";
import { Request, Response, RequestHandler } from "express";

const isProduction = env.NODE_ENV === "production";

_morgan.token("request-headers-size", (req: Request) =>
  JSON.stringify(req.headers).length.toString()
);

_morgan.token("response-headers-size", (_req: Request, res: Response) =>
  JSON.stringify(res.getHeaders()).length.toString()
);

_morgan.token("timestamp", () => {
  const now = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return now.toLocaleString("en-GB", {
    hour12: false,
    timeZone: isProduction ? "UTC" : timeZone,
  });
});

const customLogFormat = (
  tokens: TokenIndexer<Request, Response>,
  req: Request,
  res: Response
): string => {
  const status = Number(tokens["status"]?.(req, res)) || 500;

  const statusStr = isProduction
    ? status.toString()
    : status >= 500
    ? chalk.red.bold(status)
    : status >= 400
    ? chalk.yellow.bold(status)
    : status >= 300
    ? chalk.cyan.bold(status)
    : status >= 200
    ? chalk.green.bold(status)
    : chalk.white.bold(status);

  const method = tokens["method"]?.(req, res) || "-";
  const url = tokens["url"]?.(req, res) || "-";
  const reqContentLength = tokens["req"]?.(req, res, "content-length") || "-";
  const reqHeaderSize = tokens["request-headers-size"]?.(req, res) || "-";
  const timestamp = tokens["timestamp"]?.(req, res) || "-";
  const resContentLength = tokens["res"]?.(req, res, "content-length") || "-";
  const resHeaderSize = tokens["response-headers-size"]?.(req, res) || "-";
  const responseTime = tokens["response-time"]?.(req, res) || "-";

  const logParts = [
    isProduction ? method : chalk.blue.bold(method),
    isProduction ? url : chalk.white(url),
    isProduction
      ? `${reqContentLength}/${reqHeaderSize}`
      : chalk.magenta(`${reqContentLength}/${reqHeaderSize}`),
    isProduction
      ? `[${timestamp} ${isProduction ? "UTC" : "Local"}]`
      : chalk.green.bold(`[${timestamp}]`),
    "||",
    statusStr,
    isProduction
      ? `${resContentLength}/${resHeaderSize}`
      : chalk.magenta(`${resContentLength}/${resHeaderSize}`),
    isProduction ? `${responseTime} ms` : chalk.yellow(`${responseTime} ms`),
  ];

  return logParts.join(" ");
};

const morganMiddleware: RequestHandler = _morgan(customLogFormat);

export default morganMiddleware;

/* Log */
/* Method URL ReqContentLength/ReqHeaderLength TimeStamp || HttpCode ResContentLength/ResHeaderLength ResponseTimeTaken  */
