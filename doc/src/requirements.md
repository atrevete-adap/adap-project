# Software Requirements
> High-level specification outlining business goals, user needs, and technical behavior for the system.

## Business Requirements
> Answering the "What for?" or "Why?" of the business (commercial, financial, or strategic goals).

- BR-01: Operational independence from the commercial product.
  - Provide Turbine with an internal administrative tool completely separate from its commercial product (Brain), ensuring that product and           administration are not mixed and that the administrative application continues to function even if Brain changes or disappears.
- BR-02: Separation of commercial relationship from debt collection.
  - Formally represent the commercial agreement or subscription on a month-to-month basis without inventing non-existent commitment periods. When a customer requests cancellation, the generation of new recurring invoices must stop on the effective date without blocking commercial termination, while keeping the collection workflow active for any prior outstanding debt.
- BR-03: Commercial flexibility and annual tiered rate reviews.
  - Support the company's hybrid revenue model consisting of monthly subscriptions (based on configurable tiers tied to customer annual revenue) and one-off services. Drive annual revenue review campaigns with human validation to update future rates without modifying historical invoices.
- BR-04: Financial governance, risk control and separation of duties.
  - Protect revenue through hierarchical approval workflows and separation of duties before applying extraordinary discounts, manual modifications to amounts or due dates, high-amount one-off invoices, corrective invoices, or uncollectible debt write-offs.
- BR-05: Auditable financial visibility.
  - Provide management with a financial dashboard showing weekly, monthly, quarterly, and annual metrics, recurring revenue forecasts, and progress against configured targets or budgets, requiring every metric to be 100% explainable and reconcilable with the underlying invoices.
- BR-06: Ensure accounting legality and seamless cordination with the external accounting firm.
  - The business operates in Spain, needing that the billing of the enterprise comply with the fiscal periods of the Spanish tax agency and the requirements of the external countability advisors, avoiding mismatches or improper alterations of revenue.

## User Requirements
> Answering "What does the user want to achieve?" (Customer or actor goals).

#### A. Customer Relationship and Subscription Management
- UR-01: Registration, import and maintenance of clients and contacts
- UR-02: Subscription lifecycle management. 

#### B. Invoicing, Communications, and Collections
- UR-03: One-off, recurring, and corrective invoicing.
- UR-04: Multi-channel delivery and bounce handling.
- UR-05: Automated payment follow-up and billing issue management.
- UR-06: Payment reconciliation and uncollectible debt write-off.

#### C. Financial Governance, Rate Reviews, and Accounting
- UR-07: Hierarchical approvals with separation of duties.
- UR-08: Annual revenue tier review campaigns.
- UR-09: Period closing and external accounting packages.

#### D. Daily Operations, Analytics, and System Administration
- UR-10: Daily operational workspace, global search, and bulk actions.
- UR-11: Financial dashboard and customizable reporting.
- UR-12: User access control, portfolio assignment, and delegation.
- UR-13: Global business configuration and template simulation.
- UR-14: Immutable auditing, automation health monitoring, and backups.

## System Requirements
> Technical translation of user and business goals into executable functional capabilities and quality constraints.

### Functional Requirements
> Answering "What the system does to fulfill user requirements?" (Inputs, outputs, calculations, and technical behavior).
>
> Sub-requirements (FRx.y.z) detail a function of their parent requirement and share its dependencies.

#### 1. Customer Management

- **FR1.** Customer company registration. The system will allow users to register a customer company with its trading name, legal name, tax identification number, tax address, country, working currency and contact information, without assuming a Spanish format for tax identifiers or addresses.
  - Dependencies / Relationships: FR6.1.
- **FR1.1.** Contact people. The system will manage the contact people of each customer company.
  - Dependencies / Relationships: FR1.
  - **FR1.1.1.** A company can have multiple contacts, each with a role (purchasing, billing administration or collections).
  - **FR1.1.2.** A single contact can be linked to more than one company.
  - **FR1.1.3.** A contact who leaves can be marked inactive, keeping the history of the invoices sent to them.
  - **FR1.1.4.** The system will warn before removing or deactivating the only billing contact of an active customer.
  - **FR1.1.5.** For each contact, the system will store whether they accept WhatsApp for administrative communications and their preferred language.
- **FR1.2.** View and edit customer data. The system will save customer data as soon as it is created and allow it to be consulted and modified at any time.
  - Dependencies / Relationships: FR1.
- **FR1.3.** Logical deletion and reactivation. The system will never physically delete a customer.
  - Dependencies / Relationships: FR1.
  - **FR1.3.1.** Deleting a customer is a logical deletion that keeps its data and history.
  - **FR1.3.2.** When a former customer returns, its historical record is reactivated instead of creating a duplicate.
- **FR1.4.** Customer import. The system will allow customers to be imported from a CSV file.
  - Dependencies / Relationships: FR1.
  - **FR1.4.1.** Before confirming, the system shows a preview where the user maps columns and sees the errors of each row.
  - **FR1.4.2.** The user chooses between correcting the file or importing only the valid rows.
  - **FR1.4.3.** Duplicate tax identifiers are warned about.
  - **FR1.4.4.** Each import is recorded with a summary of created, updated and rejected rows and the reasons.
