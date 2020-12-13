import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { MenuComponent } from './layouts/menu/menu.component';
import { LoginComponent } from './login/login.component';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import { BoardmemberComponent } from './boardmember/boardmember.component';
import {TabViewModule} from 'primeng/tabview';
import { NotificationsComponent } from './notifications/notifications.component';
import {AccordionModule} from 'primeng/accordion';
import {DialogModule} from 'primeng/dialog';
import {FileUploadModule} from 'primeng/fileupload';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {TooltipModule} from 'primeng/tooltip';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputMaskModule} from 'primeng/inputmask';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ChipsModule} from 'primeng/chips';
import {EditorModule} from 'primeng/editor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegistrationComponent } from './registration/registration.component';
import { GenericdialogComponent } from './genericdialog/genericdialog.component';
import { BoardDetailsComponent } from './board-details/board-details.component';
import { FooterComponent } from './footer/footer.component';
import { MessageService } from 'primeng/api';
import { NotificationByGroupNameComponent } from './notification-by-group-name/notification-by-group-name.component';
import { LoaderService } from './loader.service';
import { LoaderInterceptorService } from './loader-interceptor.service';
import { InvitemembersComponent } from './invitemembers/invitemembers.component';
import { RegistrationapproveComponent } from './registrationapprove/registrationapprove.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    LoginComponent,
    BoardmemberComponent,
    NotificationsComponent,
    RegistrationComponent,
    GenericdialogComponent,
    BoardDetailsComponent,
    FooterComponent,
    NotificationByGroupNameComponent,
    InvitemembersComponent,
    RegistrationapproveComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    ButtonModule,
    InputTextModule,
    PanelModule,
    CardModule,
    TabViewModule,
    AccordionModule,
    InputMaskModule,
    DialogModule,
    FileUploadModule,
    InputTextareaModule,
    DropdownModule,
    MultiSelectModule,
    TableModule,
    ToastModule,
    ProgressSpinnerModule,
    TooltipModule,
    ChipsModule,
    EditorModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},
     MessageService,
     LoaderService,
     { provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class AppModule { }
