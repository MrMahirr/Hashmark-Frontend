# Frontend - Next.js FSD Mimarisi

Bu proje `hashmark-frontend` icinde Feature-Sliced Design yaklasimi ile
ilerler. Klasorler su an iskelet olarak olusturuldu; uygulama kodlari
eklendikce ilgili katmanlara yerlestirilecek.

```text
hashmark-frontend/
|-- src/
|   |-- app/                     # Next.js App Router
|   |   |-- layout.tsx
|   |   |-- page.tsx             # landing
|   |   |-- auth/
|   |   |   |-- login/page.tsx
|   |   |   `-- callback/page.tsx # OAuth return
|   |   `-- dashboard/
|   |       |-- layout.tsx
|   |       |-- page.tsx         # genel ozet
|   |       |-- repos/
|   |       |   |-- page.tsx     # repo listesi
|   |       |   `-- [repoId]/page.tsx # repo detay
|   |       |-- debts/
|   |       |   `-- page.tsx     # tum borclar
|   |       `-- settings/
|   |           `-- page.tsx
|   |
|   |-- features/                # FSD feature katmani
|   |   |-- auth/
|   |   |   |-- api/
|   |   |   |   `-- auth.api.ts
|   |   |   |-- hooks/
|   |   |   |   `-- useAuth.ts
|   |   |   `-- store/
|   |   |       `-- auth.store.ts # Zustand
|   |   |-- repos/
|   |   |   |-- api/
|   |   |   |   `-- repos.api.ts
|   |   |   |-- components/
|   |   |   |   |-- RepoCard.tsx
|   |   |   |   |-- RepoList.tsx
|   |   |   |   `-- ScanProgress.tsx
|   |   |   `-- hooks/
|   |   |       `-- useRepos.ts
|   |   |-- debts/
|   |   |   |-- api/
|   |   |   |   `-- debts.api.ts
|   |   |   |-- components/
|   |   |   |   |-- DebtTable.tsx # TanStack Table
|   |   |   |   |-- DebtFilters.tsx
|   |   |   |   `-- DebtBadge.tsx # TODO/FIXME rengi
|   |   |   `-- hooks/
|   |   |       `-- useDebts.ts
|   |   `-- dashboard/
|   |       |-- components/
|   |       |   |-- StatCard.tsx
|   |       |   |-- TrendChart.tsx # Recharts
|   |       |   |-- ModuleBarChart.tsx
|   |       |   `-- LabelPieChart.tsx
|   |       `-- hooks/
|   |           `-- useDashboard.ts
|   |
|   |-- shared/                  # FSD shared katmani
|   |   |-- api/
|   |   |   |-- client.ts        # axios instance
|   |   |   |-- methods.ts       # enum
|   |   |   `-- endpoints.ts     # enum
|   |   |-- components/
|   |   |   |-- Button.tsx
|   |   |   |-- Badge.tsx
|   |   |   |-- Spinner.tsx
|   |   |   `-- EmptyState.tsx
|   |   |-- hooks/
|   |   |   `-- useQueryParams.ts
|   |   `-- types/
|   |       |-- debt.types.ts
|   |       `-- repo.types.ts
|   |
|   `-- widgets/                 # FSD widget katmani
|       |-- Navbar.tsx
|       `-- Sidebar.tsx
|
|-- .env.local
|-- next.config.ts
|-- tailwind.config.ts
`-- package.json
```

## API Katmani Kurali

API route parcalari iki ayri enum dosyasinda tutulur:

- `src/shared/api/methods.ts`: ana API route gruplari.
- `src/shared/api/endpoints.ts`: route sonuna eklenen endpoint parcalari.

```ts
// src/shared/api/methods.ts
export enum ApiMethod {
  AUTH = "/auth",
  REPOS = "/repos",
  DEBTS = "/debts",
  DASHBOARD = "/dashboard",
}
```

```ts
// src/shared/api/endpoints.ts
export enum ApiEndpoint {
  LOGIN = "login",
  CALLBACK = "callback",
  LOGOUT = "logout",
  SCAN = "scan",
  SUMMARY = "summary",
  SETTINGS = "settings",
}
```

Kullanim standardi:

```ts
import { ApiEndpoint } from "@/shared/api/endpoints";
import { ApiMethod } from "@/shared/api/methods";
import { apiClient } from "@/shared/api/client";

export async function scanRepo(repoId: string) {
  const response = await apiClient.post(
    `${ApiMethod.REPOS}/${repoId}/${ApiEndpoint.SCAN}`
  );

  return response.data;
}
```

Bu standart ile URL parcalari string olarak dagilmaz; route gruplari ve
endpoint suffixleri merkezi enum dosyalarindan yonetilir.
