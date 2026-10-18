# Use Case Specifications

> Submission 1 behavioural contracts, revised on 2026-10-18 against `main` at `a052e3c099825989e02a57d0dd3a30b1fe0e70aa`. Covers the 24 use cases in the four PlantUML views and preserves the current requirement mappings.

## 1. Scope and source convention

The system is Turbine’s independent internal invoicing and collections application. Customers and their contacts receive communications but never log into it. Brain or another external application can call a restricted API; it is outside the system boundary. Payment and communication services are external supporting actors and may be simulated.

`E p. n` refers to the PDF page number of *TurbineH - Transcripción de reunión extendida en inglés.pdf*, the 18-page extended client transcript supplied for the project. The current [requirements](requirements.md), including interpretations C1–C12 and the consolidated scope exclusions, define this behavioural baseline. In particular, C4 separates cancellation from debt collection, C9 moves communication dates without moving the legal due date, and C11 excludes marketing use of retained billing data. The client-review caveats recorded there remain in force; this document does not assert a later client approval.

The field order follows the repository’s Cockburn-style template. Each use case lists the BR, UR, FR and NFR it traces to, using the IDs in [requirements.md](requirements.md).

## 2. Actors and common rules

| Actor | Role in the specifications and diagram |
| --- | --- |
| Operational User | Reader / Assigned Staff in the diagram. Performs permitted operations on assigned or validly delegated customers; cannot self-assign, change global configuration or access the global financial dashboard. |
| Administrator | Specialises Operational User in the diagram; manages assignments, imports, reviews, financial reporting, cancellation confirmation, corrections, approvals and period closing within the applicable authority. |
| Super Administrator | Specialises Administrator in the diagram; manages global configuration, accounts, protected audit and recovery. Each action still requires its explicit capability under FR6.2. |
| Time | Timer actor used by the diagram for recurring billing, reminders, scheduled payment checks, annual-review activation and backups. It initiates authorised automation, not an interactive staff session. |
| External Application | Scoped API caller for debt queries or cancellation-request intake; never a customer interactive account. |
| Payment Provider | Supporting service supplying simulated payment-query results and validated transaction notifications; it is not a payment gateway operated by Turbine. |
| Communication Service | Supporting service for email and consented complementary WhatsApp, including password recovery and account activation; providers may be simulated. |

Each **Primary Actor** names one diagram role. An **Alternative Initiator**, where present, describes another path already associated in the diagram; it does not grant extra permissions. Included subfunctions UC-09 and UC-11 inherit their caller's authorised execution context rather than requiring a new staff session. Permission, scope and approval checks belong to the preconditions and extensions.

- **R-01 Authorization:** every protected action, including direct downloads and API requests, rechecks role and customer scope. Authentication is a precondition of internal user goals, not an automatic `include` edge from every use case to login.
- **R-02 Financial consistency:** issued snapshots and original PDFs are preserved; corrections, payments, and collection status have distinct evidence. Read-only invoice consultation never changes amounts.
- **R-03 Reliable automation:** the same logical issuance, billing-period item, payment transaction, or reminder occurrence cannot be applied twice. Failures have explicit outcomes and recoverable stages.
- **R-04 Historical and privacy controls:** operational deactivation is logical and preserves outstanding obligations. Retention/deletion follows an approved, category-specific policy; the retention target and verification method are those specified in NFR-05. Retained billing data is not reused for marketing (C11).
- **R-05 Role specialisation and access:** the actor generalisations in the diagram apply: Super Administrator specialises Administrator, which specialises Operational User. A generalisation does not remove the explicit financial-report permission check in UC-17 or the protected-backup restriction in UC-20. The requirements do not establish whether every Super Administrator account must receive financial-report permission; that account-policy choice remains for team confirmation, and this specification grants no unconditional dashboard access on the strength of a technical configuration role.
- **R-06 Quantitative targets:** use the existing NFR definitions for testing. Their numerical targets are the team’s proposed acceptance conditions, not measurements already achieved by a running system.

## 3. Use case inventory

