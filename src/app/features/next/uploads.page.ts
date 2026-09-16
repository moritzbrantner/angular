import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UploadClassifierService } from '../../core/services/upload-classifier.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { UploadQueueItem } from '../../shared/models/content.models';

@Component({
  selector: 'app-uploads-page',
  imports: [DecimalPipe],
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">{{ locale() === 'de' ? 'Plattformuebergreifender Upload-Starter' : 'Cross-platform upload starter' }}</p>
        <h1>Uploads</h1>
        <p class="lead-copy">
          {{ locale() === 'de' ? 'Eine Browser-Queue-Demo plus Entwurfsregeln fuer echte Storage-Flows.' : 'A browser queue demo plus the design rules you usually need before implementing real storage flows.' }}
        </p>
      </section>

      <section class="section split-layout">
        <article
          class="content-card drop-zone"
          (dragover)="handleDrag($event)"
          (drop)="handleDrop($event)"
        >
          <div>
            <p class="eyebrow">Browser intake</p>
            <h2>{{ locale() === 'de' ? 'Uploads vor der Netzwerkschicht normalisieren' : 'Normalize uploads before the network layer' }}</h2>
            <p class="muted-copy">{{ locale() === 'de' ? 'Lege Dateien hier ab oder nutze den Browser-Picker.' : 'Drop files here or use the browser picker.' }}</p>
            <label class="button button--primary">
              <span>{{ locale() === 'de' ? 'Dateien waehlen' : 'Choose files' }}</span>
              <input class="visually-hidden" type="file" multiple (change)="handleFileInput($event)" />
            </label>
          </div>
        </article>

        <article class="content-card">
          <div class="dialog-heading">
            <div>
              <p class="eyebrow">{{ locale() === 'de' ? 'Aktuelle Upload-Elemente' : 'Current upload items' }}</p>
              <h2>{{ queue().length }} queued</h2>
            </div>
            <button class="button button--secondary" type="button" (click)="clear()" [disabled]="queue().length === 0">
              {{ locale() === 'de' ? 'Queue leeren' : 'Clear queue' }}
            </button>
          </div>

          <div class="queue-list">
            @if (queue().length === 0) {
              <p class="muted-copy">{{ locale() === 'de' ? 'Noch keine Dateien. Fuege ein paar hinzu, um Klassifizierung und Strategie zu sehen.' : 'No files yet. Add a few files to see classification and strategy.' }}</p>
            }

            @for (item of queue(); track item.id) {
              <div class="queue-item">
                <div>
                  <strong>{{ item.name }}</strong>
                  <p class="muted-copy">{{ item.kind }} · {{ item.strategy }} · {{ item.size / 1024 | number: '1.0-0' }} KB</p>
                </div>
                <span class="pill">{{ item.type }}</span>
              </div>
            }
          </div>
        </article>
      </section>

      <section class="section card-grid card-grid--three">
        @for (group of acceptedGroups; track group.title) {
          <article class="content-card">
            <p class="eyebrow">{{ group.eyebrow }}</p>
            <h2>{{ group.title }}</h2>
            <ul class="stack-list">
              @for (item of group.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </article>
        }
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadsPageComponent {
  private readonly classifier = inject(UploadClassifierService);
  private readonly localeService = inject(LocaleService);
  private readonly seo = inject(SeoService);
  protected readonly locale = this.localeService.locale;
  protected readonly queue = signal<readonly UploadQueueItem[]>([]);
  protected readonly acceptedGroups = [
    { eyebrow: 'Images', title: 'Preview and optimize', items: ['png', 'jpg', 'webp', 'svg'] },
    { eyebrow: 'Documents', title: 'Scan and store', items: ['pdf', 'docx', 'txt', 'md'] },
    { eyebrow: 'Media', title: 'Transcode or chunk', items: ['mp4', 'mov', 'mp3', 'wav'] },
  ];

  constructor() {
    this.seo.setPage('Uploads', 'Browser upload queue with classification and strategy suggestions.');
  }

  protected handleDrag(event: DragEvent): void {
    event.preventDefault();
  }

  protected handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.addFiles(event.dataTransfer?.files);
  }

  protected handleFileInput(event: Event): void {
    this.addFiles((event.target as HTMLInputElement).files);
    (event.target as HTMLInputElement).value = '';
  }

  protected clear(): void {
    this.queue.set([]);
  }

  private addFiles(files: FileList | null | undefined): void {
    if (!files) {
      return;
    }

    const items = Array.from(files).map((file) => this.classifier.classify(file));
    this.queue.update((queue) => [...queue, ...items]);
  }
}
