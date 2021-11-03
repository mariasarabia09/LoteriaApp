import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'settings',
    templateUrl: '../../components/settings/settings.component.html',
    styleUrls: ['../../components/settings/settings.component.scss']
})

export class SettingsComponent {

    private speedRangeSource: Subject<number> = new Subject<number>();

    constructor(private settingsService: SettingsService) {
        this.speedRangeSource.pipe(debounceTime(500)).subscribe(x => {
            this.settingsService.setPlaySpeed(x);
        });
    }

    onSpeedChange(element) {
        element.nextElementSibling.value = element.value;
        this.speedRangeSource.next(element.value);
    }
}