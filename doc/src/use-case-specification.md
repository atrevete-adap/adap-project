# Use Case Specifications

> Submission 1: 18 behavioural contracts consolidated on 2026-10-20 from the original 59-FR baseline at `2d9d12f`. Reconciled with the requirement decomposition on `main` at `046ecb943b4a44673fb99490c187a289d9b64965` and with the 14 consolidated user requirements (UR-01 to UR-14) introduced on `main` at `7ef6452`. The six absorbed cases remain as explicit flows; no functional requirement is removed.

## 1. Scope, actors and shared rules

Turbine is an independent internal invoicing and collections application. Customers and the accounting firm receive documents or support externally; neither has an application account. Payment and communication providers may be simulated. `E p. n` denotes the supplied 18-page extended client transcript. The current [requirements](requirements.md), including the remaining C1-C4, C6 and C11 interpretations, detailed FR rules and Out of Scope, define the baseline; client-review caveats remain in force.

| Actor | Capability |
| --- | --- |
| Operational User | Assigned staff; customer-scoped operations, invoice work and payment follow-up when permitted. |
| Administrator | Specialises Operational User; wider operational management, assignments, approvals, financial reporting, corrections and period closing within authority. |
| Super Administrator | Specialises Administrator; global configuration, protected audit and recovery. A specific capability check still applies to every action. |
| Time | Authorised timer automation for monthly billing, annual-review tasks, reminders, payment queries and backups. |
| External Application | Separately authenticated/scoped API caller; debt queries and cancellation intake confer no interactive customer access. |
| Payment Provider | Supporting service providing verified transaction evidence; Turbine does not operate a payment gateway. |
| Communication Service | Supporting service for email and consented complementary WhatsApp. |

- Authentication and current role/customer scope are rechecked on every protected request, direct download, bulk item and API operation. An inherited actor association never bypasses an operation's capability or approval threshold. UC-17 requires financial-report permission even for a technical Super Administrator account; the unresolved account-policy choice is not silently decided here.
- Issued snapshots, numbers and original PDFs are preserved. Corrections, cash movements and collection state have distinct evidence; logical deactivation or cancellation never marks a debt paid.
- Automated issuance, transaction allocation and reminder occurrences are idempotent. Recovery resumes the failed stage without repeating successful financial work; item failures have explicit outcomes.
- Customer-agreed terms override the default five days. FR3.2.6 (formerly C9) moves communications only, not the legal due date; C4 separates cancellation from old debt; C11 excludes marketing reuse. Document and approve proration, rounding and day-count conventions before activation rather than inventing client decisions.
- Existing NFR targets remain acceptance conditions, not measured results. Retention, backup/recovery and immutable audit checks follow NFR-05; no universal legal retention period is asserted here.
- Shared details such as saved views, comments, scoped attachments, background status and per-item bulk results follow their mapped FR. They are not separate use cases merely because they require a screen.

## 2. Consolidation and inventory

IDs already used by the group are retained, leaving deliberate gaps. There are 18 cases, not 24; absorbed IDs must not appear as separate ellipses in the diagram.

| Absorbed ID | Remaining contract | Behaviour retained |
| --- | --- | --- |
| UC-03 | UC-02 | CSV preview, validation, confirmation and row results. |
| UC-05 | UC-04 | Assignment, reassignment, expiring delegation and access routing. |
| UC-07 | UC-06 | Annual review evidence, proposed band, human approval and effective rate. |
| UC-09 | UC-08 | Validation, numbering, immutable issuance and PDF recovery. |
| UC-11 | UC-08 | Delivery, observed status, consent, retries and bounce handling. |
| UC-19 | UC-20 | Immutable audit inspection and automation health, alongside backup/recovery. |

