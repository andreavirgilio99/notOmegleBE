import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import { AgeGroup, GetUsersCollectionResult, UserData, UserStatus, UsersCollection } from './types';

export function appConfig(app: Express) {
    app.use(express.static(path.join(__dirname, 'resources')));

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

export function getUsersCollection(): GetUsersCollectionResult {
    const collection: UsersCollection = new Map([
        [AgeGroup.Adults, new Map([
            [UserStatus.Idle, new Map<string, UserData>()],
            [UserStatus.Paired, new Map<string, UserData>()],
            [UserStatus.Pending, new Map<string, UserData>()],
        ])],
        [AgeGroup.Minors, new Map([
            [UserStatus.Idle, new Map<string, UserData>()],
            [UserStatus.Paired, new Map<string, UserData>()],
            [UserStatus.Pending, new Map<string, UserData>()],
        ])],
    ]);

    const addUser = (id: string, data: UserData) => {
        const ageGroup = data.isMinor ? AgeGroup.Minors : AgeGroup.Adults;
        const status = UserStatus.Idle;

        const collectionChunk = collection.get(ageGroup)?.get(status);

        if (collectionChunk) {
            collectionChunk.set(id, data);
        }
    }

    const removeUser = (id: string) => {
        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    userMap.delete(id);
                    return;
                }
            }
        }
    };

    const switchUserStatus = (id: string, newStatus: UserStatus) => {
        for (const [ageGroup, statusMap] of collection.entries()) {
            for (const [status, userMap] of statusMap.entries()) {
                if (userMap.has(id)) {
                    const userData = userMap.get(id);
                    userMap.delete(id);

                    const newStatusMap = collection.get(ageGroup)?.get(newStatus);
                    if (newStatusMap && userData) {
                        newStatusMap.set(id, userData);
                    }

                    return;
                }
            }
        }
    };

    return [addUser, removeUser, switchUserStatus];
}

