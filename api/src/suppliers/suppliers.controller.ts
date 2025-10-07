import {
    Controller, Get, Post, Patch, Delete,
    Param, Body, Query, ParseIntPipe, UseGuards
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  
  import { SuppliersService } from './suppliers.service';
  import { SupplierQueryDto } from './dto/supplier-query.dto';
  import { CreateSupplierDto } from './dto/create-supplier.dto';
  import { UpdateSupplierDto } from './dto/update-supplier.dto';
  
  // Usa tus guards/decorators existentes:
  import { JwtAuthGuard } from '../guards/jwt-auth.guard';            // ajusta la ruta si difiere
  import { RolesGuard } from '../guards/roles.guard';                  // si lo tienes
  import { Roles } from '../decorators/roles.decorator';               // si lo tienes
  
  @ApiTags('Suppliers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard) // si tu proyecto ya usa ambos
  @Controller('api/v1/suppliers')
  export class SuppliersController {
    constructor(private readonly service: SuppliersService) {}
  
    @Get()
    list(@Query() query: SupplierQueryDto) {
      return this.service.list(query);
    }
  
    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
      return this.service.getById(id);
    }
  
    @Post()
    @Roles('admin') // restringe creación a admin
    create(@Body() dto: CreateSupplierDto) {
      return this.service.create(dto);
    }
  
    @Patch(':id')
    @Roles('admin', 'operador')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupplierDto) {
      return this.service.update(id, dto);
    }
  
    @Patch(':id/activate')
    @Roles('admin')
    activate(@Param('id', ParseIntPipe) id: number) {
      return this.service.setActive(id, true);
    }
  
    @Patch(':id/deactivate')
    @Roles('admin')
    deactivate(@Param('id', ParseIntPipe) id: number) {
      return this.service.setActive(id, false);
    }
  
    @Delete(':id')
    @Roles('admin')
    remove(@Param('id', ParseIntPipe) id: number) {
      this.service.remove(id);
      return { ok: true };
    }
  }
  