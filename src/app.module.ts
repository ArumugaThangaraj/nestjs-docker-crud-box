import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { parse } from 'pg-connection-string';  // ADD THIS IMPORT

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.DATABASE_URL) {
          const dbConfig = parse(process.env.DATABASE_URL);
          return {
            type: 'postgres' as const,
            host: dbConfig.host || undefined,
            port: Number(dbConfig.port) || 5432,
            username: dbConfig.user || undefined,
            password: dbConfig.password  || undefined,
            database: dbConfig.database  || undefined,
            synchronize: true,
            autoLoadEntities: true,
          };
        }
        // Fallback for local (your old .env)
        return {
          type: 'postgres' as const,
          host: process.env.DB_HOST,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB,
          port: Number(process.env.DB_PORT),
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}