| ID | Use case | Functional requirements |
| --- | --- | --- |
| [UC-01](#uc-01) | Access the internal application | FR6.1, FR6.2 |
| [UC-02](#uc-02) | Maintain customer and contact records | FR1, FR1.1, FR1.2, FR1.3, FR1.6 |
| [UC-03](#uc-03) | Import customers from CSV | FR1, FR1.4 |
| [UC-04](#uc-04) | Manage internal user accounts | FR6.2, FR6.3 |
| [UC-05](#uc-05) | Assign and delegate customers | FR1.5, FR6.4, FR14.1 |
| [UC-06](#uc-06) | Manage a monthly subscription | FR2.2, FR5.2, FR10, FR10.1, FR10.2 |
| [UC-07](#uc-07) | Review the annual revenue band and rate | FR5, FR5.1 |
| [UC-08](#uc-08) | Prepare a one-off invoice | FR2, FR2.3, FR2.5, FR14.2 |
| [UC-09](#uc-09) | Issue an invoice | FR2, FR2.3, FR2.4, FR2.5, FR2.6, FR14 |
| [UC-10](#uc-10) | Generate monthly recurring invoices | FR2.1, FR9.2, FR14 |
| [UC-11](#uc-11) | Deliver an issued invoice | FR2.7, FR13.1 |
| [UC-12](#uc-12) | Reconcile a payment with an invoice | FR3, FR3.1 |
| [UC-13](#uc-13) | Run invoice reminders and overdue follow-up | FR3.2, FR3.3, FR3.4, FR13 |
| [UC-14](#uc-14) | Review assigned work and internal notifications | FR7, FR7.1, FR7.2, FR8.2, FR8.3 |
| [UC-15](#uc-15) | Record a subscription cancellation | FR4, FR4.1, FR15 |
| [UC-16](#uc-16) | Query a customer’s outstanding obligations through the API | FR4.2, FR15 |
| [UC-17](#uc-17) | Consult the financial dashboard and export reports | FR8, FR8.1, FR8.3, FR8.4, FR8.5 |
| [UC-18](#uc-18) | Configure system-wide billing and automation policies | FR5.1, FR6.2, FR13, FR13.1 |
| [UC-19](#uc-19) | Inspect business audit and automation health | FR9.1, FR9.2 |
| [UC-20](#uc-20) | Create and restore a backup | FR9 |
| [UC-21](#uc-21) | Correct an issued invoice | FR2.3, FR2.8 |
| [UC-22](#uc-22) | Resolve a billing or delivery issue | FR3.4, FR12, FR12.1, FR12.2 |
| [UC-23](#uc-23) | Decide a sensitive financial approval | FR3.5, FR11, FR11.1 |
| [UC-24](#uc-24) | Close or reopen an administrative period | FR13.2 |

## 4. Behavioral specifications

## UC-01

* **ID / Code:** UC-01
* **Use Case Name:** Access the internal application
* **Description:** Authenticate an internal staff member using a corporate email and password and open their permitted work area.
* **Primary Actor:** Operational User
* **Supporting Actors:** Communication Service (password recovery email)
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01; UR: UR-27; FR: FR6.1, FR6.2; NFR-02, NFR-04.
* **Source:** E pp. 7-8, 12.
* **Stakeholders & Interests:**
  * *Internal staff:* access their work without exposing another employee’s customer data.
  * *Turbine security administrator:* restrict sessions to active corporate accounts and revoke obsolete access.
* **Preconditions:** An authorized internal account has been provisioned. Login itself requires no existing session.
* **Postconditions:** On success, an authenticated session carries the current role and customer scope. On rejection, no session is granted. Logout, expiry or deactivation invalidates further protected access.
* **Success Guarantee:** A session is created with the account’s current permissions and assigned-customer scope.
* **Minimal Guarantee:** No protected customer or financial information is disclosed; no unauthenticated session is granted.
* **Trigger:** The staff member opens the application and requests access.
* **Main Success Scenario:**
1. The staff member enters their corporate email and password.
2. The system validates the email against the configured, authorized corporate domain and verifies the credentials and active account.
3. The system creates a session and displays the work area allowed by the account’s permissions.

* **Extensions:**
  * **2a.** Invalid credentials, unauthorized domain, or inactive account: reject access with a generic message; apply the failed-attempt protection policy.
  * **1a.** Forgotten password: issue a single-use, expiring recovery link through the approved email channel for an eligible account; do not reveal whether an account exists.
  * **3a.** The user logs out, their session expires through inactivity, or their account is deactivated: invalidate access; protected actions require authentication again.

## UC-02

* **ID / Code:** UC-02
* **Use Case Name:** Maintain customer and contact records
* **Description:** Create, consult, update or logically deactivate a customer and its billing contacts within the user’s customer scope.
* **Primary Actor:** Operational User
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-02, BR-03; UR: UR-01, UR-02, UR-04, UR-08; FR: FR1, FR1.1, FR1.2, FR1.3, FR1.6; NFR-01, NFR-02, NFR-03, NFR-04, NFR-05.
* **Source:** E pp. 2, 4, 7-8, 12, 14-15.
* **Stakeholders & Interests:**
  * *Assigned staff:* find and maintain accurate records for their own customers.
  * *Customer and billing contacts:* receive correct invoices at the intended addresses without historical data being rewritten.
  * *Administrator:* retain ownership and traceability when records change or become inactive.
* **Preconditions:** An authenticated user has the required customer-management permission; existing records must fall within their current assignments or administrative scope.
* **Postconditions:** Confirmed customer/contact changes and their actor/time are stored. Deactivated customers retain issued documents and outstanding debt; validation or version conflicts leave the prior committed record intact.
* **Success Guarantee:** The confirmed operation is stored, its history is recorded, and historical issued documents remain intact.
* **Minimal Guarantee:** Unauthorized records remain undisclosed; rejected changes do not alter committed data; deactivation never erases issued invoices or extinguishes debt.
* **Trigger:** The user requests customer registration or opens an existing customer.
* **Main Success Scenario:**
1. The user searches by person, trading/legal company name, tax identifier, or email, optionally filtering by location and sector; alternatively, they select New customer.
2. The system displays only authorized matches or a new form. The user enters company, tax, location, sector, and contact information, distinguishing billing recipients from other contacts.
3. The system validates required fields and formats and warns about possible duplicate tax identifiers.
4. The user reviews and confirms the data; the system saves the record and records the actor and time.
5. The system shows the customer’s authorized invoices, documents, and relevant business timeline.

* **Extensions:**
  * **3a.** Missing data: show field-level errors and preserve valid entries. Data sufficient for a commercial record may still be insufficient for invoice issuance.
  * **3b.** Possible duplicate: show the existing authorized record for review; do not merge companies automatically. Reactivation of a retained historical customer requires confirmation.
  * **2a.** Edit or logical deletion: validate permission and confirmation; deactivation retains historical invoices and debt. Warn before removing the only billing contact of an active customer.
  * **4a.** Concurrent update or lost assignment: recheck authorization and record version before saving; reject the stale or unauthorized write without overwriting another user’s changes.
  * **5a.** Download or export selected customer data: recheck scope, generate only authorized data, and audit sensitive exports. Temporary generated files follow their own retention policy.

## UC-03

* **ID / Code:** UC-03
* **Use Case Name:** Import customers from CSV
* **Description:** Preview a CSV file, validate its customer rows and import only the confirmed, permitted records with a row-level result report.
* **Primary Actor:** Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-02, BR-03; UR: UR-03; FR: FR1, FR1.4; NFR-01, NFR-03, NFR-04, NFR-05.
* **Source:** E p. 7.
* **Stakeholders & Interests:**
  * *Administrator:* onboard many customers without duplicate or accidental updates.
  * *Imported customers:* have accurate tax and contact data kept within the authorised scope.
  * *Assigned staff:* receive usable customer records and actionable import errors.
* **Preconditions:** The actor is authenticated as Administrator with import permission; the configured import policy is available. Every imported or updated record must fall within the actor’s authorised scope.
* **Postconditions:** The import report identifies committed, rejected and unprocessed rows. Only confirmed valid rows are applied; invalid or ambiguous rows cannot silently overwrite retained customer data.
* **Success Guarantee:** Confirmed valid rows are imported and an operation report identifies created, updated, and rejected rows with reasons.
* **Minimal Guarantee:** No unconfirmed import is applied; failed rows cannot silently corrupt existing customer data.
* **Trigger:** The user selects a CSV file for customer import.
* **Main Success Scenario:**
1. The user uploads the CSV and maps its columns to customer and contact fields.
2. The system validates rows, required fields, formats, duplicates, and permitted updates and displays a preview before writing customer records.
3. The user reviews the preview and confirms the valid rows under the approved import policy.
4. The system writes authorized rows, preserving the distinction between existing and new customers.
5. The system records the import operation and provides its result summary.

* **Extensions:**
  * **2a.** Invalid structure or ambiguous mapping: reject processing and identify the problem without importing customers.
  * **2b.** Invalid rows or duplicate tax identifiers: flag them; the user corrects the source or explicitly selects valid-only import if the agreed policy allows it. Do not silently overwrite or merge.
  * **4a.** A row fails during import: report its outcome and committed results precisely; retries must re-evaluate duplicates rather than blindly create another copy.

## UC-04

* **ID / Code:** UC-04
* **Use Case Name:** Manage internal user accounts
* **Description:** Provision, change or deactivate internal staff accounts while controlling role assignment and preserving historical attribution.
* **Primary Actor:** Super Administrator
* **Supporting Actors:** Communication Service (account activation email)
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-03; UR: UR-27; FR: FR6.2, FR6.3; NFR-04, NFR-05.
* **Source:** E pp. 7-8, 12.
* **Stakeholders & Interests:**
  * *Super Administrator:* control who can enter the internal application and administer roles.
  * *Internal staff:* receive appropriate access and clear activation instructions.
  * *Turbine audit reviewer:* retain the identity responsible for past operations after staff leave.
* **Preconditions:** The actor is authenticated as Super Administrator and permitted to administer the requested account and role. FR6.3 also allows an explicitly authorised Administrator; that delegated path requires the same checks and is not a general role-escalation right.
* **Postconditions:** Confirmed account and role changes are audited. Deactivation revokes sessions while retaining past actions. Failed activation delivery is recorded separately from the saved account state.
* **Success Guarantee:** The authorized account change is recorded and takes effect without losing historical attribution.
* **Minimal Guarantee:** No user can grant permissions they are not authorized to administer; historical action owners are not deleted.
* **Trigger:** The actor requests creation, permission changes, or deactivation of an internal account.
* **Main Success Scenario:**
1. The actor opens user management and selects an account operation.
2. The actor enters the corporate email, role, and permitted capabilities, or changes the existing account.
3. The system validates the domain, uniqueness, actor authority, and proposed permissions.
4. The actor confirms; the system stores the change and its audit event.
5. For a newly created account, the system sends the approved activation or initial-access message.

* **Extensions:**
  * **3a.** Unauthorized role escalation or non-corporate email: reject the change.
  * **1a.** Deactivate account: revoke active sessions and preserve all historical actions; pending assignments and approvals must be reviewed for reassignment.
  * **5a.** Initial-access email fails: retain the account’s actual activation state and record a retryable delivery failure.

## UC-05

* **ID / Code:** UC-05
* **Use Case Name:** Assign and delegate customers
* **Description:** Assign or temporarily delegate customers to staff and apply the resulting access and work-routing changes.
* **Primary Actor:** Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-03; UR: UR-24, UR-28; FR: FR1.5, FR6.4, FR14.1; NFR-04, NFR-05.
* **Source:** E p. 8.
* **Stakeholders & Interests:**
  * *Administrator:* allocate work and arrange temporary cover without losing accountability.
  * *Assigned and substitute staff:* see the correct customers and pending work for the effective interval.
  * *Customer:* retain continuity of service without unnecessary disclosure to other staff.
* **Preconditions:** The actor is an authenticated Administrator; customer and receiving account exist and are eligible.
* **Postconditions:** Confirmed assignments or dated delegations and their history are stored; subsequent access uses the new scope. Expired delegation grants no access, and invalid changes grant no additional permissions.
* **Success Guarantee:** Access and pending work reflect the new assignment or time-bounded delegation; historical attribution is unchanged.
* **Minimal Guarantee:** Staff cannot assign themselves customers; unconfirmed or invalid changes grant no access.
* **Trigger:** The Administrator requests an assignment, reassignment, unassignment, or temporary substitution.
* **Main Success Scenario:**
1. The Administrator selects customers and the receiving staff member.
2. For delegation, the Administrator enters its start and end dates while retaining the principal assignment.
3. The system previews access changes and pending work affected by the operation.
4. The Administrator confirms; the system applies the assignment, records history, and routes pending work to the current responsible staff member.
5. The system enforces the new scope on subsequent reads, writes, downloads, and exports.

* **Extensions:**
  * **2a.** Invalid interval or inactive recipient: reject the assignment and explain the error.
  * **3a.** Bulk reassignment: show the number of affected customers and report successes and failures individually.
  * **5a.** Delegation expires: remove delegated access at the recorded end time, preserving the principal assignment and historical actions.

## UC-06

* **ID / Code:** UC-06
* **Use Case Name:** Manage a monthly subscription
* **Description:** Create or change a monthly subscription, preview initial proration and schedule billing under approved effective terms.
* **Primary Actor:** Operational User
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-02, BR-03, BR-05; UR: UR-05, UR-06, UR-10; FR: FR2.2, FR5.2, FR10, FR10.1, FR10.2; NFR-01, NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 2-5, 14.
* **Stakeholders & Interests:**
  * *Assigned staff:* set up recurring service and explain the initial and monthly charges.
  * *Customer:* be billed for the agreed service dates and approved price.
  * *Administrator:* control exceptional terms and preserve historical invoice amounts.
* **Preconditions:** The actor is authenticated, authorized for the customer, and has an eligible customer record and configured rates.
* **Postconditions:** Approved subscription terms and effective dates are saved, with future billing scheduled accordingly. Any required initial invoice has its own issuance state; pending approvals and paused dates cannot become billable by mistake.
* **Success Guarantee:** The subscription’s approved terms, dates, and billing state are stored; eligible billing is scheduled without rewriting historical invoices.
* **Minimal Guarantee:** Unapproved terms do not become billable; old invoices retain their issued amounts; a pause never marks old debt paid.
* **Trigger:** The actor requests a new subscription, a permitted change, pause, or reactivation.
* **Main Success Scenario:**
1. The actor selects the customer, service, start date, agreed rate, and payment terms.
2. The system validates tax data and previews any initial prorated one-off amount and the first regular monthly billing date.
3. The actor reviews the calculation and requests any explicit commercial exception.
4. After required approvals, the actor confirms; the system stores effective dates and applicable terms.
5. If a prorated initial invoice is required now, the system prepares it for UC-09; normal recurrence is scheduled for the first applicable monthly billing date. A mid-month start uses an initial prorated invoice and begins regular recurrence on the following first day; a first-day start must not produce an overlapping extra proration invoice.

* **Extensions:**
  * **2a.** Missing mandatory tax data: block activation and identify the missing fields.
  * **3a.** Approved no-proration exception or future start: store it explicitly; do not issue invoices or reminders before the approved start.
  * **1a.** Pause: require reason and dates; suppress the affected future monthly charges, retain existing debt, and route reactivation review to the responsible staff member.
  * **4a.** Sensitive price or term change: create UC-23 approval; pending or rejected terms are not used for billing.
  * **5a.** Issue or delivery failure: preserve subscription and invoice states separately; record the failure without duplicating documents.

## UC-07

* **ID / Code:** UC-07
* **Use Case Name:** Review the annual revenue band and rate
* **Description:** Review verified annual customer revenue and activate an approved future subscription rate from the applicable revenue band.
* **Primary Actor:** Administrator
* **Alternative Initiator:** Time starts the due-review task; an Administrator supplies evidence and submits the rate decision.
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-05; UR: UR-15; FR: FR5, FR5.1; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 2-3, 11.
* **Stakeholders & Interests:**
  * *Administrator:* apply the correct revenue band with supporting evidence.
  * *Customer:* understand why and when the subscription price changes.
  * *Assigned staff:* follow up missing revenue evidence and communicate the approved rate.
* **Preconditions:** The Administrator is authenticated and authorised to review the customer; a subscription and versioned rate table exist. Activation requires the applicable approval authority. A Time trigger may create a due-review task but cannot supply unverified revenue or approve a rate.
* **Postconditions:** The review retains the revenue evidence, prior/proposed rate, decision and effective date. Approval activates the future rate; missing evidence or rejection leaves the existing rate in force.
* **Success Guarantee:** An approved rate change has an effective date and a record of the prior and new values; previous invoices remain unchanged.
* **Minimal Guarantee:** Annual review never silently changes historical invoices or activates an unvalidated rate.
* **Trigger:** A review becomes due or an authorized staff member starts it.
* **Main Success Scenario:**
1. The system lists due annual reviews within the actor’s scope.
2. The actor enters or retrieves the customer’s verified annual revenue, its source, and verification date.
3. The system proposes the corresponding band and future rate.
4. The actor submits the proposal for UC-23 approval; an authorized approver reviews the evidence and effective date.
5. The system activates the approved rate from that date and retains the review history.

* **Extensions:**
  * **2a.** Revenue evidence unavailable: keep the review pending and notify the responsible person; do not infer a new rate.
  * **4a.** Rejected proposal: retain the existing rate and the rejection reason.
  * **5a.** A past review was incorrect: record the correction and proposed impact; do not automatically issue retroactive charges.

## UC-08

* **ID / Code:** UC-08
* **Use Case Name:** Prepare a one-off invoice
* **Description:** Prepare and validate a one-off invoice draft, including lines, taxes, discounts and payment terms, before approval or issuance.
* **Primary Actor:** Operational User
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-02; UR: UR-09, UR-11; FR: FR2, FR2.3, FR2.5, FR14.2; NFR-01, NFR-02, NFR-04, NFR-05.
* **Source:** E pp. 3-5, 16.
* **Stakeholders & Interests:**
  * *Assigned staff:* prepare a correct invoice with useful validation feedback.
  * *Customer:* receive charges matching the agreed one-off service.
  * *Financial approver:* review exceptional amounts or discounts before issuance.
* **Preconditions:** The actor is authenticated and authorized for the customer and invoice creation.
* **Postconditions:** A draft and its validation/approval state are saved. Draft creation alone consumes no definitive invoice number and sends no invoice; an issued original remains immutable.
* **Success Guarantee:** A validated draft is saved and ready for required approval or issuance; saving a draft alone does not issue an invoice.
* **Minimal Guarantee:** No incomplete draft is sent as an issued invoice; no definitive series number is consumed solely by saving a draft.
* **Trigger:** The actor requests a one-off invoice for a customer.
* **Main Success Scenario:**
1. The actor selects the customer and enters service lines, quantities, prices, discounts, taxes, and agreed terms.
2. The system calculates decimal totals and previews the invoice, identifying missing tax details or unusual amounts.
3. The actor corrects any errors and confirms the draft.
4. The system stores the draft and either makes it ready for UC-09 or routes sensitive changes to UC-23.

* **Extensions:**
  * **2a.** Invalid quantity, price, tax, or missing mandatory data: preserve the draft and show actionable errors; block issuance.
  * **2b.** Unusually high amount: warn and apply the configured approval policy, rather than silently changing the price.
  * **3a.** User leaves the form: retain a recoverable draft where supported; no definitive number or customer message is created.
  * **4a.** An existing issued invoice was selected for editing: refuse draft-style overwrite and offer UC-21 where authorized.

## UC-09

* **ID / Code:** UC-09
* **Use Case Name:** Issue an invoice
* **Description:** Convert an authorised invoice proposal into a numbered, preserved invoice PDF and request its delivery exactly once.
* **Primary Actor:** Operational User
* **Calling Contexts:** UC-10 supplies scheduled recurring items, UC-06 supplies initial prorated items, and UC-21 supplies corrective documents.
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** Subfunction
* **Related requirements:** BR-02, BR-04; UR: UR-11, UR-12; FR: FR2, FR2.3, FR2.4, FR2.5, FR2.6, FR14; NFR-01, NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 3-5, 8-9, 14.
* **Stakeholders & Interests:**
  * *Turbine finance staff:* maintain unique sequential numbering and reproducible issued amounts.
  * *Customer:* receive a complete corporate invoice with correct tax and payment details.
  * *Assigned staff:* distinguish successful issuance from document or delivery failures.
* **Preconditions:** A complete, authorised draft or approved subscription/correction proposal exists, and applicable approvals and period rules are satisfied. Direct initiation requires an authenticated Operational User with issuance authority and customer scope; included calls use their authorised workflow context. An automated caller must be authorised for the identified billing item.
* **Postconditions:** A successful issuance stores the unique series number, immutable financial snapshot, original PDF and delivery request. A later PDF/dispatch failure retains the same issued identity and a recoverable failed stage.
* **Success Guarantee:** Exactly one issued invoice has a unique sequential number in its series, immutable issued data, a preserved PDF, and a recorded delivery request.
* **Minimal Guarantee:** No duplicate invoice number or payment-state change is introduced; any durable issuance is preserved and recoverable, even if document delivery fails.
* **Trigger:** An authorized user confirms issuance, or an eligible recurring or prorated item is ready.
* **Main Success Scenario:**
1. The system rechecks authorization, current invoice version, required tax fields, effective terms, approvals, and period restrictions.
2. The system computes and verifies the final lines, tax bases, taxes, currency, total, and due date.
3. The system reserves a unique number in the configured series and stores the issued snapshot consistently.
4. The system generates and preserves the PDF with corporate identity, issuer/customer tax details, number, dates, lines, taxes, total, and support/payment details.
5. The system records issuance and queues UC-11 delivery against the same invoice.

* **Extensions:**
  * **1a.** Missing data, pending approval, conflict, or unauthorized operation: block issuance and explain the reason; no customer message is queued.
  * **3a.** Concurrent or repeated issuance request: return the already issued invoice or in-progress result; never allocate a second issued invoice for the same operation.
  * **4a.** PDF generation fails after issuance was recorded: retain the issued snapshot and number, mark document generation failed, and retry for that same invoice.
  * **5a.** Delivery cannot be queued or later fails: the issued invoice remains issued; record a retryable dispatch error without renumbering.

## UC-10

* **ID / Code:** UC-10
* **Use Case Name:** Generate monthly recurring invoices
* **Description:** Generate the monthly invoices due for active subscriptions and resume interrupted runs without duplicating a subscription-period charge.
* **Primary Actor:** Time
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** Summary
* **Related requirements:** BR-02, BR-03, BR-04; UR: UR-11, UR-24; FR: FR2.1, FR9.2, FR14; NFR-03, NFR-05, NFR-06.
* **Source:** E pp. 4, 9, 14, 17.
* **Stakeholders & Interests:**
  * *Turbine:* complete recurring billing even after downtime without duplicate charges.
  * *Customer:* receive only the monthly invoice justified by their active terms.
  * *Assigned staff:* receive actionable exceptions rather than manually inspect every subscription.
* **Preconditions:** Monthly subscriptions, effective terms, and a billing period exist; the scheduled process is authorized to perform billing.
* **Postconditions:** The execution records each subscription-period outcome and run totals. Successful items refer to one issued invoice; ineligible items are skipped and failed stages remain recoverable independently.
* **Success Guarantee:** Every successfully processed eligible subscription has exactly one invoice for the period; failures and skipped items have explicit recorded outcomes.
* **Minimal Guarantee:** A failed item cannot duplicate successful invoices or prevent all independent subscriptions from being processed.
* **Trigger:** The first-day schedule fires, or the system resumes after a missed or failed execution.
* **Main Success Scenario:**
1. The process creates or resumes a persistent execution record for the billing period.
2. The system identifies eligible active subscriptions and checks start, pause, cancellation, rate, discount, and payment-term effective dates.
3. For each eligible item without an invoice already generated for that subscription and period, the system prepares billing data and executes UC-09.
4. The system records each item’s outcome and notifies the responsible staff member of actionable exceptions.
5. The process stores totals for generated, skipped, and failed items and exposes its final status.

* **Extensions:**
  * **2a.** Paused, not-yet-active, or effectively cancelled subscription: skip generation without deleting previous debt.
  * **3a.** Duplicate or concurrent run: detect the existing subscription-period result and avoid issuing another invoice.
  * **3b.** Missing tax data, PDF failure, or other item-level failure: record the failed stage and continue with independent items.
  * **1a.** Service outage: on recovery identify missed periods/items and resume idempotently; do not require the staff browser to remain open.

## UC-11

* **ID / Code:** UC-11
* **Use Case Name:** Deliver an issued invoice
* **Description:** Send an issued invoice to its billing recipients through the configured communication service and retain the observed dispatch outcome.
* **Primary Actor:** Operational User
* **Calling Contexts:** UC-09 automatically requests delivery after issuance; the Operational User can request an authorised retry.
* **Supporting Actors:** Communication Service (email; complementary WhatsApp when consented)
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** Subfunction
* **Related requirements:** BR-02, BR-04; UR: UR-17; FR: FR2.7, FR13.1; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 5, 12, 15.
* **Stakeholders & Interests:**
  * *Billing recipient:* receive the correct invoice and support details through an eligible channel.
  * *Assigned staff:* see bounced or missing deliveries and retry against the same invoice.
  * *Turbine:* retain dispatch evidence without generating a second financial document.
* **Preconditions:** An issued invoice and its preserved PDF exist. Delivery is requested by an authorised issuing workflow or an authenticated Operational User with retry authority and customer scope. Enabled channel configuration is available; a missing recipient is handled in extension 1a.
* **Postconditions:** Each attempt records the invoice, recipients, channel, time and observed service result. A bounce or service error leaves the invoice issued and the delivery problem visible; acceptance alone is not proof of reading.
* **Success Guarantee:** A dispatch attempt has the correct invoice, recipients, template, channel, and observed provider outcome recorded.
* **Minimal Guarantee:** Sending failure does not delete, duplicate, or renumber the invoice; recipient and retry history remain traceable.
* **Trigger:** UC-09 requests delivery, or authorized staff request a failed invoice delivery to be retried.
* **Main Success Scenario:**
1. The system loads the invoice’s authorized billing contacts and default email channel.
2. The system prepares the message and PDF using the appropriate template, language, and support details.
3. The Communication Service accepts or rejects the dispatch; the system records the attempt, time, recipient, and provider result.
4. The system updates delivery state using only available evidence and makes failures visible to the responsible staff member.

* **Extensions:**
  * **1a.** Missing billing contact: keep the invoice issued but undelivered; create an actionable issue rather than discard the invoice.
  * **2a.** Complementary WhatsApp delivery: use only a valid number with recorded channel consent; the provider may be simulated.
  * **3a.** Provider failure or bounce: record the failed attempt, notify the responsible staff member, and allow corrected-recipient retry or configured fallback.
  * **3b.** Repeated dispatch request: avoid duplicate processing of the same attempt; an intentional resend has a separate tracked attempt linked to the original invoice.
  * **4a.** Provider acceptance without delivery/read evidence: retain the actual observed status; do not claim that the customer read the message.

## UC-12

* **ID / Code:** UC-12
* **Use Case Name:** Reconcile a payment with an invoice
* **Description:** Match verified payment-provider evidence to an invoice and record an allocation or an explicit discrepancy for staff review.
* **Primary Actor:** Operational User
* **Alternative Initiator:** Time starts a scheduled payment query. Validated Payment Provider notifications are another integration trigger; the provider remains the supporting actor shown in the diagram.
* **Supporting Actors:** Payment Provider (simulated Stripe; optional Revolut adapter)
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-02, BR-04; UR: UR-20; FR: FR3, FR3.1; NFR-04, NFR-05, NFR-06.
* **Source:** E p. 6.
* **Stakeholders & Interests:**
  * *Assigned staff:* resolve mismatches and know when an invoice has been settled.
  * *Customer:* have received funds credited correctly without duplicate allocations.
  * *Turbine finance staff:* reconcile balances to provider evidence and preserve reversals.
* **Preconditions:** The provider connection is configured. Manual initiation requires an authenticated Operational User with reconciliation authority and current customer scope; scheduled queries use the authorised integration context. Inbound notifications must be validated before their transaction evidence is processed.
* **Postconditions:** A verified transaction is allocated at most once, with updated balances and an internal notification. Ambiguous, partial or excess payments retain their evidence and review state; provider failures do not mark invoices paid.
* **Success Guarantee:** A uniquely identified payment is allocated correctly and auditable balances and notifications reflect the result, or an unresolved discrepancy remains explicitly pending.
* **Minimal Guarantee:** No duplicate payment or unsupported paid status is created; unresolved transactions remain available for review.
* **Trigger:** A simulated Stripe event arrives, a payment query runs, or a staff member opens an unreconciled transaction.
* **Main Success Scenario:**
1. The system validates and records the provider transaction’s identity, successful/settled status, amount, currency, date, and available reference.
2. The system checks whether the event or transaction has already been processed.
3. The system searches for an eligible invoice using the agreed matching policy, checking reference, amount, and currency rather than amount alone.
4. A clear full match is allocated once; the invoice becomes paid only when verified allocations settle its outstanding balance.
5. The system retains the payment-to-invoice evidence, audit history, updated balance, and notification to the assigned staff member.

* **Extensions:**
  * **1a.** Query/provider unavailable or event invalid: record an integration failure or reject the event; do not invent a payment.
  * **2a.** Duplicate event or different event about the same recorded transaction: return the previous result without allocating money twice.
  * **3a.** No reference, multiple plausible matches, or currency mismatch: retain the transaction for manual review; do not automatically mark an invoice paid.
  * **3b.** Underpayment or overpayment: preserve the received amount and difference for review; underpayment does not settle the invoice and excess is not silently discarded.
  * **4a.** Manual reconciliation or reversal: an authorized person records the allocation or reversal and reason; preserve original events and recalculate balances without deleting evidence.

## UC-13

* **ID / Code:** UC-13
* **Use Case Name:** Run invoice reminders and overdue follow-up
* **Description:** Send eligible due-date and overdue reminders while checking current balances, agreed terms and follow-up suspensions before dispatch.
* **Primary Actor:** Time
* **Supporting Actors:** Communication Service (email; complementary WhatsApp when consented)
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** Summary
* **Related requirements:** BR-02, BR-04; UR: UR-18; FR: FR3.2, FR3.3, FR3.4, FR13; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 5-6, 9, 13, 15.
* **Stakeholders & Interests:**
  * *Assigned staff:* be notified of overdue invoices and intervene in disputes.
  * *Customer and billing contacts:* receive relevant reminders with support details and agreed payment dates.
  * *Turbine collections team:* follow up outstanding balances consistently without duplicate messages.
* **Preconditions:** An issued invoice has an outstanding balance and stored payment terms; channel templates and reminder policy are configured.
* **Postconditions:** Reminder attempts and next occurrences are recorded. Settled or validly suspended balances receive no ineligible dispatch; overdue transitions notify the assigned staff member and never erase the debt.
* **Success Guarantee:** Eligible reminders are dispatched once per scheduled occurrence; overdue status and relevant staff notifications are updated and recorded.
* **Minimal Guarantee:** No reminder may be based on stale paid status or bypass a valid suspension; failed deliveries are not recorded as successful.
* **Trigger:** A reminder becomes due under the invoice’s effective schedule.
* **Main Success Scenario:**
1. The process selects unpaid invoices and calculates which reminder occurrences are due from their stored issue/due dates and applicable terms.
2. The system rechecks the current outstanding balance and any explicit follow-up suspension.
3. For each eligible occurrence, the system prepares the corresponding reminder or overdue message with invoice, amount, due date, support phone, and support email.
4. The configured email service or permitted complementary WhatsApp channel processes the message and the system records the observed attempt result.
5. The system records the next follow-up and notifies the assigned employee when an invoice becomes overdue.

* **Extensions:**
  * **1a.** Customer-specific approved payment terms, such as thirty days: use that due date; do not apply overdue status on default day five.
  * **2a.** Payment has settled the invoice: suppress the reminder and stop subsequent collection follow-up for that settled balance.
  * **2b.** Follow-up paused for a dispute: retain unpaid status and the review task; suppress external reminders until the approved pause is reviewed or ends.
  * **4a.** Provider failure or duplicate job: record a retryable failure or reuse the occurrence outcome; do not issue duplicate reminders for one scheduled occurrence.
  * **1b.** A reminder falls on a configured weekend/holiday: move only the communication to the next working day according to C9 and FR13; retain the invoice’s stored legal due date. Calendar-day offsets and collision handling must be documented in the configured policy; do not silently choose a different due date.

## UC-14

* **ID / Code:** UC-14
* **Use Case Name:** Review assigned work and internal notifications
* **Description:** Review the scoped operational work list and notifications, then open the appropriate workflow without treating a read alert as a resolved debt.
* **Primary Actor:** Operational User
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-02, BR-03; UR: UR-22, UR-23; FR: FR7, FR7.1, FR7.2, FR8.2, FR8.3; NFR-02, NFR-03, NFR-04, NFR-05.
* **Source:** E pp. 6-8.
* **Stakeholders & Interests:**
  * *Assigned staff:* prioritise payments, overdue invoices and unresolved operational work.
  * *Administrator:* monitor the wider operational queue where permitted.
  * *Customer:* avoid an unpaid invoice being incorrectly treated as settled when an alert is read.
* **Preconditions:** The actor is authenticated; work items and notifications are restricted to the actor’s authorized scope.
* **Postconditions:** Read/handled notification states are stored independently from the underlying issue or invoice. Opening an item rechecks scope; merely reading an overdue notice does not settle its balance.
* **Success Guarantee:** The actor can locate and act on authorized work, with read and handled states recorded separately.
* **Minimal Guarantee:** Reading an alert never settles an invoice, resolves an issue, or bypasses customer-level authorization.
* **Trigger:** The actor opens their work area or receives a relevant internal notification.
* **Main Success Scenario:**
1. The system displays scoped payments received, due/overdue invoices, delivery failures, pending reconciliations, approvals, and annual reviews.
2. The actor filters or opens an item; the system rechecks current permission to the referenced customer or invoice.
3. The actor marks a notification as read and follows the link to the corresponding operational use case.
4. When the underlying problem is resolved, the system records its actual resolution; informational items may remain simply read.

* **Extensions:**
  * **2a.** Assignment changed or access revoked: deny the target data and refresh the work list.
  * **3a.** The actor only reads an overdue alert: do not mark its debt resolved or paid.
  * **1a.** Administrator view: permit the global operational inbox; it does not grant other roles access to the global financial dashboard.

## UC-15

* **ID / Code:** UC-15
* **Use Case Name:** Record a subscription cancellation
* **Description:** Confirm a subscription cancellation date, stop subsequent recurring generation and retain collection of existing obligations.
* **Primary Actor:** Administrator
* **Alternative Initiator:** External Application submits cancellation intake only; Administrator confirmation is required for the effective cancellation.
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-04; UR: UR-07; FR: FR4, FR4.1, FR15; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 4, 11-12, 14, 17.
* **Stakeholders & Interests:**
  * *Customer:* stop future subscription charges while retaining an accurate account of existing debt.
  * *Administrator:* confirm cancellation effects and keep debt follow-up separate.
  * *External Application:* receive a controlled intake outcome without deleting a subscription directly.
  * *Assigned staff:* continue collecting prior unpaid invoices after cancellation.
* **Preconditions:** The customer and subscription exist. Confirmation requires an authenticated Administrator with cancellation authority. External intake requires separate API authentication and cancellation-request scope; it does not itself grant confirmation authority.
* **Postconditions:** An authorised confirmation records the effective cancellation and stops applicable future recurrence. Earlier invoices remain collectible; an external intake request alone leaves cancellation pending internal confirmation.
* **Success Guarantee:** After authorized confirmation, recurrence stops from its effective cancellation date; previously issued debt remains collectible and visible.
* **Minimal Guarantee:** No cancellation deletes invoices, payment evidence, or outstanding debt. An unapproved request does not directly mutate recurrence.
* **Trigger:** Staff record a cancellation request or an authorized external application submits one.
* **Main Success Scenario:**
1. The actor supplies the customer/subscription identifier, request reason, and proposed effective date.
2. The system validates scope and records the request; an external request enters the internal workflow rather than directly deleting the subscription.
3. The system invokes the debt-calculation subfunction of UC-16 and displays outstanding obligations and the effects on future billing. This authorised internal include uses the existing workflow context, not external API credentials.
4. An authorized staff member confirms the effective cancellation under the approved policy.
5. The system stops applicable future monthly generation, retains old invoices and collection follow-up, and records and communicates the outcome.

* **Extensions:**
  * **3a.** Outstanding invoices exist: display them and continue collection; under the later extended statement, debt does not indefinitely prevent commercial cancellation.
  * **4a.** The request is not yet confirmed or its effective date is invalid: retain a pending or rejected intake result without silently applying cancellation. C4 is the current team interpretation; its stated next-client-review validation remains pending and does not create a second, debt-blocking cancellation rule.
  * **2a.** Unauthorized or unknown identifier: return no protected debt detail and make no billing change.
  * **5a.** Cancellation overlaps a billing run: apply the effective-date rule consistently and prevent duplicate or inappropriate future issuance.

## UC-16

* **ID / Code:** UC-16
* **Use Case Name:** Query a customer’s outstanding obligations through the API
* **Description:** Return an authorised, time-stamped snapshot of a customer’s outstanding obligations without changing their billing state.
* **Primary Actor:** External Application
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-04; UR: UR-07; FR: FR4.2, FR15; NFR-03, NFR-04, NFR-05.
* **Source:** E pp. 4, 11-12.
* **Stakeholders & Interests:**
  * *External Application:* obtain a reliable debt response and distinguish errors from debt-free results.
  * *Turbine:* limit financial disclosure to authenticated, scoped API clients.
  * *Customer:* have debt calculated from preserved invoices, verified payments and corrections.
* **Preconditions:** External calls require a provisioned External Application with API credentials and specific debt-query scope. The internal calculation included by UC-15 instead requires the already authorised cancellation workflow and customer scope; it does not expose an unauthenticated public API.
* **Postconditions:** A successful query returns permitted debt indicators/balances with currency and snapshot time. Errors disclose no unauthorised details, do not imply zero debt and leave customer, invoice and recurrence states unchanged.
* **Success Guarantee:** The API returns a documented, authorized debt snapshot without changing customer or invoice state.
* **Minimal Guarantee:** The query cannot cancel a subscription, erase debt, or bypass staff permissions.
* **Trigger:** The external application sends a debt-status request for an identified customer.
* **Main Success Scenario:**
1. The External Application submits the customer identifier with its API authentication. An included UC-15 call supplies the same identifier through its authorised internal context.
2. The system verifies the external caller’s query permission, customer scope and applicable request limit, or verifies the inherited internal cancellation context.
3. The system calculates outstanding obligations from issued invoices, verified payments, and approved corrective documents, retaining currency distinctions.
4. The system returns the debt indicator, permitted balance/detail, and snapshot time in the documented response format and records the important call.

* **Extensions:**
  * **2a.** Missing/invalid authentication or insufficient scope: reject with the documented authentication/authorization response and disclose no protected debt data.
  * **2b.** Unknown or inaccessible customer: apply the documented non-disclosing error contract.
  * **3a.** Calculation cannot be completed: return an explicit unavailable/error outcome, never debt-free by default.
  * **4a.** State changes after the response: later cancellation processing rechecks current obligations; the response is not a permanent guarantee or cancellation authorization.

## UC-17

* **ID / Code:** UC-17
* **Use Case Name:** Consult the financial dashboard and export reports
* **Description:** Inspect financial indicators for a selected period and filters, trace their underlying records and export an authorised report.
* **Primary Actor:** Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-07, BR-08; UR: UR-25, UR-26; FR: FR8, FR8.1, FR8.3, FR8.4, FR8.5; NFR-02, NFR-03, NFR-04, NFR-05.
* **Source:** E pp. 7, 11, 14-15.
* **Stakeholders & Interests:**
  * *Administrator:* compare invoiced, collected and outstanding amounts and inspect their evidence.
  * *Turbine management:* use reproducible indicators for financial oversight.
  * *Customers represented in reports:* have their data disclosed only within authorised reports.
* **Preconditions:** The actor is authenticated with the Administrator role and financial-report permission.
* **Postconditions:** The selected indicators or export retain their filters and calculation/generation time. Downloads recheck permission; failures are explicit and incomparable currencies remain separate without an approved conversion policy.
* **Success Guarantee:** The dashboard or export shows reproducible financial totals for the selected scope, with filters and generation history recorded.
* **Minimal Guarantee:** Financial totals do not change invoice amounts; unauthorized users cannot retrieve the same data through direct export requests.
* **Trigger:** The Administrator opens the financial dashboard or requests a report.
* **Main Success Scenario:**
1. The Administrator selects a weekly, monthly, quarterly, or annual period and available customer, manager, location/country, sector, invoice status, and invoice-type filters.
2. The system calculates invoiced, collected, outstanding, overdue, collection-time, and expected recurring-revenue indicators from recorded transactions.
3. The Administrator opens an indicator’s details to inspect the contributing invoices and allocations.
4. The Administrator optionally requests CSV or readable PDF export; the system rechecks permission, records filters and generation time, and produces an authorized download.

* **Extensions:**
  * **1a.** An Operational User without Administrator authority, or an account without financial-report permission, requests the global dashboard: deny access. A Super Administrator account is subject to the same explicit financial-report permission check; the common role-policy caveat applies.
  * **2a.** Multiple currencies: separate totals unless an approved reporting conversion policy exists; never silently add incomparable currency amounts.
  * **4a.** Long report: persist a background job and return its status; recheck permission when the result is downloaded.
  * **4b.** Export fails: retain an explicit failure; no misleading partial report is labelled complete.

## UC-18

* **ID / Code:** UC-18
* **Use Case Name:** Configure system-wide billing and automation policies
* **Description:** Validate and version global billing, numbering, communication and approval settings for eligible future operations.
* **Primary Actor:** Super Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-02, BR-03, BR-05; UR: UR-29; FR: FR5.1, FR6.2, FR13, FR13.1; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 2-5, 9-10, 12.
* **Stakeholders & Interests:**
  * *Super Administrator:* change global rules with a visible and auditable effect.
  * *Operational staff:* use consistent rates, templates and automation policies.
  * *Customer:* retain the invoice terms that applied when the document was issued.
* **Preconditions:** The actor is authenticated as Super Administrator and can change the relevant configuration.
* **Postconditions:** A confirmed configuration version records its actor, reason and effective date/scope. Invalid settings are not activated, and previously issued invoices keep their original amounts, terms and documents.
* **Success Guarantee:** A validated configuration version is stored with effective scope/date and audit history; historical invoice snapshots remain intact.
* **Minimal Guarantee:** Invalid or unconfirmed settings are not activated; integration secrets are not exposed in output or committed as configuration content.
* **Trigger:** The actor opens global configuration.
* **Main Success Scenario:**
1. The actor selects payment periods, reminder intervals, corporate domain, issuer identity, series, rate bands, currencies, taxes, templates, channel settings, or approval thresholds.
2. The system shows current values and the effects of proposed changes.
3. The actor changes values and previews affected templates or reminder schedules using test data.
4. The system validates consistency and the actor confirms the effective change.
5. The system stores the version, actor, time, and reason and makes the new policy available to eligible future operations.

* **Extensions:**
  * **3a.** Missing template variable, invalid interval, duplicate numbering policy, or unsafe combination: reject activation and display the cause.
  * **5a.** Existing issued invoices: retain the terms, amounts, identity snapshot, and original documents that applied when issued.
  * **1a.** Actor lacks global-configuration permission: reject the change without relying on hidden UI controls.

## UC-19

* **ID / Code:** UC-19
* **Use Case Name:** Inspect business audit and automation health
* **Description:** Inspect protected business audit and automation execution records to trace actions and identify failed processing stages.
* **Primary Actor:** Super Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-03; UR: UR-30; FR: FR9.1, FR9.2; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 8-9, 12.
* **Stakeholders & Interests:**
  * *Super Administrator:* diagnose failures and identify who changed business records.
  * *Turbine audit reviewer:* follow an intact financial and operational history.
  * *Assigned staff:* have operational failures investigated without losing their original action history.
* **Preconditions:** The actor is authenticated as Super Administrator; audit and execution records are available.
* **Postconditions:** The authorised reviewer can inspect correlated audit and execution evidence without modifying it. Failed processes remain identified as failed, and unprivileged requests reveal no protected global audit data.
* **Success Guarantee:** The actor can trace relevant actions and failed stages without modifying the historical evidence.
* **Minimal Guarantee:** Inspection cannot rewrite audit history, expose credentials, or silently repair financial records.
* **Trigger:** The actor requests audit history or automation-health information.
* **Main Success Scenario:**
1. The actor selects business audit, process executions, or the health view.
2. The system displays permitted records with responsible user/process, action, target, timestamp, and outcome.
3. The actor filters by period, process, customer, or outcome and inspects an event.
4. The system exposes useful failure correlation and last generation, dispatch, integration, and successful backup status without revealing sensitive technical details.

* **Extensions:**
  * **2a.** Administrator or Assigned User requests protected global audit or backup details: deny under the current role policy; ordinary customer timelines remain separately scoped.
  * **3a.** The actor attempts to edit or delete past audit evidence: reject the mutation.
  * **4a.** Execution failed: show the failed item/stage and support correlation; do not misrepresent failure as successful completion.

## UC-20

* **ID / Code:** UC-20
* **Use Case Name:** Create and restore a backup
* **Description:** Create a scheduled or manual backup, or restore a selected backup and validate data, documents and permissions before resuming operations.
* **Primary Actor:** Super Administrator
* **Alternative Initiator:** Time creates a scheduled backup. Restoration always requires Super Administrator confirmation.
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** Summary
* **Related requirements:** BR-01, BR-03; UR: UR-30; FR: FR9; NFR-04, NFR-05.
* **Source:** E pp. 8-9, 12.
* **Stakeholders & Interests:**
  * *Super Administrator:* recover a known consistent state and measure the restoration outcome.
  * *Turbine:* retain usable backups and resume billing without replaying successful charges.
  * *Customers:* retain invoice documents and properly scoped access after recovery.
* **Preconditions:** A backup policy and authorised destination exist. Manual creation requires an authenticated Super Administrator; Time can initiate the configured scheduled backup. Recovery additionally requires a selected valid backup, an approved recovery target and explicit Super Administrator confirmation.
* **Postconditions:** A backup attempt records its scope, time and success/failure. A restored target is released only after consistency checks pass; failed validation leaves recovery incomplete and normal billing blocked.
* **Success Guarantee:** A created backup has a recorded outcome; a successful recovery restores a validated, consistent dataset and documents with measured recovery time.
* **Minimal Guarantee:** An unsuccessful backup or restore is never labelled valid; recovery does not bypass access rules or intentionally rerun billing as new invoices.
* **Trigger:** The scheduled backup becomes due, or the Super Administrator requests a recovery drill or recovery operation.
* **Main Success Scenario:**
1. For backup creation, Time fires the configured schedule or the Super Administrator requests a manual run; the system creates the data-and-document backup and records its time, scope and outcome. Creation can finish here; recovery begins at step 2 using an existing valid backup.
2. For recovery, the Super Administrator selects a valid backup and approved target; the system shows the recovery scope and required confirmation.
3. The Super Administrator confirms and the system restores the selected backup, restricting conflicting operations as required.
4. The system verifies invoice/document relationships, permissions, and recoverable financial data and records the recovery duration and result.
5. Scheduled jobs resume under their idempotency rules after the recovery is validated.

* **Extensions:**
  * **1a.** Backup failure: record failure and alert the responsible operator; retain the last known valid backup.
  * **2a.** Non-Super Administrator or invalid backup: deny recovery; do not disclose backup contents.
  * **4a.** Restore validation fails: do not declare recovery complete or resume normal billing; report the failed recovery stage.

## UC-21

* **ID / Code:** UC-21
* **Use Case Name:** Correct an issued invoice
* **Description:** Issue an approved corrective document linked to an issued invoice while preserving the original evidence and period controls.
* **Primary Actor:** Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-04, BR-07, BR-08; UR: UR-13; FR: FR2.3, FR2.8; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 3-4, 11, 14.
* **Stakeholders & Interests:**
  * *Administrator:* correct a billing error with a documented reason and required approval.
  * *Customer:* receive an explainable correction and accurate outstanding balance.
  * *Accounting firm:* receive traceable original/corrective documents for accounting without needing an application account.
* **Preconditions:** An issued original invoice exists; the actor has correction authority and any closed-period rule is satisfied.
* **Postconditions:** The issued correction links to the untouched original and the balance is recomputed from both documents and payment allocations. Rejected or blocked proposals issue no correction and never fabricate a refund.
* **Success Guarantee:** An approved corrective document is issued and linked to the original; the resulting balance is explainable without altering the original evidence.
* **Minimal Guarantee:** No issued invoice is silently overwritten or physically deleted; paid, rectified, voided, and uncollectible are not treated as equivalent.
* **Trigger:** The Administrator identifies an invoice error or approved financial adjustment.
* **Main Success Scenario:**
1. The Administrator opens the original invoice and enters the correction reason and proposed corrected data/amount.
2. The system previews the original-to-correction relationship and impact on the customer balance.
3. The system checks required approval and closed-period restrictions; the authorized actor obtains any necessary decision.
4. The system issues the corrective document under UC-09 with the applicable configured series and preserved original link.
5. The system updates financial views from both documents and applicable payment allocations and records the action.

* **Extensions:**
  * **1a.** The original is an unissued draft: use its ordinary draft-correction flow instead of creating an issued corrective document.
  * **3a.** Approval rejected or period locked without required exception authority: block the correction and preserve the proposal and reason.
  * **5a.** Refund or uncollectible decision is needed: preserve the separate approved workflow; a corrective document alone must not invent a payment or refund.

## UC-22

* **ID / Code:** UC-22
* **Use Case Name:** Resolve a billing or delivery issue
* **Description:** Track a customer billing or delivery issue, its responsible person and resolution, with any authorised reminder suspension recorded separately.
* **Primary Actor:** Operational User
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-02, BR-03, BR-04; UR: UR-19; FR: FR3.4, FR12, FR12.1, FR12.2; NFR-02, NFR-04, NFR-05.
* **Source:** E pp. 5-6, 10-11, 15.
* **Stakeholders & Interests:**
  * *Assigned staff:* coordinate corrective actions and see who owns the unresolved issue.
  * *Customer:* have billing or delivery problems followed up without inappropriate reminders.
  * *Administrator:* control sensitive notes and any exceptional suspension or financial action.
* **Preconditions:** The actor has access to the affected customer/invoice and the relevant issue-management permission.
* **Postconditions:** The issue retains its owner, status, internal history and resolution. Any reminder suspension records its reason and review date; closing the issue alone neither settles debt nor changes issued amounts.
* **Success Guarantee:** The issue has an owner, status, resolution history, and any explicit follow-up suspension/review date; financial state changes follow their own authorized cases.
* **Minimal Guarantee:** Internal comments are not sent to customers automatically; issue closure does not erase debt or payment evidence.
* **Trigger:** An operational problem is reported or a failed process creates an actionable issue.
* **Main Success Scenario:**
1. The actor opens or creates the issue, selecting the customer and optional invoice, type, description, priority, and responsible person.
2. The system stores the issue and notifies the responsible person.
3. The actor records internal findings and permitted attachments; sensitive administrative notes remain restricted.
4. If authorized and justified, the actor pauses external reminders with a reason and review date while retaining unpaid debt.
5. After the corrective operational action, the actor records the resolution; the system updates the issue and reviews the reminder pause.

* **Extensions:**
  * **3a.** Attachment is disallowed or too large: reject it according to the configured file policy; do not expose or execute it.
  * **4a.** User lacks pause permission: reject suspension; opening an issue alone does not suspend reminders.
  * **5a.** Pause review becomes due before resolution: notify the responsible person and apply the documented resumption policy.
  * **5b.** Resolving the issue requires reconciliation or rectification: execute UC-12 or UC-21 with their own authorization; do not simply mark the invoice paid.

## UC-23

* **ID / Code:** UC-23
* **Use Case Name:** Decide a sensitive financial approval
* **Description:** Approve or reject a sensitive financial proposal against the current values, authority threshold and separation-of-duties rules.
* **Primary Actor:** Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-04, BR-05, BR-06; UR: UR-14, UR-21; FR: FR3.5, FR11, FR11.1; NFR-02, NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 3, 11, 14.
* **Stakeholders & Interests:**
  * *Financial requester:* receive a clear decision on the submitted operation.
  * *Administrator:* control financial exposure within approval authority.
  * *Customer:* be billed only under approved exceptional terms or corrections.
  * *Turbine audit reviewer:* trace the decision to the exact values and responsible approver.
* **Preconditions:** An authenticated Administrator has authority for the proposal’s operation and threshold; a current proposal exists with its exact values, reason and requester. Higher thresholds require a Super Administrator acting in the specialised Administrator role; applicable separation-of-duties rules remain mandatory.
* **Postconditions:** The decision records its actor, time, reason and exact proposal version. Only an approved current proposal may continue; rejection or stale values keep the originating financial operation blocked.
* **Success Guarantee:** A recorded approval/rejection is applied to the exact proposal version and the requesting workflow can continue or remain blocked accordingly.
* **Minimal Guarantee:** Approval cannot be reused to authorize a changed proposal or bypass configured separation of duties.
* **Trigger:** An eligible approver opens a pending request.
* **Main Success Scenario:**
1. The system lists requests the actor may decide under the applicable approval threshold and assignment.
2. The approver reviews the affected customer, proposed price/discount/terms or correction, reason, and financial impact.
3. The system checks decision authority, any separation-of-duties rule, and whether the proposal is still current.
4. The approver approves or rejects with a comment; the system stores the actor, time, outcome, and exact values/version decided.
5. The system notifies the requester and permits the originating workflow to continue only under the recorded decision.

* **Extensions:**
  * **3a.** Self-approval forbidden for this operation/threshold: reject the decision and route to an eligible different approver.
  * **3b.** Values changed after submission or another approver already decided: reject the stale decision and request refreshed review.
  * **1a.** Approver unavailable: an authorized Administrator reassigns the request, preserving reassignment history and threshold authority.
  * **5a.** Rejected request: do not activate the proposed financial terms; retain the decision and reason.

## UC-24

* **ID / Code:** UC-24
* **Use Case Name:** Close or reopen an administrative period
* **Description:** Close an administrative month or quarter, or exceptionally reopen it under higher authority with an audited reason.
* **Primary Actor:** Administrator
* **Supporting Actors:** None
* **Scope:** Turbine internal invoicing and collections application.
* **Level:** User Goal
* **Related requirements:** BR-01, BR-07, BR-08; UR: UR-16; FR: FR13.2; NFR-04, NFR-05, NFR-06.
* **Source:** E pp. 3, 14.
* **Stakeholders & Interests:**
  * *Administrator:* prevent ordinary changes after period review and control exceptional reopening.
  * *Accounting firm:* work from a stable, traceable accounting period and identify later corrections without an application account.
  * *Turbine finance staff:* retain period history without debt being erased by closing.
* **Preconditions:** The actor is an authenticated Administrator with period-closing authority and the target period exists. Exceptional reopening additionally requires the higher reopen capability and a recorded reason; actor generalisation does not remove that check.
* **Postconditions:** The period state and authorised close/reopen event are stored and enforced on subsequent financial changes. A rejected close leaves its former state; reopening preserves issued snapshots and correction history.
* **Success Guarantee:** The period state and any exceptional reopening are audited and enforced in subsequent financial operations.
* **Minimal Guarantee:** The period state does not erase history, reclassify debt as paid, or supersede invoice correction and audit rules.
* **Trigger:** An authorized actor requests closing after review, or exceptional reopening with a reason.
* **Main Success Scenario:**
1. The actor selects the month or quarter and reviews its financial records and unresolved exceptions.
2. The system previews which ordinary financial changes the close will restrict.
3. The actor confirms closing; the system records the period, actor, time, and reason.
4. The system rejects later ordinary mutations in that period unless the authorized exceptional procedure is followed.

* **Extensions:**
  * **1a.** Exceptional reopening: require the higher capability and a reason; record the decision before allowing the narrowly authorized procedure.
  * **3a.** Unresolved blocking exception or concurrent financial change: reject the close and show the conflict for review.
  * **4a.** Correction requested: use UC-21 and its period checks; reopening never permits silent rewriting of issued invoice snapshots.

## 5. Coverage and delivery scope

The 24 stable UC identifiers match the four views in [use-case-diagram.pu](use-case-diagram.pu). The **Related requirements** fields and inventory retain the existing consolidated BR/UR/FR/NFR mappings; all 59 current FR are covered. Former requirement numbers in historical consolidation notes are not live mappings.

Relationships used by the flows are: UC-10 and UC-21 include UC-09; UC-09 includes UC-11; UC-15 includes the debt calculation of UC-16. UC-09 extends UC-06 for initial proration, UC-23 extends UC-06/UC-08/UC-21 when approval is required, and UC-22 extends UC-11/UC-12 for delivery or reconciliation problems. Included calls preserve their authorised caller context. A successful parent flow may record queued delivery; an included dispatch failure does not undo a durable issued invoice.

The historical October 15 coordination review is retained at `notes/submission1-integration-review.md`, outside the four source deliverables. Its DEC entries are a dated review history, not a second active requirements baseline. C4, C9 and C11 in requirements.md supersede the corresponding older questions; other unconfirmed policy details remain explicitly conditional in the contracts, particularly dashboard capabilities, date-count conventions, proration/rounding configuration and exceptional approval thresholds. No later client approval is implied.

For issue #11, compile only the four named deliverables: requirements, use case diagram, use case specification and Scrum report. Do not compile the notes folder into a fifth deliverable. This document specifies expected behaviour; it does not report implemented functionality or executed application tests.
