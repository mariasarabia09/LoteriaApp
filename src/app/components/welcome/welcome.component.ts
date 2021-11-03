import { Component } from '@angular/core';

@Component({
    selector: 'welcome',
    templateUrl: '../../components/welcome/welcome.component.html',
    styleUrls: ['../../components/welcome/welcome.component.scss']
})

export class WelcomeComponent{
    pageTitle: string = "Welcome";
}