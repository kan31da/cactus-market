import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { ErrorComponent } from './components/error/error.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ErrorMsgComponent } from './components/error-msg/error-msg.component';


const redirectUnauthorizedToLanding = () => redirectUnauthorizedTo(['auth', 'login']);

const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

export const routes: Routes = [

    //HOME
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },

    //USER
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }

        // canActivate: [AuthGuard],
        // data: { authGuardPipe: redirectUnauthorizedToLanding }
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }

        // canActivate: [AuthGuard],
        // data: { authGuardPipe: redirectUnauthorizedToLanding }
    },

    //SHOP  
    {
        path: 'shop', children: [
            { path: '', component: ShopComponent },
            // { path: ':cactusId', component:  }
        ],

        // canActivate: [AuthGuard]
    },

    //ERROR    
    { path: 'error', component: ErrorMsgComponent },
    { path: '404', component: ErrorComponent },
    { path: '**', redirectTo: '/404' },
];
