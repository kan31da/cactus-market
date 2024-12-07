import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    activeLink: string = '/home';

    constructor(private router: Router) {     
      this.router.events.subscribe(() => {
        this.activeLink = this.router.url; // Update the active link
      });
    }
  
    isActive(link: string): boolean {
      return this.activeLink === link;
    }
}
