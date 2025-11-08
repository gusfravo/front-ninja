import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { MenuInterface } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuSignalService {

  private menu: WritableSignal<MenuInterface> = signal<MenuInterface>({ isOpen: false });

  public menuSignal: Signal<MenuInterface> = computed(() => this.menu());

  constructor() { }

  onUpdate(value: MenuInterface): void {
    this.menu.set(value)
  }
}
