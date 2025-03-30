# Dogifier

An extension that adds dogs to your images. Made as a trial/interview for an internship position at YourMove.AI

<img width="1490" alt="image" src="https://github.com/user-attachments/assets/56770e98-beb9-4b3d-9539-1ea740194581" />


## Techstack

- React
- TypeScript
- Vite

## Features

- Adds playful dog images to user photos using Google's experimental image editing AI
- Seamless integration as a browser extension
- Simple and fast UI
- Copy & Save features for easy usage

## Setup

1. Clone the repository.
2. Run `pnpm install`.
3. Create a `.env` file in the root directory with the following content:
   ```env
   NEXT_PUBLIC_GEMINI_KEY=your_api_key_here
   ```
4. Replace `your_api_key_here` with a Google Gemini API key.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
