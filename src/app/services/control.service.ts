import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ControlService {
    private startSubject = new Subject<number>();
    private pauseSubject = new Subject();
    private resumeSubject = new Subject();
    private endSubject = new Subject();

    started$ = this.startSubject.asObservable();
    paused$ = this.pauseSubject.asObservable();
    resumed$ = this.resumeSubject.asObservable();
    ended$ = this.endSubject.asObservable();

    onStart(speed: number): void {
        this.startSubject.next(speed);
    }

    onPaused(): void {
        this.pauseSubject.next();
    }

    onResume(): void {
        this.resumeSubject.next();
    }

    onEnd(): void {
        this.endSubject.next();
    }
}