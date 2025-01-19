import { Body, Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{token: string}>{
        return this.authService.signUp(signUpDto); 
    }

    @Post('/login')
    login(@Body() LoginDto: LoginDto): Promise<{token: string}>{
        return this.authService.login(LoginDto); 
    }

    @Get("/user-details")
    @UseGuards(AuthGuard("jwt"))
    async userDetails(@Request() req): Promise<any>{
        return req.user;      
    }
}