- **FR1.5.** Responsible internal user. The system will allow each customer to be assigned an internal user responsible for it.
  - Dependencies / Relationships: FR1, FR6.2.
- **FR1.6.** Customer status, tags and timeline. The system will show the commercial situation of each customer.
  - Dependencies / Relationships: FR1.5, FR9.1, FR10.
  - **FR1.6.1.** The system represents the customer statuses that affect billing (at minimum: pending activation, active, paused, cancellation requested, inactive, administratively blocked), and authorised users can change them after the consequences are shown.
  - **FR1.6.2.** Users can tag customers (e.g. strategic, partner, collection risk).
  - **FR1.6.3.** Each customer has a business timeline with its relevant events: registration, change of responsible person, rate changes, invoices, payments, issues, pauses, cancellation and reactivation.
- **FR1.7.** Registration validation. The system will validate emails, tax identifiers (when the country's format is known) and mandatory fields, distinguishing the data required to issue an invoice from data that is only recommended.
  - Dependencies / Relationships: FR1.
- **FR1.8.** Duplicate warning. Before creating a customer, the system will warn about likely duplicates (primarily by tax identifier) and will never merge companies automatically.
  - Dependencies / Relationships: FR1.

#### 2. Invoicing

- **FR2.** Invoice creation. The system will allow users to create an invoice for a customer, choosing whether it is one-off or recurring.
  - Dependencies / Relationships: FR1, FR13.
- **FR2.1.** Automatic recurring invoices. On the first day of every month, the system will automatically generate an invoice for each active subscription from the concepts configured in it. Paused, not-yet-active and cancelled subscriptions do not generate invoices.
  - Dependencies / Relationships: FR2, FR10, FR14.
- **FR2.2.** Prorated first invoice. When a recurring customer starts during the month, the system will invoice the remaining days of that month, and normal monthly invoicing will start on the following first day. The proration is shown before the registration is confirmed.
  - Dependencies / Relationships: FR2.1, FR10.1.
- **FR2.3.** Invoice lifecycle and editing. The system will model the invoice lifecycle (e.g. draft, pending approval, issued, sent, overdue, paid, with discrepancy, disputed, uncollectible, rectified).
  - Dependencies / Relationships: FR2, FR2.8, FR9.1, FR11.
  - **FR2.3.1.** The system sets the overdue and paid states automatically from due dates and payments.
  - **FR2.3.2.** Drafts, including their amount, can be freely corrected or deleted.
  - **FR2.3.3.** A manual change to the amount of a recurring invoice requires approval.
  - **FR2.3.4.** Issued invoices can never be deleted or silently modified: relevant changes are traced, and changes that are not legally allowed go through a corrective invoice.
- **FR2.4.** Series and numbering. Invoices will have a series and a unique, sequential number within it, configured by the super administrator.
  - Dependencies / Relationships: FR2.3, FR6.2.
  - **FR2.4.1.** Numbers are assigned only at issuance, never to drafts.
  - **FR2.4.2.** Retrying a failed sending does not consume a new number.
- **FR2.5.** Preview and issuance validation. Before issuance, the system will show a preview of the invoice.
  - Dependencies / Relationships: FR1, FR2, FR13.
  - **FR2.5.1.** Issuance is blocked if mandatory tax data is missing, stating exactly what is missing.
  - **FR2.5.2.** The system warns, without blocking, when an amount differs by more than 50% (configurable) from the average of the customer's last 6 invoices of the same type.
- **FR2.6.** Invoice PDF generation and storage. The system will generate each issued invoice as a PDF in a single standard format with Turbine's corporate identity (logo, tax data, series and number, dates, lines, taxable bases, taxes, total, payment terms and support contact details) and store it linked to its customer. The original PDF is preserved, so later template changes do not alter historical invoices.
  - Dependencies / Relationships: FR2, FR13.
- **FR2.7.** Invoice sending and delivery tracking. When an invoice is issued, the system will send it to the customer's billing contact.
  - Dependencies / Relationships: FR1.1, FR2.6, FR7, FR13.1.
  - **FR2.7.1.** Invoices are sent by email, and by WhatsApp only when the contact has consented and has a valid number (both providers may be simulated).
  - **FR2.7.2.** Each sending attempt records channel, recipients, date, template and result.
  - **FR2.7.3.** Each message has a visible status: queued, sent, delivered (if the provider reports it), failed or retried.
  - **FR2.7.4.** If a sending fails, the invoice is not marked as notified and the responsible user is notified.
  - **FR2.7.5.** After correcting the contact, the invoice can be resent without creating a new invoice or number.
- **FR2.8.** Corrective invoices. Starting from an issued invoice, the system will propose the data to correct, generate the corrective document and keep it linked to the original.
  - Dependencies / Relationships: FR2.3, FR2.4, FR11.
  - **FR2.8.1.** Creating a corrective invoice requires administrative permission and, depending on the amount, approval.
  - **FR2.8.2.** Customer balances take corrective documents into account.
- **FR2.9.** Invoice lines. Each invoice is made of one or more lines with description, quantity, unit price, optional discount and a tax selected from a configurable list.
  - Dependencies / Relationships: FR2, FR13.
- **FR2.10.** Concept catalogue. Invoice lines can reuse concepts from a catalogue where each concept has a name, default price and default tax; changes to the catalogue do not affect existing invoices.
  - Dependencies / Relationships: FR2.9.
- **FR2.11.** Invoice currency. An invoice is issued in a single currency that never changes afterwards.
  - Dependencies / Relationships: FR2.

#### 3. Payment Tracking and Reminders

- **FR3.** Payment detection. The system will check whether each invoice has been paid by querying the payment source and by receiving payment events (Stripe simulated for this project).
  - Dependencies / Relationships: FR2.
- **FR3.1.** Payment reconciliation. The system will match received transactions (amount, date, currency, description, reference) to invoices.
  - Dependencies / Relationships: FR3, FR9.1.
  - **FR3.1.1.** A transaction is reconciled automatically only when its reference matches exactly one open invoice with the same amount and currency; all other transactions stay pending manual reconciliation.
  - **FR3.1.2.** The system never silently picks one of several invoices with the same amount.
  - **FR3.1.3.** A received amount lower or higher than the invoice total is recorded as a discrepancy.
  - **FR3.1.4.** A reconciliation can be reversed with a reason.
  - **FR3.1.5.** An invoice is marked paid only from the transactions that justify it, which the system shows.
- **FR3.2.** Payment reminders. The system will send automatic payment reminders to the customer for each unpaid invoice.
  - Dependencies / Relationships: FR2.7, FR3, FR3.3, FR13.
  - **FR3.2.1.** A reminder is sent on day 3 after issuance and another on the due date.
  - **FR3.2.2.** After the due date, a reminder is sent every 2–3 days until payment is detected or a person intervenes.
  - **FR3.2.3.** The reminders of an invoice stop when that invoice is paid.
  - **FR3.2.4.** Every reminder includes Turbine's support email and telephone number.
  - **FR3.2.5.** A reminder falling on a weekend or configured holiday is moved to the next working day; the legal due date of the invoice does not move.
- **FR3.3.** Due date calculation. The system will calculate each invoice's due date with a default payment period of 5 days. Payment terms agreed with a customer take precedence over the default.
  - Dependencies / Relationships: FR2, FR6.2, FR10.
- **FR3.4.** Disputes and paused follow-up. The responsible user can pause the collection follow-up of an invoice.
  - Dependencies / Relationships: FR3.2, FR7.
  - **FR3.4.1.** An invoice can be marked as disputed or follow-up paused, with a reason and a review date.
  - **FR3.4.2.** Automatic reminders stop during that period, and the invoice is still shown as unpaid.
  - **FR3.4.3.** The responsible user is notified when the review date arrives.
- **FR3.5.** Uncollectible debt. Authorised users can mark a debt as uncollectible, with a reason and approval, as a state distinct from paid.
  - Dependencies / Relationships: FR2.3, FR11.

#### 4. Cancellation

- **FR4.** Cancellation requests. The system will allow a customer's cancellation to be recorded manually or received as a request through the API.
  - Dependencies / Relationships: FR1, FR15.
- **FR4.1.** Effects of cancellation. The system will apply a cancellation from its effective date.
  - Dependencies / Relationships: FR2.1, FR3.2, FR4.
  - **FR4.1.1.** From the effective date, no new invoices are generated for the customer.
  - **FR4.1.2.** Outstanding debt, including unpaid one-off invoices, does not block the cancellation; collection of all previous invoices continues until they are paid (see C4).
- **FR4.2.** Outstanding obligations query (API). The system will provide an API that, given a customer identifier, returns whether the customer has outstanding obligations and the minimum authorised detail.
  - Dependencies / Relationships: FR3, FR15.
- **FR4.3.** Cancellation task. A cancellation request creates a task for the customer's responsible user.
  - Dependencies / Relationships: FR4, FR7.

#### 5. Pricing

- **FR5.** Annual price review. Once a year (or when configured), the system will review the price range of each recurring customer according to its annual revenue.
  - Dependencies / Relationships: FR1, FR2.1, FR5.1, FR11.
- **FR5.1.** Rate table. Revenue ranges and their prices will be stored as configuration editable by the super administrator. Changes to the rate table apply to new reviews only and never alter issued invoices.
  - Dependencies / Relationships: FR6.2.
- **FR5.2.** Commercial exceptions. The system will support time-limited discounts, free periods and extra services with agreed prices.
  - Dependencies / Relationships: FR10, FR11.
  - **FR5.2.1.** Users managing a customer can request an exception; an administrator approves it, and the super administrator above a configurable threshold.
  - **FR5.2.2.** Time-limited discounts stop applying automatically when they end.
- **FR5.3.** Review preparation. The system will list the customers due for review and obtain their annual revenue from a simulated source or by manual entry, recording the source and date; customers without data stay pending.
  - Dependencies / Relationships: FR5.
- **FR5.4.** Review approval. The system will propose the corresponding price range; the change requires human approval, has an effective date, and records who approved it and the previous and new prices.
  - Dependencies / Relationships: FR5, FR11.
- **FR5.5.** Review corrections. A review record can be corrected with traceability, but any retroactive adjustment must be an explicit, approved action.
  - Dependencies / Relationships: FR5.4.

#### 6. Users and Access

- **FR6.1.** Login and sessions. Internal users log in with their corporate email and password.
  - **FR6.1.1.** Only verified addresses from the authorised domain are accepted, and there is no self-registration.
  - **FR6.1.2.** Users can recover their password through links that expire.
  - **FR6.1.3.** Sessions expire after inactivity, and users can log out.
  - **FR6.1.4.** After 5 consecutive failed login attempts, the account is locked for 15 minutes (both values configurable).
- **FR6.2.** Roles and permissions. The system will support three roles: super administrator, administrator and operational user.
  - Dependencies / Relationships: FR6.1.
  - **FR6.2.1.** Only the super administrator can change the system configuration.
  - **FR6.2.2.** Administrators manage customers, contacts, companies, invoices and invoice types, assign customers and resolve approvals within their permissions.
  - **FR6.2.3.** Operational users view and modify the operational data of their assigned customers, create invoices if permitted, follow up payments and download documents.
  - **FR6.2.4.** Operational users cannot widen their own access, change global rates, create series or see the global financial dashboard.
  - **FR6.2.5.** Every request, including direct URLs, downloads, exports and API calls, is checked against these permissions on the server.
- **FR6.3.** User management. The super administrator or an authorised administrator can create or invite users and assign roles.
  - Dependencies / Relationships: FR6.2.
  - **FR6.3.1.** Users who leave are deactivated, never deleted, so their past actions remain attributed.
  - **FR6.3.2.** Deactivating a user ends their active sessions.
- **FR6.4.** Customer visibility, reassignment and delegation. An administrator decides which customers each operational user can see.
  - Dependencies / Relationships: FR1.5, FR6.2.
  - **FR6.4.1.** When a customer is reassigned, the new responsible user inherits pending tasks, while history keeps who performed each earlier action.
  - **FR6.4.2.** A user's customers can be delegated to another user for a date range; the delegation expires automatically.

#### 7. Internal Notifications

- **FR7.** Notification events. The system will notify the internal user responsible for a customer when an invoice is paid, of every follow-up sent for an unpaid invoice, and of overdue invoices, bounced emails, disputes opened, pending annual reviews, rejected approvals, mentions and expiring pauses.
  - Dependencies / Relationships: FR1.5, FR3.
- **FR7.1.** Inboxes and preferences. Each user has a notification inbox, and administrators also have a global inbox.
  - Dependencies / Relationships: FR7.
  - **FR7.1.1.** Notifications have a priority and can be marked as read or as handled; reading an actionable notification does not resolve it.
  - **FR7.1.2.** Each user can choose which notifications arrive in-app, by email or in a daily digest.
- **FR7.2.** Configurable alert rules. Administrators can configure parameterised alerts from a closed set of conditions (e.g. invoice overdue more than N days, outstanding balance above X, sending failed N times).
  - Dependencies / Relationships: FR7, FR13.

#### 8. Reports, Dashboard and Search

- **FR8.** Invoicing reports. The system will generate weekly, monthly and annual reports on invoicing and collections.
  - Dependencies / Relationships: FR2, FR3, FR14.
- **FR8.1.** Financial dashboard. Visible only to administrators, it shows weekly, monthly, quarterly and yearly figures: invoiced, collected, outstanding, overdue, average collection time, evolution, customers with highest debt, expected recurring revenue, one-off billing and a forecast of next month's recurring revenue calculated from active subscriptions. Every figure can be drilled down to the records that make it up.
  - Dependencies / Relationships: FR8, FR6.2.
- **FR8.2.** Daily work screen. On login, each user sees invoices due soon, overdue invoices, payments to reconcile, delivery problems, pending approvals, due annual reviews and tasks assigned to them, each linking directly to the item.
  - Dependencies / Relationships: FR2, FR3, FR11.
- **FR8.3.** Search, filters and quick access. The system will let users find customers and invoices, always limited to what they are allowed to see.
  - Dependencies / Relationships: FR1, FR2, FR6.2.
  - **FR8.3.1.** Users can search by part of trading name, legal name, tax identifier, contact name, email or invoice number.
  - **FR8.3.2.** Users can filter customers (location, business area, tags) and invoices (status, type, date).
  - **FR8.3.3.** Users can save a combination of search and filters as a named view.
  - **FR8.3.4.** Users can mark customers as favourites and see their 10 most recently opened customers.
- **FR8.4.** Exports. Results can be exported at least to CSV and to a readable PDF report.
  - Dependencies / Relationships: FR8, FR6.2, FR9.1.
  - **FR8.4.1.** Exports respect the user's permissions.
  - **FR8.4.2.** Each export records date, filters and user.
  - **FR8.4.3.** Generated exports are kept for a configurable period.
- **FR8.5.** Accounting firm package. The system will export a monthly or quarterly package (issued invoices, corrective invoices, collections and PDFs) in a configurable format, recording generation date, period and version.
  - Dependencies / Relationships: FR2, FR3.
- **FR8.6.** Report filters. Reports can be filtered by period, customer, internal manager, country, sector, invoice status, type and currency.
  - Dependencies / Relationships: FR8.
- **FR8.7.** Background reports. Reports covering more than 1,000 invoices (configurable) run in the background, and the user is notified when they are ready.
  - Dependencies / Relationships: FR8, FR14.
- **FR8.8.** Scheduled summaries. Administrators can schedule weekly or monthly summaries, sent only to authorised users.
  - Dependencies / Relationships: FR8, FR6.2.

#### 9. Backups, Auditing and Monitoring

- **FR9.** Backups. The system will create automatic backups of data and documents according to a defined policy, and backups must be restorable.
  - Dependencies / Relationships: FR6.2.
- **FR9.1.** Audit trail. The system will record who created customers, changed tax data, issued invoices, changed due dates, approved discounts, reassigned customers, marked disputes, reconciled manually, changed configuration and accessed payments.
  - Dependencies / Relationships: FR6.2.
  - **FR9.1.1.** No one can edit the audit trail.
  - **FR9.1.2.** The super administrator can consult and filter it.
- **FR9.2.** Automation log and health screen. The system will monitor its automated processes.
  - Dependencies / Relationships: FR9, FR14.
  - **FR9.2.1.** Each automated process records when it ran, the items processed and created, and any failures with their reasons.
  - **FR9.2.2.** A health screen shows the last recurring generation, the pending email queue, recent integration errors and the last successful backup.

#### 10. Subscriptions (Commercial Relationship)

- **FR10.** Subscription record. The system will store each customer's commercial relationship separately from its invoices: start date, plan, agreed rate and recurring concepts, internal manager, payment terms and associated documents .
  - Dependencies / Relationships: FR1, FR5.
- **FR10.1.** Start date and deferred billing. The system will allow a subscription's billing start to be planned.
  - Dependencies / Relationships: FR10, FR2.2.
  - **FR10.1.1.** A subscription can start on a future date; until then the customer is pending activation and no invoices or reminders are generated.
  - **FR10.1.2.** A subscription can be explicitly marked to start billing the following month without proration.
- **FR10.2.** Pause and reactivation. A subscription can be paused and reactivated.
  - Dependencies / Relationships: FR10, FR7.
  - **FR10.2.1.** A pause records a reason, a start date and an optional reactivation date.
  - **FR10.2.2.** No monthly invoices are generated during the pause, while old invoices stay in collection.
  - **FR10.2.3.** The responsible user is notified when the reactivation date arrives.
- **FR10.3.** Activation validation. Activating a recurring subscription is blocked while invoicing tax data is missing, explaining what is missing.
  - Dependencies / Relationships: FR10, FR1.7.

#### 11. Approvals

- **FR11.** Approval workflow. Manual amount changes, extraordinary discounts, unusual due dates, one-off invoices above a threshold, corrective invoices, write-offs and price-range changes require approval before taking effect.
  - Dependencies / Relationships: FR2, FR5, FR13.
- **FR11.1.** Separation of duties and substitution. The system will control who can decide each approval.
  - Dependencies / Relationships: FR11, FR9.1.
  - **FR11.1.1.** Above a configurable threshold, users cannot approve their own requests.
  - **FR11.1.2.** An administrator can reassign a pending approval or designate a substitute approver, and every reassignment is recorded.
- **FR11.2.** Approval exemption. Invoices generated unchanged from an approved subscription do not require approval.
  - Dependencies / Relationships: FR11, FR2.1.
- **FR11.3.** Approval inbox. The system states why an item is pending; approvers see an approval inbox, and requesters see the status and the approver's comment.
  - Dependencies / Relationships: FR11.

#### 12. Billing Issues, Comments and Attachments

- **FR12.** Billing issues. Users can open internal issues linked to a customer and optionally an invoice (e.g. incorrect tax ID, disputed amount, email not received, payment not located), with responsible user, status, priority, comments and attachments; the resolution is recorded on closure.
  - Dependencies / Relationships: FR1, FR2.
- **FR12.1.** Internal comments. Users can comment on invoices, issues and customers.
  - Dependencies / Relationships: FR7, FR6.2.
  - **FR12.1.1.** Users can mention other users, who are notified.
  - **FR12.1.2.** Comments are never sent to the customer.
  - **FR12.1.3.** Restricted administrative notes are visible only to administrators.
- **FR12.2.** Attachments. Users can attach documents (orders, accepted quotations, receipts, screenshots, accounting documents) to customers and invoices.
  - Dependencies / Relationships: FR1, FR2, FR6.2.
  - **FR12.2.1.** Each attachment has a type and description and must respect format and size limits.
  - **FR12.2.2.** Access follows the permissions of the associated customer or invoice, and temporary download links expire.
- **FR12.3.** Issues pausing reminders. An issue that affects collection can pause the reminders of the related invoice.
  - Dependencies / Relationships: FR12, FR3.4.

#### 13. Configuration and Templates

- **FR13.** Global configuration. The super administrator can configure the default payment period, reminder timings, allowed email domain, issuer tax data, logo and template, series, currencies, taxes, approval thresholds, notification channels, working calendar (weekends and a small holiday calendar) and automation policies.
  - Dependencies / Relationships: FR6.2, FR9.1.
- **FR13.1.** Communication templates. Authorised users can edit the templates for invoice emails, reminders and other customer messages.
  - Dependencies / Relationships: FR13, FR1.1.
  - **FR13.1.1.** Templates use variables (company, invoice number, amount, due date, responsible person, support details).
  - **FR13.1.2.** Templates exist in at least Spanish and English, chosen per customer or contact.
  - **FR13.1.3.** The preview warns about missing variables; users can send a test to themselves and preview the reminder schedule.
  - **FR13.1.4.** Each sending records the template version used.
- **FR13.2.** Period closing. An authorised administrator can mark a month or quarter as closed.
  - Dependencies / Relationships: FR2.3, FR9.1.
  - **FR13.2.1.** Financial elements in a closed period cannot be changed except through an exceptional, audited procedure.
  - **FR13.2.2.** Reopening a period requires higher permission and a reason.
- **FR13.3.** Configuration changes. Configuration changes are validated, audited and never retroactive on issued invoices.
  - Dependencies / Relationships: FR13, FR9.1.

#### 14. Automation, Background Tasks and Bulk Operations

- **FR14.** Background processing. Operations affecting more than 100 records (e.g. monthly generation, imports, bulk actions) run in the background with a visible status (pending, processing, completed, completed with errors).
  - Dependencies / Relationships: FR2.1, FR9.2.
- **FR14.1.** Bulk actions. Users can perform bulk actions (reassign customers, export a selection, change sector, generate reports).
  - Dependencies / Relationships: FR6.2.
  - **FR14.1.1.** Before a bulk action, the user sees how many items are affected and confirms sensitive actions; afterwards, the system shows a per-item result.
  - **FR14.1.2.** There is no uncontrolled bulk "mark as paid".
- **FR14.2.** Form assistance and safe editing. The system will assist users when filling in the customer, subscription and invoice forms.
  - Dependencies / Relationships: FR1, FR2, FR5.1.
  - **FR14.2.1.** Forms pre-fill the country and currency the user selected most often in the last 30 days, the default due date (FR3.3) and the rate of the customer's revenue range (FR5.1).
  - **FR14.2.2.** A summary of what will happen is shown before confirming.
  - **FR14.2.3.** The customer and invoice forms save a draft automatically every 30 seconds.
  - **FR14.2.4.** Reversible actions offer undo, and irreversible actions are explained before confirmation.
  - **FR14.2.5.** If two users edit the same record, the system detects the conflict instead of silently overwriting changes.
- **FR14.3.** Missed generation recovery. If the monthly generation did not run, the missing invoices are generated on recovery without duplicates.
  - Dependencies / Relationships: FR14, FR2.1.
- **FR14.4.** Double submission protection. Issuing, sending and reconciliation are protected against double clicks and reloads.
  - Dependencies / Relationships: FR14, FR2.4, FR3.1.

#### 15. API

- **FR15.** External API. The system will expose a documented API to query customers, debt status and invoices and to submit controlled requests (such as cancellation requests).
  - Dependencies / Relationships: FR6.2.
- **FR15.1.** API rules. The API applies the same business rules and permissions as the user interface.
  - Dependencies / Relationships: FR15, FR6.2.
- **FR15.2.** API access control. The API has its own authentication, rate limits and logging of important calls.
  - Dependencies / Relationships: FR15, FR9.1.

### Non-Functional Requirements
> Answering "How well?" or "Under what quality standards/restrictions does the system operate?" (Performance, security, usability).

- NFR-01: Usability and Operational Efficiency
  - Description: The system shall provide an intuitive interface that allows users to complete common administrative tasks quickly and with minimal effort.
  - Dependencies / Relationships: Related to customer registration, customer management, invoice creation, and invoice search functionalities. Related functional requirements: FR1, FR1.4, FR2, FR2.5, FR8.2, FR8.3, FR14.2.
  - Metric / Acceptance criterion: At least 4 out of 5 test users shall be able to complete a predefined standard customer registration or invoice issuance task in less than 60 seconds, using no more than 5 navigation clicks.
  - Verification method: Timed User Acceptance Test with 5 representative users performing predefined administrative tasks. Task completion time and navigation clicks will be recorded.

- NFR-02: Multi-Device Compatibility and Accessibility
  - Description: The application shall provide a responsive and accessible interface for desktop computers, tablets, and smartphones.
  - Dependencies / Relationships: Related to customer management, invoice consultation, payment monitoring, approval workflows, and dashboard functionalities. Related functional requirements: FR1.2, FR2.6, FR3, FR8.1, FR8.2, FR11.
  - Metric / Acceptance criterion: All main administrative workflows shall remain usable without unintended horizontal scrolling at screen resolutions of 360x800, 768x1024, and 1920x1080 pixels. The main application views shall achieve an accessibility score of at least 90/100 in Google Lighthouse and meet WCAG 2.1 Level AA accessibility requirements.
  - Verification method: Responsive design testing using Chrome DevTools at the specified screen resolutions. Accessibility testing using Google Lighthouse, complemented by manual WCAG 2.1 AA checks, including keyboard navigation and visual accessibility verification.

- NFR-03: Performance and Scalability
  - Description: The system shall maintain fast response times while supporting an increasing number of customers, historical invoices, and concurrent users without significant performance degradation.
  - Dependencies / Relationships: Related to customer management, customer imports, recurring invoice generation, search operations, reporting, and background processing. Related functional requirements: FR1, FR1.4, FR2.1, FR8, FR8.3, FR14.
  - Metric / Acceptance criterion: The system shall support at least 5,000 active customers, 200,000 historical invoices, and 50 concurrent users. The 95th percentile response time (P95) for standard customer and invoice queries shall remain below 2 seconds, with no failed requests during a 15-minute load test.
  - Verification method: Automated load testing using Apache JMeter with a database containing at least 5,000 customers and 200,000 historical invoices. Response times, concurrent user capacity, and error rates will be measured during the defined test period.

- NFR-04: Authentication Security and Data Protection
  - Description: The system shall protect sensitive customer, financial, and tax information through secure authentication, role-based authorization, and encrypted communications, preventing unauthorized access to restricted resources.
  - Dependencies / Relationships: Related to user authentication, role-based access control, user management, customer data, invoice management, document access, exports, and external API operations. Related functional requirements: FR6.1, FR6.2, FR6.3, FR8.4, FR12.2, FR15.
  - Metric / Acceptance criterion: 100% of login attempts using unauthorized email domains shall be rejected. Passwords shall be securely hashed using bcrypt with a cost factor of at least 12 or an equivalently secure mechanism. Sensitive data shall be transmitted using HTTPS with TLS 1.3. 100% of unauthorized attempts to access restricted customer records, documents, exports, or API resources shall be rejected. No High or Critical security vulnerabilities shall remain in the final security test report.
  - Verification method: Automated authentication and authorization tests, including unauthorized email domains and attempts to access restricted resources through direct URLs and API requests. Security scanning using OWASP ZAP, inspection of password storage, and verification of TLS configuration.

- NFR-05: Data Retention, Auditability and Backup
  - Description: The system shall preserve historical financial information, maintain protected audit records of critical administrative operations, and provide reliable mechanisms for recovering data and documents after a failure.
  - Dependencies / Relationships: Related to customer deactivation, invoice history, financial record management, cancellation, administrative period closing, backups, and auditing functionalities. Related functional requirements: FR1.1, FR1.3, FR2.3, FR2.6, FR4.1, FR9, FR9.1, FR13.2.
  - Metric / Acceptance criterion: 100% of issued invoices shall remain accessible to authorized users after customer deactivation, subject to the approved data retention policy. 100% of critical financial and administrative changes defined in FR9.1 shall generate an audit record containing the responsible user, action, and timestamp. 100% of attempts to modify or delete existing audit records through application interfaces shall be rejected. Automatic backups shall be performed at least once every 24 hours, and data recovery from a valid backup shall be possible within 4 hours.
  - Verification method: Database inspection and tests involving customer deactivation and historical invoices. Audit log inspection after critical operations and unauthorized modification attempts. Backup restoration tests and role-based access control tests.

- NFR-06: Data Integrity and Automation Reliability
  - Description: The system shall ensure that automated invoicing, payment processing, and administrative operations execute reliably, preventing duplicate records, inconsistent financial data, and silent overwriting of concurrent modifications.
  - Dependencies / Relationships: Related to recurring invoice generation, invoice numbering, payment detection, payment reconciliation, automation logs, background processing, and concurrent record editing. Related functional requirements: FR2.1, FR2.4, FR3, FR3.1, FR9.2, FR14, FR14.2.
  - Metric / Acceptance criterion: Repeated processing of the same payment event shall not create duplicate payments. Retrying automated recurring invoice generation shall not create duplicate invoices for the same customer and billing period. 100% of simulated conflicting updates to the same record shall be detected, preventing silent data overwriting. 100% of simulated automation failures shall be recorded with an identifiable error status, without preventing independent operations from continuing.
  - Verification method: Integration tests simulating duplicate payment notifications, repeated invoice generation, concurrent record modifications, and failures during automated processes. Database consistency checks and inspection of automation execution logs will verify the results.

- NFR-07: Maintainability and Deployment Reproducibility
  - Description: The system shall be maintainable and deployable independently of Turbine's Brain product, allowing configuration changes and future system modifications without affecting core administrative operations.
  - Dependencies / Relationships: Related to configurable pricing, global system configuration, and external API integration. Related functional requirements: FR5.1, FR13, FR15. Related business requirements: BR-01, BR-03.
  - Metric / Acceptance criterion: 100% of the configurable parameters defined in FR13 shall be modifiable without changing the source code. The application shall be deployable in a clean test environment using documented instructions and shall successfully perform its core customer and invoice operations without requiring Brain.
  - Verification method: Configuration testing to verify that system parameters can be modified without source code changes. Deployment testing in a clean environment following the technical documentation, followed by integration tests confirming that customer and invoice operations function independently of Brain.

## Additional Information
> Interpretation of contradictory client statements and items the client explicitly placed out of scope.

### Contradictions and Interpretations

> Only real conflicts between client statements are kept here. C5, C7, C8, C9, C10 and C12 were removed after review on 20/10/2026: they were not contradictions, because the transcript states the answer directly. Their content now lives in the FRs: C5 → FR3.1.3 (installments are in Out of Scope), C7 → FR3.3, C8 → FR9 and FR9.1, C9 → FR3.2.5, C10 → FR2.5.2 and FR11, C12 → FR6.1. The remaining IDs are kept unchanged so that existing references stay valid.

- **C1. Roles of the second user type**.
  - *Statements:* First meeting: a "reader" who only sees what has been assigned to them, then "cannot create or edit", then CRUD on the assigned items, plus a super administrator. Extended meeting: the client asks not to cling to the name; what matters is the capability.
  - *Interpretation:* Three roles. The second user type is renamed **operational user** and can modify the data of its assigned customers (FR6.2, FR6.2.3, FR6.2.4).
- **C2. Editing issued invoices**.
  - *Statements:* First meeting: an invoice can be modified "whenever he wants", but invoices go by quarters, so one dated in March cannot be modified in April. Extended meeting: drafts can be corrected; after issuance, changes must be traced or done through a corrective invoice, and periods can be closed.
  - *Interpretation:* Drafts are editable, issued invoices are corrected only through corrective invoices, and the "quarter" idea becomes administrative period closing (FR2.3.2, FR2.3.4, FR2.8, FR13.2).
- **C3. Creating customers**.
  - *Statements:* Employees create customers, people, companies and invoices, but "No" was recorded as the answer to "Does the application need to have the possibility of creating a customer?".
  - *Interpretation:* The "No" referred to customers registering themselves, as the extended meeting confirms (no self-registration; internal users create records). Customer creation is kept (FR1, FR6.1.1, FR6.2.2).
- **C4. Cancellation with unpaid invoices** *(team decision)*.
  - *Statements:* First meeting: "you cannot cancel because this invoice is unpaid", "we will cancel you when you meet the next invoice you have to pay", and an open one-off invoice must be paid before leaving; but also "if you notify your cancellation, no more invoices are issued to you". Extended meeting: debt must not block cancellation forever; recurrence stops and collection continues.
  - *Interpretation:* The cancellation always proceeds: new recurring invoices stop from the effective date, and collection of all previous invoices, one-off invoices included, continues until they are paid (FR4.1.1, FR4.1.2). Source (extended meeting): "I do not want a debt to block the commercial cancellation forever, but at the same time I do not want the outstanding payment to disappear when the customer is cancelled." *Team decision, to be validated at the next client review.*
- **C6. Editable amount vs. fixed yearly price**.
  - *Statements:* First meeting: the amount "must be modifiable all the time and editable when you create the invoice", but also the recurring price "is the same throughout the year". Extended meeting: recurring invoices are automatic, and manual amount changes need approval.
  - *Interpretation:* The amount is editable on drafts (mainly one-off invoices). Recurring prices change only through the annual review or approved commercial exceptions, and manual changes to a recurring invoice require approval (FR2.3.2, FR2.3.3, FR5.2, FR5, FR11).
- **C11. Using retained data for marketing**.
  - *Statements:* First meeting: logical deletion keeps customer data "so that you can, in the future, have a marketing campaign" (the client agreed). Extended meeting: "This application must not automatically use billing data for commercial campaigns. That would be another purpose and would have to be handled separately."
  - *Interpretation:* Retained data is kept for legal and historical reasons only (FR1.3.1) and is never used for marketing in this system (see Out of Scope).

### Out of Scope (stated by the client)

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
- Merging duplicate customer records: the client called it "delicate"; duplicates are only warned about (FR1.8).
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
