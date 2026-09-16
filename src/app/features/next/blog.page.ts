import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { BLOG_POSTS } from '../../shared/content/next-template.content';

@Component({
  selector: 'app-blog-page',
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">Blog</p>
        <h1>{{ locale() === 'de' ? 'Repo-verwaltete Site-Inhalte' : 'Repo-managed site content' }}</h1>
        <p class="lead-copy">
          {{ locale() === 'de' ? 'Kanonische Produkt- und Marketing-Inhalte leben typisiert im Repository.' : 'Canonical product and marketing content lives in typed source files under version control.' }}
        </p>
      </section>

      <section class="post-list">
        @for (post of posts(); track post.title) {
          <article class="content-card">
            <time [attr.datetime]="post.date">{{ post.date }}</time>
            <h2>{{ post.title }}</h2>
            <p class="muted-copy">{{ post.summary }}</p>
          </article>
        }
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPageComponent {
  private readonly localeService = inject(LocaleService);
  private readonly seo = inject(SeoService);
  protected readonly locale = this.localeService.locale;
  protected readonly posts = computed(() => BLOG_POSTS[this.locale()]);

  constructor() {
    this.seo.setPage('Blog', 'Repo-managed localized content for the Angular template.');
  }
}
