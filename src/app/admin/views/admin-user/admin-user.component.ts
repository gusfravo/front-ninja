import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { UserApiService } from './user-api.service';
import { UserResponse } from '@shared/interfaces';

@Component({
  selector: 'app-admin-user',
  imports: [RouterLink],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.scss'
})
export class AdminUserComponent {
  unsubscribe = new Subject<void>();
  instanceList: UserResponse[] = [];

  constructor(private readonly userApiService: UserApiService) {}

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.userApiService.onList().pipe(
      takeUntil(this.unsubscribe),
      take(1),
      tap(data => { this.instanceList = data; })
    ).subscribe();
  }

  onDelete(uuid: string) {
    this.userApiService.onDelete(uuid).pipe(
      takeUntil(this.unsubscribe),
      tap(() => { this.loadList(); })
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
