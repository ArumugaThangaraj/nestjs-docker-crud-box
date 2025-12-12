import { Controller,Body,Get,Param,Post,Delete,Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createuser.dto.';
import { UpdateUserDto } from './dto/updateuser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}


    @Get()
    findAll(){
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string){
        return this.userService.findOne(+id)
    }

    @Post() 
    create(@Body() dto:CreateUserDto){
        return this.userService.create(dto)
    }

    @Patch(':id')
    update(@Param('id') id:string,@Body() dto:UpdateUserDto){
        return this.userService.update(+id,dto)
    }

    @Delete(':id')
    delete(@Param('id' )id:string){
        return this.userService.delete(+id)
    }
    

}
