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

- UR-01: International commercial and tax customer registration.
- UR-02: Multiple contacts per company and channel consent management.
- UR-03: CSV customer import with validation and preview.
- UR-04: Duplicate detection, historical reactivation, and controlled merging.
- UR-05: Subscription management.
- UR-06: Temporary subscription pause and reactivation.
- UR-07: Commercial cancellation with outstanding debt retention.
- UR-08: Customer status tracking and business timeline.
- UR-09: Quotation creation and invoice conversion.
- UR-10: One-off invoice creation, concept  catalog, and cost centers 
- UR-11: Proration preview for mid-month sign-ups.
- UR-12: Automatic drafts, validation, and anomalous amount alerts.
- UR-13: Viewing and downloading corporate PDF invoices.
- UR-14: Corrective invoice (administratives can rectify errors or process refunds).
- UR-15: Administrative migration of historical invoices.
- UR-16: Approval workflow and inbox with separation of duties.
- UR-17: Annual revenue tier review campaign.
- UR-18: Adminoistrative period closing and controlled reopening.
- UR-19: Delivery tracking and bounce email handling.
- UR-20: Billing issue management, comments, and attachments.
- UR-21: Manual payment reconciliation, partial settlements and reversal.
- UR-22: Controlled write-off of uncollectible debt.
- UR-23: Daily work screen and actionable notification.
- UR-24: Immediate global search, saved views and quick access.
- UR-25: Controlled bulk actions and background processing.
- UR-26: Financial dashboard with drill-down and budget targets.
- UR-27: Report exports, scheduled summaries, and accounting packages.
- UR-28: Corporate authentication, account lifecycle and session control.
- UR-29: Portfolio assignment and temporary absence delegation.
- UR-30: Global system configuration and simulation testing.
- UR-31: Immutable auditing, system health monitoring privacy, and backups (Superadministrators related).


## System Requirements
> Technical translation of user and business goals into executable functional capabilities and quality constraints.

### Functional Requirements
> Answering "What the system does to fulfill user requirements?" (Inputs, outputs, calculations, and technical behavior).

#### FR1. Customer Management

- **FR1.** Customer company registration. The system will allow users to register a customer company by storing its trading name, legal name, tax identification number, tax address, country, working currency and contact information. Tax identifiers and addresses must not assume a Spanish format.
  - Dependencies / Relationships: FR6.1.
- **FR1.1.** Multiple contact people per company. The system will allow multiple contact people to be associated with a single customer company, each with a specific role (purchasing, billing administration or collections).
  - Dependencies / Relationships: FR1.
- **FR1.2.** Contacts shared between companies. The system will allow a single contact person to be associated with more than one customer company.
  - Dependencies / Relationships: FR1.1.
- **FR1.3.** Logical deactivation of contacts. The system will allow users to mark a contact person as inactive when they leave a company, while preserving the history of the invoices previously sent to their email address.
  - Dependencies / Relationships: FR1.1.
- **FR1.4.** View and edit customer data. The system will save customer data as soon as it is created and allow it to be consulted and modified at any time.
  - Dependencies / Relationships: FR1.
- **FR1.5.** Logical deletion of customers. When a customer is deleted, the system will perform a logical deletion, keeping the customer's data and history stored.
  - Dependencies / Relationships: FR1.
- **FR1.6.** Customer import. The system will allow customers to be imported from a CSV file with a preview before confirming. The user will be able to map columns, see row errors, and choose between correcting the file or importing only the valid rows according to a defined policy. Duplicate tax identifiers will be warned about. Each import will be recorded as an operation with a summary of created, updated and rejected rows and the reasons.
  - Dependencies / Relationships: FR1, FR1.9.
- **FR1.7.** Assign an internal user. The system will allow each customer to be assigned an internal user responsible for it.
  - Dependencies / Relationships: FR1, FR6.2.
- **FR1.8.** Customer status. The system will represent the customer statuses that affect billing (at minimum: pending activation, active, paused, cancellation requested, inactive, administratively blocked) and allow authorised users to change them. The consequences of each status change will be shown explicitly before confirming.
  - Dependencies / Relationships: FR1.7, FR10.
- **FR1.9.** Duplicate detection. Before creating a customer, the system will search for likely duplicates (primarily by tax identifier) and warn the user. It will never merge companies automatically.
  - Dependencies / Relationships: FR1.
- **FR1.10.** Controlled merge *(optional)*. If record merging is implemented, it will be an administrative operation restricted to authorised users and fully audited, including the contacts, documents and invoices moved.
  - Dependencies / Relationships: FR1.9, FR9.1.
- **FR1.11.** Customer reactivation. When a former customer returns, the system will allow their historical record to be reactivated instead of creating a duplicate.
  - Dependencies / Relationships: FR1.5, FR1.9.
