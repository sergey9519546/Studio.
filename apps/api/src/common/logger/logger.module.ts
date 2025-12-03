import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

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
                customProps: (req) => ({
                    userId: req.user?.id,
                }),
                serializers: {
                    req: (req) => ({
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
