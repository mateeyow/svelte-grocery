# Grocery Svelte

A small POC for svelte and sveltekit framework to learn and familiarize it.

This is like a Todo application but for groceries that enables you to create a list of items for you to buy for your next grocery run.

## Features

- [x] Add, update or delete item in grocery list
- [x] Mark an item as done or purchased
- [x] Add filter for items base on their status
- [x] Items in the grocery list should be saved in localstorage
- [ ] Nested grocery list until 2 levels
- [ ] Add animation

## Developing

Once you've created a project and installed dependencies with `pnpm install` (or `ppnpm install`), start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
