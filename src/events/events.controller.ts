import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Sse("alchemy/:address")
    stream(): Observable<MessageEvent> {

        return this.eventsService.getStream()
        // return this.eventsService.getStream().pipe(
        //     filter(event => event.activity[0].toAddress === address || event.activity[0].fromAddress === address)
        // );
    }
}
