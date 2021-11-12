import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscriber, Subscription } from 'rxjs';
import { mergeAll } from 'rxjs/operators';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { ControlService } from 'src/app/services/control.service';

@Component({
    selector: 'cards',
    templateUrl: '../../components/cards/cards.component.html',
    styleUrls: ['../../components/cards/cards.component.scss']
})

export class CardsComponent implements OnInit, OnDestroy {
    cardServiceSubscription: Subscription;
    controlServiceSubscription: Subscription;
    gameEndsSubscription: Subscription;

    card: Card;
    isPaused: Boolean = false;
    isEnd: Boolean = false;

    constructor(private cardService: CardService, private controlService: ControlService) { }

    ngOnInit() {
        this.cardServiceSubscription = this.cardService.cardDealt$.subscribe(card => {
            this.card = card;
        });

        this.controlServiceSubscription = this.controlService.paused$.subscribe(() =>
            this.isPaused = true
        );

        this.controlServiceSubscription = this.controlService.resumed$.subscribe(() =>
            this.isPaused = false
        );

        this.controlServiceSubscription = this.controlService.ended$.subscribe(() =>{
            this.isPaused = false
            this.isEnd = true;
        });

        this.gameEndsSubscription = this.cardService.lastCard$.subscribe(()=>{
            this.isEnd = true;
        })
    }

    ngOnDestroy() {
        this.cardServiceSubscription.unsubscribe();
    }
}