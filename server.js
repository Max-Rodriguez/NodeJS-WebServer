// ----- Node Module Imports -----

const http = require('http');
const url = require('url');
const fs = require('fs');


// ----- Default Server Variables -----

let prefix = "[Server]: ";
let homepage = "/home.html";
let port = 3000;


// ----- Utils -----

// Create A Time Stamp

function getTimeStamp() {

    const moment = new Date();
    const local_string = moment.toLocaleString();
    let timestamp = "[" + local_string + "] ";

    return timestamp

}

// Console Logging

const log_types = {

    "log": (ts, msg) => { console.log(ts + prefix + msg); },

    "warn": (ts, msg) => { console.warn(ts + "[WARN]: " + msg); },

    "error": (ts, msg) => { console.error(ts + "[ERROR]: " + msg); },

    "_error": (ts, type) => {

        console.error(ts + "[ERROR]: " + 
            "Utils Logger: Type '" + type + "' Invalid.");

    }

}

function serverLog(type, msg) {

    const timestamp = getTimeStamp();

    function type_not_found() {

        let err_f = types["_error"];
        
        err_f(timestamp, type);

    }

    const log_function = typeof log_types[type] !== "undefined" ? log_types[type] : type_not_found();

    log_function(timestamp, msg);

}


// ----- Constructing HTTP Server -----

serverLog("log", "Initializing HTTP Server ..")

const server = http.createServer( (req, res) => {

    // Parse URL Path Requested
    const path = url.parse(req.url, true);
    const url_string = path.pathname;


    req.on("data", (data) => {
        // Data Listener Required For Request End Listener.
    });

    req.on("end", () => {

        let request_path = "./domain" + url_string;
        
        let file_found = false;
        let content;

        try {
            content = fs.readFileSync(request_path, 'utf-8');
            file_found = true;
        }

        catch {

            if (request_path !== "./domain/") {

                content = fs.readFileSync("./domain/404.html", 'utf-8');

                res.writeHead(404, "NOT FOUND", { "Content-Type": "text/html" });
                res.write(content);

                res.end(); // Send Response

                serverLog("log", "Code 404; Served Request for URL [ " + url_string + " ]")

            } else {

                let home_path = "./domain" + homepage;
                content = fs.readFileSync(home_path, 'utf-8');

                res.writeHead(200, "OK", { "Content-Type": "text/html" });
                res.write(content);

                res.end(); // Send Response

                serverLog("log", "Code 200; Served Request for URL [ " + url_string + " ]")

            }

        }

        if (file_found) {

            res.writeHead(200, "OK", { "Content-Type": "text/html" });
            res.write(content);

            res.end(); // Send Response

            serverLog("log", "Code 200; Served Request for URL [ " + url_string + " ]")

        }

    });

});


// ----- Initialize Listening -----

try {

    server.listen(port, () => {

        serverLog("log", "Web Server Listening On Port (" + port + ") ..");
    
    });

}

catch (error) {
    
    serverLog("warn", "Failed to listen on port " + port + " ..");
    serverLog("error", error); // Log error message.

}