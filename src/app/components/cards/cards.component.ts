import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';

@Component({
    selector: 'cards',
    templateUrl: '../../components/cards/cards.component.html',
    styleUrls: ['../../components/cards/cards.component.scss']
})

export class CardsComponent implements OnInit, OnDestroy {
    cardServiceSubscription: Subscription;
    card: Card;

    constructor(private cardService: CardService) { }

    ngOnInit() {
        this.cardServiceSubscription = this.cardService.cardDealt$.subscribe(card => {
            this.card = card;
        });
    }

    ngOnDestroy() {
        this.cardServiceSubscription.unsubscribe();
    }
}