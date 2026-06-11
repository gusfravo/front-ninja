import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MemberApiService } from '@admin/views/catalogs/shared/member-api.service';
import { MemberResponse } from '@shared/interfaces/member.interface';
import { Subject, takeUntil, tap } from 'rxjs';

interface MemberForm {
  full_name: string;
  rfc: string;
  birth_date: string;
  department: string;
  nom: string;
  secretary: string;
  contribution: boolean;
  status: boolean;
}

@Component({
  selector: 'app-admin-catalog-members-modal',
  imports: [FormsModule, NgIf],
  templateUrl: './admin-catalog-members-modal.component.html',
  styleUrl: './admin-catalog-members-modal.component.scss',
})
export class AdminCatalogMembersModalComponent implements OnInit, OnDestroy {
  private readonly data = inject<{ member?: MemberResponse }>(DIALOG_DATA);
  private readonly dialogRef = inject(DialogRef);
  private readonly unsubscribe = new Subject<void>();

  loading = false;

  form: MemberForm = {
    full_name: '',
    rfc: '',
    birth_date: '',
    department: '',
    nom: '',
    secretary: '',
    contribution: false,
    status: true,
  };

  constructor(private readonly memberApiService: MemberApiService) {}

  ngOnInit() {
    if (this.data?.member) {
      const m = this.data.member;
      this.form = {
        full_name: m.full_name ?? m.fullName ?? '',
        rfc: m.rfc ?? '',
        birth_date: m.birthDate ?? '',
        department: m.department ?? '',
        nom: m.nom ?? '',
        secretary: m.secretary ?? '',
        contribution: m.contribution ?? false,
        status: m.status ?? true,
      };
    }
  }

  get isEdit(): boolean {
    return !!this.data?.member?.uuid;
  }

  onSave() {
    if (!this.form.full_name || !this.form.rfc) return;
    this.loading = true;

    const payload: any = { ...this.form };
    if (this.isEdit) payload['uuid'] = this.data.member!.uuid;

    this.memberApiService.save(payload).pipe(
      takeUntil(this.unsubscribe),
      tap((result) => {
        this.loading = false;
        this.dialogRef.close(result);
      }),
    ).subscribe({ error: () => { this.loading = false; } });
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
