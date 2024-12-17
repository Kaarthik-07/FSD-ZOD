import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import {Response , Express } from 'express';
import cookieParser from 'cookie-parser';
import { UserRoutes  } from '../routes';
const app : Express = express();
const allowedOrigins : string  = "*";
const corsOptions = {
    origin : allowedOrigins ,
    methods : "GET,POST,PUT,PATCH,HEAD,DELETE",
    credentials : true ,
    optionsSuccessStatus : 200

}
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(UserRoutes.BASE_ROUTE , UserRoutes.router);
const PORT = process.env.PORT || 6969 ;

app.get('/' , (_ , res : Response) => { res.status(200).json({msg : 'working.....'}) });

app.listen(PORT , () => { console.log(`[app_server]: This is where my life headed at -> http:localhost/${PORT}`) });




