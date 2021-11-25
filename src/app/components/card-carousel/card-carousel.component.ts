import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';

import * as $ from 'jquery';
import { variable } from '@angular/compiler/src/output/output_ast';

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
    lastFourCardsOfDeck: Boolean = false;

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

            // console.log($('#carousel-example')[0].dataset.in);

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
    }

        /*refillDefaultDeckOfCards(index: number): boolean{
        if (index == 6)
        {
            console.log("there");

            this.defaultCards.push({
                cardId: 13,
                cardNameSpanish: "El Gorrito",
                cardNameEnglish: "The Bonnet",
                imageUrl: "assets/images/13 - El Gorrito.jpg"
            });
        }

        return true;

        if(index + 4 >= this.defaultCards.length)
        {
            let variables = this.cardService.getDefaultCards();
            variables.forEach((variable: Card) =>
            {
                this.defaultCards.push(variable);
                console.log(this.defaultCards.length);
            });
        }
        console.log("there");

    }*/
}