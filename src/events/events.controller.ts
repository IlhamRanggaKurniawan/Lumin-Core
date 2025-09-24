import { Controller, MessageEvent, Param, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';
import { filter } from 'rxjs/operators';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Sse("alchemy/:address")
    stream(@Param("address") address: string): Observable<MessageEvent> {

        return this.eventsService.getStream().pipe(
            filter((event: MessageEvent) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const data = JSON.parse(event.data as string)

                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                return data.to.toLocaleLowerCase() === address.toLocaleLowerCase() && data.from.toLocaleLowerCase() !== address.toLocaleLowerCase()
            })
        )

    }
}
