import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';

export function appConfig(app: Express) {
    app.use(express.static(path.join(__dirname, 'resources')));

    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'resources', 'index.html'));
    });

    app.get('/assets/*', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'resources', req.originalUrl));
    });

    app.get('/polyfills.js', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'resources', 'polyfills.js'));
    });

    app.get('/runtime.js', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'resources', 'runtime.js'));
    });

    app.get('/main.js', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'resources', 'main.js'));
    });

    app.get('*.js', function (req: Request, res: Response, next: NextFunction) {
        res.type('text/javascript');
        next();
    });

    app.get('*.css', function (req: Request, res: Response, next: NextFunction) {
        res.type('text/css');
        next();
    });
}