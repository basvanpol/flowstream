import { UtilsModule } from './components/utils/utils.module';
import { SelectConfirmationModalComponent } from './components/shared/modals/select-confirmation-modal/select-confirmation-modal.component';
import { AuthGuard } from './services/guards/auth-guard.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RoutesModule } from './routes/routes.module';
import { ServicesModule } from './services/services.module';
import { RootStoreModule } from './store/root-store.module';
import { FeaturesModule } from './components/features/features.module';
import { SharedModule } from './components/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { IconModule } from './components/shared/icon-font/icon-font.module';
import { environment } from './environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    SelectConfirmationModalComponent
  ],
  imports: [
    UtilsModule,
    CommonModule,
    ServicesModule,
    BrowserModule,
    IconModule,
    SharedModule,
    FeaturesModule,
    RootStoreModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RoutesModule,
    RouterModule,
    HttpClientModule,
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  entryComponents: [
    SelectConfirmationModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
