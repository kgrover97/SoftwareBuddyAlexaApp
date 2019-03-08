import restify = require("restify");
import fs = require("fs");
import Log from "./log";

/**
 * Creates a RESTIFY server that handles HTTPS requests. Be sure to start the
 * server after creation. Endpoints can be added by calling the registerListener
 * function with an appropriate callback.
 */
export default class RestServer {
    private port: number;
    private rest: restify.Server;

    constructor(port: number) {
        this.port = port;
    }

    public get server() {
        return this.rest;
    }

    /**
     * Creates and starts the underlying Restify server.
     *
     * @returns A promise that resolves once the Restify server is listening for
     * requests.`
     */
    public async start(): Promise<void> {
        return new Promise<void>((fulfill, reject) => {
            try {
                // certificate: fs.readFileSync(`${__dirname}/../ssl/certificate.pem`),
                // key: fs.readFileSync(`${__dirname}/../ssl/private-key.pem`)
                this.rest = restify.createServer({
                    name: "devy-proxy",
                });

                this.rest.use(restify.plugins.bodyParser());

                this.rest.on("error", (err: Error) => {
                    Log.warn(`RestServer::onError() - REST server encountered an error. ${err}`);
                    reject(err);
                });

                // Start the REST server
                this.rest.listen(this.port, () => {
                    Log.info(`RestServer::start() - REST server is listening at ${this.rest.url}`);
                    fulfill();
                });
            }
            catch (err) {
                throw new Error(`Failed to start REST server. ${err}`);
            }
        });
    }

    /**
     * Stops the underlying Restify server.
     *
     * @returns A promise the resolves once the Restify server has closed all open
     * connections.
     */
    public async stop(): Promise<void> {
        return new Promise<void>((fulfill) => {
            this.rest.close(() => fulfill());
        });
    }

    /**
     * Register a callback for an endpoint.
     *
     * @param verb An HTTP verb. Currently only POST is implemented.
     * @param path The endpoint path. Passed directly to Restify.
     * @param listener The function that should be called when a request is received
     * on the corresponding endpoint.
     */
    public registerListener(verb: string, path: string, listener: (req: restify.Request, res: restify.Response, next: restify.Next) => void) {
        switch (verb.toLowerCase()) {
            case "post":
                this.rest.post(path, listener);
                break;
            default:
                throw new Error("Invalid HTTP verb.");
        }
    }

}
