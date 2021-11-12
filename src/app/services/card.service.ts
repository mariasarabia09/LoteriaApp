import { Injectable } from '@angular/core';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Card } from '../models/card';
import { Settings } from '../models/settings';
import { ControlService } from './control.service';
import { SettingsService } from './settings.service';

@Injectable({
    providedIn: 'root',
})
export class CardService {
    private interval: Observable<number>;
    private intervalSubscription: Subscription;
    private speedSubscription: Subscription;
    private languageSubscription: Subscription;
    private cardSource = new Subject<Card>();
    private cards: Card[];
    private speed: number;

    //Speaking API
    private currentLanguage: string;
    private utterance = new SpeechSynthesisUtterance();

    cardDealt$ = this.cardSource.asObservable();

    constructor(private settingsService: SettingsService, private controlService: ControlService) {
        this.resetCards();

        this.controlService.started$.subscribe((settings: Settings) => {
            this.setLanguage(settings.language);
            this.beginPlay(settings.speed);
        });

        this.controlService.paused$.subscribe(() => {
            this.intervalSubscription?.unsubscribe();
            this.speedSubscription?.unsubscribe();
        });

        this.controlService.resumed$.subscribe(() => {
            let settings = this.settingsService.getCurrentSettings();
            this.beginPlay(settings.speed);
        });

        this.controlService.ended$.subscribe(() => {
            this.endPlay();
        });

        this.languageSubscription = this.settingsService.languageChanged$.subscribe(language => {
            this.setLanguage(language);
        });

        this.speedSubscription = this.settingsService.speedChanged$.subscribe(speed => {
            this.pausePlay();
            this.beginPlay(speed);
            this.speed = speed;
        });
    }

    beginPlay(period: number) {
        this.interval = interval(period);
        this.intervalSubscription = this.interval.pipe(startWith(0)).subscribe(val => {
            var cardDealt = this.popFirstCard();
            this.shuffleCards();
            this.dealCard(cardDealt);
            this.speak(cardDealt);

            if (this.cards.length == 0) {
                this.endPlay();
            }
        });
    }

    setLanguage(language: string) {
        this.currentLanguage = language;
    }

    speak(card: Card) {
        if (this.currentLanguage === 'English' || this.currentLanguage === 'Both') {
            this.utterance.lang = 'en-US';
            this.utterance.text = card.cardNameEnglish;
            window.speechSynthesis.speak(this.utterance);

            if (this.currentLanguage === 'English') {
                return;
            }
        }

        this.utterance.lang = 'es-US';
        this.utterance.text = card.cardNameSpanish;
        window.speechSynthesis.speak(this.utterance);
    }

    pausePlay() {
        this.intervalSubscription?.unsubscribe();
        this.speedSubscription?.unsubscribe();
    }

    endPlay() {
        this.intervalSubscription?.unsubscribe();
        this.speedSubscription?.unsubscribe();
        this.languageSubscription?.unsubscribe();
        this.interval = null;
        this.resetCards();
    }

    getDefaultCards() {
        return this.cards;
    }

