# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Pilot** (v5.6.0), a Shopify Hydrogen theme powered by Weaverse - a visual page builder for Hydrogen storefronts. The project is built with React 19.1.1, TypeScript 5.9.2, React Router 7.8.2, and Tailwind CSS v4.1.13. It runs on Node.js 20+ and uses Biome 2.2.2 for linting/formatting.

**Important**: This project uses React Router v7, NOT Remix. Always import from `'react-router'` not `'react-router-dom'`.

## Essential Commands

### Development
```bash
npm run dev        # Start development server on port 3456
npm run dev:ca     # Start with customer account push (unstable)
npm run build      # Production build with GraphQL codegen
npm run preview    # Preview production build
npm start          # Start production server
npm run clean      # Clean all build artifacts and dependencies
```

### Code Quality (Always run before committing)
```bash
npm run biome      # Check for linting/formatting errors
npm run biome:fix  # Fix linting/formatting errors
npm run format     # Format code with Biome
npm run typecheck  # Run TypeScript type checking
```

### Testing
```bash
npm run e2e        # Run Playwright E2E tests
npm run e2e:ui     # Run tests with UI mode
```

### GraphQL
```bash
npm run codegen    # Generate TypeScript types from GraphQL
```

## Architecture Overview

### Route Structure
All routes follow the pattern `($locale).{route}.tsx` to support internationalization:
- Homepage: `($locale)._index.tsx`
- Products: `($locale).products.$productHandle.tsx`
- Collections: `($locale).collections.$collectionHandle.tsx`
- Account: `($locale).account.*`
- API routes: `($locale).api.*`
- Cart operations: `($locale).cart.*`
- Policies & Pages: `($locale).pages.$pageHandle.tsx`, `($locale).policies.$policyHandle.tsx`

### Key Architectural Patterns

1. **Parallel Data Loading**: Every page route loads Weaverse data alongside GraphQL queries using `Promise.all()`:
   ```typescript
   const [{ shop, product }, weaverseData, productReviews] = await Promise.all([
     storefront.query(PRODUCT_QUERY, { variables }),
     weaverse.loadPage({ type: "PRODUCT", handle }),
     getJudgeMeProductReviews({ context, handle }),
   ]);
   ```

2. **Component Structure**:
   - `/app/sections/` - Weaverse visual builder sections with schema exports and optional loaders
   - `/app/components/` - Reusable UI components organized by feature (cart/, product/, layout/, customer/)
   - Each Weaverse section must export: default component + schema + optional loader

3. **Data Fetching**:
   - GraphQL fragments in `/app/graphql/fragments.ts`
   - Complete queries in `/app/graphql/queries.ts`
   - Route loaders handle all data fetching server-side
   - Use `routeHeaders` for consistent cache control

4. **Styling**:
   - Tailwind CSS v4 with custom utilities
   - class-variance-authority (cva) for component variants
   - Use the `cn()` utility from `/app/utils/cn.ts` for class merging
   - Biome's `useSortedClasses` enabled for `clsx`, `cva`, and `cn` functions

5. **Type Safety**:
   - GraphQL types are auto-generated via codegen
   - Path alias `~/` maps to `/app/` directory
   - Strict TypeScript configuration
   - Two separate codegen outputs:
     - `storefront-api.generated.d.ts` - For all storefront queries (excludes account routes)
     - `customer-account-api.generated.d.ts` - For customer account queries (only in `*.account*.{ts,tsx,js,jsx}` files)

### Important Integrations

- **Weaverse**: Visual page builder - sections must be registered in `/app/weaverse/components.ts`
- **Judge.me**: Product reviews integration via utilities in `/app/utils/judgeme.ts`
- **Analytics**: Shopify Analytics integrated throughout components
- **Customer Accounts**: New Shopify Customer Account API support (OAuth-based)
- **Radix UI**: For accessible UI primitives (accordion, dialog, dropdown, etc.)
- **Swiper**: For carousel/slideshow functionality

### Weaverse Section Development

