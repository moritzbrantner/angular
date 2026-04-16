import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly exact?: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-root',
  },
})
export class App {
  protected readonly navItems: readonly NavItem[] = [
    { href: '/', label: 'Home', exact: true },
    { href: '/templates', label: 'Templates' },
    { href: '/showcase', label: 'Showcase' },
    { href: '/docs', label: 'Docs' },
    { href: '/about', label: 'About' },
  ];

  protected readonly currentYear = new Date().getFullYear();
}
