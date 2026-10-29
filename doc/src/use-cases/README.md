# Use Case Specifications

> Submission 1: 18 behavioural contracts consolidated on 2026-10-20 from the original 59-FR baseline at `2d9d12f`. Reconciled with the requirement decomposition on `main` at `046ecb943b4a44673fb99490c187a289d9b64965` and with the 14 consolidated user requirements (UR-01 to UR-14) introduced on `main` at `7ef6452`. The six absorbed cases remain as explicit flows; no functional requirement is removed.

## 1. Scope, actors and shared rules

Turbine is an independent internal invoicing and collections application. Customers and the accounting firm receive documents or support externally; neither has an application account. Payment and communication providers may be simulated. `E p. n` denotes the supplied 18-page extended client transcript. The current [requirements](../requirements.md), including the remaining C1-C4, C6 and C11 interpretations, detailed FR rules and Out of Scope, define the baseline; client-review caveats remain in force.

| Actor | Capability |
| --- | --- |
| Operational User | Assigned staff; customer-scoped operations, invoice work and payment follow-up when permitted. |
| Administrator | Specialises Operational User; wider operational management, assignments, approvals, financial reporting, corrections and period closing within authority. |
| Super Administrator | Specialises Administrator; global configuration, protected audit and recovery. A specific capability check still applies to every action. |
| Time | Authorised timer automation for monthly billing, annual-review tasks, reminders, payment queries and backups. |
| External Application | Separately authenticated/scoped API caller; debt queries and cancellation intake confer no interactive customer access. |
| Payment Provider | Supporting service providing verified transaction evidence; Turbine does not operate a payment gateway. |
| Communication Service | Supporting service for email and consented complementary WhatsApp. |

- Authentication and current role/customer scope are rechecked on every protected request, direct download, bulk item and API operation. An inherited actor association never bypasses an operation's capability or approval threshold. UC-12 requires financial-report permission even for a technical Super Administrator account; the unresolved account-policy choice is not silently decided here.
- Issued snapshots, numbers and original PDFs are preserved. Corrections, cash movements and collection state have distinct evidence; logical deactivation or cancellation never marks a debt paid.
- Automated issuance, transaction allocation and reminder occurrences are idempotent. Recovery resumes the failed stage without repeating successful financial work; item failures have explicit outcomes.
- Customer-agreed terms override the default five days. FR3.2.5 (formerly C9) moves communications only, not the legal due date; C4 separates cancellation from old debt; C11 excludes marketing reuse. Document and approve proration, rounding and day-count conventions before activation rather than inventing client decisions.
- Existing NFR targets remain acceptance conditions, not measured results. Retention, backup/recovery and immutable audit checks follow NFR-05; no universal legal retention period is asserted here.
- Shared details such as saved views, comments, scoped attachments, background status and per-item bulk results follow their mapped FR. They are not separate use cases merely because they require a screen.

## 2. Consolidation and inventory

The original 24 cases were consolidated into 18 and renumbered consecutively as UC-01 to UC-18. The first table lists the six original cases absorbed into another contract; absorbed cases do not appear as separate ellipses in the diagram. The second table maps each current ID to its original ID.

| Original ID (absorbed) | Current contract | Behaviour retained |
| --- | --- | --- |
| Original UC-03 | UC-02 | CSV preview, validation, confirmation and row results. |
| Original UC-05 | UC-03 | Assignment, reassignment, expiring delegation and access routing. |
| Original UC-07 | UC-04 | Annual review evidence, proposed band, human approval and effective rate. |
| Original UC-09 | UC-05 | Validation, numbering, immutable issuance and PDF recovery. |
| Original UC-11 | UC-05 | Delivery, observed status, consent, retries and bounce handling. |
| Original UC-19 | UC-14 | Immutable audit inspection and automation health, alongside backup/recovery. |

| Current ID | Original ID |
| --- | --- |
| UC-01 | UC-01 |
| UC-02 | UC-02 |
| UC-03 | UC-04 |
| UC-04 | UC-06 |
| UC-05 | UC-08 |
| UC-06 | UC-10 |
| UC-07 | UC-12 |
| UC-08 | UC-13 |
| UC-09 | UC-14 |
| UC-10 | UC-15 |
| UC-11 | UC-16 |
| UC-12 | UC-17 |
| UC-13 | UC-18 |
| UC-14 | UC-20 |
| UC-15 | UC-21 |
| UC-16 | UC-22 |
| UC-17 | UC-23 |
| UC-18 | UC-24 |

