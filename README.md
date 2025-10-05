This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

🌐 **Live Demo:** [pension12.vercel.app](https://pension12.vercel.app)

## 🚀 Features

### 🔹 1. Pension Calculator
- Input details like age, salary, retirement age, contribution %, inflation rate.  
- See **interactive charts** showing retirement savings growth (Recharts).  
- Run **What-If Scenarios** (e.g., *“What if I retire at 58 instead of 60?”*, *“What if inflation increases to 8%?”*).  
- Get **AI explanations** of the results in plain language (Gemini-powered).  

### 🔹 2. Pension Scheme Comparison
- Compare multiple government or private pension schemes.  
- Get **AI-generated pros/cons** for each scheme.  
- View **side-by-side comparisons** in a clean table view.  

### 🔹 3. AI Assistant Chatbot 🤖
- Conversational assistant built with **Vercel AI SDK + Gemini**.  
- Users can ask any pension/retirement-related queries.  
- Provides **personalized insights and advice**.  

### 🔹 4. Scenario Simulation (What-If Analysis)
- Adjust parameters like age, inflation, contribution % dynamically.  
- Charts & projections update **in real-time**.  
- AI explains the **impact of your decisions**.  

### 🔹 5. Voice Assistant 🎙️
- **Speech-to-Text**: Ask questions using your voice (react-speech-recognition).  
- **Text-to-Speech**: AI answers are spoken back using Web Speech API.  
- Toggle between **chat-only** or **voice-enabled mode**.  

### 🔹 6. User Dashboard
- Secure authentication via **Firebase Auth**.  
- Save pension plans & scheme comparisons.  
- Export reports as **PDF/CSV**.  
- Get **notifications & reminders** for contributions. 

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
