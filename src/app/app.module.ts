import {NgtUniversalModule} from '@ng-toolkit/universal';
import {CommonModule} from '@angular/common';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BasicLayoutComponent} from './layout/basic-layout/basic-layout.component';
import {RoutingModule} from './routing/routing-module/routing.module';
import {CollectorComponent} from './collector/collector.component';
import {ItemComponent} from './item/item.component';
import {HttpClientModule} from '@angular/common/http';
import {interceptorProvider} from './interceptor';
import {FormsModule} from '@angular/forms';
import {AboutComponent} from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    BasicLayoutComponent,
    CollectorComponent,
    ItemComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpClientModule,
    RoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    interceptorProvider
  ],
})
export class AppModule {
}
