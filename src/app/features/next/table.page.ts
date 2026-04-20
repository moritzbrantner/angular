import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { EMPLOYEE_REPOSITORY } from '../../shared/data-access/content.repositories';
import { EmployeeRecord } from '../../shared/models/content.models';

@Component({
  selector: 'app-table-page',
  template: `
    <div class="page-shell">
      <section class="page-intro">
        <p class="eyebrow">Data view</p>
        <h1>Employee table</h1>
        <p class="lead-copy">A repository-backed table with loading, empty, and error states.</p>
      </section>

      <section class="section content-card">
        <label class="field">
          <span>Filter employees</span>
          <input type="search" [value]="query()" (input)="updateQuery($event)" placeholder="Search by name, department, role, or location" />
        </label>

        @if (loading()) {
          <p class="muted-copy">Loading endpoint data...</p>
        } @else if (hasError()) {
          <p class="status-copy status-copy--error">Unable to load endpoint data.</p>
        } @else if (filteredEmployees().length === 0) {
          <p class="muted-copy">No employees match the current filter.</p>
        } @else {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                @for (employee of filteredEmployees(); track employee.id) {
                  <tr>
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.department }}</td>
                    <td>{{ employee.role }}</td>
                    <td><span class="pill">{{ employee.status }}</span></td>
                    <td>{{ employee.location }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    </div>
  `,
  styleUrl: './next-pages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePageComponent {
  private readonly employeeRepository = inject(EMPLOYEE_REPOSITORY);
  private readonly seo = inject(SeoService);
  protected readonly employees = signal<readonly EmployeeRecord[]>([]);
  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly query = signal('');
  protected readonly filteredEmployees = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.employees().filter((employee) =>
      `${employee.name} ${employee.department} ${employee.role} ${employee.location} ${employee.status}`
        .toLowerCase()
        .includes(query),
    );
  });

  constructor() {
    this.seo.setPage('Employee table', 'Repository-backed employee table with static and API modes.');
    this.employeeRepository.list().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.loading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
      },
    });
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
