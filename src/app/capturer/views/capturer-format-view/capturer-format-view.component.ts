import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DelegationApiService } from '@admin/views/catalogs/shared/delegation-api.service';
import { DependenceApiService } from '@admin/views/catalogs/shared/dependence-api.service';
import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { DelegationResponse, DependenceResponse } from '@shared/interfaces';
import { EventFileResponse } from '@shared/interfaces/event-file.interface';
import { take } from 'rxjs';

@Component({
  selector: 'app-capturer-format-view',
  imports: [RouterLink, FormsModule, NgFor, NgIf, SlicePipe],
  templateUrl: './capturer-format-view.component.html',
  styleUrl: './capturer-format-view.component.scss',
  standalone: true
})
export class CapturerFormatViewComponent implements OnInit {
  eventId = '';
  rows = Array.from({ length: 17 }, (_, i) => i + 1);

  // Estado del EventFile actual
  eventFileId: string | null = null;
  saving = false;

  // Campos del formulario
  dependenceName = '';
  selectedDelegationId = '';

  // Catálogos
  dependences: DependenceResponse[] = [];
  filteredDependences: DependenceResponse[] = [];
  showDependenceDropdown = false;
  delegations: DelegationResponse[] = [];

  // Cache de EventFiles del evento
  private allEventFiles: EventFileResponse[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventApiService: EventApiService,
    private readonly dependenceApiService: DependenceApiService,
    private readonly delegationApiService: DelegationApiService,
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

    // Carga todos los EventFiles del evento en caché local
    this.eventApiService.onFindFile({ eventId: this.eventId }).pipe(take(1)).subscribe(files => {
      this.allEventFiles = files ?? [];
    });
  }

  // ── Delegación ────────────────────────────────────────────────
  onDelegationChange() {
    this.eventFileId = null;
    this.dependenceName = '';

    if (!this.selectedDelegationId) return;

    const existing = this.allEventFiles.find(
      f => f.deletation?.uuid === this.selectedDelegationId
    );

    if (existing) {
      this.eventFileId = existing.uuid;
      this.dependenceName = existing.dependence_name ?? '';
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
}
