# Project Structure: inventory-management-system

**Root Path:** `/srv/dev-disk-by-uuid-8664ee37-1c82-443c-bced-fbeefe52e1b5/MainPools(MainServer)/inventory-management-system`
**Generated:** PROJECT_STRUCTURE.md

---

## Directory Tree

```
inventory-management-system/
├── **docker/**
│   ├──  .dockerignore *(123.0 B)*
│   ├── Dockerfile *(949.0 B)*
│   └── nginx.conf *(1.2 KB)*
├── **n8n/**
│   ├── 3wBw4lvgqudhPZ21.json *(13.5 KB)*
│   ├── 9l6gg6HzfpfV9bIj.json *(14.8 KB)*
│   ├── cI3YhhQsjoSgAArM.json *(2.5 KB)*
│   ├── Cr5GbenQMcpGRbH0.json *(9.4 KB)*
│   ├── GBSXQwifCZdWo5qF.json *(15.4 KB)*
│   ├── GPIoYMXINj8bnfIw.json *(17.7 KB)*
│   ├── iawH7WdT0BTBaHsu.json *(19.6 KB)*
│   ├── J9fS2IqweuJi5M9j.json *(18.8 KB)*
│   ├── njaz8UOE3QBvRugL.json *(17.9 KB)*
│   ├── Nn6WK0ZBzcsmKDeL.json *(17.5 KB)*
│   ├── oQ0Chcjhvk9n4xtH.json *(4.3 KB)*
│   ├── z9UL2JzJEciEBQu2.json *(4.6 KB)*
│   └── Zb1PTnzM4o5TnSVZ.json *(16.3 KB)*
├── **public/**
│   └── vite.svg *(1.5 KB)*
├── **src/**
│   ├── **api/**
│   │   ├── **services/**
│   │   │   ├── boxService.js *(855.0 B)*
│   │   │   ├── categoryService.js *(985.0 B)*
│   │   │   ├── chatService.js *(197.0 B)*
│   │   │   ├── dashboardService.js *(1000.0 B)*
│   │   │   ├── orderService.js *(710.0 B)*
│   │   │   ├── projectService.js *(1.9 KB)*
│   │   │   ├── stockService.js *(1.8 KB)*
│   │   │   └── vendorService.js *(976.0 B)*
│   │   └── config.js *(1.3 KB)*
│   ├── **assets/**
│   │   ├── **styles/**
│   │   └── vue.svg *(496.0 B)*
│   ├── **components/**
│   │   ├── **base/**
│   │   │   ├── BaseButton.vue *(3.4 KB)*
│   │   │   ├── BaseCard.vue *(3.2 KB)*
│   │   │   ├── BaseDialog.vue *(5.9 KB)*
│   │   │   ├── BaseEmpty.vue *(2.6 KB)*
│   │   │   ├── BaseFormField.vue *(5.1 KB)*
│   │   │   ├── BaseLoading.vue *(3.8 KB)*
│   │   │   ├── BaseSelect.vue *(2.4 KB)*
│   │   │   ├── BaseSnackbar.vue *(2.4 KB)*
│   │   │   └── BaseTable.vue *(8.4 KB)*
│   │   ├── **dialogs/**
│   │   │   ├── BoxFormDialog.vue *(9.3 KB)*
│   │   │   ├── BulkStatusDialog.vue *(2.7 KB)*
│   │   │   ├── CategoryFormDialog.vue *(4.3 KB)*
│   │   │   ├── ComponentFormDialog.vue *(12.4 KB)*
│   │   │   ├── DeleteConfirmDialog.vue *(2.1 KB)*
│   │   │   ├── GlobalLoading.vue *(503.0 B)*
│   │   │   ├── index.js *(286.0 B)*
│   │   │   ├── ProjectDetailDialog.vue *(17.6 KB)*
│   │   │   ├── ProjectFormDialog.vue *(8.6 KB)*
│   │   │   └── VendorFormDialog.vue *(11.2 KB)*
│   │   └── **global/**
│   │       └── GlobalNotification.vue *(899.0 B)*
│   ├── **composables/**
│   │   ├── useApi.js *(692.0 B)*
│   │   ├── useBaseStore.js *(4.7 KB)*
│   │   ├── useNotification.js *(1.0 KB)*
│   │   └── usePagination.js *(1.0 KB)*
│   ├── **plugins/**
│   │   └── vuetify.js *(999.0 B)*
│   ├── **router/**
│   │   └── index.js *(1.7 KB)*
│   ├── **stores/**
│   │   ├── boxStore.js *(4.5 KB)*
│   │   ├── categoryStore.js *(4.1 KB)*
│   │   ├── orderStore.js *(2.0 KB)*
│   │   ├── projectStore.js *(12.3 KB)*
│   │   ├── settingsStore.js *(2.7 KB)*
│   │   ├── stocksStore.js *(468.0 B)*
│   │   ├── stockStore.js *(5.8 KB)*
│   │   └── vendorStore.js *(2.9 KB)*
│   ├── **utils/**
│   ├── **views/**
│   │   ├── Boxes.vue *(18.0 KB)*
│   │   ├── Categories.vue *(19.8 KB)*
│   │   ├── Chatbot.vue *(6.4 KB)*
│   │   ├── Components.vue *(14.1 KB)*
│   │   ├── Dashboard.vue *(20.5 KB)*
│   │   ├── NotFound.vue *(753.0 B)*
│   │   ├── Orders.vue *(20.3 KB)*
│   │   ├── ProjectDetail.vue *(47.6 KB)*
│   │   ├── Projects.vue *(20.3 KB)*
│   │   ├── PurchaseOrder.vue *(21.6 KB)*
│   │   ├── Settings.vue *(12.8 KB)*
│   │   ├── StockDetail.vue *(34.3 KB)*
│   │   └── Vendors.vue *(22.4 KB)*
│   ├── App.vue *(2.0 KB)*
│   ├── env.d.ts *(274.0 B)*
│   ├── main.js *(1.2 KB)*
│   ├── style.css *(1.2 KB)*
│   └── theme.js *(4.9 KB)*
├── .env.development *(164.0 B)*
├── .env.example *(177.0 B)*
├── .env.production *(174.0 B)*
├── .gitignore *(357.0 B)*
├── DEPLOYMENT.md *(311.0 B)*
├── docker-compose.yml *(167.0 B)*
├── index.html *(482.0 B)*
├── package-lock.json *(135.1 KB)*
├── package.json *(893.0 B)*
├── PROJECT_STRUCTURE.md *(4.5 KB)*
├── README.md *(5.3 KB)*
├── structure.js *(3.0 KB)*
└── vite.config.js *(269.0 B)*
```

---

## Excluded Directories

- `node_modules`
- `.git`
- `dist`
- `build`
- `__pycache__`
- `.vscode`
- `.idea`
- `coverage`

## Excluded File Extensions

- `.log`
- `.tmp`
- `.cache`
- `.DS_Store`
- `.env`
- `.env.local`