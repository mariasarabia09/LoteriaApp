import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';

import * as $ from 'jquery';

@Component({
    selector: 'card-carousel',
    templateUrl: '../../components/card-carousel/card-carousel.component.html',
    styleUrls: ['../../components/card-carousel/card-carousel.component.scss']
})

export class CardCarouselComponent {
    constructor(private cardService: CardService) { }

    cardServiceSubscription: Subscription;
    pastCards: Card[] = [];
    dealtCard: Card;
    gameStarted: Boolean = false;
    defaultCards: Card[];

    ngOnInit() {
        this.cardService.cards$.subscribe(cards => {
            this.defaultCards = cards;
        });

        this.cardServiceSubscription = this.cardService.cardDealt$.subscribe(card => {
            if (!this.gameStarted) {
                this.gameStarted = true;
                let options = $('#carousel-example').data();
                options.interval = false;
            }

            if (this.dealtCard) {
                this.pastCards.push(this.dealtCard);

                if (this.pastCards.length > 4) {
                    this.moveCarouselRight();
                }
            }

            this.dealtCard = card;
        });
    };

    moveCarouselRight() {
        let activeElement = $('.carousel-item.active');
        let nextElementId = parseInt(activeElement[0].id.split('_')[1]) + 1;
        let nextElement = $('#card_' + nextElementId);

        activeElement.removeClass("active");
        nextElement.addClass("active");
    };
}