# TurbineH — Internal Invoicing & Payment Tracking System

> **Course:** Application Analysis and Design (Grado en Ingeniería Informática, Plan 2023)  
> **Institution:** E.T.S. de Ingeniería Informática — Universidad de Málaga (UMA)  
> **Academic Year:** 2026/2027  
> **Team:** Atrévete  
> **Current submission:** Submission 2 — System Design (delivery date: November 17, 2026)  
> **Previous submission:** Submission 1 — Requirements Analysis and Use Cases (delivered, week of October 20, 2026)  

---

## 1. Project Overview (Case Study)
**TurbineH** is an early-stage Artificial Intelligence startup developing the *Brain Operative System*, an intelligence orchestration platform for enterprises. Currently, TurbineH manages its B2B customer subscriptions, one-off services, invoice generation, and payment collection manually.

This project models and designs an **independent, internal responsive web application** for TurbineH's administrative staff to:
- Register and manage corporate customers and their contact persons (via manual entry or CSV import) with logical deletion policies.
- Generate and issue standard corporate **PDF invoices** (both **one-off** and **monthly recurring** subscriptions tiered by customer annual revenue) in under one minute.
- Automate **payment tracking and reconciliation** by querying a payment source and receiving its payment events (Stripe, simulated), with other sources such as Revolut or a bank account addable later.
- Execute automated **payment reminder workflows** (a reminder on day 3 after issuance, another on the due date, then every 2–3 days while overdue, by email and by WhatsApp when the contact consents) and notify the responsible internal user.
- Enforce **role-based access control** (*Super Administrator*, *Administrator*, and *Operational User* limited to their assigned customers), protect issued invoices through corrective invoices and administrative period closing, and stop recurring billing on cancellation while collection of previous debt continues (outstanding obligations can be queried through an API).

---

## 2. Team Members — Group "Atrévete"

| Full Name | GitHub User | Submission 1 | Submission 2 |
| :--- | :--- | :--- | :--- |
| **Adam Antonio Ehmidi Álvarez** | `@T00sahic` | Scrum Master | Team Member |
| **Héctor Encinas García** | `@HecTPlay` | Team Member | Team Member |
| **Deniz Klaastjerk Inan** | `@DenizUMA` | Team Member | Scrum Master |
| **Víctor Navas Ramos** | `@victornr1` | Team Member | Team Member |
| **Pablo Pérez Arcas** | `@ByCur` | Team Member | Team Member |

- **Project Board (GitHub Projects):** [ADAP - Atrévete](https://github.com/orgs/atrevete-adap/projects)
- **Workflow:** every change reaches `main` through a pull request reviewed by another member (branch protection on `main`).

---

## 3. Repository Structure

- `doc/` — Final deliverables in PDF format.
  - Submission 1: `requirements.pdf`, `use-case-diagram.pdf`, `use-case-specification.pdf`, `scrum-report.pdf`.
  - Submission 2: the PDFs of the Submission 2 artifacts are exported at the end of Sprint 5 (#54).
- `doc/src/` — Editable source files:
  - `requirements.md` — Business, User, Functional (with sub-requirements and MoSCoW priorities) and Non-Functional Requirements, contradictions and out-of-scope items.
  - `use-case-diagram.pu` — PlantUML source of the use case diagram (overview and four views).
  - [`use-cases/`](doc/src/use-cases/README.md) — one Cockburn-style contract per use case (UC-01 to UC-22) with an index and traceability; `use-case-specification.md` redirects to this index.
  - `domain-model.pu` — Domain model: the main concepts of the problem domain, their attributes and associations.
  - `architecture.md` — Architectural pattern (layered, client-server) and its rationale, the Scheduler, and the components per layer.
  - `class-diagram.pu` and `class-diagram-traceability.md` — UML class diagram (one source, seven views) and its traceability to the use cases.
  - `component-diagram.pu` — UML component diagram of the layered architecture.
  - `sequence-*.pu` — UML sequence diagrams of the main use case scenarios.
  - `scrum-report.md` — Scrum Report of Submission 1.
  - `img/` — Exported diagram images and GitHub Projects board screenshots.
- `notes/` — Coordination and review notes; not part of the deliverables.
- `scripts/validate-use-cases.cjs` — `node scripts/validate-use-cases.cjs` checks the use case contracts' structure, links and traceability against the requirements.
- `scripts/validate-class-diagram.cjs` — `node scripts/validate-class-diagram.cjs` checks the class diagram's consistency with the domain model and the use cases.
- `scripts/check-design-consistency.py` — `python3 scripts/check-design-consistency.py` checks that the class, component and sequence diagrams use the same classes, operations, dependencies and ports.
- `README.md` — Project overview and documentation index.
- `.gitignore` — Git ignore rules.

---

## 4. Submission 2 — System Design (delivery date: November 17, 2026)

Status as of 11/11/2026. Each artifact is tracked as an issue on the project board.

| Artifact | Source (`doc/src/`) | Issue | Status |
| :--- | :--- | :--- | :--- |
| Domain model | `domain-model.pu` | #42 | Done |
| Architecture pattern and rationale | `architecture.md` | #43 | Done |
| Physical Entity-Relationship diagram | `er-diagram.pu` | #44 | In review (PR #73) |
| UML class diagram | `class-diagram.pu`, `class-diagram-traceability.md` | #45 | Done |
| UML component diagram | `component-diagram.pu` | #46 | Done |
| UML sequence diagram: monthly invoice generation | `sequence-monthly-generation.pu` | #48 | Done |
| UML sequence diagram: prepare, issue and send an invoice | `sequence-issue-invoice.pu` | #47 | Done |
| UML sequence diagram: reconcile a payment | `sequence-reconcile-payment.pu` | #49 | Done |
| UML sequence diagram: cancellation with debt query | `sequence-*.pu` | #50 | Planned (Sprint 5) |
| Consistency check across the design artifacts | `scripts/check-design-consistency.py`, decisions in `class-diagram-traceability.md` (section 9) | #51 | In progress |
| Scrum Report (Markdown + PDF) | `scrum-report-delivery-2.md` | #53 | In progress (PR #39) |

The feedback on Submission 1 that affects the design was applied first, in Sprint 3 (#27–#38): Functional Requirements consolidated into 80 parent FRs with sub-requirements and MoSCoW priorities on the parents, User Requirements in standard format with UR → FR traceability, measurable NFRs, use case diagram notation fixes, and the Time actor replaced by the system Scheduler.

| Sprint | Dates | Goal |
| :--- | :--- | :--- |
| Sprint 3 | 28/10 – 04/11 | Apply the Submission 1 feedback that the design builds on. |
| Sprint 4 | 04/11 – 11/11 (extended during 11/11) | Complete the design core: domain model, architecture, ER, class and component diagrams. |
| Sprint 5 | 11/11 – 17/11 | Sequence diagrams, consistency check, PDFs, presentation and submission. |

---

## 5. Submission 1 — Requirements Analysis and Use Cases (delivered)

Requirements document, UML use case diagram, use case specifications and Scrum Report, exported to `doc/` and submitted in the week of October 20, 2026.
