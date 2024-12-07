import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { ErrorComponent } from './components/error/error.component';

export const routes: Routes = [

    //HOME
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },

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
