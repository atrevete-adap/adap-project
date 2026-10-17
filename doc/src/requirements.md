# Software Requirements
> High-level specification outlining business goals, user needs, and technical behavior for the system.

## Business Requirements
> Answering the "What for?" or "Why?" of the business (commercial, financial, or strategic goals).

- BR-01: Operational independence from the commercial product.
- BR-02: Extreme agility in frequent operations. 
- BR-03: Business scalability through management by exception.
- BR-04: Separation of commercial relationship from debt collection.
- BR-05: Commercial flexibility and annual tiered rate reviews. 
- BR-06: Financial governance, risk control and separation of duties.
- BR-07: Auditable financial visibility and target tracking. 
- BR-08: Accounting integrity, immutable traceability and external accounting firm coordination.
- BR-09: Data privacy and prohibition of marketing use.
- BR-10: Executive mobility, technological sustainability and determinism.

## User Requirements
> Answering "What does the user want to achieve?" (Customer or actor goals).

#### A. Customer, Contact, and Commercial Agreement Management
- UR-01: International commercial and tax customer registration.
- UR-02: Multiple contacts per company and channel consent management.
- UR-03: CSV customer import with validation and preview.
- UR-04: Duplicate detection, historical reactivation, and controlled merging.
- UR-05: Subscription management.
- UR-06: Temporary subscription pause and reactivation.
- UR-07: Commercial cancellation with outstanding debt retention.
- UR-08: Customer status tracking and business timeline.

#### B. Quotations, Invoicing, and Document Lifecycle
- UR-09: Quotation creation and invoice conversion.
- UR-10: One-off invoice creation, concept  catalog, and cost centers 
- UR-11: Proration preview for mid-month sign-ups.
- UR-12: Automatic drafts, validation, and anomalous amount alerts.
- UR-13: Viewing and downloading corporate PDF invoices.
- UR-14: Corrective invoice (administratives can rectify errors or process refunds).
- UR-15: Administrative migration of historical invoices.

#### C. Approvals, Annual Rate Reviews, and Accounting Closings
- UR-16: Approval workflow and inbox with separation of duties.
- UR-17: Annual revenue tier review campaign.
- UR-18: Adminoistrative period closing and controlled reopening.

#### D. Deliveries, Payment Reminders, Reconciliation, and Billing Issues
- UR-19: Delivery tracking and bounce email handling.
- UR-20: Billing issue management, comments, and attachments.
- UR-21: Manual payment reconciliation, partial settlements and reversal.
- UR-22: Controlled write-off of uncollectible debt.

#### E. Daily Operations, Search, Financial Dashboard, and Reporting
- UR-23: Daily work screen and actionable notification.
- UR-24: Immediate global search, saved views and quick access.
- UR-25: Controlled bulk actions and background processing.
- UR-26: Financial dashboard with drill-down and budget targets.
- UR-27: Report exports, scheduled summaries, and accounting packages.

#### F. Users, Global Configuration, Auditing, and Monitoring
- UR-28: Corporate authentication, account lifecycle and session control.
- UR-29: Portfolio assignment and temporary absence delegation.
- UR-30: Global system configuration and simulation testing.
- UR-31: Immutable auditing, system health monitoring privacy, and backups (Superadministrators related).


## System Requirements
> Technical translation of user and business goals into executable functional capabilities and quality constraints.

### Functional Requirements
> Answering "What the system does to fulfill user requirements?" (Inputs, outputs, calculations, and technical behavior).

#### FR1. Customer Management

