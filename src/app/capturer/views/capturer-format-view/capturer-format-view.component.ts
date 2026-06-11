import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DelegationApiService } from '@admin/views/catalogs/shared/delegation-api.service';
import { DependenceApiService } from '@admin/views/catalogs/shared/dependence-api.service';
import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { MemberApiService } from '@admin/views/catalogs/shared/member-api.service';
import { DelegationResponse, DependenceResponse } from '@shared/interfaces';
import { EventFileResponse } from '@shared/interfaces/event-file.interface';
import { EventMemberResponse } from '@shared/interfaces/event-member.interface';
import { MemberResponse } from '@shared/interfaces/member.interface';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap, take, takeUntil } from 'rxjs';

export interface FormatMemberRow {
  member: EventMemberResponse;
  trabajadorEstudiante: boolean;
  boletaOriginal: boolean;
  constanciaOriginal: boolean;
  reciboOriginal: boolean;
  sobrePago: boolean;
  actaNacimiento: boolean;
  boletaCopia: boolean;
  constanciaCopia: boolean;
  reciboCopia: boolean;
  constanciaCarta: boolean;
  reciboCarta: boolean;
  exento: boolean;
}

function toFormatRow(m: EventMemberResponse): FormatMemberRow {
  return {
    member: m,
    trabajadorEstudiante: false,
    boletaOriginal: false,
    constanciaOriginal: false,
    reciboOriginal: false,
    sobrePago: false,
    actaNacimiento: false,
    boletaCopia: false,
    constanciaCopia: false,
    reciboCopia: false,
    constanciaCarta: false,
    reciboCarta: false,
    exento: false,
  };
}

@Component({
  selector: 'app-capturer-format-view',
  imports: [RouterLink, FormsModule, NgFor, NgIf],
  templateUrl: './capturer-format-view.component.html',
  styleUrl: './capturer-format-view.component.scss',
  standalone: true
})
export class CapturerFormatViewComponent implements OnInit, OnDestroy {
  eventId = '';

  // EventFile
  eventFileId: string | null = null;
  saving = false;
  private allEventFiles: EventFileResponse[] = [];

  // Delegación y dependencia
  dependenceName = '';
  selectedDelegationId = '';
  selectedDelegation: DelegationResponse | null = null;

  // Catálogos
  dependences: DependenceResponse[] = [];
  filteredDependences: DependenceResponse[] = [];
  showDependenceDropdown = false;
  delegations: DelegationResponse[] = [];

  readonly schoolLevels = [
    'Educación Inicial',
    'Preescolar',
    'Primaria',
    'Secundaria',
    'Bachillerato',
    'Preparatoria',
    'Profesional Técnico',
    'Técnico Superior Universitario (TSU)',
    'Licenciatura',
    'Ingeniería',
    'Especialidad',
    'Maestría',
    'Doctorado',
  ];

  // Filas de la tabla (EventMembers)
  memberRows: FormatMemberRow[] = [];
  loadingMembers = false;

  // Búsqueda de miembros
  searchTerm = '';
  searchResults: MemberResponse[] = [];
  selectedSearchMember: MemberResponse | null = null;
  showSearchDropdown = false;
  loadingSearch = false;
  addingMember = false;
  searchError: string | null = null;

