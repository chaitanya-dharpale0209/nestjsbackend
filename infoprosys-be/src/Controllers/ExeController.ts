import { Controller, Get, Param } from '@nestjs/common';
import { execService } from 'src/Services/ExecService';

@Controller('exec')
export class ExecController {
  constructor(private readonly execService: execService) {}

  @Get(':id')
  getVendorById(@Param('id') id: string) {
    return this.execService.getVendor(id);
  }

  @Get('getall')
  getAllVendors(){
    return this.execService.getAllVendors();
  }
}
