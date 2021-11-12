import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Settings } from '../models/settings';

@Injectable({
    providedIn: 'root',
})
export class ControlService {
    private startSubject = new Subject<Settings>();
    private pauseSubject = new Subject();
    private resumeSubject = new Subject();
    private endSubject = new Subject();

    started$ = this.startSubject.asObservable();
    paused$ = this.pauseSubject.asObservable();
    resumed$ = this.resumeSubject.asObservable();
    ended$ = this.endSubject.asObservable();

    onStart(settings: Settings): void {
        this.startSubject.next(settings);
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