  private readonly searchInput$ = new Subject<string>();
  private readonly unsubscribe = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventApiService: EventApiService,
    private readonly dependenceApiService: DependenceApiService,
    private readonly delegationApiService: DelegationApiService,
    private readonly memberApiService: MemberApiService,
  ) {
    this.eventId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit() {
    this.dependenceApiService.onList().pipe(take(1)).subscribe(data => {
      this.dependences = data;
    });

    this.delegationApiService.onList({ dependenceId: null, name: '' }).pipe(take(1)).subscribe(data => {
      this.delegations = data;
    });

    this.eventApiService.onFindFile({ eventId: this.eventId }).pipe(take(1)).subscribe(files => {
      this.allEventFiles = files ?? [];
    });

    this.initMemberSearch();
  }

  // ── Búsqueda de miembros ──────────────────────────────────────
  private initMemberSearch() {
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term || term.length < 2) {
          this.searchResults = [];
          this.showSearchDropdown = false;
          return of([]);
        }
        this.loadingSearch = true;
        return this.memberApiService.listByName(term);
      }),
      takeUntil(this.unsubscribe),
    ).subscribe({
      next: (results) => {
        this.loadingSearch = false;
        this.searchResults = results;
        this.showSearchDropdown = results.length > 0;
      },
      error: () => { this.loadingSearch = false; },
    });
  }

  onSearchInput() {
    this.selectedSearchMember = null;
    this.searchError = null;
    this.searchInput$.next(this.searchTerm);
  }

  selectSearchMember(member: MemberResponse) {
    this.selectedSearchMember = member;
    this.searchTerm = member.full_name;
    this.showSearchDropdown = false;
    this.searchResults = [];
    this.searchError = null;
  }

  hideSearchDropdown() {
    setTimeout(() => { this.showSearchDropdown = false; }, 200);
  }

  addMember() {
    if (!this.selectedSearchMember || !this.eventFileId || !this.selectedDelegation?.dependence?.uuid) return;

    this.addingMember = true;
    this.searchError = null;

    this.eventApiService.onSaveEventMember({
      eventFileId: this.eventFileId,
      memberId: this.selectedSearchMember.uuid,
      dependenceId: this.selectedDelegation.dependence.uuid,
      full_name: this.selectedSearchMember.full_name,
      child_name: null,
      school_level: null,
      observations: '',
      approved: false,
      status: true,
    }).pipe(take(1)).subscribe({
      next: (result) => {
        this.memberRows = [...this.memberRows, toFormatRow(result)];
        this.addingMember = false;
        this.resetSearch();
      },
      error: (err) => {
        this.addingMember = false;
        this.searchError = err?.error?.message ?? 'El miembro ya está registrado en este archivo';
      },
    });
  }

  private resetSearch() {
    this.searchTerm = '';
    this.selectedSearchMember = null;
    this.searchResults = [];
    this.showSearchDropdown = false;
    this.searchError = null;
  }

  // ── Delegación ────────────────────────────────────────────────
  onDelegationChange() {
    this.eventFileId = null;
    this.dependenceName = '';
    this.memberRows = [];
    this.selectedDelegation = null;
    this.resetSearch();

    if (!this.selectedDelegationId) return;

    // Cargar delegación completa (con dependence) para poder agregar miembros
    this.delegationApiService.onGet(this.selectedDelegationId).pipe(take(1)).subscribe(del => {
      this.selectedDelegation = del;
    });

    const existing = this.allEventFiles.find(
      f => f.deletation?.uuid === this.selectedDelegationId
    );

    if (existing) {
      this.eventFileId = existing.uuid;
      this.dependenceName = existing.dependence_name ?? '';
      this.loadMembers(existing.uuid);
    } else {
      this.saving = true;
      this.eventApiService.onSaveEventFile({
        eventId: this.eventId,
        delegationId: this.selectedDelegationId,
        dependence_name: null,
      }).pipe(take(1)).subscribe({
        next: (file) => {
          this.eventFileId = file.uuid;
          this.allEventFiles = [...this.allEventFiles, file];
          this.saving = false;
        },
        error: () => { this.saving = false; }
      });
    }
  }

  private loadMembers(eventFileId: string) {
    this.loadingMembers = true;
    this.eventApiService.onListEventMembers(eventFileId).pipe(take(1)).subscribe({
      next: (members) => {
        this.memberRows = members.map(toFormatRow);
        this.loadingMembers = false;
      },
      error: () => { this.loadingMembers = false; }
    });
  }

  // ── Dependencia (autocomplete) ────────────────────────────────
  onDependenceInput() {
    const val = this.dependenceName.toLowerCase().trim();
    if (!val) { this.showDependenceDropdown = false; return; }
    this.filteredDependences = this.dependences.filter(d =>
      d.name.toLowerCase().includes(val)
    );
    this.showDependenceDropdown = this.filteredDependences.length > 0;
  }

  selectDependence(dep: DependenceResponse) {
    this.dependenceName = dep.name;
    this.showDependenceDropdown = false;
    this.autoSaveDependence();
  }

  hideDependenceDropdown() {
    setTimeout(() => { this.showDependenceDropdown = false; }, 200);
  }

  onDependenceBlur() {
    this.hideDependenceDropdown();
    this.autoSaveDependence();
  }

  private autoSaveDependence() {
    if (!this.eventFileId || !this.selectedDelegationId) return;
    this.saving = true;
    this.eventApiService.onSaveEventFile({
      uuid: this.eventFileId,
      eventId: this.eventId,
      delegationId: this.selectedDelegationId,
      dependence_name: this.dependenceName || null,
    }).pipe(take(1)).subscribe({
      next: (file) => {
        const idx = this.allEventFiles.findIndex(f => f.uuid === file.uuid);
        if (idx >= 0) this.allEventFiles[idx] = file;
        this.saving = false;
      },
      error: () => { this.saving = false; }
    });
  }

  // ── Auto-guardado de campos del miembro ──────────────────────
  saveField(row: FormatMemberRow, field: 'child_name' | 'school_level' | 'observations', value: string) {
    const current = row.member[field] ?? '';
    if (value === current) return;

    (row.member as any)[field] = value;
    this.persistMember(row.member);
  }

  toggleApproved(row: FormatMemberRow) {
    row.member.approved = !row.member.approved;
    this.persistMember(row.member);
  }

  private persistMember(m: EventMemberResponse) {
    if (!this.eventFileId) return;
    this.eventApiService.onSaveEventMember({
      uuid: m.uuid,
      eventFileId: this.eventFileId,
      memberId: m.member.uuid,
      dependenceId: m.dependence.uuid,
      full_name: m.full_name,
      child_name: m.child_name,
      school_level: m.school_level,
      observations: m.observations,
      approved: m.approved,
      status: m.status,
    }).pipe(take(1)).subscribe({
      next: (result) => {
        const idx = this.memberRows.findIndex(r => r.member.uuid === result.uuid);
        if (idx >= 0) this.memberRows[idx].member = result;
      },
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
