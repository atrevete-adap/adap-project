# Architecture Pattern and Rationale

This document records the architectural decision for the TurbineH internal invoicing and collections system (#43). It is the basis for the UML component diagram (#46) and the sequence diagrams (#47 to #50). Terminology follows Session 2.1 (Architectural Modeling).

## 1. Decision

The system follows a **layered (n-tier) architecture** with four layers, deployed as a **client-server** web application:

| Layer | Responsibility | Typical elements (stereotype) |
| --- | --- | --- |
| Presentation | Screens of the responsive web application and the REST endpoint for external applications. Receives input and shows results; holds no business rules. | `<<boundary>>` views and API endpoint |
| Application | One controller per group of use cases. Coordinates each use case: checks permissions, calls the domain, opens transactions and records audit entries. Also contains the **Scheduler**. | `<<control>>` controllers |
| Domain | Business entities and rules of the domain model (#42): customers, subscriptions, invoices, payments, approvals, audit. Declares the interfaces it needs from the outside world. | entities, `<<interface>>` ports |
| Infrastructure | Technical implementations of the domain interfaces: database access, PDF generation, document storage, and adapters for the simulated payment and communication services. | `<<infrastructure>>` adapters |

Two rules complete the pattern:

1. **Each layer only depends on the layer immediately below it.** The presentation layer never accesses the database or the domain directly; it always goes through a controller.
2. **Dependency inversion towards infrastructure.** The domain declares interfaces (for example `PaymentGateway`, `CommunicationService`, `InvoiceRepository`) and the infrastructure layer implements them through adapters. This is the same structure as the *Medical Appointment Management System* case study (Session 2.1, slide 21), where `LegacyScheduleGateway` and `NotificationService` are domain interfaces implemented by infrastructure adapters.

Inside the presentation and application layers, views and controllers follow the **Model-View-Controller** split: views are `<<boundary>>`, controllers are `<<control>>` and the model is the domain layer.

## 2. Rationale

Session 2.1 recommends the layered architecture for *critical banking and financial operations* that need "high security, transactional consistency, strict auditing, and reliable data management". TurbineH's system has the same profile: it issues legally numbered invoices, tracks debt, and must keep an immutable audit trail.

| Requirement | How the layered architecture supports it |
| --- | --- |
| **BR-01** Operational independence from Brain | Brain and other external applications only reach the system through the REST endpoint in the presentation layer (FR15). No internal layer depends on Brain, so the application keeps working if Brain changes or disappears. |
| **BR-04** Financial governance and separation of duties | Permission and approval checks live in the application controllers, a single place every request passes through (UI, API or Scheduler). |
| **BR-06** Fiscal compliance | Numbering, taxes and immutability of issued invoices are domain rules, isolated from screens and storage. |
| **NFR-04** Security | The presentation layer cannot reach the database; every protected operation is authorised in the application layer before touching data. |
| **NFR-05** Auditability, availability and recovery | Controllers record an audit entry for every critical operation. Backups and restores are application use cases (UC-21, UC-22) that use a storage interface, so the backup target can change without touching business rules. |
| **NFR-06** Data integrity and automation reliability | Transactions are opened by the application layer, and automatic jobs run through the same controllers as interactive users, so duplicate checks and idempotency rules are written once. |
| **NFR-07** Maintainability and Deployment Reproducibility | Each layer can be changed or tested on its own, and the application is deployed independently of Brain. The simulated payment and communication services are adapters, so replacing a simulation with a real provider (Stripe, Revolut, an email or WhatsApp service) only changes the infrastructure layer. |

### Alternatives considered

| Pattern | Why it was not chosen |
| --- | --- |
| Microservices | Designed for independent scaling under massive traffic. TurbineH is an internal tool for a small staff; splitting it into services would add distributed data and network overhead without a matching need. Session 2.1 lists this as *accidental over-complexity*. |
| Event-driven architecture | Suited to high-throughput asynchronous streams (IoT, streaming). The system's workflows are mostly interactive and transactional. The few asynchronous tasks are covered by the Scheduler and background jobs inside the layered design. |
| Pipe-and-filter | Not suitable for interactive systems (Session 2.1). |
| Plain client-server without layers | Would mix screens, business rules and data access, which conflicts with the security and auditability requirements above. Client-server is kept only as the deployment topology (browser and API clients talking to one server). |

## 3. Scheduler

Following the professor's feedback on Submission 1 (#27), time is not an actor. Automatic processes are started by a **Scheduler** component in the application layer. It is driven by a system timer in the infrastructure layer and reads its calendar from the automation policies configured in UC-13.

The Scheduler contains no business logic. When an occurrence becomes due, it calls the same application controller that a user would call, with a system identity instead of an interactive session. Each run is recorded as an `AutomationRun` (domain model), which UC-14 shows in the automation health view.

| Scheduled job | Controller called | Use case | Requirements |
| --- | --- | --- | --- |
| Monthly invoice generation (first day of the month, plus recovery of missed runs) | Invoicing | UC-06 (includes UC-05, UC-19, UC-20) | FR2.1, FR14.3 |
| Payment reminders and overdue follow-up | Collections | UC-08 | FR3.2, FR3.3 |
| Payment provider queries | Collections | UC-07 | FR3, FR3.1 |
| Data and document backups | Audit and Backup | UC-21 | FR9, NFR-05 |
| Annual rate review task creation | Customers and Subscriptions | UC-04 | FR5 |
| Scheduled financial summaries | Reporting and Operations | UC-12 | FR8.8 |

Because every job goes through a controller, the same permission checks, transactions, idempotency rules (NFR-06) and audit entries apply to automatic and manual work.

## 4. Components per layer

This is the starting point for the component diagram (#46). Component names in the application layer group the 22 use cases; the domain layer follows the domain model (#42).

**Presentation layer**
- `Web UI` `<<boundary>>`: responsive screens for internal users (NFR-02).
- `REST API` `<<boundary>>`: authenticated endpoint for external applications such as Brain (UC-10 intake, UC-11).

**Application layer** (`<<control>>`)
- `Access and Users`: UC-01, UC-03.
- `Customers and Subscriptions`: UC-02, UC-04, UC-10.
- `Invoicing`: UC-05, UC-06, UC-15, UC-19, UC-20.
- `Collections`: UC-07, UC-08, UC-16.
- `Approvals`: UC-17.
- `Reporting and Operations`: UC-09, UC-11, UC-12, UC-18.
- `Configuration`: UC-13.
- `Audit and Backup`: UC-14, UC-21, UC-22.
- `Scheduler`: starts the jobs in section 3.

**Domain layer**
- The concepts of the domain model (#42), grouped as *Customers and subscriptions*, *Invoicing and collection* and *Governance and automation*.
- Interfaces (ports): repositories for each aggregate, `PaymentGateway`, `CommunicationService`, `DocumentStorage`, `PdfRenderer`.

**Infrastructure layer** (`<<infrastructure>>`)
- `Persistence`: implements the repositories on the relational database.
- `Payment Provider Adapter`: implements `PaymentGateway` (simulated Stripe / Revolut).
- `Email Adapter` and `WhatsApp Adapter`: implement `CommunicationService` (simulated).
- `Document Storage` and `PDF Generator`: store invoice PDFs, attachments and backups.
- `System Timer`: triggers the Scheduler.

**External systems** (`<<external>>`): Payment Provider, Email / WhatsApp service, Brain and other API clients, database server.

## 5. Architectural constraints

- The presentation layer cannot access the domain or the database directly; it only calls application controllers.
- The domain layer does not depend on any infrastructure technology; it only declares interfaces.
- External applications only use the REST API, with their own credentials and scope (FR15).
- Automatic jobs are started by the Scheduler and executed by application controllers, never by direct database scripts.
- Issued invoices, original PDFs and audit entries are never modified in place (BR-06, NFR-05).
- The system is deployed independently from Brain (NFR-07).
