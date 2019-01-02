import * as http from "http";
import finalhandler from "finalhandler";
import serveStatic from "serve-static";

const serve = serveStatic("./dist/");

const server = http.createServer((req, res) => {
    const done = finalhandler(req, res);
    serve(req, res, done);
});

const port = 5000;
server.listen(port, "0.0.0.0", () => {
    console.log("Listening on port " + port + ". Hit CTRL-C to stop the server.");
});