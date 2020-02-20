// Reference: https://github.com/emostar/express-graceful-exit/blob/master/lib/graceful-exit.js

import http from "http";
import net from "net";
import * as Express from "express";
import { getLogger } from "../logger";

interface Options {
  callback?: Function | null;
  exitProcess?: boolean;
  exitDelay?: number;
  suicideTimeout?: number;
  force?: boolean;
}

const defaultOptions: Options = {
  suicideTimeout: 2 * 60 * 1000 + 10 * 1000, // 2m10s (nodejs default is 2m)
  exitProcess: true,
  exitDelay: 10, // wait in ms before process.exit, if exitProcess true
  force: false
};

let sockets: net.Socket[] = [];
let options: Options = { ...defaultOptions };
let hardExitTimer: any;
let connectionsClosed = false;

const logger = getLogger("api.js");

/**
 * Track open connections to forcibly close sockets if and when the hard exit handler runs
 * @param server HTTP server
 */
exports.init = function init(server: http.Server) {
  server.on("connection", function(socket: net.Socket) {
    sockets.push(socket);

    socket.on("close", function() {
      sockets.splice(sockets.indexOf(socket), 1);
    });
  });
};

function exit(code: number) {
  if (hardExitTimer === null) {
    return; // server.close has finished, don't callback/exit twice
  }
  if (options.callback) {
    options.callback(code);
  }
  if (options.exitProcess) {
    logger.debug(`Exiting process with code ${code}`);
    // leave a bit of time to write logs, callback to complete, etc
    setTimeout(function() {
      process.exit(code);
    }, options.exitDelay || 500);
  }
}

export const hardExitHandler = function hardExitHandler() {
  if (connectionsClosed) {
    // this condition should never occur, see serverClosedCallback() below.
    // the user callback, if any, has already been called
    if (options.exitProcess) {
      process.exit(1);
    }
    return;
  }
  if (options.force) {
    sockets = sockets || [];
    logger.debug(`Destroying ${sockets.length} open sockets`);
    sockets.forEach(function(socket) {
      socket.destroy();
    });
  } else {
    logger.debug("Suicide timer ran out before some connections closed");
  }
  exit(1);
  hardExitTimer = null;
};

export const gracefulExitHandler = function gracefulExitHandler(
  app: Express.Application,
  server: http.Server,
  _options?: Options
) {
  // Get the options set up
  if (!_options) {
    _options = {};
  }
  options = { ...defaultOptions, ..._options };
  if (options.callback) {
    if (options.exitProcess) {
      logger.debug(
        `Callback has ${options.exitDelay}ms to complete before hard exit`
      );
    }
  }
  logger.debug("Closing down the http server");

  // Let everything know that we wish to exit gracefully
  app.set("graceful_exit", true);

  // Time to stop accepting new connections
  server.close(function serverClosedCallback() {
    // Everything was closed successfully, mission accomplished!
    connectionsClosed = true;

    logger.debug("No longer accepting connections");
    exit(0);

    clearTimeout(hardExitTimer); // must be cleared after calling exit()
    hardExitTimer = null;
  });

  // If any connections linger past the suicide timeout, exit the process.
  // When this fires we've run out of time to exit gracefully.
  hardExitTimer = setTimeout(
    exports.hardExitHandler,
    options.suicideTimeout || 1
  );
};

export const middleware = function middleware(app: Express.Application) {
  // This flag is used to signal the below middleware when the server wants to stop.
  // New connections are handled for us by Node, but existing connections using the
  // Keep-Alive header require this workaround to close.
  app.set("graceful_exit", false);

  return function checkIfExitingGracefully(
    req: Express.Request,
    _res: Express.Response,
    next: Express.NextFunction
  ) {
    if (app.settings.graceful_exit === true) {
      // sorry keep-alive connections, but we need to part ways
      req.connection.setTimeout(1);
    }

    next();
  };
};
