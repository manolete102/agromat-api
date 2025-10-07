import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    ValidationPipe,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
  import { CategoriesService } from './categories.service';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  
  // Ajusta rutas si tus guards/decorators están en otra carpeta
  import { JwtAuthGuard } from '../guards/jwt-auth.guard';
  import { RolesGuard } from '../guards/roles.guard';
  import { Roles } from '../decorators/roles.decorator';
  
  @ApiTags('Categories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('categories')
  export class CategoriesController {
    constructor(private readonly service: CategoriesService) {}
  
    // GET /api/v1/categories?page=&limit=&q=&onlyActive=
    @Get()
    @Roles('admin', 'operador', 'visor')
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'q', required: false, description: 'Búsqueda por nombre' })
    @ApiQuery({ name: 'onlyActive', required: false, description: 'true|false' })
    list(
      @Query('page') page?: string,
      @Query('limit') limit?: string,
      @Query('q') q?: string,
      @Query('onlyActive') onlyActive?: 'true' | 'false',
    ) {
      return this.service.list({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        q,
        onlyActive: onlyActive === 'true',
      });
    }
  
    // GET /api/v1/categories/:id
    @Get(':id')
    @Roles('admin', 'operador', 'visor')
    get(@Param('id', ParseIntPipe) id: number) {
      return this.service.getById(id);
    }
  
    // POST /api/v1/categories
    @Post()
    @Roles('admin')
    create(@Body(new ValidationPipe({ transform: true })) dto: CreateCategoryDto) {
      return this.service.create(dto.name);
    }
  
    // PATCH /api/v1/categories/:id
    @Patch(':id')
    @Roles('admin')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body(new ValidationPipe({ transform: true })) dto: UpdateCategoryDto,
    ) {
      return this.service.update(id, dto);
    }
  
    // PATCH /api/v1/categories/:id/activate
    @Patch(':id/activate')
    @Roles('admin')
    activate(@Param('id', ParseIntPipe) id: number) {
      this.service.setActive(id, true);
      return { ok: true };
    }
  
    // PATCH /api/v1/categories/:id/deactivate
    @Patch(':id/deactivate')
    @Roles('admin')
    deactivate(@Param('id', ParseIntPipe) id: number) {
      this.service.setActive(id, false);
      return { ok: true };
    }
  
    // DELETE /api/v1/categories/:id
    @Delete(':id')
    @Roles('admin')
    remove(@Param('id', ParseIntPipe) id: number) {
      this.service.remove(id);
      return { ok: true };
    }
  }
  