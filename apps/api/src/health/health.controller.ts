import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'im-reading-here-api',
    };
  }

  @Get('version')
  @ApiOperation({ summary: 'Get version information' })
  @ApiResponse({ status: 200, description: 'Version information' })
  getVersion() {
    return {
      version: '1.0.0',
      commit: process.env.GIT_COMMIT || 'unknown',
      buildTime: process.env.BUILD_TIME || 'unknown',
      schemaVersion: '1.0.0',
    };
  }
}
