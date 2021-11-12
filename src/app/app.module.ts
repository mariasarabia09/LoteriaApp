import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CardsComponent } from './components/cards/cards.component';
import { ControlsComponent } from './components/controls/controls.component';
import { CardCarouselComponent } from './components/card-carousel/card-carousel.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    CardsComponent,
    ControlsComponent,
    CardCarouselComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
