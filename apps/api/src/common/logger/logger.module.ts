import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { IncomingMessage, ServerResponse } from 'http';

interface RequestWithUser extends IncomingMessage {
    user?: { id: string };
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
}

@Module({
    imports: [
        PinoLoggerModule.forRoot({
            pinoHttp: {
                level: process.env.LOG_LEVEL || 'info',
                transport:
                    process.env.NODE_ENV !== 'production'
                        ? {
                            target: 'pino-pretty',
                            options: {
                                colorize: true,
                                singleLine: true,
                                translateTime: 'HH:MM:ss',
                                ignore: 'pid,hostname',
                            },
                        }
                        : undefined,
                customProps: (req: RequestWithUser, _: ServerResponse) => ({
                    userId: req.user?.id,
                }),
                serializers: {
                    req: (req: RequestWithUser) => ({
                        method: req.method,
                        url: req.url,
                        params: req.params,
                        query: req.query,
                    }),
                    res: (res) => ({
                        statusCode: res.statusCode,
                    }),
                },
                redact: {
                    paths: ['req.headers.authorization', 'req.body.password'],
                    remove: true,
                },
            },
        }),
    ],
    exports: [PinoLoggerModule],
})
export class LoggerModule { }