    private shuffleCards() {
        var currentIndex = this.cards.length, temporaryValue, randomIndex;

        //Fisher-Yates (aka Knuth) Shuffle
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = temporaryValue;
        }
    }

    private popFirstCard() {
        return this.cards.shift();
    }

    private dealCard(card: Card) {
        this.cardSource.next(card);
    }

    private resetCards() {
        this.cards = [
            {
                cardId: 1,
                cardNameSpanish: "El Gallo",
                cardNameEnglish: "The Rooster",
                imageUrl: "assets/images/1 - El Gallo.jpg"
            },
            {
                cardId: 2,
                cardNameSpanish: "El Diablito",
                cardNameEnglish: "The Devil",
                imageUrl: "assets/images/2 - El Diablito.jpg"
            },
            {
                cardId: 3,
                cardNameSpanish: "La Dama",
                cardNameEnglish: "The Lady",
                imageUrl: "assets/images/3 - La Dama.jpg"
            },
            {
                cardId: 4,
                cardNameSpanish: "El Catrin",
                cardNameEnglish: "The Dandy",
                imageUrl: "assets/images/4 - El Catrin.jpg"
            },
            {
                cardId: 5,
                cardNameSpanish: "El Paraguas",
                cardNameEnglish: "The Umbrella",
                imageUrl: "assets/images/5 - El Paraguas.jpg"
            },
            {
                cardId: 6,
                cardNameSpanish: "La Sirena",
                cardNameEnglish: "The Mermaid",
                imageUrl: "assets/images/6 - La Sirena.jpg"
            },
            {
                cardId: 7,
                cardNameSpanish: "La Escalera",
                cardNameEnglish: "The Ladder",
                imageUrl: "assets/images/7 - La Escalera.jpg"
            },
            {
                cardId: 8,
                cardNameSpanish: "La Botella",
                cardNameEnglish: "The Bottle",
                imageUrl: "assets/images/8 - La Botella.jpg"
            }
            /*,
            {
                cardId: 9,
                cardNameSpanish: "El Barril",
                cardNameEnglish: "The Barrel",
                imageUrl: "assets/images/9 - El Barril.jpg"
            },
            {
                cardId: 10,
                cardNameSpanish: "El Arbol",
                cardNameEnglish: "The Tree",
                imageUrl: "assets/images/10 - El Arbol.jpg"
            },
            {
                cardId: 11,
                cardNameSpanish: "El Melon",
                cardNameEnglish: "The Canalope",
                imageUrl: "assets/images/11 - El Melon.jpg"
            },
            {
                cardId: 12,
                cardNameSpanish: "El Valiente",
                cardNameEnglish: "The Brave Man",
                imageUrl: "assets/images/12 - El Valiente.jpg"
            },
            {
                cardId: 13,
                cardNameSpanish: "El Gorrito",
                cardNameEnglish: "The Bonnet",
                imageUrl: "assets/images/13 - El Gorrito.jpg"
            },
            {
                cardId: 14,
                cardNameSpanish: "La Muerte",
                cardNameEnglish: "The Death",
                imageUrl: "assets/images/14 - La Muerte.jpg"
            },
            {
                cardId: 15,
                cardNameSpanish: "La Pera",
                cardNameEnglish: "The Pear",
                imageUrl: "assets/images/15 - La Pera.jpg"
            },
            {
                cardId: 16,
                cardNameSpanish: "La Bandera",
                cardNameEnglish: "The Flag",
                imageUrl: "assets/images/16 - La Bandera.jpg"
            },
            {
                cardId: 17,
                cardNameSpanish: "El Bandolon",
                cardNameEnglish: "The Guitar",
                imageUrl: "assets/images/17 - El Bandolon.jpg"
            },
            {
                cardId: 18,
                cardNameSpanish: "El Violoncello",
                cardNameEnglish: "The Violin",
                imageUrl: "assets/images/18 - El Violoncello.jpg"
            },
            {
                cardId: 19,
                cardNameSpanish: "La Garza",
                cardNameEnglish: "The Heron",
                imageUrl: "assets/images/19 - La Garza.jpg"
            },
            {
                cardId: 20,
                cardNameSpanish: "El Pajaro",
                cardNameEnglish: "The Bird",
                imageUrl: "assets/images/20 - El Pajaro.jpg"
            },
            {
                cardId: 21,
                cardNameSpanish: "La Mano",
                cardNameEnglish: "The Hand",
                imageUrl: "assets/images/21 - La Mano.jpg"
            },
            {
                cardId: 22,
                cardNameSpanish: "La Bota",
                cardNameEnglish: "The Boot",
                imageUrl: "assets/images/22 - La Bota.jpg"
            },
            {
                cardId: 23,
                cardNameSpanish: "La Luna",
                cardNameEnglish: "The Moon",
                imageUrl: "assets/images/23 - La Luna.jpg"
            },
            {
                cardId: 24,
                cardNameSpanish: "El Cotorro",
                cardNameEnglish: "The Parrot",
                imageUrl: "assets/images/24 - El Cotorro.jpg"
            },
            {
                cardId: 25,
                cardNameSpanish: "El Borracho",
                cardNameEnglish: "The Drunk",
                imageUrl: "assets/images/25 - El Borracho.jpg"
            },
            {
                cardId: 26,
                cardNameSpanish: "El Bailador",
                cardNameEnglish: "The Dancer",
                imageUrl: "assets/images/26 - El Bailador.jpg"
            },
            {
                cardId: 27,
                cardNameSpanish: "El Corazon",
                cardNameEnglish: "The Heart",
                imageUrl: "assets/images/27 - El Corazon.jpg"
            },
            {
                cardId: 28,
                cardNameSpanish: "La Sandia",
                cardNameEnglish: "The Watermelon",
                imageUrl: "assets/images/28 - La Sandia.jpg"
            },
            {
                cardId: 29,
                cardNameSpanish: "El Tambor",
                cardNameEnglish: "The Drum",
                imageUrl: "assets/images/29 - El Tambor.jpg"
            },
            {
                cardId: 30,
                cardNameSpanish: "El Camaron",
                cardNameEnglish: "The Shrimp",
                imageUrl: "assets/images/30 - El Camaron.jpg"
            },
            {
                cardId: 31,
                cardNameSpanish: "Las Jaras",
                cardNameEnglish: "The Arrows",
                imageUrl: "assets/images/31 - Las Jaras.jpg"
            },
            {
                cardId: 32,
                cardNameSpanish: "El Musico",
                cardNameEnglish: "The Musician",
                imageUrl: "assets/images/32 - El Musico.jpg"
            },
            {
                cardId: 33,
                cardNameSpanish: "La Arana",
                cardNameEnglish: "The Spider",
                imageUrl: "assets/images/33 - La Arana.jpg"
            },
            {
                cardId: 34,
                cardNameSpanish: "El Soldado",
                cardNameEnglish: "The Solder",
                imageUrl: "assets/images/34 - El Soldado.jpg"
            },
            {
                cardId: 35,
                cardNameSpanish: "La Estrella",
                cardNameEnglish: "The Star",
                imageUrl: "assets/images/35 - La Estrella.jpg"
            },
            {
                cardId: 36,
                cardNameSpanish: "El Cazo",
                cardNameEnglish: "The Saucepan",
                imageUrl: "assets/images/36 - El Cazo.jpg"
            },
            {
                cardId: 37,
                cardNameSpanish: "El Mundo",
                cardNameEnglish: "The World",
                imageUrl: "assets/images/37 - El Mundo.jpg"
            },
            {
                cardId: 38,
                cardNameSpanish: "El Apache",
                cardNameEnglish: "The Native",
                imageUrl: "assets/images/38 - El Apache.jpg"
            },
            {
                cardId: 39,
                cardNameSpanish: "El Nopal",
                cardNameEnglish: "The Cactus",
                imageUrl: "assets/images/39 - El Nopal.jpg"
            },
            {
                cardId: 40,
                cardNameSpanish: "El Alacran",
                cardNameEnglish: "The Scorpion",
                imageUrl: "assets/images/40 - El Alacran.jpg"
            },
            {
                cardId: 41,
                cardNameSpanish: "La Rosa",
                cardNameEnglish: "The Rose",
                imageUrl: "assets/images/41 - La Rosa.jpg"
            },
            {
                cardId: 42,
                cardNameSpanish: "La Calabera",
                cardNameEnglish: "The Skull",
                imageUrl: "assets/images/42 - La Calabera.jpg"
            },
            {
                cardId: 43,
                cardNameSpanish: "La Campana",
                cardNameEnglish: "The Bell",
                imageUrl: "assets/images/43 - La Campana.jpg"
            },
            {
                cardId: 44,
                cardNameSpanish: "El Cantarito",
                cardNameEnglish: "The Water Jar",
                imageUrl: "assets/images/44 - El Cantarito.jpg"
            },
            {
                cardId: 45,
                cardNameSpanish: "El Venado",
                cardNameEnglish: "The Deer",
                imageUrl: "assets/images/45 - El Venado.jpg"
            },
            {
                cardId: 46,
                cardNameSpanish: "El Sol",
                cardNameEnglish: "The Sun",
                imageUrl: "assets/images/46 - El Sol.jpg"
            },
            {
                cardId: 47,
                cardNameSpanish: "La Corona",
                cardNameEnglish: "The Crown",
                imageUrl: "assets/images/47 - La Corona.jpg"
            },
            {
                cardId: 48,
                cardNameSpanish: "La Chalupa",
                cardNameEnglish: "The Boat",
                imageUrl: "assets/images/48 - La Chalupa.jpg"
            },
            {
                cardId: 49,
                cardNameSpanish: "El Pino",
                cardNameEnglish: "The Pine Tree",
                imageUrl: "assets/images/49 - El Pino.jpg"
            },
            {
                cardId: 50,
                cardNameSpanish: "El Pescado",
                cardNameEnglish: "The Fish",
                imageUrl: "assets/images/50 - El Pescado.jpg"
            },
            {
                cardId: 51,
                cardNameSpanish: "La Palma",
                cardNameEnglish: "The Palm",
                imageUrl: "assets/images/51 - La Palma.jpg"
            },
            {
                cardId: 52,
                cardNameSpanish: "La Maceta",
                cardNameEnglish: "The Plant",
                imageUrl: "assets/images/52 - La Maceta.jpg"
            },
            {
                cardId: 53,
                cardNameSpanish: "El Arpa",
                cardNameEnglish: "The Harp",
                imageUrl: "assets/images/53 - El Arpa.jpg"
            },
            {
                cardId: 54,
                cardNameSpanish: "La Rana",
                cardNameEnglish: "The Frog",
                imageUrl: "assets/images/54 - La Rana.jpg"
            }*/
        ];
    }
}