1. **Creating a New Section**:
   ```typescript
   // app/sections/my-section/index.tsx
   import { createSchema, type HydrogenComponentProps, type ComponentLoaderArgs } from '@weaverse/hydrogen';
   import { forwardRef } from 'react';

   interface MyProps extends HydrogenComponentProps {
     heading: string;
     loaderData?: any; // Data from server-side loader
   }

   const MySection = forwardRef<HTMLElement, MyProps>((props, ref) => {
     const { heading, loaderData, ...rest } = props;
     // Component implementation
     // Access loader data via props.loaderData
   });

   export default MySection;

   export const schema = createSchema({
     type: 'my-section',
     title: 'My Section',
     settings: [
       {
         group: 'Content',
         inputs: [
           {
             type: 'text',
             name: 'heading',
             label: 'Heading',
             defaultValue: 'Default Heading'
           }
         ]
       }
     ]
   });

   // Optional loader for server-side data fetching
   export const loader = async ({ weaverse, data }: ComponentLoaderArgs) => {
     // Access Shopify Storefront API
     const result = await weaverse.storefront.query(QUERY, { variables });
     // Access component settings via data parameter
     // Return data to be available as props.loaderData
     return result.data;
   };
   ```

2. **Register in `/app/weaverse/components.ts`**:
   ```typescript
   import * as MySection from "~/sections/my-section";
   export const components = [
     // ... existing components
     MySection,
   ];
   ```

3. **Component Loader Pattern**:
   - Loaders run on the server-side for each component instance
   - Access Shopify API via `weaverse.storefront.query()`
   - Access component settings via `data` parameter
   - Return value becomes available as `props.loaderData`
   - Great for fetching product data, collections, metafields, etc.

### Route Data Loading Pattern

```typescript
export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { handle } = params;
  invariant(handle, "Missing handle param");
  
  const { storefront, weaverse } = context;
  
  // Parallel data loading
  const [shopifyData, weaverseData, thirdPartyData] = await Promise.all([
    storefront.query(QUERY, { variables }),
    weaverse.loadPage({ type: "PAGE_TYPE", handle }),
    fetchThirdPartyData(),
  ]);
  
  // Handle errors
  if (!shopifyData.resource) {
    throw new Response("Not found", { status: 404 });
  }
  
  return data({
    shopifyData,
    weaverseData,
    thirdPartyData,
  });
}
```

### Theme Settings & Schema

Weaverse provides global theme settings defined in `app/weaverse/schema.server.ts`. This includes:
- **Layout**: Page width, navigation heights
- **Colors**: Background, text, buttons, badges
- **Typography**: Heading/body sizes, spacing, line height
- **Product Cards**: Image settings, content display, quick shop, badges
- **Animations**: Reveal-on-scroll effects
- **Newsletter Popup**: Timing, positioning, content

Theme settings are loaded in the root loader:
```typescript
export async function loader({ context }: LoaderFunctionArgs) {
  return defer({
    weaverseTheme: await context.weaverse.loadThemeSettings(),
  });
}
```

Access theme settings in components:
```typescript
import { useThemeSettings } from '@weaverse/hydrogen';

function MyComponent() {
  const settings = useThemeSettings();
  // Use settings.logo, settings.colors, etc.
}
```

The `App` component must be wrapped with `withWeaverse` HOC in `root.tsx`:
```typescript
import { withWeaverse } from '@weaverse/hydrogen';

function App() { /* ... */ }

export default withWeaverse(App);
```

### Weaverse Context Integration

The `weaverse` client is injected into the app context in `server.ts`:

```typescript
import { WeaverseClient } from '@weaverse/hydrogen';
import { components } from '~/weaverse/components';
import { themeSchema } from '~/weaverse/schema.server';

export default {
  async fetch(request, env, executionContext) {
    const { storefront, ...hydrogenContext } = createHydrogenContext({ /* ... */ });

    return {
      ...hydrogenContext,
      storefront,
      weaverse: new WeaverseClient({
        ...hydrogenContext,
        storefront,
        request,
        cache,
        themeSchema,
        components,
      }),
    };
  }
};
```

