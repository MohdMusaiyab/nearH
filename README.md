<div align="center">
  <h1>NearH — The Zero-Latency Healthcare Grid 🏥</h1>
  <p><strong>A high-performance, real-time medical infrastructure platform bridging the gap between emergency sirens and hospital entry gates.</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-DB_%26_Auth-3ECF8E?logo=supabase)](https://supabase.com/)
  [![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?logo=redis)](https://upstash.com/)
</div>

<hr/>

## 📖 Overview

Built specifically to serve the dynamic Indian healthcare ecosystem, **NearH** synchronizes disparate clinical nodes into a single, instantly searchable grid. By providing real-time visibility into infrastructure capacity, it eliminates "Ghost Bed" data and maximizes the critical **Golden Hour** during medical emergencies.

With a focus on sovereign hospital data control and zero-trust security architecture, NearH connects patients to life-saving infrastructure—from ICU ventilators to rare blood availability—before they even reach the hospital doors.

<br/>

## ✨ Core Capabilities

- **⚡ Live Inventory Sync Engine**
  A proprietary synchronization module that provides real-time, zero-latency availability updates for General Beds, ICU Units, and Ventilators across the network.

- **🩸 Decentralized Blood Registry**
  Comprehensive, live monitoring of critical blood reserves (including rare groups like O- and AB+) tracked individually across all verified clinical nodes.

- **👨‍⚕️ Dynamic Clinical Staffing Matrix**
  Live clinical status tracking (e.g., `Available`, `In_Surgery`, `Emergency_Only`) operating on highly-optimized PostgreSQL custom Enums. Ensures patients know exactly when specialized care is accessible.

- **🔐 Zero-Trust Network Architecture**
  Strict role-based access controls (RBAC) powered by Supabase Auth with granular routing middleware.

- **🏛️ Sovereign Data Ownership**
  Verified hospital nodes retain exclusive autonomy and control over their own data pipelines and administrative dashboards, ensuring highly accurate reporting.

<br/>

## 🛠️ Technology Stack

NearH leverages a modern, highly-scalable stack built for maximum concurrency and sub-second data delivery:

| Domain                 | Technology              | Purpose                                         |
| :--------------------- | :---------------------- | :---------------------------------------------- |
| **Frontend Framework** | Next.js 15 (App Router) | Server-Side Rendering (SSR) & optimized routing |
| **Language**           | TypeScript              | End-to-end type safety                          |
| **Styling & UI**       | Tailwind CSS v4         | High-performance atomic CSS utilities           |
| **Animations**         | Framer Motion           | Smooth, "Clinical Aesthetic" micro-interactions |
| **Primary Database**   | Supabase (PostgreSQL)   | Relational logic, Custom Enums, Triggers        |
| **Authentication**     | Supabase Auth API       | Secure, encrypted user & role management        |
| **Caching Layer**      | Redis (via Upstash)     | Sub-second API response times & caching         |
| **Iconography**        | Lucide React            | Clean, scalable vector graphic integration      |

<br/>

## 📂 Core Architecture & Schema

The system is underpinned by a highly relational, efficiently indexed PostgreSQL architecture designed to minimize query response latency:

- **`Hospitals`**: The central entity modeling trauma levels, operational authorization (`is_verified` / `is_active`), and geographic location data.
- **`Profiles`**: Custom RBAC enforcement matrix (`user`, `admin`, `superadmin`) intrinsically bonded to Supabase Auth instances.
- **`Inventory`**: High-frequency transactional tables tracking beds and oxygen facilities.
- **`Doctors`**: Clinical personnel tracking featuring `JSONB` implementation for flexible weekly availability schedules.
- **`Blood Bank`**: Unique-constrained inventory logic mapped specifically for vital blood group unit tracking.

<br/>

## 🚀 Quick Start Guide

Want to run the grid locally? Follow these steps to initialize the environment:

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.0 or newer)
- npm or yarn
- A [Supabase](https://supabase.com/) Account (for Database & Auth)
- An [Upstash Redis](https://upstash.com/) Instance

### 1. Clone the Repository

```bash
git clone https://github.com/MohdMusaiyab/nearH.git
cd nearH
```

### 2. Install Package Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root of the project. You will need to populate it with your specific database keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Initialize the Application

```bash
npm run dev
```

The application will now compile and start. Access the live grid at [http://localhost:3000](http://localhost:3000).

---

<div align="center">
  <p>Designed and built for instantaneous response.</p>
</div>