| ID | Goal | Functional requirements |
| --- | --- | --- |
| [UC-01](#uc-01) | Access the internal application | FR6.1, FR6.2 |
| [UC-02](#uc-02) | Maintain customers and import records | FR1, FR1.1, FR1.2, FR1.3, FR1.6, FR1.4, FR1.7, FR1.8 |
| [UC-04](#uc-04) | Administer staff access and customer assignments | FR6.2, FR6.3, FR1.5, FR6.4, FR14.1 |
| [UC-06](#uc-06) | Manage subscriptions and annual rate reviews | FR2.2, FR5.2, FR10, FR10.1, FR10.2, FR5, FR5.1, FR5.3, FR5.4, FR5.5, FR5.6, FR10.3 |
| [UC-08](#uc-08) | Prepare, issue and deliver an invoice | FR2, FR2.3, FR2.5, FR14.2, FR2.4, FR2.6, FR14, FR2.7, FR13.1, FR2.9, FR2.10, FR2.11, FR11.2, FR14.5 |
| [UC-10](#uc-10) | Generate monthly recurring invoices | FR2.1, FR9.2, FR14, FR11.2, FR14.3, FR14.4 |
| [UC-12](#uc-12) | Reconcile payments with invoices | FR3, FR3.1, FR3.6, FR3.7, FR14.5 |
| [UC-13](#uc-13) | Run reminders and overdue follow-up | FR3.2, FR3.3, FR3.4, FR13 |
| [UC-14](#uc-14) | Review daily work and notifications | FR7, FR7.1, FR7.2, FR8.2, FR8.3 |
| [UC-15](#uc-15) | Record subscription cancellation | FR4, FR4.1, FR15, FR4.3, FR4.4, FR15.1, FR15.2 |
| [UC-16](#uc-16) | Query outstanding obligations through the API | FR4.2, FR15, FR15.1, FR15.2 |
| [UC-17](#uc-17) | Consult financial dashboard and reports | FR8, FR8.1, FR8.3, FR8.4, FR8.5, FR8.6, FR8.7, FR8.8 |
| [UC-18](#uc-18) | Configure billing and automation policies | FR5.1, FR6.2, FR13, FR13.1, FR13.3 |
| [UC-20](#uc-20) | Supervise audit, backups and recovery | FR9.1, FR9.2, FR9 |
| [UC-21](#uc-21) | Correct an issued invoice | FR2.3, FR2.8 |
| [UC-22](#uc-22) | Resolve a billing or delivery issue | FR3.4, FR12, FR12.1, FR12.2, FR12.3 |
| [UC-23](#uc-23) | Decide a sensitive financial approval | FR3.5, FR11, FR11.1, FR11.3 |
| [UC-24](#uc-24) | Close or reopen an administrative period | FR13.2 |

## 3. Behavioural contracts

## UC-01

* **ID / Code:** UC-01
* **Use Case Name:** Access the internal application
* **Description:** Authenticate an internal staff member and open the work area permitted by their corporate account.
* **Primary Actor:** Operational User
* **Supporting Actors:** Communication Service (password recovery)
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-04; UR: UR-12; FR: FR6.1, FR6.2; NFR-02, NFR-04.
* **Source:** E pp. 7-8, 12.
* **Stakeholders & Interests:**
  * *Internal staff:* obtain access to their work.
  * *Turbine:* restrict access to active corporate accounts.
* **Preconditions:** An internal account has been provisioned; login itself requires no existing session.
* **Postconditions:** Successful login creates a session with current permissions; rejection creates none. Logout, expiry or deactivation invalidates access.
* **Success Guarantee:** The authenticated user reaches the work area allowed by their role and customer scope.
* **Minimal Guarantee:** No protected customer information is disclosed to an unauthenticated requester.
* **Trigger:** A staff member requests access.
* **Main Success Scenario:**
1. The user enters their corporate email and password.
2. The system checks the authorised domain, active account and credentials.
3. The system creates the session and opens the scoped work area.

* **Extensions:**
  * **2a.** Invalid credentials, domain or inactive account: reject with a generic message and apply failed-attempt protection.
  * **1a.** Forgotten password: send an expiring, single-use recovery link for an eligible account without revealing account existence.
  * **3a.** Logout, inactivity expiry or deactivation: invalidate the session and require authentication again.

## UC-02

* **ID / Code:** UC-02
* **Use Case Name:** Maintain customers and import records
* **Description:** Maintain customer companies and contacts, including validated CSV onboarding through an administrator-only alternative.
* **Primary Actor:** Operational User
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-06; UR: UR-01, UR-10; FR: FR1, FR1.1, FR1.2, FR1.3, FR1.6, FR1.4, FR1.7, FR1.8; NFR-01, NFR-02, NFR-03, NFR-04, NFR-05.
* **Source:** E pp. 2, 4, 7-8, 12, 14-15.; E p. 7.
* **Stakeholders & Interests:**
  * *Assigned staff:* keep their customer portfolio accurate.
  * *Billing contacts:* receive correct documents at the intended address.
  * *Administrator:* import customers without duplicates or silent overwrites.
* **Preconditions:** The actor is authenticated with customer-management permission and current customer scope. CSV import additionally requires Administrator authority and import permission.
* **Postconditions:** Confirmed changes and their actor/time are stored; CSV results identify each committed/rejected row. Deactivation retains issued documents and debt.
* **Success Guarantee:** The authorised customer/contact operation is saved and available in the customer timeline.
* **Minimal Guarantee:** Rejected or stale operations leave committed data intact; no automatic merge or historical invoice rewrite occurs.
* **Trigger:** The user creates or opens a customer, or an authorised Administrator selects CSV import.
* **Main Success Scenario:**
1. The user searches by company, contact, tax identifier or email, using location, sector or tag filters, or starts a new record.
2. The system displays authorised matches; the user enters company, tax, currency, status and contact data, including billing recipients, language and WhatsApp consent.
3. The system validates required fields, duplicate identifiers and record version, and previews the change.
4. The user confirms; the system saves permitted changes, records history and shows the customer timeline and documents.

* **Extensions:**
  * **2a.** CSV import: the Administrator uploads a file and maps columns. The system previews rows and errors; the Administrator corrects the file or confirms valid-only import. Apply authorised rows and report created, updated, rejected or unprocessed rows and reasons; retries recheck duplicates.
  * **3a.** Missing fields or possible duplicate: retain valid input, identify the problem and require explicit historical-record reactivation; do not merge automatically.
  * **2b.** Edit, status change or logical deletion: show billing consequences and confirm; retain history and old debt. Warn before removing the only billing contact or using inactive recipients.
  * **3b.** Concurrent change or lost assignment: reject the stale/unauthorised write without overwriting committed data.
  * **4a.** View, download or bulk export/update: recheck every item’s scope, preview sensitive operations, confirm and report per-item outcomes; sensitive exports are audited.

## UC-04

* **ID / Code:** UC-04
* **Use Case Name:** Administer staff access and customer assignments
* **Description:** Administer internal accounts and customer portfolios with separate capabilities for account changes, assignment and temporary delegation.
* **Primary Actor:** Administrator
* **Other Initiating Contexts:** Super Administrator administers privileged accounts; each account/assignment branch retains its own authority check.
* **Supporting Actors:** Communication Service (account activation)
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-04; UR: UR-10, UR-12; FR: FR6.2, FR6.3, FR1.5, FR6.4, FR14.1; NFR-04, NFR-05.
* **Source:** E pp. 7-8, 12.; E p. 8.
* **Stakeholders & Interests:**
  * *Administrator:* allocate work and arrange temporary cover.
  * *Internal staff:* receive only authorised accounts and portfolios.
  * *Turbine:* retain responsibility for past actions when staff leave.
* **Preconditions:** The actor is authenticated with the capability for the selected operation. Account/role administration requires Super Administrator or explicitly delegated Administrator authority under FR6.3; assignment requires Administrator authority.
* **Postconditions:** Confirmed account or assignment changes are audited and enforced. Deactivation ends sessions; reassignment transfers pending work without rewriting historical ownership.
* **Success Guarantee:** The selected account, portfolio assignment or dated delegation is saved with its effective access scope.
* **Minimal Guarantee:** The actor cannot grant privileges beyond their authority; invalid requests confer no access and staff history is never deleted.
* **Trigger:** An authorised administrator selects an account or portfolio operation.
* **Main Success Scenario:**
1. The Administrator selects the account or customers and the operation to perform.
2. For assignment, the Administrator chooses an eligible staff member and, for temporary cover, start/end dates.
3. The system validates authority, recipient status and dates, and previews affected access and pending work.
4. The Administrator confirms; the system saves the operation, audit event and work routing.

* **Extensions:**
  * **2a.** Account creation or role change: an authorised account administrator enters the corporate email and permitted role. Validate domain, uniqueness and grant authority before confirmation; send the activation message and record delivery failure separately.
  * **2b.** Account deactivation: revoke active sessions, retain attribution and flag pending assignments/approvals for reassignment.
  * **3a.** Invalid interval, inactive recipient or privilege escalation: reject without changing access.
  * **4a.** Bulk reassignment: confirm the affected count, recheck each customer and report successes/failures individually.
  * **4b.** Delegation expires: remove temporary access automatically, retain the principal assignment and preserve all prior actions.

## UC-06

* **ID / Code:** UC-06
* **Use Case Name:** Manage subscriptions and annual rate reviews
* **Description:** Maintain monthly subscription terms and effective dates, including pauses, initial proration and an administrator-led annual rate review.
* **Primary Actor:** Operational User
* **Other Initiating Contexts:** Administrator performs annual-rate decisions; Time creates due-review tasks but cannot approve rates.
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-02, BR-03, BR-04; UR: UR-02, UR-03, UR-08; FR: FR2.2, FR5.2, FR10, FR10.1, FR10.2, FR5, FR5.1, FR5.3, FR5.4, FR5.5, FR5.6, FR10.3; NFR-01, NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 2-5, 14.; E pp. 2-3, 11.
* **Stakeholders & Interests:**
  * *Assigned staff:* set up the service and follow up review tasks.
  * *Customer:* pay the approved price for the agreed service dates.
  * *Administrator:* validate annual revenue and exceptional commercial terms.
* **Preconditions:** The actor is authenticated and authorised for the customer; a rate table exists. Activation requires complete invoicing tax data. Annual rate activation requires Administrator approval authority.
* **Postconditions:** Approved terms, dates and review evidence are retained. Billing follows their effective dates; prior invoices and old debt remain intact.
* **Success Guarantee:** The subscription or approved future rate is stored with a traceable effective date and appropriate billing schedule.
* **Minimal Guarantee:** Unapproved terms are not billed, unavailable revenue is not invented and a pause never settles old debt.
* **Trigger:** Staff request a subscription operation or Time makes an annual review due.
* **Main Success Scenario:**
1. The user selects the customer, service, start date, rate, recurring concepts and agreed payment terms.
2. The system validates tax data and previews the documented proration calculation and first regular billing date.
3. The user reviews the proposal; required commercial exceptions go to UC-23 before activation.
4. After authorised confirmation, the system stores effective terms and schedules monthly billing.
5. For an eligible mid-month start, the system invokes UC-08 with the approved initial prorated proposal; normal recurrence begins on the following first day.

* **Extensions:**
  * **2a.** Future start or approved no-proration option: record it explicitly; create no premature invoice or reminder. A first-day start must not generate an overlapping extra proration invoice.
  * **1a.** Pause/reactivate: record reason and dates; suppress the affected future monthly invoices, retain old debt and notify the responsible person when review/reactivation is due.
  * **3a.** Discount, free period or extra service: UC-23 decides the exact proposal under configured thresholds; apply approved effective dates and expire time-limited discounts automatically.
  * **1b.** Annual review: Time lists due reviews. An authorised Administrator records annual revenue, source and date; the system proposes the band. Obtain the required UC-23 decision, retain old/new values and activate only from the approved date.
  * **1c.** Annual evidence missing or proposal rejected: retain the pending review or rejection and existing rate; corrections remain traced, with no automatic retroactive charge.
  * **5a.** Issuance or delivery fails: preserve the subscription and invoice stages separately and retry without duplicating the charge.

## UC-08

* **ID / Code:** UC-08
* **Use Case Name:** Prepare, issue and deliver an invoice
* **Description:** Validate an invoice proposal, issue its unique numbered PDF and request delivery, keeping draft, issuance and communication states distinct.
* **Primary Actor:** Operational User
* **Other Initiating Contexts:** UC-06, UC-10 and UC-21 supply authorised proposals; included callers execute the same validation, issuance and dispatch contract without demanding a new staff session.
* **Supporting Actors:** Communication Service
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-04, BR-06; UR: UR-03, UR-04; FR: FR2, FR2.3, FR2.5, FR14.2, FR2.4, FR2.6, FR14, FR2.7, FR13.1, FR2.9, FR2.10, FR2.11, FR11.2, FR14.5; NFR-01, NFR-02, NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 3-5, 16.; E pp. 3-5, 8-9, 14.; E pp. 5, 12, 15.
* **Stakeholders & Interests:**
  * *Customer and billing recipients:* receive a correct invoice through an eligible channel.
  * *Assigned staff:* prepare invoices and resolve delivery failures.
  * *Turbine finance staff:* preserve numbering, issued amounts and dispatch evidence.
* **Preconditions:** Direct initiation requires authentication, invoice-creation/issuance authority and customer scope. Included calls from UC-06, UC-10 or UC-21 supply an authorised subscription or correction proposal. Applicable series, taxes and templates are configured.
* **Postconditions:** A draft remains unissued until confirmation. Successful issuance stores one number, snapshot and original PDF; each dispatch records recipients, channel, template version and observed outcome.
* **Success Guarantee:** One valid proposal becomes an issued invoice with preserved PDF and a recorded delivery attempt or recoverable dispatch request.
* **Minimal Guarantee:** Drafts consume no definitive number. A failure after durable issuance retains the same identity; retries never duplicate the invoice or invent delivery/read evidence.
* **Trigger:** Staff prepare a one-off invoice, an authorised workflow supplies a billable proposal, or staff request a delivery retry.
* **Main Success Scenario:**
1. The user enters customer, lines, quantities, prices, discounts, taxes and terms, using available defaults/catalogue; an included workflow supplies its approved proposal instead.
2. The system validates mandatory tax data, decimal totals, currency, current version, approvals and period rules, and presents the preview or verifies the approved automated proposal.
3. The authorised user confirms issuance; an automated caller proceeds only under the approved subscription/correction authority. Sensitive changes invoke UC-23.
4. The system allocates one sequential series number, stores immutable issued data and generates/preserves the corporate PDF with tax, total, dates and support/payment details.
5. The system requests delivery through Communication Service to eligible billing recipients and records the attempt/result; staff can view or download the same preserved PDF.

* **Extensions:**
  * **2a.** Missing/invalid data or unusual amount: show errors or the configured warning. Block invalid issuance; preserve a recoverable draft with conflict detection. Catalogue/template changes never rewrite issued invoices.
  * **3a.** Pending/rejected approval or locked period: retain the proposal without issuing or sending it; financial changes to an issued original use UC-21.
  * **4a.** Repeated/concurrent request: return the recorded invoice/in-progress result; never allocate a second invoice for the same operation.
  * **4b.** PDF generation fails after issuance: retain the number and snapshot and retry that document; do not label it generated.
  * **5a.** Delivery-only retry: use the existing PDF/number and recheck scope and corrected recipients; record an intentional resend as another attempt. A queued attempt is not a delivery/read confirmation.
  * **5b.** Missing contact, bounce or provider failure: keep the invoice issued, record the failed/undelivered state, notify its responsible staff and allow UC-22 follow-up.
  * **5c.** Email is the default. Complementary WhatsApp requires a valid number and consent; use the contact’s language and versioned template. Providers may be simulated.

## UC-10

* **ID / Code:** UC-10
* **Use Case Name:** Generate monthly recurring invoices
* **Description:** Process eligible monthly subscriptions and recover interrupted billing runs without repeating a subscription-period charge.
* **Primary Actor:** Time
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** Summary
* **Related requirements:** BR-02, BR-03, BR-06; UR: UR-03, UR-10; FR: FR2.1, FR9.2, FR14, FR11.2, FR14.3, FR14.4; NFR-03, NFR-05, NFR-06.
* **Source:** E pp. 4, 9, 14, 17.
* **Stakeholders & Interests:**
  * *Turbine:* complete scheduled billing after failures.
  * *Customer:* avoid duplicate or ineligible charges.
  * *Assigned staff:* receive actionable item failures.
* **Preconditions:** An authorised billing schedule, subscriptions and effective terms exist.
* **Postconditions:** The run records generated, skipped and failed items. Each successful eligible subscription-period refers to its single invoice and failures retain a recoverable stage.
* **Success Guarantee:** Eligible independent items are processed once and the execution exposes its actual completion/error status.
* **Minimal Guarantee:** One failed item does not duplicate successful invoices or block independent subscriptions.
* **Trigger:** The first-day schedule fires or a missed/interrupted run resumes.
* **Main Success Scenario:**
1. The system creates or resumes the billing-period execution record.
2. It selects subscriptions eligible under start, pause, cancellation, rate and discount effective dates.
3. For each unprocessed subscription-period, it invokes UC-08 with the approved proposal and automated authority.
4. It records item outcomes, notifies staff of actionable failures and stores run totals/status.

* **Extensions:**
  * **2a.** Paused, future or effectively cancelled subscription: skip generation and retain previous debt.
  * **3a.** Duplicate/concurrent run: reuse the stored subscription-period outcome instead of issuing again.
  * **3b.** Item-level validation/PDF/delivery failure: record the failed stage, continue independent items and resume only the missing work.
  * **1a.** Outage: find missed periods/items on recovery; execution does not depend on an open staff browser.

## UC-12

* **ID / Code:** UC-12
* **Use Case Name:** Reconcile payments with invoices
* **Description:** Match verified provider transactions to invoices and preserve discrepancies or authorised reversals as auditable evidence.
* **Primary Actor:** Operational User
* **Other Initiating Contexts:** Time starts authorised queries; validated Payment Provider notifications supply transaction evidence.
* **Supporting Actors:** Payment Provider
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-04, BR-05, BR-06; UR: UR-06; FR: FR3, FR3.1, FR3.6, FR3.7, FR14.5; NFR-04, NFR-05, NFR-06.
* **Source:** E p. 6.
* **Stakeholders & Interests:**
  * *Assigned staff:* resolve uncertain matches.
  * *Customer:* have funds allocated correctly.
  * *Turbine finance staff:* explain balances from provider evidence.
* **Preconditions:** The provider connection is configured. Manual actions require reconciliation authority and customer scope; scheduled queries use authorised integration context and inbound notifications are validated.
* **Postconditions:** Verified transactions are allocated once, balances and internal alerts reflect the result, and unmatched/partial/excess amounts remain available for review.
* **Success Guarantee:** A clear match is reconciled or a discrepancy is explicitly retained; paid status requires verified allocations settling the balance.
* **Minimal Guarantee:** Invalid events and provider errors never create payments; original evidence and reversal history remain available.
* **Trigger:** Staff review a transaction, Time starts a query, or Payment Provider supplies a validated event.
* **Main Success Scenario:**
1. The system records the transaction identity, successful/settled status, amount, currency, date and reference.
2. It checks event and transaction identity for prior processing.
3. It matches reference, amount and currency to eligible invoices; amount alone cannot choose between candidates.
4. It applies a clear allocation once, recalculates the balance and records evidence and notification to the responsible staff member.

* **Extensions:**
  * **1a.** Provider unavailable or invalid event: record/reject the failure without marking any invoice paid.
  * **2a.** Duplicate event or another event for the same transaction: return the prior result without allocating again.
  * **3a.** Missing reference, ambiguous candidate or currency mismatch: keep pending for authorised manual review; UC-22 can track the issue.
  * **3b.** Under/overpayment: retain the received amount and difference; an underpayment does not settle the invoice and excess is not discarded.
  * **4a.** Manual allocation/reversal: recheck scope, require a reason and preserve original evidence while recalculating balances.

## UC-13

* **ID / Code:** UC-13
* **Use Case Name:** Run reminders and overdue follow-up
* **Description:** Send eligible invoice reminders using stored terms and current balances, suspending follow-up when authorised.
* **Primary Actor:** Time
* **Supporting Actors:** Communication Service
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** Summary
* **Related requirements:** BR-02, BR-04; UR: UR-05; FR: FR3.2, FR3.3, FR3.4, FR13; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 5-6, 9, 13, 15.
* **Stakeholders & Interests:**
  * *Assigned staff:* know when invoices become overdue.
  * *Billing contacts:* receive relevant reminders and support details.
  * *Turbine:* follow up debt consistently.
* **Preconditions:** An issued invoice has an outstanding balance and stored terms; templates, channels and schedule are configured.
* **Postconditions:** Dispatch results and next occurrences are stored; overdue changes notify the responsible staff. Settled or validly suspended balances receive no ineligible reminder.
* **Success Guarantee:** Each eligible occurrence produces a tracked attempt without duplicate dispatch.
* **Minimal Guarantee:** Failed delivery is not recorded as success; a reminder never cancels service or silently settles debt.
* **Trigger:** An invoice reminder or overdue occurrence becomes due.
* **Main Success Scenario:**
1. The system selects due occurrences using issue/due dates and customer terms, which override the default five-day period.
2. It rechecks balance, follow-up suspension, recipients and channel consent.
3. It prepares the day-three, due-date or overdue message, including amount, due date and support phone/email.
4. Communication Service processes the attempt; the system records its observed result, next occurrence and any overdue alert.

* **Extensions:**
  * **1a.** Weekend/holiday: move only communication to the next working day under FR3.2.6; retain the legal due date. Use the documented counting/collision policy.
  * **2a.** Settled balance or valid dispute pause: suppress dispatch; keep unpaid debt and review task where applicable.
  * **4a.** Provider failure or duplicate job: record a retryable failure or reuse the occurrence result; do not send the same occurrence twice.
  * **1b.** Customer-specific terms, e.g. thirty days: do not declare overdue on default day five; overdue spacing is the configured two/three-day policy.

## UC-14

* **ID / Code:** UC-14
* **Use Case Name:** Review daily work and notifications
* **Description:** Find scoped tasks and notifications, search operational records and open the workflow needed to act.
* **Primary Actor:** Operational User
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-02, BR-04; UR: UR-10; FR: FR7, FR7.1, FR7.2, FR8.2, FR8.3; NFR-02, NFR-03, NFR-04, NFR-05.
* **Source:** E pp. 6-8.
* **Stakeholders & Interests:**
  * *Assigned staff:* prioritise actionable work.
  * *Administrator:* review the permitted wider queue.
  * *Customer:* avoid debt being treated as resolved merely because an alert was read.
* **Preconditions:** The user is authenticated; tasks, search results and notifications are restricted to current scope.
* **Postconditions:** Read/handled notification states are stored independently of actual payment or issue resolution; opening records rechecks access.
* **Success Guarantee:** The user locates authorised work and can follow it to the relevant operational case.
* **Minimal Guarantee:** Reading an alert neither settles debt nor grants access to an out-of-scope record.
* **Trigger:** Login opens the work screen or the user searches/reviews a notification.
* **Main Success Scenario:**
1. The system lists due/overdue invoices, payments to reconcile, dispatch failures, approvals, annual reviews and assigned tasks.
2. The user filters/searches by permitted customer/contact/invoice fields and can save views or use favourites/recent records.
3. The user opens an item; the system rechecks access and links to the relevant case.
4. The system records read/handled state separately from the underlying operational result.

* **Extensions:**
  * **3a.** Assignment changed or access revoked: deny target details and refresh the list.
  * **4a.** Only an overdue alert was read: retain the debt and unresolved status.
  * **1a.** Administrator global operational view: enforce its permission; an Operational User receives no global financial dashboard.
  * **1b.** Notification preferences: retain in-app events; permit configured daily summary versus immediate non-critical email. Notify the responsible user of payments, due/overdue status, follow-ups, issues, reactivation and review tasks under FR7–FR7.2.

## UC-15

* **ID / Code:** UC-15
* **Use Case Name:** Record subscription cancellation
* **Description:** Confirm the effective cancellation date, stop future recurrence and keep existing obligations in collection.
* **Primary Actor:** Administrator
* **Other Initiating Contexts:** External Application can submit intake only; Administrator confirms cancellation.
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-02; UR: UR-02; FR: FR4, FR4.1, FR15, FR4.3, FR4.4, FR15.1, FR15.2; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 4, 11-12, 14, 17.
* **Stakeholders & Interests:**
  * *Customer:* end the commercial relationship without debt disappearing.
  * *Administrator:* confirm billing consequences.
  * *Assigned staff:* continue prior-debt follow-up.
  * *External Application:* submit controlled intake requests.
* **Preconditions:** The customer/subscription exists. Internal confirmation requires cancellation authority; external intake requires API authentication/scope and cannot itself confirm cancellation.
* **Postconditions:** Confirmation records the effective date and stops applicable future recurring billing. Previous invoices remain collectible; unconfirmed API intake remains pending.
* **Success Guarantee:** Cancellation and old debt are represented separately, following C4 and FR4/FR4.1.
* **Minimal Guarantee:** Intake alone deletes no subscription, erases no debt and creates no paid status.
* **Trigger:** An Administrator records a cancellation or External Application submits intake.
* **Main Success Scenario:**
1. The actor supplies customer/subscription, reason and effective date; the system validates scope and records the request.
2. The system invokes UC-16 in the authorised internal context and shows current obligations and billing effects.
3. An authorised Administrator confirms the effective date.
4. The system stops applicable recurrence, retains old invoices/collection tasks and records the outcome.

* **Extensions:**
  * **2a.** Outstanding invoices exist: show them and continue collection; they do not block commercial cancellation under current C4 interpretation.
  * **3a.** Invalid date or unconfirmed request: retain a rejected/pending result without applying cancellation.
  * **1a.** Unknown/unauthorised identifier: expose no protected debt data and change no billing state.
  * **4a.** Overlapping billing run: enforce the effective date consistently and avoid inappropriate future issuance; the C4 next-client-review caveat remains.

## UC-16

* **ID / Code:** UC-16
* **Use Case Name:** Query outstanding obligations through the API
* **Description:** Return an authorised, time-stamped customer debt snapshot without mutating billing or cancellation state.
* **Primary Actor:** External Application
* **Other Initiating Contexts:** UC-15 invokes debt calculation using its authorised internal context, without external API credentials.
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-02; UR: UR-02; FR: FR4.2, FR15, FR15.1, FR15.2; NFR-03, NFR-04, NFR-05, NFR-07.
* **Source:** E pp. 4, 11-12.
* **Stakeholders & Interests:**
  * *External Application:* distinguish valid debt results from errors.
  * *Turbine:* limit disclosure to scoped callers.
  * *Customer:* have obligations calculated from financial evidence.
* **Preconditions:** External calls require provisioned API credentials and debt-query scope; the UC-15 internal include uses its already-authorised workflow/customer context.
* **Postconditions:** A successful response provides permitted debt details, currency and snapshot time; rejected/unavailable queries leave all business state unchanged.
* **Success Guarantee:** The caller receives a documented, scoped debt snapshot.
* **Minimal Guarantee:** An error is never reported as debt-free, and a query cannot cancel recurrence.
* **Trigger:** An External Application requests debt status or UC-15 invokes its internal calculation.
* **Main Success Scenario:**
1. The caller supplies the customer identifier and API credentials, or UC-15 supplies authorised internal context.
2. The system verifies scope and applicable limits without exposing inaccessible records.
3. It calculates obligations from issued invoices, verified payments and corrective documents, keeping currencies distinct.
4. It returns permitted indicators/details and snapshot time and records the important call.

* **Extensions:**
  * **2a.** Invalid credentials, insufficient scope or inaccessible customer: return the documented non-disclosing error.
  * **3a.** Calculation unavailable: return an explicit error, never a zero-debt substitute.
  * **4a.** Later state change: cancellation rechecks current data; a snapshot is not permanent cancellation authority.
  * **1a.** Other FR15 customer/invoice queries or controlled intake: apply their documented field/scope contract and the same interface rules; only UC-15 confirms cancellation.

## UC-17

* **ID / Code:** UC-17
* **Use Case Name:** Consult financial dashboard and reports
* **Description:** Inspect explainable financial indicators, export authorised reports and prepare accounting packages.
* **Primary Actor:** Administrator
* **Other Initiating Contexts:** Time can execute a previously authorised report schedule for authorised recipients.
* **Supporting Actors:** Communication Service (scheduled internal summaries)
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-05, BR-06; UR: UR-09, UR-11; FR: FR8, FR8.1, FR8.3, FR8.4, FR8.5, FR8.6, FR8.7, FR8.8; NFR-02, NFR-03, NFR-04, NFR-05.
* **Source:** E pp. 7, 11, 14-15.
* **Stakeholders & Interests:**
  * *Administrator:* trace totals to invoices and allocations.
  * *Turbine management:* review financial performance.
  * *Accounting firm:* receive versioned accounting packages without an application account.
* **Preconditions:** The actor is authenticated with Administrator authority and explicit financial-report permission.
* **Postconditions:** Indicators/exports retain filters and generation time; accounting packages retain period/version. Downloads enforce scope and currency distinctions.
* **Success Guarantee:** Selected totals can be drilled down and exported reproducibly for the permitted period and scope.
* **Minimal Guarantee:** An incomplete report is not labelled complete and unrelated currencies are not silently summed.
* **Trigger:** The Administrator selects the dashboard, a report or an accounting package.
* **Main Success Scenario:**
1. The Administrator selects weekly/monthly/quarterly/annual period and customer, manager, country, sector, status, type or currency filters.
2. The system calculates invoiced, collected, outstanding, overdue, collection-time and recurring-revenue/forecast indicators.
3. The Administrator opens contributing records, then optionally exports CSV/PDF or a monthly/quarterly accounting package of invoices, corrections, collections and PDFs.
4. The system records filters, actor, time and package version; heavy operations expose background status and downloads recheck permission.

* **Extensions:**
  * **1a.** Insufficient financial permission: deny the dashboard, including a technical Super Administrator account without that capability.
  * **2a.** Multiple currencies: separate totals unless a conversion policy is approved. Budget targets remain deferred under the current Out of Scope list despite broader BR-05/UR-11 wording.
  * **4a.** Failed/long report: preserve job/result status and configurable export retention; do not present a partial file as complete.
  * **1b.** Scheduled summary: an authorised Administrator configures weekly/monthly generation for authorised recipients only.

## UC-18

* **ID / Code:** UC-18
* **Use Case Name:** Configure billing and automation policies
* **Description:** Validate and version global rates, numbering, billing, communication and approval settings for future operations.
* **Primary Actor:** Super Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-03, BR-04; UR: UR-13; FR: FR5.1, FR6.2, FR13, FR13.1, FR13.3; NFR-04, NFR-05, NFR-06, NFR-07.
* **Source:** E pp. 2-5, 9-10, 12.
* **Stakeholders & Interests:**
  * *Super Administrator:* control global policy changes.
  * *Operational staff:* use consistent templates and rates.
  * *Customer:* retain the terms on already-issued documents.
* **Preconditions:** The actor is authenticated as Super Administrator with the relevant configuration capability.
* **Postconditions:** A confirmed version records its effective scope/date, reason and actor. Issued invoice data and original documents remain unchanged.
* **Success Guarantee:** Validated configuration becomes available to eligible future operations without source-code changes.
* **Minimal Guarantee:** Invalid settings are not activated and historical invoices are never rewritten.
* **Trigger:** The Super Administrator requests a global configuration change.
* **Main Success Scenario:**
1. The actor selects payment/reminder periods, domains, issuer identity, series, rates, currencies, taxes, templates, channels, calendar or approval policy.
2. The system shows current values and previews the proposed effects.
3. The actor validates templates in Spanish/English, missing variables, a self-addressed test and the reminder schedule where applicable.
4. After validation and confirmation, the system stores an audited effective configuration version.

* **Extensions:**
  * **3a.** Invalid interval, template variable, numbering rule or unsafe combination: reject activation with the reason.
  * **4a.** Existing issued invoice: retain its original terms, amounts, identity and PDF.
  * **1a.** Insufficient configuration permission: reject the action on the server.
  * **2a.** A rule such as proration, date counting or rounding lacks an approved convention: document and obtain that policy before activation; do not invent a client decision.

## UC-20

* **ID / Code:** UC-20
* **Use Case Name:** Supervise audit, backups and recovery
* **Description:** Inspect integrity evidence and automation health, and create or restore backups through explicit operation-specific branches.
* **Primary Actor:** Super Administrator
* **Other Initiating Contexts:** Time creates scheduled backups only; restoration always requires Super Administrator confirmation.
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** Summary
* **Related requirements:** BR-01, BR-04, BR-06; UR: UR-14; FR: FR9.1, FR9.2, FR9; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 8-9, 12.
* **Stakeholders & Interests:**
  * *Super Administrator:* diagnose failures and recover a validated state.
  * *Turbine:* retain intact financial history and usable backups.
  * *Customer:* retain documents and scoped access after recovery.
* **Preconditions:** The actor has Super Administrator audit/recovery authority. Time may create only the configured scheduled backup; restore additionally requires a valid backup, approved target and explicit human confirmation.
* **Postconditions:** Audit consultation changes no historical evidence. Backup attempts have recorded scope/outcome; restoration releases operations only after data/document/permission checks pass.
* **Success Guarantee:** The selected inspection, backup or recovery operation has a traceable result and failed stages remain visible.
* **Minimal Guarantee:** Audit history cannot be edited/deleted; failed recovery is not declared complete or allowed to resume normal billing.
* **Trigger:** The Super Administrator opens supervision/recovery or Time starts a backup.
* **Main Success Scenario:**
1. The Super Administrator selects audit/health inspection, backup creation or recovery.
2. For inspection, the system shows permitted actions and executions with actor/process, target, time and outcome; the actor filters or opens an event.
3. The system shows last generation, pending dispatches, integration failures and last successful backup, with an actionable issue code and actual status.

* **Extensions:**
  * **1a.** Backup creation: the Super Administrator requests a manual backup or Time fires the schedule; create data-and-document backup and record scope/time/outcome. Apply the at-least-24-hour NFR-05 target.
  * **1b.** Restore: select a valid backup and approved target, show scope, obtain Super Administrator confirmation and restrict conflicting operations. Restore and validate invoice/PDF links, balances and permissions; record duration/outcome before resuming idempotent jobs. The recovery target is NFR-05’s four hours, not a measured achievement.
  * **2a.** Non-Super Administrator requests protected global audit/backup data or tries audit mutation: reject; ordinary customer timelines remain separately scoped.
  * **1c.** Backup fails or is invalid: retain the last valid backup, record the failure and notify the responsible operator.
  * **1d.** Restore validation fails: leave recovery incomplete, identify the failed stage and keep normal billing blocked.
  * **3a.** An automated item failed: show that item and stage without misrepresenting the whole process as successful.

## UC-21

* **ID / Code:** UC-21
* **Use Case Name:** Correct an issued invoice
* **Description:** Issue an approved corrective document linked to the preserved original invoice and explain the resulting balance.
* **Primary Actor:** Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-04, BR-06; UR: UR-03; FR: FR2.3, FR2.8; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 3-4, 11, 14.
* **Stakeholders & Interests:**
  * *Administrator:* correct errors with authority and a reason.
  * *Customer:* receive an accurate adjustment.
  * *Accounting firm:* trace original and corrective documents without logging in.
* **Preconditions:** An issued original exists; the actor has correction authority and satisfies approval and closed-period rules.
* **Postconditions:** The issued correction is linked to the untouched original; balances reflect both documents and verified allocations.
* **Success Guarantee:** The authorised correction is issued with a preserved original link and auditable financial effect.
* **Minimal Guarantee:** Blocked/rejected corrections issue no document and never invent a refund/payment.
* **Trigger:** The Administrator selects an original invoice for correction.
* **Main Success Scenario:**
1. The Administrator enters the reason and proposed corrected data/amount.
2. The system previews the relationship and balance impact.
3. It checks period rules and any UC-23 approval for the exact proposal.
4. The system invokes UC-08 with the approved corrective proposal, appropriate series and original link, then records the updated financial view.

* **Extensions:**
  * **1a.** Unissued draft: use UC-08 draft editing instead of a corrective document.
  * **3a.** Rejected approval or locked period without exception authority: retain the blocked proposal and reason.
  * **4a.** Issuance/delivery failure follows UC-08 recovery rules. Any cash refund is a separate authorised workflow, not created by the corrective document.

## UC-22

* **ID / Code:** UC-22
* **Use Case Name:** Resolve a billing or delivery issue
* **Description:** Track a customer issue to resolution, including internal evidence and a separately authorised follow-up suspension.
* **Primary Actor:** Operational User
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-02, BR-04, BR-06; UR: UR-05; FR: FR3.4, FR12, FR12.1, FR12.2, FR12.3; NFR-02, NFR-04, NFR-05.
* **Source:** E pp. 5-6, 10-11, 15.
* **Stakeholders & Interests:**
  * *Assigned staff:* coordinate the issue owner and corrective action.
  * *Customer:* have billing problems followed up.
  * *Administrator:* control restricted notes and financial exceptions.
* **Preconditions:** The actor is authenticated with issue-management permission and access to the customer/invoice.
* **Postconditions:** The issue retains owner, status, history and resolution; any reminder pause has its own reason/review date and does not erase debt.
* **Success Guarantee:** A tracked issue has an operational resolution or remains explicitly pending with an owner.
* **Minimal Guarantee:** Internal comments are not sent to customers and issue closure alone changes no invoice amount or paid status.
* **Trigger:** Staff report a problem or invoice delivery/payment matching creates an exception.
* **Main Success Scenario:**
1. The user records customer, optional invoice, issue type, description, priority and owner.
2. The system stores the issue and notifies the owner or mentioned users.
3. The user adds internal findings/comments and permitted attachments; administrative notes remain restricted.
4. If authorised, the user records a justified reminder pause and review date.
5. After the actual corrective action, the user records resolution and the system reviews any pause.

* **Extensions:**
  * **3a.** Disallowed/oversize attachment or expired download link: reject; access follows the linked customer/invoice scope.
  * **4a.** No pause permission: deny suspension; opening an issue alone does not stop follow-up.
  * **5a.** Pause review due before resolution: notify the owner and apply the documented resumption policy.
  * **5b.** Financial action needed: use UC-12 reconciliation or UC-21 correction with their own authority; do not mark an invoice paid merely to close the issue.

## UC-23

* **ID / Code:** UC-23
* **Use Case Name:** Decide a sensitive financial approval
* **Description:** Approve or reject the exact financial proposal under authority thresholds, substitution and separation-of-duties rules.
* **Primary Actor:** Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-03, BR-04, BR-06; UR: UR-06, UR-07; FR: FR3.5, FR11, FR11.1, FR11.3; NFR-02, NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 3, 11, 14.
* **Stakeholders & Interests:**
  * *Requester:* receive a decision on the submitted values.
  * *Administrator:* control financial exposure.
  * *Customer:* be charged only under approved exceptions.
* **Preconditions:** A current proposal identifies operation, values, reason and requester; the actor has its threshold authority. Higher thresholds require Super Administrator authority and any separation-of-duties rule still applies.
* **Postconditions:** The decision and exact proposal version are retained; only the approved current proposal can continue.
* **Success Guarantee:** Approval/rejection is recorded with actor/time/reason and routed to the originating workflow.
* **Minimal Guarantee:** A stale or rejected decision cannot activate changed terms or bypass a required second person.
* **Trigger:** An eligible approver opens a pending request.
* **Main Success Scenario:**
1. The system lists requests the approver may decide.
2. The approver reviews customer, proposed price/discount/terms/correction or debt write-off and its impact.
3. The system rechecks authority, separation of duties and current proposal version.
4. The approver decides with a comment; the system records the decision and notifies the requester.

* **Extensions:**
  * **3a.** Forbidden self-approval, changed values or a prior decision: reject the stale/unauthorised action and request eligible review.
  * **1a.** Approver absent: an authorised Administrator reassigns/substitutes while preserving authority and reassignment history.
  * **4a.** Rejection: retain the prior terms and block the proposed financial action.
  * **4b.** Approved uncollectible debt: record a reasoned, audited uncollectible state distinct from paid; preserve financial evidence and the applicable collection decision.

## UC-24

* **ID / Code:** UC-24
* **Use Case Name:** Close or reopen an administrative period
* **Description:** Close a reviewed month/quarter or exceptionally reopen it with higher authority and an audited reason.
* **Primary Actor:** Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-04, BR-06; UR: UR-09; FR: FR13.2; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 3, 14.
* **Stakeholders & Interests:**
  * *Administrator:* control post-review changes.
  * *Accounting firm:* receive a stable accounting period.
  * *Turbine finance staff:* retain traceable corrections and period history.
* **Preconditions:** The actor has period-closing authority and the period exists; reopening additionally requires higher capability and a reason.
* **Postconditions:** The confirmed period state and close/reopen event are stored and enforced on later operations; rejected requests leave the former state.
* **Success Guarantee:** The authorised state transition is audited and subsequent financial checks enforce it.
* **Minimal Guarantee:** Closing/reopening neither erases debt nor permits silent rewriting of issued invoices.
* **Trigger:** An Administrator requests closure or exceptional reopening.
* **Main Success Scenario:**
1. The Administrator selects the period and reviews records and unresolved exceptions.
2. The system previews the restrictions and checks for blocking changes.
3. The authorised actor confirms; the system records period, actor, time and reason and enforces the new state.

* **Extensions:**
  * **1a.** Reopen: require higher capability and a reason before changing the state; retain the earlier closure event.
  * **2a.** Blocking exception or concurrent financial mutation: reject and show the conflict.
  * **3a.** Invoice correction remains subject to UC-21; reopening is not permission to overwrite an original.

## 4. Relationships and coverage

The four views of [use-case-diagram.pu](use-case-diagram.pu) show exactly these 18 IDs. UC-10 and UC-21 include UC-08; their caller supplies the appropriate approved recurring or corrective proposal. UC-15 includes UC-16's debt calculation. UC-08 extends UC-06 only when an initial prorated invoice is due. UC-23 extends UC-06, UC-08 or UC-21 only when the applicable rate, commercial or correction decision requires approval. UC-22 extends UC-08 or UC-12 for delivery or reconciliation problems; it does not run after every successful invoice/payment.

The grouped cases retain their distinct branch permissions and outcomes; grouping is a presentation change, not a grant of new capabilities. All 59 original FR remain covered; the current 85 parent requirements and all 112 explicitly defined descendant rules (197 FR IDs) are covered. Each listed parent FR includes its defined sub-requirements; the coordination note records the complete parent mapping. The diagram's historical C9 label refers to FR3.2.6, which now defines the working-calendar rule directly. BR links use the six current BR, without renumbering requirements. Broader UR goals for controlled merging, cost centres, budget targets or refunds do not override the existing scope exclusions or create unsupported cash flows.

Compile only the four named Submission 1 deliverables. Historical review/consolidation notes remain in `notes/`; they are not additional PDFs. These contracts define expected behaviour and make no claim of implementation or executed application tests.
