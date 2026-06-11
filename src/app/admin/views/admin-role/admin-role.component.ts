import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { RoleApiService } from './role-api.service';
import { RoleResponse } from '@shared/interfaces';

@Component({
  selector: 'app-admin-role',
  imports: [RouterLink],
  templateUrl: './admin-role.component.html',
  styleUrl: './admin-role.component.scss'
})
export class AdminRoleComponent {
  unsubscribe = new Subject<void>();
  instanceList: RoleResponse[] = [];

  constructor(private readonly roleApiService: RoleApiService) {}

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.roleApiService.onList().pipe(
      takeUntil(this.unsubscribe),
      take(1),
      tap(data => { this.instanceList = data; })
    ).subscribe();
  }

  onDelete(uuid: string) {
    this.roleApiService.onDelete(uuid).pipe(
      takeUntil(this.unsubscribe),
      tap(() => { this.loadList(); })
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
