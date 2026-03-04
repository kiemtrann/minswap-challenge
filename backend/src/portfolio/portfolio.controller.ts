import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';

@ApiTags('portfolio')
@Controller('api/v1/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('coins')
  @ApiOperation({})
  @ApiQuery({
    name: 'address',
    required: true,
    description: 'Sui wallet address',
    example:
      '0x200e6f6dd7e974904cab77e52761f8f0e4e27aabe29f44c7b0e272e8e5ecf543',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Max number of coins to return',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Portfolio summary with per coin breakdown',
    type: PortfolioResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Missing or invalid parameters' })
  async getPortfolioCoins(
    @Query('address') address: string,
    @Query('limit') limit?: string,
  ): Promise<PortfolioResponseDto> {
    if (!address) {
      throw new BadRequestException('Query parameter "address" is required');
    }

    const parsedLimit = limit ? parseInt(limit, 10) : undefined;

    if (parsedLimit !== undefined && (isNaN(parsedLimit) || parsedLimit < 1)) {
      throw new BadRequestException('"limit" must be a positive integer');
    }

    return this.portfolioService.getPortfolio(address, parsedLimit);
  }
}
