import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Settings } from '../models/settings';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private settingsSpeedSource = new Subject<number>();
    private settingsLanguageSource = new Subject<string>();
    private currentSettings: Settings = this.getDefaultSettings();

    speedChanged$ = this.settingsSpeedSource.asObservable();
    languageChanged$ = this.settingsLanguageSource.asObservable();

    setPlaySpeed(seconds: number) {
        const milliseconds = seconds * 1000;
        this.currentSettings.speed = milliseconds;
        this.settingsSpeedSource.next(this.currentSettings.speed);
    }

    setLanguage(language: string) {
        this.settingsLanguageSource.next(language);
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