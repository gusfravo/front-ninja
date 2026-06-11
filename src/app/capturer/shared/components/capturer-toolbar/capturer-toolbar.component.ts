import { MenuInterface } from '../../interfaces/menu.interface';
import { CapturerMenuSignalService } from '../../services/menu-signal.service';
import { NgClass } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@core/auth/service/auth.service';

@Component({
  selector: 'app-capturer-toolbar',
  imports: [
    RouterOutlet,
    NgClass,
    RouterLink
  ],
  templateUrl: './capturer-toolbar.component.html',
  styleUrl: './capturer-toolbar.component.scss',
  standalone: true
})
export class CapturerToolbarComponent {
  menuSignal!: Signal<MenuInterface>;

  constructor(
    private readonly menuSignalService: CapturerMenuSignalService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.menuSignal = this.menuSignalService.menuSignal;
  }

  onChangeMenuStatus() {
    let menuData = this.menuSignal();
    menuData.isOpen = !menuData.isOpen;
    this.menuSignalService.onUpdate(menuData);
  }

  onLogout() {
    this.authService.onLogout();
    this.router.navigate(['/capturer/login']);
  }
}
