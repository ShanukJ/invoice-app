# Invoice Generator

[![Netlify Status](https://api.netlify.com/api/v1/badges/a2aac459-23ab-414d-bb33-91c7303be68c/deploy-status)](https://geninvoice.shanukj.me) [![Latest Release](https://img.shields.io/github/v/release/ShanukJ/invoice-app)](https://github.com/ShanukJ/invoice-app/releases)

A professional invoice generator built with Next.js, React, and Tailwind CSS. Create, manage, and download invoices as PDFs directly from your browser.

## Features

- Generate professional PDF invoices
- Manage multiple companies
- Auto-fill service period with current month dates
- Track invoice history
- Store bank details and issuer information
- All data stored locally in browser (localStorage)
- Mobile-responsive design

## Tech Stack

- **Framework**: Next.js 16
- **UI**: React with TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React

## Project Structure

The project follows Atomic Design principles:

```
app/
├── components/
│   ├── atoms/           # Basic UI elements (Button, Input, Card, etc.)
│   ├── molecules/       # Combinations of atoms (FormField, TabButton, EmptyState)
│   ├── organisms/       # Complex UI sections (Tabs, Cards with logic)
│   └── templates/       # Page-level layouts (InvoiceGenerator)
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── utils/               # Utility functions (formatting, validation)
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

1. **Settings Tab**: Add your name, address, and bank details
2. **Companies Tab**: Add companies you invoice
3. **Generate Tab**: Select a company, fill in invoice details, and generate PDF
4. **History Tab**: View all previously generated invoices

## Build

```bash
npm run build
```

## License

MIT
