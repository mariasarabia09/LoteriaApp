import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardService } from 'src/app/services/card.service';
import { ControlService } from 'src/app/services/control.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'controls',
    templateUrl: '../../components/controls/controls.component.html',
    styleUrls: ['../../components/controls/controls.component.scss']

})

export class ControlsComponent {
    settingServiceSubscription: Subscription;
    isGamePaused: boolean = true;
    isFirstTime: boolean = true;
    speed: number;

    constructor(private cardService: CardService, private settingsService: SettingsService, private controlService: ControlService) { }

    startGame() {
        this.isFirstTime = false;
        let settings = this.settingsService.getCurrentSettings();
        this.controlService.onStart(settings.speed);
    }

    pauseGame() {
        this.isGamePaused = false;
        this.cardService.pausePlay();
        this.controlService.onPaused();
    }

    resumeGame() {
        this.isGamePaused = true;
        this.controlService.onResume();
    }

    endGame() {
        this.controlService.onEnd();
    }
}