import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 5, limit: 3 }], // 5 saniyelik süre ve 3 istek limiti
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Tüm uygulamada erişilebilir
    }),
    MongooseModule.forRoot(process.env.DB_URI), // MongoDB bağlantısı
    TaskModule,
    AuthModule,
    ChatModule, // ChatModule zaten ChatService ve ChatController'ı içeriyor
  ],
  controllers: [AppController], // AppController burada kalabilir
  providers: [AppService], // AppService burada kalabilir
})
export class AppModule {}
