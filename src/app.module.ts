
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { parse } from 'pg-connection-string';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        if (config.get<string>('DATABASE_URL')) {
          const parsed = parse(config.get<string>('DATABASE_URL')!);

          return {
            type: 'postgres' as const,
            host: parsed.host||undefined,
            port: parsed.port ? Number(parsed.port) : 5432,
            username: parsed.user||undefined,
            password: parsed.password||undefined,
            database: parsed.database ||undefined,
            synchronize: true,
            autoLoadEntities: true,
            ssl: { rejectUnauthorized: false },
          };
        }

        return {
          type: 'postgres' as const,
          host: config.get('DB_HOST') || 'localhost',
          port: Number(config.get('DB_PORT') || '5432'),
          username: config.get('DB_USERNAME') || 'postgres',
          password: config.get('DB_PASSWORD') || 'postgres',
          database: config.get('DB') || 'doc1',
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    UserModule,
  ],
})
export class AppModule {}