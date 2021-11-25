import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { shareReplay, startWith } from 'rxjs/operators';
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
    private gameEnds = new Subject<string>();
    private cards: Card[];
    private speed: number;

    //Speaking API
    private currentLanguage: string;
    private utterance = new SpeechSynthesisUtterance();

    cardDealt$ = this.cardSource.asObservable();
    lastCard$ = this.gameEnds.asObservable();

    cards$ = this.httpClient.get<Card[]>('http://api.loteria.com/cards')
        .pipe(
            shareReplay(1)
        );

    constructor(private settingsService: SettingsService, private controlService: ControlService, private httpClient: HttpClient) {
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
            if (this.cards.length == 0) {
                this.endPlay();
                return;
            }

            this.shuffleCards();
            var cardDealt = this.popFirstCard();
            this.dealCard(cardDealt);
            this.speak(cardDealt);
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
        this.gameEnds.next();
        this.intervalSubscription?.unsubscribe();
        this.speedSubscription?.unsubscribe();
        this.languageSubscription?.unsubscribe();
        this.interval = null;
        this.resetCards();
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
        this.cards$.subscribe(cards => this.cards = cards);
    }
}