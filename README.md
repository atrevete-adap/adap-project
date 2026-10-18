# Turbine — Internal Invoicing & Payment Tracking System

> **Course:** Application Analysis and Design (Grado en Ingeniería Informática, Plan 2023)  
> **Institution:** E.T.S. de Ingeniería Informática — Universidad de Málaga (UMA)  
> **Academic Year:** 2026/2027  
> **Team:** Atrévete  
> **Target Deadline (Submission 1):** Week of October 20, 2026  

---

## 1. Project Overview (Case Study)
**Turbine** is an early-stage Artificial Intelligence startup developing the *Brain Operative System*, an intelligence orchestration platform for enterprises. Currently, Turbine manages its B2B customer subscriptions, one-off services, invoice generation, and payment collection manually.

This project models and designs an **independent, internal responsive web application** for Turbine's administrative staff to:
- Register and manage corporate customers and their contact persons (via manual entry or CSV import) with logical deletion policies.
- Generate and issue standard corporate **PDF invoices** (both **one-off** and **monthly recurring** subscriptions tiered by customer annual revenue) in under one minute.
- Automate **payment tracking and reconciliation** by querying external payment platforms (e.g., Stripe / Revolut).
- Execute automated **payment reminder workflows** (Day 1 issuance, Day 3 & Day 5 reminders, and periodic overdue follow-ups via Email/WhatsApp) and notify assigned internal staff.
- Enforce **role-based access control** (*Super Administrator*, *Administrator*, and *Reader / Assigned Staff*), quarterly tax modification locks, and cancellation debt checks via an external API.

---

## 2. Team Members — Group "Atrévete"

| Full Name | GitHub User | Role (Submission 1) |
| :--- | :--- | :--- |
| **Adam Antonio Ehmidi Álvarez** | `@T00sahic` | Scrum Master |
| **Héctor Encinas García** | `@HecTPlay` | Team Member |
| **Deniz Klaastjerk Inan** | `@DenizUMA` | Team Member |
| **Víctor Navas Ramos** | `@victornr1` | Team Member |
| **Pablo Pérez Arcas** | `@ByCur` | Team Member |

- **Project Board (GitHub Projects):** [ADAP - Atrévete](https://github.com/orgs/atrevete-adap/projects)

---

## 3. Repository Structure (Submission 1)

- `doc/` — Compiled final deliverables in PDF format:
  - `doc/requirements.pdf`
  - `doc/use-case-diagram.pdf`
  - `doc/use-case-specification.pdf`
  - `doc/scrum-report.pdf`
- `doc/src/` — Editable source files:
  - `doc/src/requirements.md` (Business, User, Functional & Non-Functional Requirements)
  - `doc/src/use-case-diagram.pu` (PlantUML source for the Use Case Diagram)
  - `doc/src/use-case-specification.md` (Cockburn-style Use Case Specifications)
  - `doc/src/scrum-report.md` (Sprint planning, meetings, board snapshots & risk log)
- `notes/` — Historical coordination and review notes; excluded from the four Submission 1 PDFs.
- `README.md` — Project overview and documentation index.
- `.gitignore` — Git ignore rules.

---

## 4. Submission 1 — Milestone Plan (Deadline: Week of October 20, 2026)

| Milestone | Objective & Main Deliverables |
| :--- | :--- |
| **Milestone 1** | **Environment Setup & Project Management Kickoff:** Designate Scrum Master, initialize public GitHub repo (`doc/` & `doc/src/`), configure GitHub Projects board, and hold Sprint Planning. |
| **Milestone 2** | **Requirements Elicitation & Documentation:** Analyze client interview notes and document `BR`, `UR`, `FR` (with dependencies), and `NFR` (with quantifiable metrics & verification tests) in `requirements.md`. |
| **Milestone 3** | **UML Use Case Diagram Modeling:** Identify primary/secondary actors, system boundaries, core use cases, and `<<include>>`/`<<extend>>` relationships in `use-case-diagram.pu`. |
| **Milestone 4** | **Use Case Specifications & Behavioral Contracts:** Document full Cockburn specifications in `use-case-specification.md` with strict traceability to `FR` and `NFR`. |
| **Milestone 5** | **Sprint Review, Scrum Report & Peer Evaluation:** Hold Sprint Retrospective, compile `scrum-report.md` and all PDFs into `doc/`, complete Balls Method evaluation, and submit `.zip` + Repo URL. |
