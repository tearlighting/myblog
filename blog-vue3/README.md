# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

```mermaid
erDiagram
    USERS {
        int id PK
        string name
    }
    ROLES {
        int id PK
        string name
    }
    PERMISSIONS {
        int id PK
        string name
    }
    USER_ROLES {
        int user_id FK
        int role_id FK
        PK (user_id, role_id)
    }
    ROLE_PERMISSIONS {
        int role_id FK
        int permission_id FK
        PK (role_id, permission_id)
    }

    USERS ||--o{ USER_ROLES : "user_id"
    ROLES ||--o{ USER_ROLES : "role_id"

    ROLES ||--o{ ROLE_PERMISSIONS : "role_id"
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : "permission_id"

```
