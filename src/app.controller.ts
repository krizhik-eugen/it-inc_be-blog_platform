import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
    @Get()
    getInfo() {
        return `<h1>Welcome to blog platform!</h1>
        <p>check the docs: <a href="/api">/api</a></p>
        `;
    }
}
