import { MenuInterface } from '@admin/shared/interfaces/menu.interface';
import { MenuSignalService } from '@admin/shared/services/menu-signal.service';
import { NgClass } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-toolbar',
  imports: [
    RouterOutlet,
    NgClass,
    RouterLink
  ],
  templateUrl: './admin-toolbar.component.html',
  styleUrl: './admin-toolbar.component.scss',
  standalone: true
})
export class AdminToolbarComponent {
  menuSignal!: Signal<MenuInterface>;

  constructor(private readonly menuSignalService: MenuSignalService) {
    this.menuSignal = this.menuSignalService.menuSignal;
  }

  onChangeMenuStatus() {
    let menuData = this.menuSignal();
    menuData.isOpen = !menuData.isOpen;
    this.menuSignalService.onUpdate(menuData);
  }

}
