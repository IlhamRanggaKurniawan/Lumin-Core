import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventsService {
    private events$ = new Subject<MessageEvent>()

    getStream() {
        return this.events$.asObservable()
    }

    emitEvent(data: any) {
        this.events$.next({ data: JSON.stringify(data) } as MessageEvent)
    }
}
