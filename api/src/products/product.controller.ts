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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ProductsService } from './product.services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryDto } from './dto/product-query.dto';

// Ajusta estas rutas si tus guards/decorators están en otro path
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  // GET /api/v1/products?page=&limit=&q=&onlyActive=&sortBy=&sortDir=
  @Get()
  @Roles('admin', 'operador', 'visor')
  list(@Query(new ValidationPipe({ transform: true })) query: ProductsQueryDto) {
    return this.service.list({
      page: query.page,
      limit: query.limit,
      q: query.q,
      onlyActive: query.onlyActive === 'true',
      sortBy: query.sortBy,
      sortDir: query.sortDir,
    });
  }

  // GET /api/v1/products/:id
  @Get(':id')
  @Roles('admin', 'operador', 'visor')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  // POST /api/v1/products
  @Post()
  @Roles('admin')
  create(@Body(new ValidationPipe({ transform: true })) dto: CreateProductDto) {
    return this.service.create(dto);
  }

  // PATCH /api/v1/products/:id
  @Patch(':id')
  @Roles('admin', 'operador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateProductDto,
  ) {
    return this.service.update(id, dto);
  }

  // PATCH /api/v1/products/:id/activate
  @Patch(':id/activate')
  @Roles('admin')
  activate(@Param('id', ParseIntPipe) id: number) {
    this.service.setActive(id, true);
    return { ok: true };
  }

  // PATCH /api/v1/products/:id/deactivate
  @Patch(':id/deactivate')
  @Roles('admin')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    this.service.setActive(id, false);
    return { ok: true };
  }

  // DELETE /api/v1/products/:id
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.service.remove(id);
    return { ok: true };
  }
}
