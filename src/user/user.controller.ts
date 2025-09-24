import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Post("/:address")
    async createUser() {
        
    }

    @Get("/:address")
    async getUserData() {

    }
}