- **FR1.12.** Data validation. The system will validate emails, tax identifiers (when the country's format is known), mandatory fields and whitespace normalisation. It will distinguish data required to issue an invoice from data that is only recommended for the commercial record, allowing controlled gaps in the latter.
  - Dependencies / Relationships: FR1, FR2.15.
- **FR1.13.** Customer tags. The system will allow customers to be tagged (e.g. strategic, beta, partner, collection risk). Tags will not replace statuses derived from data (e.g. "unpaid").
  - Dependencies / Relationships: FR1.
- **FR1.14.** Customer timeline. The system will show a business timeline for each customer with relevant events: registration, change of responsible person, rate changes, invoices issued, payments, issues, pauses, cancellation and reactivation.
  - Dependencies / Relationships: FR1, FR9.1.
- **FR1.15.** Billing-contact protection. The system will warn the user when they try to remove or deactivate the only billing contact of an active customer.
  - Dependencies / Relationships: FR1.1, FR1.3.
- **FR1.16.** Channel consent and language per contact. The system will store, for each contact, whether they accept WhatsApp (or other consent-based channels) for administrative communications, and the preferred communication language for the customer or contact.
  - Dependencies / Relationships: FR1.1, FR2.7, FR13.2.
- **FR1.17.** Favourites and recent items. The system will let each user access favourite and recently used customers quickly. These lists will never act as an authorisation mechanism.
  - Dependencies / Relationships: FR1, FR6.13.

#### FR2. Invoicing

- **FR2.** Invoice creation. The system will allow users to create an invoice for a customer, choosing whether it is one-off or recurring. Invoices are made of lines (FR2.8); the PDF is only a representation of data stored in the system.
  - Dependencies / Relationships: FR1.
- **FR2.1.** Automatic recurring invoices. For customers with an active subscription, the system will automatically generate a new invoice on the first day of every month from the concepts configured in the subscription, without manual creation or approval as long as it matches the approved subscription. Paused, not-yet-active and cancelled subscriptions will not generate invoices. Monthly is currently the only recurrence frequency; the amount stays the same every month (only the date changes) until an annual review or approved exception changes it.
  - Dependencies / Relationships: FR2, FR10, FR14.1.
- **FR2.2.** Prorated first invoice. When a recurring customer starts during the month, the system will generate an invoice for the remaining days of that month; normal monthly invoicing will start on the following first day. The proration will be shown before confirming the registration and will follow a single documented rule (day-count method, start on the last day of the month).
  - Dependencies / Relationships: FR2.1, FR10.2.
- **FR2.3.** Editable amount. The system will allow the invoice amount to be modified while the invoice is a draft. A manual change to the amount of a recurring invoice will send it for approval before issuance.
  - Dependencies / Relationships: FR2, FR2.12, FR11.
- **FR2.4.** Invoice PDF generation. The system will automatically generate each invoice as a PDF in a single standard format with Turbine's corporate identity, including logo, tax information, series and number, dates, lines, taxable bases, taxes, total, payment terms and support contact details. The same PDF will be used wherever the invoice is shown or sent. The originally issued PDF will be preserved so that later template or branding changes do not alter historical invoices.
  - Dependencies / Relationships: FR2, FR13.4.
- **FR2.5.** Invoice storage. The system will store every generated invoice PDF, linked to its customer.
  - Dependencies / Relationships: FR2.4.
- **FR2.6.** Invoice sending. When an invoice is issued, the system will automatically send it to the customer together with a notification. Each sending attempt will record channel, recipients at that moment, date, template used and result. A failed sending can be retried without creating a new invoice or number.
  - Dependencies / Relationships: FR2.4, FR2.7, FR13.1.
- **FR2.7.** Communication channels. The system will send customer communications (invoices, notifications and reminders) by email to the billing contact by default, and by WhatsApp as a complementary channel only when consent and a valid number exist. Both providers may be simulated.
  - Dependencies / Relationships: FR1.1, FR1.16.
- **FR2.8.** Invoice lines. Each invoice will have one or more lines with description, quantity, unit price, optional discount and tax.
  - Dependencies / Relationships: FR2, FR2.10.
- **FR2.9.** Concept catalogue. The system will provide a lightweight catalogue of reusable concepts with an indicative price and default tax. Description and price can be adjusted on each invoice, and changes to the catalogue will not affect existing invoices.
  - Dependencies / Relationships: FR2.8.
- **FR2.10.** Taxes. Taxes applied to invoice lines will be selected from a configurable list of registered taxes; the system will not infer foreign tax legislation.
  - Dependencies / Relationships: FR13.
- **FR2.11.** Invoice lifecycle. The system will model the invoice lifecycle (e.g. draft, pending approval, ready to issue, issued, sent, overdue, paid, with discrepancy, disputed, uncollectible, voided, rectified). States derived from data (overdue, paid) will not be set by hand.
  - Dependencies / Relationships: FR2, FR3, FR11.
- **FR2.12.** Editability rules *(resolves C2)*. Drafts can be freely corrected. After issuance an invoice cannot be silently modified: any relevant change must be traced, and changes that are not legally allowed must be made through a corrective invoice (FR2.19).
  - Dependencies / Relationships: FR2.11, FR9.1.
- **FR2.13.** Series and numbering. Invoices will have a series and a unique, sequential number within it, configured by the super administrator (e.g. ordinary and corrective series). Numbers are assigned only at issuance, never to drafts, and must be unique under concurrent issuance. Retrying a failed send will not assign a new number.
  - Dependencies / Relationships: FR2.11, FR6.6.
- **FR2.14.** Deletion of drafts. Drafts that were never issued may be deleted (leaving a trace where appropriate). Issued invoices can never be deleted.
  - Dependencies / Relationships: FR2.11.
- **FR2.15.** Preview and issuance validation. Before issuance, the system will show a preview and block issuance if mandatory tax data is missing, stating exactly what is missing.
  - Dependencies / Relationships: FR2.4, FR1.12.
- **FR2.16.** Anomaly warning. The system will warn (without necessarily blocking) when an invoice amount deviates strongly from the customer's usual pattern, using a simple configurable rule.
  - Dependencies / Relationships: FR2, FR13.
- **FR2.17.** Delivery failures. If a sending bounces or fails, the invoice will not be marked as notified; the system will notify the responsible user, create a delivery issue, allow the contact to be corrected and the invoice resent, optionally try another billing contact according to configuration, and distinguish the original sending from retries. "Invoice not created" and "invoice created but not sent" will be shown as different situations.
  - Dependencies / Relationships: FR2.6, FR7, FR12.
- **FR2.18.** Message delivery tracking. The system will show the status of each email/WhatsApp message (queued, sent, delivered if the provider reports it, failed, retried) and will never claim a message was read unless that is actually known.
  - Dependencies / Relationships: FR2.6.
- **FR2.19.** Corrective invoices and credit notes. Starting from an issued invoice, the system will propose the data to correct, generate the corrective document and keep it linked to the original. This requires administrative permission and, depending on amount, approval. Customer balances will take these documents into account.
  - Dependencies / Relationships: FR2.12, FR2.13, FR11.
- **FR2.20.** Invoice currency. An invoice is issued in a single currency that never changes afterwards.
  - Dependencies / Relationships: FR2, FR13.
- **FR2.21.** Historical invoice import. The system will allow an administrative import of historical invoices, marked as migrated, keeping their original number and document, without sending them or consuming a new number.
  - Dependencies / Relationships: FR2, FR2.13.
- **FR2.22.** Quotations *(extension)*. The system may allow creating and sending quotations, recording acceptance/rejection with evidence, and converting an accepted quotation into an invoice reusing its lines, while both documents keep separate identities and histories.
  - Dependencies / Relationships: FR2.8, FR12.4.
- **FR2.23.** Cost centres / projects *(extension)*. The system may allow one-off invoices to be classified by internal project or business line, with manageable categories whose renaming does not break history.
  - Dependencies / Relationships: FR2, FR8.

#### FR3. Payment Tracking and Reminders

- **FR3.** Payment checking. The system will check whether each invoice has been paid by querying the payment source and by receiving payment events (Stripe simulated for this project), and will allow other sources such as Revolut or a bank account to be added without changing the invoice model.
  - Dependencies / Relationships: FR2.
- **FR3.1.** Payment reminders. The system will automatically send the customer a reminder on day 3 after the invoice is issued and another on the due date. The timings are configurable by the super administrator.
  - Dependencies / Relationships: FR2.6, FR3, FR3.5.
- **FR3.2.** Overdue reminders. After the due date, the system will keep sending a reminder every 2–3 days (configurable) until payment is detected or a person intervenes. The flow is per invoice: paying later invoices does not stop the reminders for an earlier unpaid one, and the customer is never cancelled or penalised automatically for non-payment.
  - Dependencies / Relationships: FR3.1.
- **FR3.3.** Stop reminders on payment. When a payment is detected, the system will stop the reminder flow for that invoice.
  - Dependencies / Relationships: FR3, FR3.2.
- **FR3.4.** Support contact details. Every notification sent to a customer will include Turbine's support email and telephone number.
  - Dependencies / Relationships: FR2.6, FR3.1.
- **FR3.5.** Payment period. The system will calculate each invoice's due date using a default payment period of 5 days, changeable only by the super administrator. Payment terms agreed with a customer (e.g. 30 days) take precedence over the default.
  - Dependencies / Relationships: FR2, FR6.6, FR10.
- **FR3.6.** Multi-source reconciliation. The system will receive transactions (amount, date, currency, description, reference) from any configured source and try to match them to invoices. Clear matches are proposed or reconciled automatically according to policy; doubtful or unreferenced ones remain pending manual reconciliation. The system must never silently pick one of several equal-amount invoices.
  - Dependencies / Relationships: FR3.
- **FR3.7.** Idempotent payment events. A payment event received more than once will be counted only once.
  - Dependencies / Relationships: FR3.
- **FR3.8.** Amount discrepancies. If the received amount is lower or higher than the invoice total, the system will associate the transaction, keep the invoice not fully settled (or flag the overpayment), and record the pending difference for review.
  - Dependencies / Relationships: FR3.6.
- **FR3.9.** Reconciliation reversal. A reconciliation can be reversed with a reason; the system keeps the original event and records who or which rule reconciled it and who reversed it.
  - Dependencies / Relationships: FR3.6, FR9.1.
- **FR3.10.** Paid status justification. An invoice is marked paid only from a detected or validated payment, and the system will show which transaction(s) justify it.
  - Dependencies / Relationships: FR3.6.
- **FR3.11.** Pausing follow-up / disputes. The responsible user can mark an invoice as disputed or follow-up paused, with a reason and review date. Automatic reminders stop during that period, the invoice is still shown internally as unpaid, and the responsible user is notified when the review date arrives.
  - Dependencies / Relationships: FR3.2, FR7.
- **FR3.12.** Uncollectible debt. Authorised users can mark a debt as uncollectible or cancelled with a reason and approval; this is a distinct state from paid.
  - Dependencies / Relationships: FR2.11, FR11.
- **FR3.13.** Working calendar. Reminders falling on weekends or configured holidays will be moved to the next working day (see C9).
  - Dependencies / Relationships: FR3.1, FR13.5.

#### FR4. Cancellation

- **FR4.** Stop recurring invoices on cancellation. When a customer's cancellation is recorded, the system will stop generating new invoices for that customer from the effective cancellation date.
  - Dependencies / Relationships: FR2.1.
- **FR4.1.** Collection after cancellation. If a cancelled customer has unpaid invoices, the system will notify them that they must be paid and will continue the reminder flow until they are paid.
  - Dependencies / Relationships: FR4, FR3.2.
- **FR4.2.** Cancellation with outstanding debt *(see C4)*. Outstanding debt will not block the commercial cancellation indefinitely: recurrence stops on the effective date and collection of existing invoices continues. Pending item: confirm with the client whether an unpaid one-off invoice still blocks cancellation.
  - Dependencies / Relationships: FR4, FR4.1.
- **FR4.3.** Outstanding invoice query (API). The system will provide an API that returns whether a given customer has outstanding obligations, with the minimum authorised detail.
  - Dependencies / Relationships: FR3, FR15.
- **FR4.4.** Cancellation requests. The system will allow a cancellation request to be recorded manually or received through the API, creating a task for the responsible user. External systems cannot end a recurrence directly without passing through the system's rules.
  - Dependencies / Relationships: FR4, FR15.2.
- **FR4.5.** Data retention on cancellation. Cancelling a customer will never automatically delete data that must be retained for accounting purposes.
  - Dependencies / Relationships: FR4, FR16.1.

#### FR5. Pricing

- **FR5.** Annual price review. Once a year (or when configured), the system will list the customers due for review, obtain their annual revenue from a simulated source or manual entry (with source reference and date), keep those without data as pending, and propose the corresponding price range. The change requires human approval, has an effective date, and records who approved it, when, and the previous and new prices.
  - Dependencies / Relationships: FR1, FR2.1, FR11.
- **FR5.1.** Fixed price during the year. The system will keep a recurring customer's price unchanged between annual reviews.
  - Dependencies / Relationships: FR5.
- **FR5.2.** Configurable rate table. Revenue ranges and their prices will be stored as configuration editable by the super administrator. Changes apply to new reviews only and never alter issued invoices.
  - Dependencies / Relationships: FR5, FR6.6.
- **FR5.3.** Review corrections. A review record can be corrected with traceability; the system can calculate the potential impact, but any retroactive adjustment must be an explicit, approved action, never automatic.
  - Dependencies / Relationships: FR5, FR11.
- **FR5.4.** Commercial exceptions. The system will support time-limited discounts, free periods and extra services with agreed prices. Users managing a customer can request them; an administrator must approve them, and the super administrator above a configurable threshold.
  - Dependencies / Relationships: FR10, FR11.
- **FR5.5.** Discount expiry. Time-limited discounts will stop applying automatically when their end date passes.
  - Dependencies / Relationships: FR5.4, FR2.1.

#### FR6. Users and Access

- **FR6.1.** Login. The system will allow internal users to log in with an email and password; only verified email addresses from the authorised corporate domain will be accepted. There is no self-registration.
- **FR6.2.** Roles. The system will support three roles: super administrator, administrator and operational user (called "reader" in the first meeting, see C1), managed through a single coherent authorisation model.
  - Dependencies / Relationships: FR6.1.
- **FR6.3.** Administrator permissions. Administrators can manage customers, contact people, companies, invoices and invoice types, assign/unassign customers and resolve approvals within their permissions.
  - Dependencies / Relationships: FR6.2.
- **FR6.4.** Visibility assignment. The system will allow an administrator to decide which customers each operational user can see.
  - Dependencies / Relationships: FR6.2, FR1.7.
- **FR6.5.** Operational user permissions. An operational user can view and modify the operational data of their assigned customers, create invoices if permitted, follow up payments and download documents. They cannot grant themselves access to other customers, change global rates, create series or see the global financial dashboard.
  - Dependencies / Relationships: FR6.4.
- **FR6.6.** System configuration. The system will allow only the super administrator to change the system configuration (for example, the default payment period).
  - Dependencies / Relationships: FR6.2.
- **FR6.7.** User management. The super administrator or an authorised administrator can create or invite users and assign roles. Users who leave are deactivated, never deleted, so their past actions remain attributed.
  - Dependencies / Relationships: FR6.2.
- **FR6.8.** Password recovery. Users can recover their password through links that expire after a reasonable time.
  - Dependencies / Relationships: FR6.1.
- **FR6.9.** Reassignment. When a customer is reassigned, the new responsible user inherits pending tasks, and history keeps who performed each earlier action.
  - Dependencies / Relationships: FR1.7, FR9.1.
- **FR6.10.** Temporary delegation. An administrator can delegate a user's customers to another user for a date range without losing the main assignment; the delegation expires automatically.
  - Dependencies / Relationships: FR6.4.
- **FR6.11.** Sessions. Sessions expire after inactivity, users can log out, and deactivating a user invalidates their active sessions.
  - Dependencies / Relationships: FR6.1, FR6.7.
- **FR6.12.** Failed login protection. Repeated failed login attempts trigger basic protection without excessive lockouts.
  - Dependencies / Relationships: FR6.1.
- **FR6.13.** Server-side authorisation. Every request (including direct URLs, downloads, exports and API calls) is checked against the user's permissions on the server.
  - Dependencies / Relationships: FR6.2.
- **FR6.14.** Personal preferences. Each user can set personal preferences (e.g. email digests) but cannot change corporate rules that alter system behaviour.
  - Dependencies / Relationships: FR6.2, FR7.4.

#### FR7. Internal Notifications

- **FR7.** Payment notification. When an invoice is paid, the system will notify the internal user assigned to that customer.
  - Dependencies / Relationships: FR1.7, FR3.
- **FR7.1.** Non-payment notifications. The system will notify the internal user assigned to a customer of every follow-up sent for an unpaid invoice.
  - Dependencies / Relationships: FR1.7, FR3.2.
- **FR7.2.** Notification events. The responsible user will also be notified of overdue invoices, bounced emails, disputes opened, annual reviews pending, approvals rejected, mentions and expiring pauses.
  - Dependencies / Relationships: FR7.
- **FR7.3.** Inboxes. Each user has their own notification inbox; administrators can also see a global inbox.
  - Dependencies / Relationships: FR7, FR6.2.
- **FR7.4.** Notification channels. Users can choose which notifications arrive in-app, by email, or in a daily digest per category.
  - Dependencies / Relationships: FR7.3.
- **FR7.5.** Notification states and priorities. Notifications have a priority and can be marked as read or as handled; reading an actionable notification does not resolve it.
  - Dependencies / Relationships: FR7.3.
- **FR7.6.** Configurable alert rules. Administrators can configure parameterised rules from a closed set of conditions (e.g. invoice overdue more than N days, outstanding balance above X, sending failed N times, review unresolved for N days).
  - Dependencies / Relationships: FR7, FR13.

#### FR8. Reports, Dashboard and Search

- **FR8.** Invoicing reports. The system will generate weekly, monthly and annual reports on invoicing and collections, filterable by period, customer, internal manager, country, sector, invoice status, type and currency.
  - Dependencies / Relationships: FR2, FR3.
- **FR8.1.** Financial dashboard. Administrators only. Shows weekly, monthly, quarterly and yearly figures: invoiced, collected, outstanding, overdue, average collection time, evolution, customers with highest debt, expected recurring revenue, one-off billing and a simple forecast based on active subscriptions.
  - Dependencies / Relationships: FR8, FR6.2.
- **FR8.2.** Filters. The system will allow customers to be filtered by location, business area and tags, and invoices by status, type (recurring, one-off) and date.
  - Dependencies / Relationships: FR1, FR2.
- **FR8.3.** Traceable figures. Every dashboard figure can be drilled down to the records that make it up. Balances distinguish billed, collected and outstanding amounts.
  - Dependencies / Relationships: FR8.1.
- **FR8.4.** Daily work screen. On login, each user sees invoices due soon, overdue invoices, payments to reconcile, delivery problems, pending approvals, due annual reviews and tasks assigned to them, each linking directly to the item.
  - Dependencies / Relationships: FR2, FR3, FR11.
- **FR8.5.** Global search. Users can search by part of trading name, legal name, tax identifier, contact name, email or invoice number, limited to what they are allowed to see.
  - Dependencies / Relationships: FR1, FR2, FR6.13.
- **FR8.6.** Saved views. Users can save frequent filters or views (e.g. "my invoices overdue more than 15 days").
  - Dependencies / Relationships: FR8.2.
- **FR8.7.** Exports. Results can be exported at least to CSV and to a readable PDF report, respecting the user's permissions. Each export records date/time, filters and user; mass exports of sensitive data are audited.
  - Dependencies / Relationships: FR8, FR6.13, FR9.1.
- **FR8.8.** Scheduled reports. Administrators can schedule weekly or monthly summaries, sent only to authorised users or as a notification with an authenticated link.
  - Dependencies / Relationships: FR8, FR14.
- **FR8.9.** Background reports. Heavy reports run in the background and the user is notified when they are ready.
  - Dependencies / Relationships: FR8, FR14.
- **FR8.10.** Targets *(extension)*. Administrators can configure monthly or annual billing/collection targets and see progress; target changes are recorded.
  - Dependencies / Relationships: FR8.1.
- **FR8.11.** Reporting currency conversion *(extension)*. Dashboards may convert amounts to a base currency using a recorded exchange rate, showing original and converted amounts separately and never altering invoice totals.
  - Dependencies / Relationships: FR8.1, FR2.20.
- **FR8.12.** Accounting firm package. The system will export a monthly or quarterly package (issued invoices, corrective invoices, collections and PDFs/ZIP) in a configurable format, recording generation date, period and version.
  - Dependencies / Relationships: FR2, FR3.
- **FR8.13.** Export retention. Generated exports and reports are kept for a configurable period, separately from the retention policy for legal documents.
  - Dependencies / Relationships: FR8.7, FR13.

#### FR9. Backups, Auditing and Monitoring

- **FR9.** Backups. The system will create automatic backups of data and documents according to a defined policy, and backups must be restorable (restoration tested).
  - Dependencies / Relationships: FR6.2.
- **FR9.1.** Audit trail *(split from FR9)*. The system will record who created customers, changed tax data, issued invoices, changed due dates, approved discounts, reassigned customers, marked disputes, reconciled manually, changed configuration and accessed payments. The trail cannot be edited by anyone; the super administrator can consult and filter it.
  - Dependencies / Relationships: FR6.2.
- **FR9.2.** Automation execution log. Each automated process (recurring generation, reminders, reconciliation, scheduled reports) records when it ran, items processed, items created, failures and reasons.
  - Dependencies / Relationships: FR14.
- **FR9.3.** Health screen. The system will show last recurring generation run, pending email queue, recent integration errors and last successful backup.
  - Dependencies / Relationships: FR9, FR9.2.
- **FR9.4.** User-facing errors. Errors shown to users are understandable, contain no sensitive technical data, and include an issue code for correlation with technical logs.

#### FR10. Subscriptions (Commercial Relationship)

- **FR10.** Subscription record. The system will store each customer's commercial relationship separately from its invoices: start date, plan/service, agreed rate and recurring concepts, internal manager, payment terms and associated external documents. No commitment period is assumed (month to month).
  - Dependencies / Relationships: FR1, FR5.
- **FR10.1.** Future start date. A subscription can start on a future date; until then the customer is shown as pending activation and no invoices or reminders are generated.
  - Dependencies / Relationships: FR10, FR1.8.
- **FR10.2.** Deferred billing exception. A subscription can be explicitly marked to start billing the following month without proration.
  - Dependencies / Relationships: FR10, FR2.2.
- **FR10.3.** Pause. A subscription can be paused with reason, start date and optional expected reactivation date. No monthly invoices are generated during the pause; old invoices continue in collection. When the reactivation date arrives, the responsible user is notified and nothing is assumed silently if the policy requires confirmation.
  - Dependencies / Relationships: FR10, FR7.
- **FR10.4.** Activation validation. The system will block activating a recurring subscription when the tax data required for invoicing is missing, explaining what is missing.
  - Dependencies / Relationships: FR10, FR1.12.

#### FR11. Approvals

- **FR11.** Approval triggers. Manual amount changes, extraordinary discounts, due dates outside the usual pattern, one-off invoices above a threshold, corrective invoices, write-offs and price-range changes will require approval before taking effect. Invoices generated unchanged from an approved subscription do not. The system will state why an item is pending approval.
  - Dependencies / Relationships: FR2, FR5, FR13.
- **FR11.1.** Approval inbox. Approvers see pending items; requesters see pending/approved/rejected status and the approver's comment.
  - Dependencies / Relationships: FR11.
- **FR11.2.** Separation of duties. Above a configurable threshold, a user cannot approve their own request. The operations subject to this rule are defined explicitly.
  - Dependencies / Relationships: FR11, FR13.
- **FR11.3.** Approver substitution. An administrator can reassign a pending approval or designate a substitute approver; every reassignment is recorded.
  - Dependencies / Relationships: FR11, FR9.1.

#### FR12. Billing Issues, Comments and Attachments

- **FR12.** Billing issues. Users can open internal issues linked to a customer and optionally an invoice (e.g. incorrect tax ID, amount disputed, email not received, payment not located), with responsible user, status, priority, comments and attachments. The resolution is recorded on closure.
  - Dependencies / Relationships: FR1, FR2.
- **FR12.1.** Issues pausing reminders. An issue affecting collection can pause the reminders of the related invoice when indicated.
  - Dependencies / Relationships: FR12, FR3.11.
- **FR12.2.** Internal comments. Users can comment on specific items (invoice, issue, customer) and mention other users, who are notified. Comments are never sent to the customer.
  - Dependencies / Relationships: FR7.
- **FR12.3.** Restricted notes. Comments can be normal (visible within the customer's scope) or restricted administrative notes visible only to administrators.
  - Dependencies / Relationships: FR12.2, FR6.2.
- **FR12.4.** Attachments. Users can attach documents (orders, accepted quotes, receipts, screenshots, accounting documents) with type and description, subject to format and size limits. Access follows the permissions of the associated customer/invoice; temporary download links expire.
  - Dependencies / Relationships: FR1, FR2, FR6.13.

#### FR13. Configuration and Templates

- **FR13.** Global configuration. The system will keep configuration separate from operational data: default payment period, reminder timings, allowed email domain, issuer tax data, logo and template, series, currencies, taxes, approval thresholds, notification channels and automation policies. Changes are validated, audited and not retroactive on issued invoices.
  - Dependencies / Relationships: FR6.6, FR9.1.
- **FR13.1.** Communication templates. Authorised users can edit templates for invoice emails, reminders, due-date and overdue messages and dispute resolution, using variables (company, invoice number, amount, due date, responsible person, support details). The preview warns of missing variables; template versions are kept and each sending records the version used.
  - Dependencies / Relationships: FR13, FR2.6.
- **FR13.2.** Languages. Customer communications and the invoice template are available at least in Spanish and English, selected per customer or contact, without changing accounting data.
  - Dependencies / Relationships: FR13.1, FR1.16.
- **FR13.3.** Simulation and test sends. Users can send a test of a template to themselves and preview the reminder schedule for an example customer before activating changes.
  - Dependencies / Relationships: FR13.1, FR3.1.
- **FR13.4.** Issuer data. The issuing company's tax data is configuration, not hard-coded. Extension: multiple issuing entities with their own series and accounts, selectable by authorised users.
  - Dependencies / Relationships: FR13, FR2.13.
- **FR13.5.** Working calendar. Administrators configure weekends and a small holiday calendar.
  - Dependencies / Relationships: FR13.
- **FR13.6.** Period closing. An authorised administrator can mark a month or quarter as closed; financial elements in closed periods cannot be changed except through an exceptional, audited procedure. Reopening requires higher permission and a reason.
  - Dependencies / Relationships: FR2.12, FR9.1.

#### FR14. Automation, Background Tasks and Bulk Operations

- **FR14.** Background tasks. Long operations (e.g. generating thousands of PDFs) run in the background with visible status (pending, processing, completed, completed with errors), independent of the user's browser tab.
- **FR14.1.** Idempotent recurring generation. If the monthly generation did not run (e.g. downtime), the system detects missing invoices when it recovers and generates them without duplicates.
  - Dependencies / Relationships: FR2.1.
- **FR14.2.** Fault isolation. A failure on one item (customer, invoice, message) does not stop the processing of the rest; exceptions are logged and routed to whoever can resolve them.
  - Dependencies / Relationships: FR9.2, FR7.
- **FR14.3.** Duplicate submission protection. Issuing, sending and reconciliation are protected against double clicks and reloads; the user sees "already being processed" instead of a duplicate.
  - Dependencies / Relationships: FR2.13, FR3.6.
- **FR14.4.** Bulk actions. Users can perform bulk actions (reassign customers, export a selection, change sector, generate reports), seeing how many items are affected, confirming sensitive actions, and receiving a per-item result. No uncontrolled bulk "mark as paid".
  - Dependencies / Relationships: FR6.13.
- **FR14.5.** Concurrent edit detection. If two users edit the same record, the system detects the conflict instead of silently overwriting changes.
- **FR14.6.** Drafts and undo. Long forms (e.g. a one-off invoice) save drafts automatically; reversible actions offer undo; irreversible actions are explained before confirmation.
- **FR14.7.** Smart defaults and confirmation summary. Frequent forms will pre-fill sensible defaults (usual country, usual currency, default due date, rate suggested by revenue range) and show a summary of what will happen before confirming.
  - Dependencies / Relationships: FR1, FR5.2, FR10.

#### FR15. API and Integrations

- **FR15.** External API. The system will expose a documented API to query customers, debt status and invoices and to submit controlled requests, applying the same business rules and permissions as the interface, with separate authentication, rate limits and logging of important calls.
  - Dependencies / Relationships: FR6.13.
- **FR15.1.** Outstanding obligations endpoint. Given a customer identifier, returns whether there are outstanding obligations and the minimum authorised detail (refines FR4.3).
  - Dependencies / Relationships: FR15, FR4.3.
- **FR15.2.** Cancellation request endpoint. An external system can notify a cancellation request, which creates the corresponding task (FR4.4).
  - Dependencies / Relationships: FR15, FR4.4.
- **FR15.3.** Payment event reception. The system receives simulated payment-provider notifications (webhook) in addition to querying.
  - Dependencies / Relationships: FR3, FR3.7.
- **FR15.4.** Encapsulated integrations. Payment, email and WhatsApp providers are interchangeable without changing the invoice model.
  - Dependencies / Relationships: FR3, FR2.7.

#### FR16. Data Protection

- **FR16.** Personal data lookup. Authorised users can locate all personal data stored about a contact.
  - Dependencies / Relationships: FR1.1.
- **FR16.1.** Anonymisation/deletion. When legally appropriate, contact data can be anonymised or deleted following a policy that considers active records, history and backups. Issued invoices and their PDFs remain valid and retained.
  - Dependencies / Relationships: FR16, FR2.5, FR9.
- **FR16.2.** Purpose limitation. Billing contact data will not be used automatically for marketing.
  - Dependencies / Relationships: FR1.16.
- **FR16.3.** Demo data. The system can be loaded with synthetic data for demos, kept separate from production.

#### FR17. Optional Intelligent Features *(extension)*

- **FR17.** If any AI-assisted feature is added (e.g. concept classification, anomaly detection), it can be disabled, never bypasses permissions, and any significant financial suggestion requires human confirmation. Core rules remain deterministic.
  - Dependencies / Relationships: FR6.13.

#### Contradictions and Interpretations

- **C1. Roles of the second user type**.
  - *Statements:* First meeting: "reader" who only sees, then "cannot create or edit", then CRUD on assigned items, plus a super administrator. Extended meeting: the client asks not to cling to the name; what matters is the capability.
  - *Interpretation:* Three roles. The second user type is renamed **operational user** (FR6.2, FR6.5).
- **C2. Editing issued invoices** *(resolved)*.
  - *Statements:* First meeting: invoices editable "whenever he wants", but not after the quarter changes. Extended meeting: editable before issuance; after issuance changes must be traced or done via corrective invoice; periods can be closed.
  - *Interpretation:* FR2.12 (editability), FR2.19 (corrective invoices) and FR13.6 (period closing). The "quarter" idea becomes administrative period closing.
- **C3. Creating customers.**
  - *Statements:* Employees create customers, but "No" was recorded for "possibility of creating a customer".
  - *Interpretation:* The "No" referred to customer self-registration, confirmed by the extended meeting (no self-registration, internal users create records). Customer creation is kept (FR1, FR6.3).
- **C4. Cancellation with unpaid invoices** *(open)*.
  - *Statements:* First meeting: "you cannot cancel because this invoice is unpaid", "we will cancel you when you meet the next invoice you have to pay", and an open one-off invoice must be paid before leaving; but also "if you notify your cancellation, no more invoices are issued to you". Extended meeting: debt must not block cancellation forever; recurrence stops and collection continues.
  - *Interpretation:* We follow the later statement (FR4.2 updated). **To confirm at next review:** whether unpaid one-off invoices still block cancellation as a special case.
- **C5. Partial payments** *(resolved by client)*.
  - *Statements:* "No installment payments" vs. "partially reconciled" state.
  - *Interpretation:* Installments are not a commercial option, but partial or excess payments can happen and are handled as discrepancies (FR3.8).
- **C6. Editable amount vs. fixed yearly price**.
  - *Statements:* First meeting: the amount "must be modifiable all the time and editable when you create the invoice", but also the recurring price "is the same throughout the year". Extended meeting: recurring invoices are automatic, and manual amount changes need approval.
  - *Interpretation:* The amount is editable on drafts (mainly one-off invoices). Recurring prices change only through the annual review or approved commercial exceptions; manual changes to a recurring invoice go through approval (FR2.3, FR5.1, FR5.4, FR11).
- **C7. Default payment period vs. agreed terms** *(resolved)*.
  - *Interpretation:* Customer-agreed terms override the 5-day default (FR3.5).
- **C8. Backups vs. activity log** *(resolved)*.
  - *Statements:* FR9 mixed backups with "all application activity".
  - *Interpretation:* The client distinguished auditing (what happened) from backups (recovery): split into FR9 and FR9.1.
- **C9. Working calendar scope** *(open)*.
  - *Statements:* Communications falling on weekends/holidays "may" be moved to the next working day.
  - *Interpretation:* We move reminders only (FR3.13). **To confirm:** whether the due date itself also moves, and whether the rule is mandatory or configurable.
- **C10. Anomaly warning vs. high-amount approval**.
  - *Statements:* Unusual amounts should warn but not always block; high one-off invoices may require approval.
  - *Interpretation:* Two separate configurable rules: a non-blocking deviation warning (FR2.16) and an approval threshold (FR11).
- **C11. Using retained data for marketing** *(open)*.
  - *Statements:* First meeting: logical deletion keeps customer data "so that you can, in the future, have a marketing campaign" (the client agreed). Extended meeting: billing data must not be used automatically for commercial campaigns; that is a different purpose.
  - *Interpretation:* We follow the later statement: data is retained for legal and historical reasons (FR1.5), and no marketing use is built into this system (FR16.2). **To confirm** at next review.
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

### Non-Functional Requirements
> Answering "How well?" or "Under what quality standards/restrictions does the system operate?" (Performance, security, usability).

- NFR-01: Usability and Operational Efficiency
  - Description: The system shall provide an intuitive interfact that allows users to complete common administrative tasks quickly and with minimal effort.
  - Dependencies / Relationships: Related to customer registration, customer management, invoice creation, and invoice search functionalities. Functional requirement IDs pending confirmation.
  - Metric / Acceptance criterion: At least 4 out of 5 test users shall be able to complete a predefined standard customer registration or invoice issuance task in less than 60 seconds, using no more than 5 navigation clicks.
  - Verification method: Timed User Acceptance Test with 5 representative users performing predefined administrative tasks. Task completion time and navigation clicks will be recorded.
 
- NFR-02: Multi-Device Compatibility and Accessibility
  - Description: The application shall provide a responsive and accessible interface for desktop computers, tablets, and smartphones.
  - Dependencies / Relationships: Related to customer management, invoice consultation, payment monitoring, and dashboard functionalities. Functional requirement IDs pending confirmation.
  - Metric / Acceptance criterion: The main administrative workflows shall remain usable without unintended horizontal scrolling at screen resolutions of 360x800, 768x1024, and 1920x1080 pixels. The main application views shall achieve an accessibility score of at least 90/100 in Google Lighthouse and meet WCAG 2.1 Level AA.
  - Verification method: Responsive design testing using Chrome DevTools at the specified screen resolutions. Accessibility testing using Google Lighthouse, complemented by manual WCAG 2.1 AA checks.

- NFR-03: Performance and Scalability
  - Description: The system shall maintain fast response times while supporting an increasing number of customers, invoices, and concurrent users.
  - Dependencies / Relationships: Related to customer and invoice queries, search operations, reporting, and invoice generation. Functional requirement IDs pending confirmation.
  - Metric / Acceptance criterion: The system shall support at least 5,000 active customers and 50 concurrent users. The 95th percentile response time (P95) for standard customer and invoice queries shall remain below 2 seconds, with no failed requests during the defined load test.
  - Verification method: Automated load testing using Apache JMeter with a database containing at least 5,000 customers and representative invoice records.

- NFR-04: Authentication Security and Data Protection
  - Description: The system shall protect sensitive customer, financial, and tax information through secure authentication, authorization, and encrypted communications.
  - Dependencies / Relationships: Related to user authentication, role-based access control, customer data management, invoice management, and financial information access. Functional requirement IDs pending confirmation.
  - Metric / Acceptance criterion: 100% of login attempts using unauthorized email domains shall be rejected. Passwords shall be securely hashed using bcrypt with a cost factor of at least 12 or an equivalently secure mechanism. Sensitive data shall be transmitted using HTTPS with TLS 1.3. No High or Critical security vulnerabilities shall remain in the final security test report.
  - Verification method: Automated authentication and authorization tests, including attempts using unauthorized domains. Security scanning using OWASP ZAP, inspection of password storage, and verification of TLS configuration.

- NFR-05: Data Retention, Auditability and Backup
  - Description: The system shall preserve historical financial information, record important administrative actions, and provide mechanisms for recovering data after a failure.
  - Dependencies / Relationships: Related to customer deactivation, invoice history, financial record management, and administrative operations requiring audit logs. Functional requirement IDs pending confirmation.
  - Metric / Acceptance criterion: 100% of issued invoices shall remain accessible to authorized users after customer deactivation, subject to the approved data retention policy. 100% of critical financial and administrative changes shall generate an audit record containing the responsible user, action, and timestamp. Automatic backups shall be performed at least once every 24 hours. Data recovery from a valid backup shall be possible within 4 hours.
  - Verification method: Database inspection and tests involving customer deactivation and historical invoices. Audit log inspection after critical operations. Backup restoration tests and role-based access control tests.

- NFR-06: Data Integrity and Automation Reliability
  - Description: The system shall ensure that automated invoicing and payment operations execute reliably without creating duplicate or inconsistent records.
  - Dependencies / Relationships: Related to recurring invoice generation, payment processing, payment reconciliation, and automated reminder functionalities. Functional requirement IDs pending confirmation.
  - Metric / Acceptance criterion: Repeated processing of the same payment event shall not create duplicate payments. Retrying an automated recurring invoice generation shall not create duplicate invoices for the same billing period. 100% of simulated automation failures shall be recorded with an identifiable error status, without preventing independent operations from continuing.
  - Verification method: Integration tests simulating duplicate payment notifications, repeated invoice generation, and failures during automated processes. Verification of database consistency and automation execution logs.
