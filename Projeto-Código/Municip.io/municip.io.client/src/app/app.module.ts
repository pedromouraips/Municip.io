import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BannerComponent } from './landingpage/banner/banner.component';
import { AboutusComponent } from './aboutus/aboutus/aboutus.component';
import { CardComponent } from './landingpage/card/card.component';
import { LandingComponent } from './landingpage/landing/landing.component';
import { BtnMunicipBlueComponent } from './utils/buttons/btn-municip-blue/btn-municip-blue.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CardTeamComponent } from './aboutus/card-team/card-team.component';
import { LoginComponent } from './login/login.component';
import { ShowHidePasswordComponent } from './utils/show-hide-password/show-hide-password.component';
import { TermsconditionsComponent } from './termsconditions/termsconditions.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    AboutusComponent,
    CardComponent,
    LandingComponent,
    BtnMunicipBlueComponent,
    HeaderComponent,
    FooterComponent,
    CardTeamComponent,
    LoginComponent,
    ShowHidePasswordComponent,
    TermsconditionsComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