This makes `weaverse` available in:
- Route loaders: `context.weaverse.loadPage()`
- Theme settings: `context.weaverse.loadThemeSettings()`
- Component loaders: `weaverse.storefront.query()`

### Environment Configuration

Required environment variables are defined in `env.d.ts`:
- **Shopify**: `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`
- **Weaverse**: `WEAVERSE_PROJECT_ID`, `WEAVERSE_HOST` (optional), `WEAVERSE_API_BASE` (optional)
- **Optional services**: `PUBLIC_GOOGLE_GTM_ID`, `JUDGEME_PRIVATE_API_TOKEN`, `KLAVIYO_PRIVATE_API_TOKEN`

The project uses `@shopify/hydrogen` and `@shopify/remix-oxygen` for environment handling.

### Testing Strategy

- E2E tests use Playwright and are located in `/tests/`
- **Important**: Dev server runs on port 3456, but Playwright tests expect port 3000
  - Tests run against `npm run preview` (production preview on port 3000)
  - Do NOT use `npm run dev` for E2E tests
- Focus on critical user flows: cart operations, checkout process
- Run individual tests: `npx playwright test tests/cart.test.ts`

### Biome Configuration

The project extends from `ultracite` and `@weaverse/biome` configurations with these customizations:
- Double quotes for strings
- Semicolons always
- Trailing commas
- Max cognitive complexity: 50
- Sorted Tailwind classes in `clsx`, `cva`, and `cn` functions

## Code Conventions

- **Naming**: camelCase for variables/functions, PascalCase for components, kebab-case for files, ALL_CAPS for constants
- **Formatting**: 2 spaces indentation, double quotes, semicolons, trailing commas
- **TypeScript**: Always type function parameters and returns, avoid `any`, use interfaces for data structures
- **React**: Functional components with hooks only, small focused components, forwardRef for Weaverse sections
- **Async**: Use async/await, proper error handling with try/catch
- **Imports**: Use `~/` path alias for app directory imports

## Development Tools

When running `npm run dev`, access these helpful tools:
- **Development server**: http://localhost:3456
- **GraphiQL API browser**: http://localhost:3456/graphiql (explore Shopify Storefront API)
- **Network inspector**: http://localhost:3456/debug-network (debug API calls)
- **Weaverse Studio**: Access through your Shopify admin dashboard

## Common Pitfalls to Avoid

1. **GraphQL Codegen**: Always run `npm run codegen` after modifying GraphQL queries/fragments
2. **Weaverse Registration**: New sections must be registered in `/app/weaverse/components.ts`
3. **Route Caching**: Use `routeHeaders` export for consistent cache control
4. **Customer Account Queries**: Only use in `*.account*.{ts,tsx}` files
5. **Parallel Loading**: Always use `Promise.all()` for multiple data fetches in loaders
6. **Type Safety**: Never use `any` type, properly type all Weaverse section props
7. **React Router Imports**: Import from `'react-router'` not `'react-router-dom'`
8. **forwardRef Required**: All Weaverse sections MUST use `forwardRef<HTMLElement, Props>`
9. **Test Port Mismatch**: Dev server uses port 3456, but E2E tests expect port 3000 (use `npm run preview`)
10. **Component Namespaces**: Register sections as namespace imports: `import * as MySection from "~/sections/my-section"`

## Active Technologies
- TypeScript 5.9.2, React 19.1.1 + @weaverse/hydrogen 5.4.2, @shopify/hydrogen 2025.5.0, React Router 7.8.2, Tailwind CSS v4.1.13 (001-winehub-integration)
- Server-side API integration with Winehub headless endpoint, client-side caching via React state (001-winehub-integration)

## Recent Changes
- 001-winehub-integration: Added TypeScript 5.9.2, React 19.1.1 + @weaverse/hydrogen 5.4.2, @shopify/hydrogen 2025.5.0, React Router 7.8.2, Tailwind CSS v4.1.13
