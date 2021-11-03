import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Settings } from '../models/settings';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private settingsSource = new Subject<Settings>();
    private currentSettings: Settings = this.getDefaultSettings();

    settingsChanged$ = this.settingsSource.asObservable();

    setPlaySpeed(seconds: number) {
        const milliseconds = seconds * 1000;
        this.currentSettings.speed = milliseconds;
        this.settingsSource.next(this.currentSettings);
    }

    //Future to do item
    setLanguage(language: string) {

    }

    getCurrentSettings(): Settings {
        return this.currentSettings;
    }

    private getDefaultSettings(): Settings {
        return {
            language: "Spanish",
            speed: 10000
        };
    }
}