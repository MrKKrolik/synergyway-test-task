import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from 'http'
import * as path from "path";
import * as cors from "cors"
import {Request, Response} from "express";
import {groupRoutes} from "./routes/group-routes";
import {userRoutes} from "./routes/user-routes";
import {Group} from "./entity/Group";
import {User} from "./entity/User";

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    userRoutes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    groupRoutes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    app.use(express.static(path.join(__dirname, "../client/build/index.html")));
    const { PORT = 5000 } = process.env;
    const server = http.createServer(app);
    // start express server
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        
    });

}).catch(error => console.error(error));
