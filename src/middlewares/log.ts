import { Request, Response, NextFunction } from 'express';
import fs from 'fs'; // Import the 'fs' module

const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Log the request details
    console.log(`[${new Date().toISOString()}] ${req.method} : ${res.statusCode} ${req.url} from ${req.ip}`);
    
    // save log to file
    if (res.statusCode >= 400) {
        fs.appendFile('./src/logs/error.txt', `[${new Date().toISOString()}] ${req.method}  : ${res.statusCode} ${req.url} from ${req.ip}\n`, (err) => {
            if (err) {
                console.error('Error writing log to file:', err);
            }
        });
        
    }
    fs.appendFile('./src/logs/log.txt', `[${new Date().toISOString()}] ${req.method} : ${res.statusCode} ${req.url} ${res.statusCode} from ${req.ip}\n`, (err) => {
        if (err) {
            console.error('Error writing log to file:', err);
        }
    });
    // Call the next middleware or route handler
    next();
};

export default logMiddleware;