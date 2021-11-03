import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardService } from 'src/app/services/card.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'controls',
    templateUrl: '../../components/controls/controls.component.html',
    styleUrls: ['../../components/controls/controls.component.scss']

})

export class ControlsComponent {
    settingServiceSubscription : Subscription;
    isGamePaused : boolean = true;
    isFirstTime : boolean = true;
    speed: number;
    
    constructor(private cardService: CardService, private settingsService: SettingsService) {}

    startGame() {
        this.isFirstTime = false;
        let settings = this.settingsService.getCurrentSettings();
        this.cardService.beginPlay(settings.speed);
    }

    pauseGame() {
        this.isGamePaused = false;
        this.cardService.pausePlay();
    }

    resumeGame(){
        this.isGamePaused = true;
        this.cardService.resumePlay();
    }

    endGame() {
        this.cardService.endPlay();
    }
}