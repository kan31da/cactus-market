import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { ErrorComponent } from './components/error/error.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ErrorMsgComponent } from './components/error-msg/error-msg.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyCactusesComponent } from './components/my-cactuses/my-cactuses.component';
import { DetailsComponent } from './components/details/details.component';
import { AddCactusComponent } from './components/add-cactus/add-cactus.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
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
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }

    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
    },

    //CACTUSES
    {
        path: 'shop',
        component: ShopComponent
    },
    {
        path: 'my-cactuses',
        component: MyCactusesComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        // path: 'add-cactus',
        // component: AddCactusComponent,
        // canActivate: [AuthGuard],
        // data: { authGuardPipe: redirectUnauthorizedToLogin }

        path: 'add-cactus', children: [
            { path: '', component: AddCactusComponent, },
            { path: ':cactusId', component: AddCactusComponent, }
        ],
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        path: 'details/:cactusId',
        component: DetailsComponent
    },


    //ERROR    
    { path: 'error', component: ErrorMsgComponent },
    { path: '404', component: ErrorComponent },
    { path: '**', redirectTo: '/404' },
];
