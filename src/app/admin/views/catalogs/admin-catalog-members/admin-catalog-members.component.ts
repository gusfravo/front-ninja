import { MemberApiService } from '@admin/views/catalogs/shared/member-api.service';
import { AdminCatalogMembersModalComponent } from './components/admin-catalog-members-modal/admin-catalog-members-modal.component';
import { NgIf, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { MemberResponse } from '@shared/interfaces/member.interface';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-members',
  imports: [NgIf, NgFor, FormsModule, DialogModule],
  templateUrl: './admin-catalog-members.component.html',
  styleUrl: './admin-catalog-members.component.scss',
})
export class AdminCatalogMembersComponent implements OnInit, OnDestroy {
  memberList: MemberResponse[] = [];
  filterName = '';
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;

  private readonly searchSubject = new Subject<string>();
  private readonly unsubscribe = new Subject<void>();

  constructor(
    private readonly memberApiService: MemberApiService,
    private readonly dialog: Dialog,
  ) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.unsubscribe),
    ).subscribe(() => {
      this.page = 1;
      this.loadList();
    });
    this.loadList();
  }

  get pages(): number[] {
    const range: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  }

  onSearchChange() {
    this.searchSubject.next(this.filterName);
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.page = p;
    this.loadList();
  }

  private loadList() {
    this.memberApiService.list({ page: this.page, limit: this.limit, name: this.filterName }).pipe(
      takeUntil(this.unsubscribe),
      tap((res) => {
        this.memberList = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.page = res.page;
      }),
    ).subscribe();
  }

  openModal(member?: MemberResponse) {
    const ref = this.dialog.open(AdminCatalogMembersModalComponent, {
      minWidth: '520px',
      data: { member },
    });

    ref.closed.pipe(takeUntil(this.unsubscribe)).subscribe((result) => {
      if (!result) return;
      this.page = 1;
      this.loadList();
    });
  }

  deleteMember(uuid: string) {
    this.memberApiService.delete(uuid).pipe(
      takeUntil(this.unsubscribe),
      tap(() => {
        if (this.memberList.length === 1 && this.page > 1) this.page--;
        this.loadList();
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
