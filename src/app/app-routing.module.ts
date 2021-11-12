import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardsComponent } from './components/cards/cards.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {path: "play", component: CardsComponent},
  {path: "settings", component: SettingsComponent},
  { path: '', redirectTo: 'play', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
