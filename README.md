# Burger Land - Plan Your Day

**An application for planning your visit to Burger Land, allowing you to purchase tickets and additional services.**

## Installation and Running

1. Clone the repo: `git clone <repository_address>`
2. Go to directory: `cd burger-land`
3. Install dependencies: `pnpm install`
4. Run: `pnpm run dev`
5. Open in your browser: [http://localhost:3000](http://localhost:3000)

## Technologies

*   **Next.js** with **App Router** - A fast and convenient **React** framework.
*   **TypeScript**
*   **Tailwind CSS** - Rapid styling
*   **`@tanstack/react-query`** - Data fetching, caching, optimistic updates
*   **`zod`** - Data validation
*   **`next-intl`** - Internationalization
*   **`cookies-next`** - `cartId` in cookies.
*   **`cypress`** - E2E testing.

## Project Structure

Key folders:

*   `app` - Main application code (Next.js App Router).
    *   `[locale]` - Language support.
    *   `api` - API routes (mocked data).
    *   `modules` - Business logic (e.g., cart).
*   `components` - Reusable UI components. - TODO: storybook and separate to package
*   `cypress` - E2E tests.
*   `i18n` - Internationalization config.
*   `messages` - Translation files.
*   `shared` - Shared types, schemas, mocks, endpoints, etc.

---

**Flow Diagram:**

```mermaid
flowchart TD
    A["Ticket selection (Price from)"]
    B["Click: Add to cart"]
    C["Open modal: 
    Summary of selection and choose arrival date (e.g. price higher on weekends and holidays)"]
    D["Display options:
    - Continue shopping
    - Proceed to payment
    + Suggestions for 3 bestsellers"]
    E{"User choice"}
    F["Continue shopping:
    Add another item to cart"]
    G["Proceed to payment: 
    Open form with data"]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E -- "Continue shopping" --> F
    E -- "Proceed to payment" --> G
    F --> A
```

---

**Architecture Diagram:**

```mermaid
flowchart TD
    A["User (Browser Client)"] --> B["Next.js Frontend (React)"]
    B --> V1["Client-Side Validation (Zod)"]
    V1 --> LB[Load Balancer]
    LB --> C["Next.js API Routes / Application Server (Node.js)"]
    C --> P["API Validation (Zod)"]
    P --> CS(Cart Service)
    P --> PS(Product Service)
    P --> OS(Order Service)
    
    CS --> DB1(Cart Database)
    PS --> DB2(Product Database)
    OS --> DB3(Order Database)
    OS --> PAY(Payment Gateway)
    CS --> RS(Reservation Service?)
    RS --> DB3

    %% Nowa ścieżka dla logowania dopiero przy płatności
    OS --> S["Auth Service"]
    S -- Guest Checkout --> PAY
    S -- Registered User --> PAY

    subgraph "Scalable Infrastructure"
        C1["Application Server (Node.js)"]
        C2["Application Server (Node.js)"]
        C3["Application Server (Node.js)"]
        C1 -- Cluster Communication --- C2
        C2 -- Cluster Communication --- C3
        C3 -- Cluster Communication --- C1
    end

    subgraph Infrastructure
        I1["CI/CD, Kubernetes, Servers"]
    end

    subgraph "Monitoring & Analytics"
        M1["Error Tracking e.g. Sentry"]
        M2["Analytics e.g. Snowplow"]
    end

    %% Monitoring arrows
    B -.-> M1
    B -.-> M2
    C -.-> M1
    C -.-> M2
    CS -.-> M1
    CS -.-> M2
    PS -.-> M1
    PS -.-> M2
    OS -.-> M1
    OS -.-> M2

    %% Infrastructure arrows
    I1 -.-> B
    I1 -.-> LB
    I1 -.-> C
    I1 -.-> CS
    I1 -.-> PS
    I1 -.-> OS
    I1 -.-> RS

    %% Load Balancer connections
    LB --> C1
    LB --> C2
    LB --> C3
    C1 --> P
    C2 --> P
    C3 --> P

```
---