- **FR1.** Customer company registration. The system will allow users to register a customer company with its trading name, legal name, tax identification number, tax address, country, working currency and contact information, without assuming a Spanish format for tax identifiers or addresses. The system will validate emails, tax identifiers (when the country's format is known) and mandatory fields, distinguishing the data required to issue an invoice from data that is only recommended. Before creating a customer, it will warn about likely duplicates (primarily by tax identifier) and will never merge companies automatically.
  - Dependencies / Relationships: FR6.1.
- **FR1.1.** Contact people. The system will allow multiple contact people per customer company, each with a role (purchasing, billing administration or collections), and a single contact to be linked to more than one company. Contacts who leave can be marked inactive while keeping the history of invoices sent to them, and the system will warn before removing the only billing contact of an active customer. For each contact it will store whether they accept WhatsApp for administrative communications and their preferred language.
  - Dependencies / Relationships: FR1.
- **FR1.2.** View and edit customer data. The system will save customer data as soon as it is created and allow it to be consulted and modified at any time.
  - Dependencies / Relationships: FR1.
- **FR1.3.** Logical deletion and reactivation. When a customer is deleted, the system will perform a logical deletion that keeps its data and history; when a former customer returns, its historical record will be reactivated instead of creating a duplicate.
  - Dependencies / Relationships: FR1.
- **FR1.4.** Customer import. The system will allow customers to be imported from a CSV file with a preview before confirming: the user maps columns, sees row errors and chooses between correcting the file or importing only the valid rows. Duplicate tax identifiers are warned about, and each import is recorded with a summary of created, updated and rejected rows and the reasons.
  - Dependencies / Relationships: FR1.
- **FR1.5.** Responsible internal user. The system will allow each customer to be assigned an internal user responsible for it.
  - Dependencies / Relationships: FR1, FR6.2.
- **FR1.6.** Customer status, tags and timeline. The system will represent the customer statuses that affect billing (at minimum: pending activation, active, paused, cancellation requested, inactive, administratively blocked), let authorised users change them after showing the consequences, and allow customers to be tagged (e.g. strategic, partner, collection risk) without tags replacing statuses derived from data. Each customer will have a business timeline with its relevant events (registration, change of responsible person, rate changes, invoices, payments, issues, pauses, cancellation and reactivation).
  - Dependencies / Relationships: FR1.5, FR9.1, FR10.

#### FR2. Invoicing

- **FR2.** Invoice creation. The system will allow users to create an invoice for a customer, choosing whether it is one-off or recurring. Each invoice is made of one or more lines with description, quantity, unit price, optional discount and a tax selected from a configurable list. Lines can reuse concepts from a lightweight catalogue whose changes do not affect existing invoices. An invoice is issued in a single currency that never changes afterwards.
  - Dependencies / Relationships: FR1, FR13.
- **FR2.1.** Automatic recurring invoices. For customers with an active subscription, the system will automatically generate an invoice on the first day of every month from the concepts configured in the subscription, without manual approval as long as it matches the approved subscription. Paused, not-yet-active and cancelled subscriptions do not generate invoices. Monthly is the only recurrence frequency, and the amount stays the same until an annual review or approved exception changes it.
  - Dependencies / Relationships: FR2, FR10, FR14.
- **FR2.2.** Prorated first invoice. When a recurring customer starts during the month, the system will invoice the remaining days of that month, and normal monthly invoicing will start on the following first day. The proration is shown before confirming and follows a single documented rule.
  - Dependencies / Relationships: FR2.1, FR10.1.
- **FR2.3.** Invoice lifecycle and editing. The system will model the invoice lifecycle (e.g. draft, pending approval, issued, sent, overdue, paid, with discrepancy, disputed, uncollectible, rectified); states derived from data, such as overdue or paid, are never set by hand. Drafts, including their amount, can be freely corrected or deleted; a manual change to the amount of a recurring invoice requires approval. Issued invoices can never be deleted or silently modified: relevant changes are traced, and changes not legally allowed go through a corrective invoice.
  - Dependencies / Relationships: FR2, FR2.8, FR9.1, FR11.
- **FR2.4.** Series and numbering. Invoices will have a series and a unique, sequential number within it, configured by the super administrator. Numbers are assigned only at issuance, never to drafts, remain unique under concurrent issuance, and are not consumed again when a failed sending is retried.
  - Dependencies / Relationships: FR2.3, FR6.2.
- **FR2.5.** Preview and issuance validation. Before issuance, the system will show a preview and block issuance if mandatory tax data is missing, stating exactly what is missing. It will also warn, without necessarily blocking, when an amount deviates strongly from the customer's usual pattern according to a simple configurable rule.
  - Dependencies / Relationships: FR1, FR2, FR13.
- **FR2.6.** Invoice PDF generation and storage. The system will generate each issued invoice as a PDF in a single standard format with Turbine's corporate identity (logo, tax data, series and number, dates, lines, taxable bases, taxes, total, payment terms and support contact details) and store it linked to its customer. The same PDF is used wherever the invoice is shown or sent, and the original is preserved so later template changes do not alter historical invoices.
  - Dependencies / Relationships: FR2, FR13.
- **FR2.7.** Invoice sending and delivery tracking. When an invoice is issued, the system will send it to the customer's billing contact by email, and by WhatsApp only when consent and a valid number exist (both providers may be simulated). Each attempt records channel, recipients, date, template and result, and the message status (queued, sent, delivered if reported, failed, retried). If a sending fails, the invoice is not marked as notified, the responsible user is notified, and the invoice can be resent after correcting the contact without creating a new invoice or number.
  - Dependencies / Relationships: FR1.1, FR2.6, FR7, FR13.1.
- **FR2.8.** Corrective invoices. Starting from an issued invoice, the system will propose the data to correct, generate the corrective document and keep it linked to the original. This requires administrative permission and, depending on the amount, approval; customer balances take these documents into account.
  - Dependencies / Relationships: FR2.3, FR2.4, FR11.

#### FR3. Payment Tracking and Reminders

- **FR3.** Payment detection. The system will check whether each invoice has been paid by querying the payment source and by receiving payment events (Stripe simulated for this project). Other sources, such as Revolut or a bank account, can be added without changing the invoice model, and a payment event received more than once is counted only once.
  - Dependencies / Relationships: FR2.
- **FR3.1.** Payment reconciliation. The system will match received transactions (amount, date, currency, description, reference) to invoices: clear matches are reconciled automatically according to policy, while doubtful or unreferenced ones stay pending manual reconciliation, and the system never silently picks one of several equal-amount invoices. Lower or higher amounts are recorded as a discrepancy, a reconciliation can be reversed with a reason, and an invoice is marked paid only from the transactions that justify it.
  - Dependencies / Relationships: FR3, FR9.1.
- **FR3.2.** Payment reminders. The system will send the customer a reminder on day 3 after issuance and another on the due date, and after the due date a reminder every 2–3 days until payment is detected or a person intervenes (timings configurable by the super administrator). The flow is per invoice, stops when that invoice is paid, never cancels or penalises the customer automatically, and every message includes Turbine's support email and telephone. Reminders falling on weekends or configured holidays move to the next working day; the legal due date does not move.
  - Dependencies / Relationships: FR2.7, FR3, FR3.3, FR13.
- **FR3.3.** Due date calculation. The system will calculate each invoice's due date with a default payment period of 5 days, changeable only by the super administrator; payment terms agreed with a customer take precedence over the default.
  - Dependencies / Relationships: FR2, FR6.2, FR10.
- **FR3.4.** Disputes and paused follow-up. The responsible user can mark an invoice as disputed or follow-up paused, with a reason and review date. Automatic reminders stop during that period, the invoice is still shown as unpaid, and the user is notified when the review date arrives.
  - Dependencies / Relationships: FR3.2, FR7.
- **FR3.5.** Uncollectible debt. Authorised users can mark a debt as uncollectible, with a reason and approval, as a state distinct from paid.
  - Dependencies / Relationships: FR2.3, FR11.

#### FR4. Cancellation

- **FR4.** Cancellation requests. The system will allow a customer's cancellation to be recorded manually or received as a request through the API, creating a task for the responsible user. External systems cannot end a recurrence directly without passing through the system's rules.
  - Dependencies / Relationships: FR1, FR15.
- **FR4.1.** Effects of cancellation. From the effective cancellation date the system will stop generating new invoices for the customer. Outstanding debt, including unpaid one-off invoices, does not block the cancellation: collection of all previous invoices continues until they are paid, and data that must be kept for accounting is never deleted automatically.
  - Dependencies / Relationships: FR2.1, FR3.2, FR4.
- **FR4.2.** Outstanding obligations query (API). The system will provide an API that, given a customer identifier, returns whether the customer has outstanding obligations and the minimum authorised detail.
  - Dependencies / Relationships: FR3, FR15.

#### FR5. Pricing

- **FR5.** Annual price review. Once a year (or when configured), the system will list the customers due for review, obtain their annual revenue from a simulated source or manual entry (with source and date), keep those without data as pending and propose the corresponding price range. The change requires human approval, has an effective date and records who approved it and the previous and new prices; the price stays fixed between reviews. Review records can be corrected with traceability, but any retroactive adjustment must be an explicit, approved action.
  - Dependencies / Relationships: FR1, FR2.1, FR5.1, FR11.
- **FR5.1.** Rate table. Revenue ranges and their prices will be stored as configuration editable by the super administrator; changes apply to new reviews only and never alter issued invoices.
  - Dependencies / Relationships: FR6.2.
- **FR5.2.** Commercial exceptions. The system will support time-limited discounts, free periods and extra services with agreed prices. Users managing a customer can request them, an administrator approves them (the super administrator above a configurable threshold), and time-limited discounts stop applying automatically when they end.
  - Dependencies / Relationships: FR10, FR11.

#### FR6. Users and Access

- **FR6.1.** Login and sessions. Internal users log in with their corporate email and password; only verified addresses from the authorised domain are accepted and there is no self-registration. Users can recover their password through links that expire, sessions expire after inactivity, users can log out, and repeated failed attempts trigger basic protection without excessive lockouts.
- **FR6.2.** Roles and permissions. The system will support three roles: super administrator, administrator and operational user (called "reader" in the first meeting, see C1). Only the super administrator can change the system configuration. Administrators manage customers, contacts, companies, invoices and invoice types, assign customers and resolve approvals within their permissions. Operational users view and modify the operational data of their assigned customers, create invoices if permitted, follow up payments and download documents, but cannot widen their own access, change global rates, create series or see the global financial dashboard. Every request, including direct URLs, downloads, exports and API calls, is checked against these permissions on the server.
  - Dependencies / Relationships: FR6.1.
- **FR6.3.** User management. The super administrator or an authorised administrator can create or invite users and assign roles. Users who leave are deactivated, never deleted, so their past actions remain attributed, and deactivation ends their active sessions.
  - Dependencies / Relationships: FR6.2.
- **FR6.4.** Customer visibility, reassignment and delegation. An administrator decides which customers each operational user can see. When a customer is reassigned, the new responsible user inherits pending tasks while history keeps who did each earlier action, and a user's customers can be delegated to another user for a date range, expiring automatically.
  - Dependencies / Relationships: FR1.5, FR6.2.

#### FR7. Internal Notifications

- **FR7.** Notification events. The system will notify the internal user responsible for a customer when an invoice is paid, of every follow-up sent for an unpaid invoice, and of overdue invoices, bounced emails, disputes opened, pending annual reviews, rejected approvals, mentions and expiring pauses.
  - Dependencies / Relationships: FR1.5, FR3.
- **FR7.1.** Inboxes and preferences. Each user has a notification inbox, and administrators also have a global inbox. Notifications have a priority and can be marked as read or as handled; reading an actionable notification does not resolve it. Each user can choose which notifications arrive in-app, by email or in a daily digest, but cannot change corporate rules.
  - Dependencies / Relationships: FR7.
- **FR7.2.** Configurable alert rules. Administrators can configure parameterised alerts from a closed set of conditions (e.g. invoice overdue more than N days, outstanding balance above X, sending failed N times).
  - Dependencies / Relationships: FR7, FR13.

#### FR8. Reports, Dashboard and Search

- **FR8.** Invoicing reports. The system will generate weekly, monthly and annual reports on invoicing and collections, filterable by period, customer, internal manager, country, sector, invoice status, type and currency. Heavy reports run in the background, and administrators can schedule weekly or monthly summaries sent only to authorised users.
  - Dependencies / Relationships: FR2, FR3, FR14.
- **FR8.1.** Financial dashboard. Visible only to administrators, it shows weekly, monthly, quarterly and yearly figures: invoiced, collected, outstanding, overdue, average collection time, evolution, customers with highest debt, expected recurring revenue, one-off billing and a simple forecast. Every figure can be drilled down to the records that make it up.
  - Dependencies / Relationships: FR8, FR6.2.
- **FR8.2.** Daily work screen. On login, each user sees invoices due soon, overdue invoices, payments to reconcile, delivery problems, pending approvals, due annual reviews and tasks assigned to them, each linking directly to the item.
  - Dependencies / Relationships: FR2, FR3, FR11.
- **FR8.3.** Search, filters and quick access. Users can search by part of trading name, legal name, tax identifier, contact name, email or invoice number, filter customers (location, business area, tags) and invoices (status, type, date), save frequent views, and quickly reach favourite and recently used customers, always limited to what they are allowed to see.
  - Dependencies / Relationships: FR1, FR2, FR6.2.
- **FR8.4.** Exports. Results can be exported at least to CSV and to a readable PDF report, respecting the user's permissions. Each export records date, filters and user, and generated exports are kept for a configurable period.
  - Dependencies / Relationships: FR8, FR6.2, FR9.1.
- **FR8.5.** Accounting firm package. The system will export a monthly or quarterly package (issued invoices, corrective invoices, collections and PDFs) in a configurable format, recording generation date, period and version.
  - Dependencies / Relationships: FR2, FR3.

#### FR9. Backups, Auditing and Monitoring

- **FR9.** Backups. The system will create automatic backups of data and documents according to a defined policy, and backups must be restorable.
  - Dependencies / Relationships: FR6.2.
- **FR9.1.** Audit trail. The system will record who created customers, changed tax data, issued invoices, changed due dates, approved discounts, reassigned customers, marked disputes, reconciled manually, changed configuration and accessed payments. No one can edit the trail; the super administrator can consult and filter it.
  - Dependencies / Relationships: FR6.2.
- **FR9.2.** Automation log and health screen. Each automated process records when it ran, items processed and created, failures and reasons. A health screen shows the last recurring generation, the pending email queue, recent integration errors and the last successful backup. Errors shown to users are understandable and include an issue code to find them in the technical log.
  - Dependencies / Relationships: FR9, FR14.

#### FR10. Subscriptions (Commercial Relationship)

- **FR10.** Subscription record. The system will store each customer's commercial relationship separately from its invoices: start date, plan, agreed rate and recurring concepts, internal manager, payment terms and associated documents (month to month, no commitment period). Activating a recurring subscription is blocked while invoicing tax data is missing, explaining what is missing.
  - Dependencies / Relationships: FR1, FR5.
- **FR10.1.** Start date and deferred billing. A subscription can start on a future date; until then the customer is pending activation and no invoices or reminders are generated. A subscription can also be explicitly marked to start billing the following month without proration.
  - Dependencies / Relationships: FR10, FR2.2.
- **FR10.2.** Pause and reactivation. A subscription can be paused with reason, start date and optional reactivation date. No monthly invoices are generated during the pause while old invoices stay in collection, and the responsible user is notified when the reactivation date arrives.
  - Dependencies / Relationships: FR10, FR7.

#### FR11. Approvals

- **FR11.** Approval workflow. Manual amount changes, extraordinary discounts, unusual due dates, one-off invoices above a threshold, corrective invoices, write-offs and price-range changes require approval before taking effect; invoices generated unchanged from an approved subscription do not. The system states why an item is pending; approvers see an approval inbox, and requesters see the status and the approver's comment.
  - Dependencies / Relationships: FR2, FR5, FR13.
- **FR11.1.** Separation of duties and substitution. Above a configurable threshold, users cannot approve their own requests. An administrator can reassign a pending approval or designate a substitute approver, and every reassignment is recorded.
  - Dependencies / Relationships: FR11, FR9.1.

#### FR12. Billing Issues, Comments and Attachments

- **FR12.** Billing issues. Users can open internal issues linked to a customer and optionally an invoice (e.g. incorrect tax ID, disputed amount, email not received, payment not located), with responsible user, status, priority, comments and attachments; the resolution is recorded on closure. An issue that affects collection can pause the related invoice's reminders.
  - Dependencies / Relationships: FR1, FR2, FR3.4.
- **FR12.1.** Internal comments. Users can comment on invoices, issues and customers and mention other users, who are notified. Comments are never sent to the customer, and restricted administrative notes are visible only to administrators.
  - Dependencies / Relationships: FR7, FR6.2.
- **FR12.2.** Attachments. Users can attach documents (orders, accepted quotations, receipts, screenshots, accounting documents) with type and description, within format and size limits. Access follows the permissions of the associated customer or invoice, and temporary download links expire.
  - Dependencies / Relationships: FR1, FR2, FR6.2.

#### FR13. Configuration and Templates

- **FR13.** Global configuration. The system will keep configuration separate from operational data: default payment period, reminder timings, allowed email domain, issuer tax data, logo and template, series, currencies, taxes, approval thresholds, notification channels, working calendar (weekends and a small holiday calendar) and automation policies. Changes are validated, audited and never retroactive on issued invoices.
  - Dependencies / Relationships: FR6.2, FR9.1.
- **FR13.1.** Communication templates. Authorised users can edit the templates for invoice emails, reminders and other customer messages using variables, in at least Spanish and English (chosen per customer or contact). The preview warns about missing variables, users can send a test to themselves and preview the reminder schedule, and each sending records the template version used.
  - Dependencies / Relationships: FR13, FR1.1.
- **FR13.2.** Period closing. An authorised administrator can mark a month or quarter as closed; financial elements in a closed period cannot be changed except through an exceptional, audited procedure, and reopening requires higher permission and a reason.
  - Dependencies / Relationships: FR2.3, FR9.1.

#### FR14. Automation, Background Tasks and Bulk Operations

- **FR14.** Background processing. Long operations run in the background with a visible status (pending, processing, completed, completed with errors). If the monthly generation did not run, missing invoices are generated on recovery without duplicates; a failure on one item does not stop the rest; and issuing, sending and reconciliation are protected against double submission.
  - Dependencies / Relationships: FR2.1, FR9.2.
- **FR14.1.** Bulk actions. Users can perform bulk actions (reassign customers, export a selection, change sector, generate reports), seeing how many items are affected, confirming sensitive actions and receiving a per-item result. There is no uncontrolled bulk "mark as paid".
  - Dependencies / Relationships: FR6.2.
- **FR14.2.** Form assistance and safe editing. Frequent forms pre-fill sensible defaults (usual country, currency, due date, rate suggested by revenue range) and show a summary before confirming; long forms save drafts automatically, reversible actions offer undo, and irreversible actions are explained first. If two users edit the same record, the system detects the conflict instead of silently overwriting changes.
  - Dependencies / Relationships: FR1, FR2, FR5.1.

#### FR15. API

- **FR15.** External API. The system will expose a documented API to query customers, debt status and invoices and to submit controlled requests (such as cancellation requests), applying the same business rules and permissions as the interface, with separate authentication, rate limits and logging of important calls.
  - Dependencies / Relationships: FR6.2.

#### Contradictions and Interpretations

- **C1. Roles of the second user type**.
  - *Statements:* First meeting: "reader" who only sees, then "cannot create or edit", then CRUD on assigned items, plus a super administrator. Extended meeting: the client asks not to cling to the name; what matters is the capability.
  - *Interpretation:* Three roles. The second user type is renamed **operational user** (FR6.2).
- **C2. Editing issued invoices** *(resolved)*.
  - *Statements:* First meeting: invoices editable "whenever he wants", but not after the quarter changes. Extended meeting: editable before issuance; after issuance changes must be traced or done via corrective invoice; periods can be closed.
  - *Interpretation:* FR2.3 (lifecycle and editing), FR2.8 (corrective invoices) and FR13.2 (period closing). The "quarter" idea becomes administrative period closing.
- **C3. Creating customers.**
  - *Statements:* Employees create customers, but "No" was recorded for "possibility of creating a customer".
  - *Interpretation:* The "No" referred to customer self-registration, confirmed by the extended meeting (no self-registration, internal users create records). Customer creation is kept (FR1, FR6.2).
- **C4. Cancellation with unpaid invoices** *(resolved, team decision)*.
  - *Statements:* First meeting: "you cannot cancel because this invoice is unpaid", "we will cancel you when you meet the next invoice you have to pay", and an open one-off invoice must be paid before leaving; but also "if you notify your cancellation, no more invoices are issued to you". Extended meeting: debt must not block cancellation forever; recurrence stops and collection continues.
  - *Interpretation:* The cancellation always proceeds: new recurring invoices stop from the effective date, and collection of all previous invoices, one-off invoices included, continues until they are paid (FR4, FR4.1). Source (extended meeting): "I do not want a debt to block the commercial cancellation forever, but at the same time I do not want the outstanding payment to disappear when the customer is cancelled." *Team decision, to be validated at the next client review.*
- **C5. Partial payments** *(resolved by client)*.
  - *Statements:* "No installment payments" vs. "partially reconciled" state.
  - *Interpretation:* Installments are not a commercial option, but partial or excess payments can happen and are handled as discrepancies (FR3.1).
- **C6. Editable amount vs. fixed yearly price**.
  - *Statements:* First meeting: the amount "must be modifiable all the time and editable when you create the invoice", but also the recurring price "is the same throughout the year". Extended meeting: recurring invoices are automatic, and manual amount changes need approval.
  - *Interpretation:* The amount is editable on drafts (mainly one-off invoices). Recurring prices change only through the annual review or approved commercial exceptions; manual changes to a recurring invoice go through approval (FR2.3, FR5, FR5.2, FR11).
- **C7. Default payment period vs. agreed terms** *(resolved)*.
  - *Interpretation:* Customer-agreed terms override the 5-day default (FR3.3).
- **C8. Backups vs. activity log** *(resolved)*.
  - *Statements:* The first version mixed backups with "all application activity".
  - *Interpretation:* The client distinguished auditing (what happened) from backups (recovery): split into FR9 and FR9.1.
- **C9. Working calendar scope** *(resolved, team decision)*.
  - *Statements:* Communications falling on weekends/holidays "may" be moved to the next working day.
  - *Interpretation:* Only communications (reminders and notices) move to the next working day; the legal due date does not move. The rule is configurable by the super administrator, with weekends and a small holiday calendar for Spain (FR3.2, FR13). Source (extended meeting): "we may want to move the communication to the next working day [...] The important thing is that the rule is defined and consistent." *Team decision, to be validated at the next client review.*
- **C10. Anomaly warning vs. high-amount approval**.
  - *Statements:* Unusual amounts should warn but not always block; high one-off invoices may require approval.
  - *Interpretation:* Two separate configurable rules: a non-blocking deviation warning (FR2.5) and an approval threshold (FR11).
- **C11. Using retained data for marketing** *(resolved by the later statement)*.
  - *Statements:* First meeting: logical deletion keeps customer data "so that you can, in the future, have a marketing campaign" (the client agreed). Extended meeting: billing data must not be used automatically for commercial campaigns; that is a different purpose.
  - *Interpretation:* Retained data is kept for legal and historical reasons only (FR1.3) and is never used for marketing in this system (see Out of Scope). Source (extended meeting): "This application must not automatically use billing data for commercial campaigns. That would be another purpose and would have to be handled separately." *Team decision, to be validated at the next client review.*
- **C12. Login identifier** *(resolved)*.
  - *Statements:* "Username and password" vs. "email and password" with a verified Turbine email.
  - *Interpretation:* The username is the corporate email (FR6.1).

#### Out of Scope (stated by the client)

- Verifactu integration and worldwide tax rules (handled by the accounting firm).
- Installment payments as a commercial option.
- Mandatory two-factor authentication (design must allow it later).
- Customer self-registration and a user account for the accounting firm.
- Sales/CRM features (prospects only if they affect billing).
- Electronic signature of quotations.
- Full multi-company support in the first deployment (only issuer data as configuration).
- Real Stripe, email or WhatsApp providers (simulated).
- Acting as a payment gateway or generating payment links; the system only checks payments.
- Payment receipts sent to the customer when an invoice is paid (only the internal notification is required).
- Simplified invoices: one-off and recurring invoices share the same standard format.
- Any customer-facing access: no customer portal and no in-app chat (customers contact support externally).
- Integration with Brain or the CRM (CSV import replaces it; the API leaves the door open).
- Recurrence frequencies other than monthly (the model should not prevent them).
- Merging duplicate customer records: the client called it "delicate"; duplicates are only warned about (FR1).
- Historical invoice import: the client does "not need it as an original basic requirement"; useful only for a future migration.
- Quotations and their conversion into invoices: described by the client as "an interesting extension".
- Cost centres or projects for one-off invoices: mentioned by the client as something that "could also appear".
- Billing and collection targets on the dashboard: a client wish for a later stage, beyond the dashboard in FR8.1.
- Converting amounts to a base currency for reporting: the client said "That is an extension".
- Multiple issuing entities with their own series: only one issuer is configured (FR13).
- Personal data lookup and anonymisation on request: the client said they "will have to study how to anonymize it"; to be defined with a legal retention policy.
- Marketing use of billing and contact data: prohibited by the client (C11); billing data is used only for administrative communications.
- Demo or synthetic data: a guideline for the team when preparing demos, not a system function.
- AI-assisted features: the client said "Artificial intelligence is not necessary; a simple configurable rule" is enough.

### Non-Functional Requirements
> Answering "How well?" or "Under what quality standards/restrictions does the system operate?" (Performance, security, usability).

- NFR-01: Usability and Operational Efficiency
  - Description: The system shall provide an intuitive interfact that allows users to complete common administrative tasks quickly and with minimal effort.
  - Dependencies / Relationships: Related to customer registration, customer management, invoice creation, and invoice search functionalities. Related functional requirements: FR1, FR1.4, FR2, FR2.5, FR8.2, FR8.3, FR14.2.
  - Metric / Acceptance criterion: At least 4 out of 5 test users shall be able to complete a predefined standard customer registration or invoice issuance task in less than 60 seconds, using no more than 5 navigation clicks.
  - Verification method: Timed User Acceptance Test with 5 representative users performing predefined administrative tasks. Task completion time and navigation clicks will be recorded.
 
- NFR-02: Multi-Device Compatibility and Accessibility
  - Description: The application shall provide a responsive and accessible interface for desktop computers, tablets, and smartphones.
  - Dependencies / Relationships: Related to customer management, invoice consultation, payment monitoring, and dashboard functionalities. Related functional requirements: FR1.2, FR2.6, FR3, FR8.1, FR8.2.
  - Metric / Acceptance criterion: The main administrative workflows shall remain usable without unintended horizontal scrolling at screen resolutions of 360x800, 768x1024, and 1920x1080 pixels. The main application views shall achieve an accessibility score of at least 90/100 in Google Lighthouse and meet WCAG 2.1 Level AA.
  - Verification method: Responsive design testing using Chrome DevTools at the specified screen resolutions. Accessibility testing using Google Lighthouse, complemented by manual WCAG 2.1 AA checks.

- NFR-03: Performance and Scalability
  - Description: The system shall maintain fast response times while supporting an increasing number of customers, invoices, and concurrent users.
  - Dependencies / Relationships: Related to customer and invoice queries, search operations, reporting, and invoice generation. Related functional requirements: FR2.1, FR8, FR8.3, FR14.
  - Metric / Acceptance criterion: The system shall support at least 5,000 active customers and 50 concurrent users. The 95th percentile response time (P95) for standard customer and invoice queries shall remain below 2 seconds, with no failed requests during the defined load test.
  - Verification method: Automated load testing using Apache JMeter with a database containing at least 5,000 customers and representative invoice records.

- NFR-04: Authentication Security and Data Protection
  - Description: The system shall protect sensitive customer, financial, and tax information through secure authentication, authorization, and encrypted communications.
  - Dependencies / Relationships: Related to user authentication, role-based access control, customer data management, invoice management, and financial information access. Related functional requirements: FR6.1, FR6.2, FR12.2, FR15.
  - Metric / Acceptance criterion: 100% of login attempts using unauthorized email domains shall be rejected. Passwords shall be securely hashed using bcrypt with a cost factor of at least 12 or an equivalently secure mechanism. Sensitive data shall be transmitted using HTTPS with TLS 1.3. No High or Critical security vulnerabilities shall remain in the final security test report.
  - Verification method: Automated authentication and authorization tests, including attempts using unauthorized domains. Security scanning using OWASP ZAP, inspection of password storage, and verification of TLS configuration.

- NFR-05: Data Retention, Auditability and Backup
  - Description: The system shall preserve historical financial information, record important administrative actions, and provide mechanisms for recovering data after a failure.
  - Dependencies / Relationships: Related to customer deactivation, invoice history, financial record management, and administrative operations requiring audit logs. Related functional requirements: FR1.1, FR1.3, FR2.3, FR2.6, FR4.1, FR9, FR9.1.
  - Metric / Acceptance criterion: 100% of issued invoices shall remain accessible to authorized users after customer deactivation, subject to the approved data retention policy. 100% of critical financial and administrative changes shall generate an audit record containing the responsible user, action, and timestamp. Automatic backups shall be performed at least once every 24 hours. Data recovery from a valid backup shall be possible within 4 hours.
  - Verification method: Database inspection and tests involving customer deactivation and historical invoices. Audit log inspection after critical operations. Backup restoration tests and role-based access control tests.

- NFR-06: Data Integrity and Automation Reliability
  - Description: The system shall ensure that automated invoicing and payment operations execute reliably without creating duplicate or inconsistent records.
  - Dependencies / Relationships: Related to recurring invoice generation, payment processing, payment reconciliation, and automated reminder functionalities. Related functional requirements: FR2.1, FR2.4, FR3, FR3.1, FR9.2, FR14.
  - Metric / Acceptance criterion: Repeated processing of the same payment event shall not create duplicate payments. Retrying an automated recurring invoice generation shall not create duplicate invoices for the same billing period. 100% of simulated automation failures shall be recorded with an identifiable error status, without preventing independent operations from continuing.
  - Verification method: Integration tests simulating duplicate payment notifications, repeated invoice generation, and failures during automated processes. Verification of database consistency and automation execution logs.