| ID | Goal | Functional requirements |
| --- | --- | --- |
| [UC-01](UC-01.md) | Access the internal application | FR6.1, FR6.2 |
| [UC-02](UC-02.md) | Maintain customers and import records | FR1, FR1.1, FR1.2, FR1.3, FR1.6, FR1.4, FR1.7, FR1.8 |
| [UC-03](UC-03.md) | Administer staff access and customer assignments | FR6.2, FR6.3, FR1.5, FR6.4, FR14.1 |
| [UC-04](UC-04.md) | Manage subscriptions and annual rate reviews | FR2.2, FR5.2, FR10, FR10.1, FR10.2, FR5, FR5.1, FR5.3, FR5.4, FR5.5, FR10.3 |
| [UC-05](UC-05.md) | Prepare, issue and deliver an invoice | FR2, FR2.3, FR2.5, FR14.2, FR2.4, FR2.6, FR14, FR2.7, FR13.1, FR2.9, FR2.10, FR2.11, FR11.2, FR14.4 |
| [UC-06](UC-06.md) | Generate monthly recurring invoices | FR2.1, FR9.2, FR14, FR11.2, FR14.3 |
| [UC-07](UC-07.md) | Reconcile payments with invoices | FR3, FR3.1, FR14.4 |
| [UC-08](UC-08.md) | Run reminders and overdue follow-up | FR3.2, FR3.3, FR3.4, FR13 |
| [UC-09](UC-09.md) | Review daily work and notifications | FR7, FR7.1, FR7.2, FR8.2, FR8.3 |
| [UC-10](UC-10.md) | Record subscription cancellation | FR4, FR4.1, FR15, FR4.3, FR15.1, FR15.2 |
| [UC-11](UC-11.md) | Query outstanding obligations through the API | FR4.2, FR15, FR15.1, FR15.2 |
| [UC-12](UC-12.md) | Consult financial dashboard and reports | FR8, FR8.1, FR8.3, FR8.4, FR8.5, FR8.6, FR8.7, FR8.8 |
| [UC-13](UC-13.md) | Configure billing and automation policies | FR5.1, FR6.2, FR13, FR13.1, FR13.3 |
| [UC-14](UC-14.md) | Supervise audit, backups and recovery | FR9.1, FR9.2, FR9 |
| [UC-15](UC-15.md) | Correct an issued invoice | FR2.3, FR2.8 |
| [UC-16](UC-16.md) | Resolve a billing or delivery issue | FR3.4, FR12, FR12.1, FR12.2, FR12.3 |
| [UC-17](UC-17.md) | Decide a sensitive financial approval | FR3.5, FR11, FR11.1, FR11.3 |
| [UC-18](UC-18.md) | Close or reopen an administrative period | FR13.2 |

## 4. Relationships and coverage

The four views of [use-case-diagram.pu](../use-case-diagram.pu) show exactly these 18 IDs. UC-06 and UC-15 include UC-05; their caller supplies the appropriate approved recurring or corrective proposal. UC-10 includes UC-11's debt calculation. UC-05 extends UC-04 only when an initial prorated invoice is due. UC-17 extends UC-04, UC-05 or UC-15 only when the applicable rate, commercial or correction decision requires approval. UC-16 extends UC-05 or UC-07 for delivery or reconciliation problems; it does not run after every successful invoice/payment.

The grouped cases retain their distinct branch permissions and outcomes; grouping is a presentation change, not a grant of new capabilities. All 59 original FR remain covered; the current 85 parent requirements and all 112 explicitly defined descendant rules (197 FR IDs) are covered. Each listed parent FR includes its defined sub-requirements; the coordination note records the complete parent mapping. The diagram's historical C9 label refers to FR3.2.5, which now defines the working-calendar rule directly. BR links use the six current BR, without renumbering requirements. Broader UR goals for controlled merging, cost centres, budget targets or refunds do not override the existing scope exclusions or create unsupported cash flows.

Compile only the four named Submission 1 deliverables. Historical review/consolidation notes remain in `notes/`; they are not additional PDFs. These contracts define expected behaviour and make no claim of implementation or executed application tests.

## 5. Functional requirement traceability

Each row lists an explicit parent reference and the sub-requirements covered by that parent. Definitions are taken from the current requirements source; a child is not an additional explicit citation unless named in a contract.

| Parent FR (explicit) | Contracts | Covered sub-requirements |
| --- | --- | --- |
| FR1 | [UC-02](UC-02.md) | FR1.1.1, FR1.1.2, FR1.1.3, FR1.1.4, FR1.1.5, FR1.3.1, FR1.3.2, FR1.4.1, FR1.4.2, FR1.4.3, FR1.4.4, FR1.6.1, FR1.6.2, FR1.6.3 |
| FR1.1 | [UC-02](UC-02.md) | FR1.1.1, FR1.1.2, FR1.1.3, FR1.1.4, FR1.1.5 |
| FR1.2 | [UC-02](UC-02.md) | None defined |
| FR1.3 | [UC-02](UC-02.md) | FR1.3.1, FR1.3.2 |
| FR1.4 | [UC-02](UC-02.md) | FR1.4.1, FR1.4.2, FR1.4.3, FR1.4.4 |
| FR1.5 | [UC-03](UC-03.md) | None defined |
| FR1.6 | [UC-02](UC-02.md) | FR1.6.1, FR1.6.2, FR1.6.3 |
| FR1.7 | [UC-02](UC-02.md) | None defined |
| FR1.8 | [UC-02](UC-02.md) | None defined |
| FR2 | [UC-05](UC-05.md) | FR2.3.1, FR2.3.2, FR2.3.3, FR2.3.4, FR2.4.1, FR2.4.2, FR2.5.1, FR2.5.2, FR2.7.1, FR2.7.2, FR2.7.3, FR2.7.4, FR2.7.5, FR2.8.1, FR2.8.2 |
| FR2.1 | [UC-06](UC-06.md) | None defined |
| FR2.2 | [UC-04](UC-04.md) | None defined |
| FR2.3 | [UC-05](UC-05.md), [UC-15](UC-15.md) | FR2.3.1, FR2.3.2, FR2.3.3, FR2.3.4 |
| FR2.4 | [UC-05](UC-05.md) | FR2.4.1, FR2.4.2 |
| FR2.5 | [UC-05](UC-05.md) | FR2.5.1, FR2.5.2 |
| FR2.6 | [UC-05](UC-05.md) | None defined |
| FR2.7 | [UC-05](UC-05.md) | FR2.7.1, FR2.7.2, FR2.7.3, FR2.7.4, FR2.7.5 |
| FR2.8 | [UC-15](UC-15.md) | FR2.8.1, FR2.8.2 |
| FR2.9 | [UC-05](UC-05.md) | None defined |
| FR2.10 | [UC-05](UC-05.md) | None defined |
| FR2.11 | [UC-05](UC-05.md) | None defined |
| FR3 | [UC-07](UC-07.md) | FR3.1.1, FR3.1.2, FR3.1.3, FR3.1.4, FR3.1.5, FR3.2.1, FR3.2.2, FR3.2.3, FR3.2.4, FR3.2.5, FR3.4.1, FR3.4.2, FR3.4.3 |
| FR3.1 | [UC-07](UC-07.md) | FR3.1.1, FR3.1.2, FR3.1.3, FR3.1.4, FR3.1.5 |
| FR3.2 | [UC-08](UC-08.md) | FR3.2.1, FR3.2.2, FR3.2.3, FR3.2.4, FR3.2.5 |
| FR3.3 | [UC-08](UC-08.md) | None defined |
| FR3.4 | [UC-08](UC-08.md), [UC-16](UC-16.md) | FR3.4.1, FR3.4.2, FR3.4.3 |
| FR3.5 | [UC-17](UC-17.md) | None defined |
| FR4 | [UC-10](UC-10.md) | FR4.1.1, FR4.1.2 |
| FR4.1 | [UC-10](UC-10.md) | FR4.1.1, FR4.1.2 |
| FR4.2 | [UC-11](UC-11.md) | None defined |
| FR4.3 | [UC-10](UC-10.md) | None defined |
| FR5 | [UC-04](UC-04.md) | FR5.2.1, FR5.2.2 |
| FR5.1 | [UC-04](UC-04.md), [UC-13](UC-13.md) | None defined |
| FR5.2 | [UC-04](UC-04.md) | FR5.2.1, FR5.2.2 |
| FR5.3 | [UC-04](UC-04.md) | None defined |
| FR5.4 | [UC-04](UC-04.md) | None defined |
| FR5.5 | [UC-04](UC-04.md) | None defined |
| FR6.1 | [UC-01](UC-01.md) | FR6.1.1, FR6.1.2, FR6.1.3, FR6.1.4 |
| FR6.2 | [UC-01](UC-01.md), [UC-03](UC-03.md), [UC-13](UC-13.md) | FR6.2.1, FR6.2.2, FR6.2.3, FR6.2.4, FR6.2.5 |
| FR6.3 | [UC-03](UC-03.md) | FR6.3.1, FR6.3.2 |
| FR6.4 | [UC-03](UC-03.md) | FR6.4.1, FR6.4.2 |
| FR7 | [UC-09](UC-09.md) | FR7.1.1, FR7.1.2 |
| FR7.1 | [UC-09](UC-09.md) | FR7.1.1, FR7.1.2 |
| FR7.2 | [UC-09](UC-09.md) | None defined |
| FR8 | [UC-12](UC-12.md) | FR8.3.1, FR8.3.2, FR8.3.3, FR8.3.4, FR8.4.1, FR8.4.2, FR8.4.3 |
| FR8.1 | [UC-12](UC-12.md) | None defined |
| FR8.2 | [UC-09](UC-09.md) | None defined |
| FR8.3 | [UC-09](UC-09.md), [UC-12](UC-12.md) | FR8.3.1, FR8.3.2, FR8.3.3, FR8.3.4 |
| FR8.4 | [UC-12](UC-12.md) | FR8.4.1, FR8.4.2, FR8.4.3 |
| FR8.5 | [UC-12](UC-12.md) | None defined |
| FR8.6 | [UC-12](UC-12.md) | None defined |
| FR8.7 | [UC-12](UC-12.md) | None defined |
| FR8.8 | [UC-12](UC-12.md) | None defined |
| FR9 | [UC-14](UC-14.md) | FR9.1.1, FR9.1.2, FR9.2.1, FR9.2.2 |
| FR9.1 | [UC-14](UC-14.md) | FR9.1.1, FR9.1.2 |
| FR9.2 | [UC-06](UC-06.md), [UC-14](UC-14.md) | FR9.2.1, FR9.2.2 |
| FR10 | [UC-04](UC-04.md) | FR10.1.1, FR10.1.2, FR10.2.1, FR10.2.2, FR10.2.3 |
| FR10.1 | [UC-04](UC-04.md) | FR10.1.1, FR10.1.2 |
| FR10.2 | [UC-04](UC-04.md) | FR10.2.1, FR10.2.2, FR10.2.3 |
| FR10.3 | [UC-04](UC-04.md) | None defined |
| FR11 | [UC-17](UC-17.md) | FR11.1.1, FR11.1.2 |
| FR11.1 | [UC-17](UC-17.md) | FR11.1.1, FR11.1.2 |
| FR11.2 | [UC-05](UC-05.md), [UC-06](UC-06.md) | None defined |
| FR11.3 | [UC-17](UC-17.md) | None defined |
| FR12 | [UC-16](UC-16.md) | FR12.1.1, FR12.1.2, FR12.1.3, FR12.2.1, FR12.2.2 |
| FR12.1 | [UC-16](UC-16.md) | FR12.1.1, FR12.1.2, FR12.1.3 |
| FR12.2 | [UC-16](UC-16.md) | FR12.2.1, FR12.2.2 |
| FR12.3 | [UC-16](UC-16.md) | None defined |
| FR13 | [UC-08](UC-08.md), [UC-13](UC-13.md) | FR13.1.1, FR13.1.2, FR13.1.3, FR13.1.4, FR13.2.1, FR13.2.2 |
| FR13.1 | [UC-05](UC-05.md), [UC-13](UC-13.md) | FR13.1.1, FR13.1.2, FR13.1.3, FR13.1.4 |
| FR13.2 | [UC-18](UC-18.md) | FR13.2.1, FR13.2.2 |
| FR13.3 | [UC-13](UC-13.md) | None defined |
| FR14 | [UC-05](UC-05.md), [UC-06](UC-06.md) | FR14.1.1, FR14.1.2, FR14.2.1, FR14.2.2, FR14.2.3, FR14.2.4, FR14.2.5 |
| FR14.1 | [UC-03](UC-03.md) | FR14.1.1, FR14.1.2 |
| FR14.2 | [UC-05](UC-05.md) | FR14.2.1, FR14.2.2, FR14.2.3, FR14.2.4, FR14.2.5 |
| FR14.3 | [UC-06](UC-06.md) | None defined |
| FR14.4 | [UC-05](UC-05.md), [UC-07](UC-07.md) | None defined |
| FR15 | [UC-10](UC-10.md), [UC-11](UC-11.md) | None defined |
| FR15.1 | [UC-10](UC-10.md), [UC-11](UC-11.md) | None defined |
| FR15.2 | [UC-10](UC-10.md), [UC-11](UC-11.md) | None defined |
