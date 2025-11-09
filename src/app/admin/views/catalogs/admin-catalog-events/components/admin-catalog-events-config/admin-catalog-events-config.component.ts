import { EventApiService } from '@admin/views/catalogs/shared/event-api.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventInterface, EventResponse } from '@shared/interfaces/event.interface';
import { Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-admin-catalog-events-config',
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
    FormsModule
  ],
  templateUrl: './admin-catalog-events-config.component.html',
  styleUrl: './admin-catalog-events-config.component.scss'
})
export class AdminCatalogEventsConfigComponent {
  object!: EventResponse;
  @Input() uuid!: string;
  file?: File;
  previewUrl: string | null = null;
  error: string | null = null;
  readonly MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  unsubscribe = new Subject();
  metadata = {
    fileUploated: false,
    sheetNameSelected: ''
  }

  sheetNames$!: Observable<string[]>

  constructor(private readonly eventApiService: EventApiService) {

  }

  ngOnInit() {
    this.eventApiService.onGet(this.uuid).pipe(
      takeUntil(this.unsubscribe),
      tap(response => {
        this.object = response
      }),
      switchMap(event => {
        return this.eventApiService.onFindExcel({ eventId: event.uuid }).pipe(
          tap(data => {
            if (data) {
              this.metadata.fileUploated = true;
              this.sheetNames$ = this.eventApiService.onGetSheets({ eventId: this.object.uuid });

            }
          })
        )
      })
    ).subscribe()
  }
  ngOnDestroy() {
    this.unsubscribe.next(null)
    this.unsubscribe.complete()
  }


  onFileSelected(event: Event) {
    this.error = null;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const f = input.files[0];

    if (f.size > this.MAX_SIZE) {
      this.error = 'El archivo excede 5 MB';
      return;
    }
    /*
    // validación de tipo
    if (!f.type.startsWith('image/')) {
      this.error = 'Solo imágenes permitidas';
      return;
    }
    */

    this.file = f;

    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(f);
  }


  upload() {
    if (!this.file) {
      this.error = 'Selecciona un archivo primero';
      return;
    }
    return this.eventApiService.onUploadFileExcel({ file: this.file, eventId: this.object.uuid }).pipe(
      takeUntil(this.unsubscribe),
      tap(_ => {
        this.metadata.fileUploated = true;
        this.sheetNames$ = this.eventApiService.onGetSheets({ eventId: this.object.uuid });
      })
    ).subscribe()
    /*
    this.uploadService.uploadFile(this.file).subscribe({
      next: res => console.log('subida ok', res),
      error: err => this.error = 'Error al subir'
    });
    */
  }

  clear() {
    this.file = undefined;
    this.previewUrl = null;
    this.error = null;
  }


  processExcel() {
    return this.eventApiService.onExecuteExcel({ eventId: this.object.uuid, sheetName: this.metadata.sheetNameSelected }).pipe(
      takeUntil(this.unsubscribe),
      tap(_ => {
        console.log("Procesado exitosamente!!!");
      })
    ).subscribe()

  }

}
