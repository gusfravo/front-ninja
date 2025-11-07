import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { login } from '../../../../shared/domain';
import { Login } from '@shared/models/login.constant';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginFormService {

  private login: WritableSignal<login> = signal<login>(structuredClone(Login));

  public loginSignal: Signal<login> = computed(() => this.login());

  constructor() { }

  onUpdate(login: login): void {
    this.login.set(login);
  }
}
