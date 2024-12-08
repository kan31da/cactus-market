import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { ErrorComponent } from './components/error/error.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [

    //HOME
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },

    //USER
    { path: 'register', component: RegisterComponent, },
    { path: 'login', component: LoginComponent, },

    //SHOP  
    {
        path: 'shop', children: [
            { path: '', component: ShopComponent },
            // { path: ':cactusId', component:  }
        ],

        // canActivate: [AuthGuard]
    },

    //ERROR    
    { path: '404', component: ErrorComponent },
    { path: '**', redirectTo: '/404' },
];
