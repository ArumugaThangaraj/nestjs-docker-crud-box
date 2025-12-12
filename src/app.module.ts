import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { parse } from 'pg-connection-string';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
       
        if (configService.get('DATABASE_URL')) {
          const parsed = parse(configService.get('DATABASE_URL')!);
          return {
            type: 'postgres' as const,
            host: parsed.host!,
            port: parsed.port ? parseInt(parsed.port, 10) : 5432,
            username: parsed.user!,
            password: parsed.password!,
            database: parsed.database!,
            synchronize: true,          
            autoLoadEntities: true,
            ssl: { rejectUnauthorized: false }, 
          };
        }

        return {
          type: 'postgres' as const,
          host: configService.get('DB_HOST') || 'localhost',
          port: parseInt(configService.get('DB_PORT') || '5432', 10),
          username: configService.get('DB_USERNAME') || 'postgres',
          password: configService.get('DB_PASSWORD') || 'postgres',
          database: configService.get('DB') || 'doc1',
          synchronize: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule {}