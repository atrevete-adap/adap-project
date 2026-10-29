# Use Case Specifications

The editable Submission 2 contracts are listed below. The requirement source is [requirements.md](../requirements.md); counts and coverage are derived from its definitions by `node scripts/validate-use-cases.cjs`. These are expected behaviours, not evidence of an implemented application or executed application tests.

## 1. Scope, actors and shared rules

Turbine is an independent internal invoicing and collections application. Customers and the accounting firm receive documents or support externally; neither has an application account. Payment and communication providers may be simulated. `E p. n` denotes the supplied 18-page extended client transcript. The current [requirements](../requirements.md), including the remaining C1-C4, C6 and C11 interpretations, functional sub-requirements and Out of Scope, define the baseline; client-review caveats remain in force.

| Actor | Capability |
| --- | --- |
| Operational User | Assigned staff; customer-scoped operations, invoice work and payment follow-up when permitted. |
| Administrator | Specialises Operational User; wider operational management, assignments, approvals, financial reporting, corrections and period closing within authority. |
| Super Administrator | Specialises Administrator; global configuration, protected audit and recovery. A specific capability check still applies to every action. |
| External Application | Separately authenticated/scoped API caller; debt queries and cancellation intake confer no interactive customer access. |
| Payment Provider | Supporting service providing verified transaction evidence; Turbine does not operate a payment gateway. |
| Communication Service | Supporting service for email and consented complementary WhatsApp. |

- Authentication and current role/customer scope are rechecked on every protected request, direct download, bulk item and API operation. An inherited actor association never bypasses an operation's capability or approval threshold. UC-12 requires financial-report permission even for a technical Super Administrator account; the unresolved account-policy choice is not silently decided here.
- Issued snapshots, numbers and original PDFs are preserved. Corrections, cash movements and collection state have distinct evidence; logical deactivation or cancellation never marks a debt paid.
- Automated issuance, transaction allocation and reminder occurrences are idempotent. Recovery resumes the failed stage without repeating successful financial work; item failures have explicit outcomes.
- Customer-agreed terms override the default five days. FR3.2.5 (formerly C9) moves communications only, not the legal due date; C4 separates cancellation from old debt; C11 excludes marketing reuse. Document and approve proration, rounding and day-count conventions before activation rather than inventing client decisions.
- Existing NFR targets remain acceptance conditions, not measured results. Retention, backup/recovery and immutable audit checks follow NFR-05; no universal legal retention period is asserted here.
- Shared details such as saved views, comments, scoped attachments, background status and per-item bulk results follow their mapped FR. They are not separate use cases merely because they require a screen.

- Automatic billing, payment queries, reminders, annual-review task creation, report schedules and backups start when their configured occurrence becomes due. They are internal system behaviour under the relevant authorised policy. UC-06 and UC-08 have no primary actor; UC-21 has no primary actor on its scheduled path. Human owners configure policies but do not manually initiate automatic occurrences. Scheduler belongs to the architecture, not the actor list. Restoration in UC-22 always requires explicit Super Administrator confirmation. This follows [the professor's answer in #27](https://github.com/atrevete-adap/adap-project/issues/27#issuecomment-6467325532).
- A draft in UC-05, issuance in UC-19 and a sending attempt in UC-20 have separate outcomes. Drafts are editable and consume no definitive number. Only issuance assigns the unique sequential number; sending retries and intentional resends reuse the preserved invoice/PDF. An issued invoice with a failed PDF or sending stage is never issued again to repair that stage.
- Reused contracts inherit only the caller's authorised customer, operation and proposal context. Automatic execution requires no interactive staff session. Approval exemptions apply only to unchanged approved subscriptions; changed financial proposals retain their approval checks. Direct staff operations still require authentication and their specific capability.
- Each numbered scenario step identifies one acting party and one action. Extension labels refer to a numbered main-scenario step; extension substeps are local to that branch. Conditional approval and issue follow-up appear where needed; ordinary navigation to another contract is not automatically a UML include or extend.
- Functional defaults and safeguards remain part of their mapped contracts: configurable login protection starts at five consecutive failures and a fifteen-minute lock (FR6.1.4); forms use the most frequent country/currency over the last thirty days, agreed/default due dates and revenue-band rates (FR14.2.1), save drafts every thirty seconds (FR14.2.3), offer undo for reversible actions and explain irreversible effects before confirmation (FR14.2.4). A deviation greater than the configured 50% against the last six same-type invoices produces a warning, not a block (FR2.5.2).
- Bulk operations above the configurable 1,000-record threshold run in the background with pending, processing, completed or completed-with-errors status (FR14). Reports above the configurable 1,000-invoice threshold follow FR8.7. Every bulk item retains its own permission check and outcome; no uncontrolled bulk mark-as-paid operation is permitted (FR14.1).
- Customer/contact handling retains multiple contacts per company, shared contacts across companies, contact roles and inactive-contact delivery history (FR1.1). Customer statuses include pending activation, active, paused, cancellation requested, inactive and administratively blocked; tags and timelines preserve all relevant commercial events (FR1.6). Notification events retain payment, sent follow-up, overdue, bounce, dispute, review, rejection, mention and expiring-pause outcomes (FR7). Internal comments and scoped attachments can also be attached to customers and invoices under UC-16, without requiring an issue to be opened.
- UC-13 covers payment/reminder periods, authorised domains, issuer tax data, logo and standard template, series, currencies, taxes, rate bands, approval thresholds, channels, working calendar and automation policies. Communication templates retain company, invoice number, amount, due date, responsible person and support variables, at least Spanish and English, a self-addressed test and the recorded sending template version (FR13.1). Global configuration remains Super Administrator-only; separately authorised template editors retain their scoped capability.

## 2. Inventory

| ID | Goal | Explicit FR references in Related requirements |
| --- | --- | --- |
| [UC-01](UC-01.md) | Access the internal application | FR6.1, FR6.2 |
| [UC-02](UC-02.md) | Maintain customers and import records | FR1, FR1.1, FR1.2, FR1.3, FR1.6, FR1.4, FR1.7, FR1.8 |
| [UC-03](UC-03.md) | Administer staff access and customer assignments | FR6.2, FR6.3, FR1.5, FR6.4, FR14.1 |
| [UC-04](UC-04.md) | Manage subscriptions and annual rate reviews | FR2.2, FR5.2, FR10, FR10.1, FR10.2, FR5, FR5.1, FR5.3, FR5.4, FR5.5, FR10.3 |
| [UC-05](UC-05.md) | Prepare an invoice draft | FR2, FR2.3, FR2.5, FR14.2, FR2.9, FR2.10, FR2.11 |
| [UC-06](UC-06.md) | Generate monthly recurring invoices | FR2.1, FR9.2, FR14, FR11.2, FR14.3 |
| [UC-07](UC-07.md) | Reconcile payments with invoices | FR3, FR3.1, FR14.4 |
| [UC-08](UC-08.md) | Run reminders and overdue follow-up | FR3.2, FR3.3, FR3.4, FR13 |
| [UC-09](UC-09.md) | Review daily work and notifications | FR7, FR7.1, FR7.2, FR8.2, FR8.3 |
| [UC-10](UC-10.md) | Record subscription cancellation | FR4, FR4.1, FR15, FR4.3, FR15.1, FR15.2 |
| [UC-11](UC-11.md) | Query outstanding obligations through the API | FR4.2, FR15, FR15.1, FR15.2 |
| [UC-12](UC-12.md) | Consult financial dashboard and reports | FR8, FR8.1, FR8.3, FR8.4, FR8.5, FR8.6, FR8.7, FR8.8 |
| [UC-13](UC-13.md) | Configure billing and automation policies | FR5.1, FR6.2, FR13, FR13.1, FR13.3 |
| [UC-14](UC-14.md) | Inspect audit and automation health | FR9.1, FR9.2 |
| [UC-15](UC-15.md) | Correct an issued invoice | FR2.3, FR2.8 |
| [UC-16](UC-16.md) | Resolve a billing or delivery issue | FR3.4, FR12, FR12.1, FR12.2, FR12.3 |
| [UC-17](UC-17.md) | Decide a sensitive financial approval | FR3.5, FR11, FR11.1, FR11.3 |
| [UC-18](UC-18.md) | Close or reopen an administrative period | FR13.2 |
| [UC-19](UC-19.md) | Issue an invoice | FR2.3, FR2.4, FR2.5, FR2.6, FR11.2, FR14.4 |
| [UC-20](UC-20.md) | Send an issued invoice | FR2.4, FR2.7, FR13.1, FR14, FR14.4 |
| [UC-21](UC-21.md) | Create a data and document backup | FR9, FR9.2 |
| [UC-22](UC-22.md) | Restore a validated backup | FR9, FR9.2 |

## 3. Single ID correspondence

This is the authoritative correspondence for the textual split in #35. Existing Submission 1 IDs are retained; only four new IDs are appended. Original 24-case IDs are historical, not active contracts. Historical notes retain their dated baseline and are not the active traceability source. Adam's [PR #41](https://github.com/atrevete-adap/adap-project/pull/41) still uses the 18-case model and explicitly defers splitting until after #36; no published split-ID proposal was found in the inspected issues, comments or open PRs on 2026-10-29.

| Submission 1 ID | Original 24-case IDs represented | Submission 2 contract(s) | Responsibility retained |
| --- | --- | --- | --- |
| UC-01 | UC-01 | [UC-01](UC-01.md) | Existing ID and goal retained. |
| UC-02 | UC-02, UC-03 | [UC-02](UC-02.md) | Existing ID and goal retained. |
| UC-03 | UC-04, UC-05 | [UC-03](UC-03.md) | Existing ID and goal retained. |
| UC-04 | UC-06, UC-07 | [UC-04](UC-04.md) | Existing ID and goal retained. |
| UC-05 | UC-08, UC-09, UC-11 | [UC-05](UC-05.md), [UC-19](UC-19.md), [UC-20](UC-20.md) | Draft preparation; immutable issuance; sending and resends. |
| UC-06 | UC-10 | [UC-06](UC-06.md) | Existing ID and goal retained. |
| UC-07 | UC-12 | [UC-07](UC-07.md) | Existing ID and goal retained. |
| UC-08 | UC-13 | [UC-08](UC-08.md) | Existing ID and goal retained. |
| UC-09 | UC-14 | [UC-09](UC-09.md) | Existing ID and goal retained. |
| UC-10 | UC-15 | [UC-10](UC-10.md) | Existing ID and goal retained. |
| UC-11 | UC-16 | [UC-11](UC-11.md) | Existing ID and goal retained. |
| UC-12 | UC-17 | [UC-12](UC-12.md) | Existing ID and goal retained. |
| UC-13 | UC-18 | [UC-13](UC-13.md) | Existing ID and goal retained. |
| UC-14 | UC-19, UC-20 | [UC-14](UC-14.md), [UC-21](UC-21.md), [UC-22](UC-22.md) | Audit/health consultation; backup creation; confirmed restoration. |
| UC-15 | UC-21 | [UC-15](UC-15.md) | Existing ID and goal retained. |
| UC-16 | UC-22 | [UC-16](UC-16.md) | Existing ID and goal retained. |
| UC-17 | UC-23 | [UC-17](UC-17.md) | Existing ID and goal retained. |
| UC-18 | UC-24 | [UC-18](UC-18.md) | Existing ID and goal retained. |

## 4. Contract relationships

The diagram source and exports remain owned by Adam and currently describe the prior 18-case model. They must be synchronised before this draft PR is ready. The [handoff](../../../notes/delivery2-use-case-handoff.md) lists actors, triggers and the changes required for the overview and views. A normal workflow handoff below is an explicit contract invocation, not a claim of a UML relationship.

| Caller / extension | Relationship | Target / base | Functional point or condition |
| --- | --- | --- | --- |
| [UC-06](UC-06.md) | include | [UC-05](UC-05.md) | Step 3: prepare each approved recurring proposal. |
| [UC-06](UC-06.md) | include | [UC-19](UC-19.md) | Step 4: issue each eligible draft. |
| [UC-15](UC-15.md) | include | [UC-05](UC-05.md) | Step 5: prepare the corrective proposal with original link. |
| [UC-15](UC-15.md) | include | [UC-19](UC-19.md) | Step 6: issue the authorised correction. |
| [UC-19](UC-19.md) | include | [UC-20](UC-20.md) | Step 11: request delivery; its outcome remains separate from issuance. |
| [UC-10](UC-10.md) | include | [UC-11](UC-11.md) | Step 4: obtain current obligations using internal authority. |
| [UC-05](UC-05.md) | extend | [UC-04](UC-04.md) | UC-04 extension 8a: eligible initial proration. Existing direction retained pending professor clarification noted in PR #41. |
| [UC-19](UC-19.md) | extend | [UC-05](UC-05.md) | UC-05 extension 9c: issuance of the current draft is requested. |
| [UC-17](UC-17.md) | extend | [UC-04](UC-04.md) | UC-04 extensions 4a–4c and 1c/1f: commercial or annual-review approval. |
| [UC-17](UC-17.md) | extend | [UC-19](UC-19.md) | UC-19 extension 4a: sensitive financial approval is required before issuance. |
| [UC-17](UC-17.md) | extend | [UC-15](UC-15.md) | UC-15 extension 4a: corrective proposal requires approval. |
| [UC-16](UC-16.md) | extend | [UC-20](UC-20.md) | UC-20 extensions 3a, 7a and 7b: delivery problem needs follow-up. |
| [UC-16](UC-16.md) | extend | [UC-07](UC-07.md) | UC-07 extensions 4a–4c: reconciliation problem needs follow-up. |
| [UC-04](UC-04.md) | workflow handoff | [UC-19](UC-19.md) | UC-04 extension 8a: issue the approved prorated draft. |
| [UC-14](UC-14.md) | workflow handoff | [UC-21](UC-21.md) | UC-14 extension 6a: separately authorised manual backup. |
| [UC-14](UC-14.md) | workflow handoff | [UC-22](UC-22.md) | UC-14 extension 6b: separately authorised recovery. |

UC-21 does not include UC-22: making a backup never restores it. UC-22 uses an existing valid backup and does not include creation of a new one. UC-14 inspection never starts a scheduled job merely by opening health information. UC-17 returns decisions to their originating workflows; it does not unconditionally execute every listed workflow. UC-09 and UC-16 navigation retains each destination capability.

## 5. Functional requirement traceability

Each row names a **defined parent requirement explicitly cited in Related requirements**, the contracts carrying that citation, and its **defined sub-requirements covered through the parent**. This inherited coverage is distinguished from explicit child citations in the prose; it does not assert that every child is individually cited or independently tested. The validator derives definitions, ancestry and coverage from the current files and rejects missing parents or unknown references. Shared rules above retain cross-cutting acceptance details. Broader UR goals do not override the current Out of Scope exclusions (including controlled merging, cost centres, budget targets and cash refunds).

| Parent FR (explicit) | Contracts | Sub-requirements covered through parent |
| --- | --- | --- |
| FR1 | [UC-02](UC-02.md) | None defined |
| FR1.1 | [UC-02](UC-02.md) | FR1.1.1, FR1.1.2, FR1.1.3, FR1.1.4, FR1.1.5 |
| FR1.2 | [UC-02](UC-02.md) | None defined |
| FR1.3 | [UC-02](UC-02.md) | FR1.3.1, FR1.3.2 |
| FR1.4 | [UC-02](UC-02.md) | FR1.4.1, FR1.4.2, FR1.4.3, FR1.4.4 |
| FR1.5 | [UC-03](UC-03.md) | None defined |
| FR1.6 | [UC-02](UC-02.md) | FR1.6.1, FR1.6.2, FR1.6.3 |
| FR1.7 | [UC-02](UC-02.md) | None defined |
| FR1.8 | [UC-02](UC-02.md) | None defined |
| FR2 | [UC-05](UC-05.md) | None defined |
| FR2.1 | [UC-06](UC-06.md) | None defined |
| FR2.2 | [UC-04](UC-04.md) | None defined |
| FR2.3 | [UC-05](UC-05.md), [UC-15](UC-15.md), [UC-19](UC-19.md) | FR2.3.1, FR2.3.2, FR2.3.3, FR2.3.4 |
| FR2.4 | [UC-19](UC-19.md), [UC-20](UC-20.md) | FR2.4.1, FR2.4.2 |
| FR2.5 | [UC-05](UC-05.md), [UC-19](UC-19.md) | FR2.5.1, FR2.5.2 |
| FR2.6 | [UC-19](UC-19.md) | None defined |
| FR2.7 | [UC-20](UC-20.md) | FR2.7.1, FR2.7.2, FR2.7.3, FR2.7.4, FR2.7.5 |
| FR2.8 | [UC-15](UC-15.md) | FR2.8.1, FR2.8.2 |
| FR2.9 | [UC-05](UC-05.md) | None defined |
| FR2.10 | [UC-05](UC-05.md) | None defined |
| FR2.11 | [UC-05](UC-05.md) | None defined |
| FR3 | [UC-07](UC-07.md) | None defined |
| FR3.1 | [UC-07](UC-07.md) | FR3.1.1, FR3.1.2, FR3.1.3, FR3.1.4, FR3.1.5 |
| FR3.2 | [UC-08](UC-08.md) | FR3.2.1, FR3.2.2, FR3.2.3, FR3.2.4, FR3.2.5 |
| FR3.3 | [UC-08](UC-08.md) | None defined |
| FR3.4 | [UC-08](UC-08.md), [UC-16](UC-16.md) | FR3.4.1, FR3.4.2, FR3.4.3 |
| FR3.5 | [UC-17](UC-17.md) | None defined |
| FR4 | [UC-10](UC-10.md) | None defined |
| FR4.1 | [UC-10](UC-10.md) | FR4.1.1, FR4.1.2 |
| FR4.2 | [UC-11](UC-11.md) | None defined |
| FR4.3 | [UC-10](UC-10.md) | None defined |
| FR5 | [UC-04](UC-04.md) | None defined |
| FR5.1 | [UC-04](UC-04.md), [UC-13](UC-13.md) | None defined |
| FR5.2 | [UC-04](UC-04.md) | FR5.2.1, FR5.2.2 |
| FR5.3 | [UC-04](UC-04.md) | None defined |
| FR5.4 | [UC-04](UC-04.md) | None defined |
| FR5.5 | [UC-04](UC-04.md) | None defined |
| FR6.1 | [UC-01](UC-01.md) | FR6.1.1, FR6.1.2, FR6.1.3, FR6.1.4 |
| FR6.2 | [UC-01](UC-01.md), [UC-03](UC-03.md), [UC-13](UC-13.md) | FR6.2.1, FR6.2.2, FR6.2.3, FR6.2.4, FR6.2.5 |
| FR6.3 | [UC-03](UC-03.md) | FR6.3.1, FR6.3.2 |
| FR6.4 | [UC-03](UC-03.md) | FR6.4.1, FR6.4.2 |
| FR7 | [UC-09](UC-09.md) | None defined |
| FR7.1 | [UC-09](UC-09.md) | FR7.1.1, FR7.1.2 |
| FR7.2 | [UC-09](UC-09.md) | None defined |
| FR8 | [UC-12](UC-12.md) | None defined |
| FR8.1 | [UC-12](UC-12.md) | None defined |
| FR8.2 | [UC-09](UC-09.md) | None defined |
| FR8.3 | [UC-09](UC-09.md), [UC-12](UC-12.md) | FR8.3.1, FR8.3.2, FR8.3.3, FR8.3.4 |
| FR8.4 | [UC-12](UC-12.md) | FR8.4.1, FR8.4.2, FR8.4.3 |
| FR8.5 | [UC-12](UC-12.md) | None defined |
| FR8.6 | [UC-12](UC-12.md) | None defined |
| FR8.7 | [UC-12](UC-12.md) | None defined |
| FR8.8 | [UC-12](UC-12.md) | None defined |
| FR9 | [UC-21](UC-21.md), [UC-22](UC-22.md) | None defined |
| FR9.1 | [UC-14](UC-14.md) | FR9.1.1, FR9.1.2 |
| FR9.2 | [UC-06](UC-06.md), [UC-14](UC-14.md), [UC-21](UC-21.md), [UC-22](UC-22.md) | FR9.2.1, FR9.2.2 |
| FR10 | [UC-04](UC-04.md) | None defined |
| FR10.1 | [UC-04](UC-04.md) | FR10.1.1, FR10.1.2 |
| FR10.2 | [UC-04](UC-04.md) | FR10.2.1, FR10.2.2, FR10.2.3 |
| FR10.3 | [UC-04](UC-04.md) | None defined |
| FR11 | [UC-17](UC-17.md) | None defined |
| FR11.1 | [UC-17](UC-17.md) | FR11.1.1, FR11.1.2 |
| FR11.2 | [UC-06](UC-06.md), [UC-19](UC-19.md) | None defined |
| FR11.3 | [UC-17](UC-17.md) | None defined |
| FR12 | [UC-16](UC-16.md) | None defined |
| FR12.1 | [UC-16](UC-16.md) | FR12.1.1, FR12.1.2, FR12.1.3 |
| FR12.2 | [UC-16](UC-16.md) | FR12.2.1, FR12.2.2 |
| FR12.3 | [UC-16](UC-16.md) | None defined |
| FR13 | [UC-08](UC-08.md), [UC-13](UC-13.md) | None defined |
| FR13.1 | [UC-13](UC-13.md), [UC-20](UC-20.md) | FR13.1.1, FR13.1.2, FR13.1.3, FR13.1.4 |
| FR13.2 | [UC-18](UC-18.md) | FR13.2.1, FR13.2.2 |
| FR13.3 | [UC-13](UC-13.md) | None defined |
| FR14 | [UC-06](UC-06.md), [UC-20](UC-20.md) | None defined |
| FR14.1 | [UC-03](UC-03.md) | FR14.1.1, FR14.1.2 |
| FR14.2 | [UC-05](UC-05.md) | FR14.2.1, FR14.2.2, FR14.2.3, FR14.2.4, FR14.2.5 |
| FR14.3 | [UC-06](UC-06.md) | None defined |
| FR14.4 | [UC-07](UC-07.md), [UC-19](UC-19.md), [UC-20](UC-20.md) | None defined |
| FR15 | [UC-10](UC-10.md), [UC-11](UC-11.md) | None defined |
| FR15.1 | [UC-10](UC-10.md), [UC-11](UC-11.md) | None defined |
| FR15.2 | [UC-10](UC-10.md), [UC-11](UC-11.md) | None defined |

The four Submission 1 PDFs remain historical exports until the final specification and diagram are synchronised. Do not present them as regenerated from this textual revision. Historical review and consolidation notes remain in `notes/`; they are not additional deliverable PDFs.
