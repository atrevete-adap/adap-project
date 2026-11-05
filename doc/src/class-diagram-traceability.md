# Class Diagram Traceability

Companion to [class-diagram.pu](class-diagram.pu) (#45). The matrix shows which classes and operations carry the main success scenario of each [use case contract](use-cases/README.md). It describes a design; no application has been implemented or tested. `node scripts/validate-class-diagram.cjs` checks that every operation cited below exists with the same name in the diagram.

## 1. Reading the diagram

- **Base.** The 15 concepts of [domain-model.pu](domain-model.pu) keep their names, attributes and association multiplicities. The domain model is not changed by this diagram.
- **Layers.** Names follow the architecture proposal in PR #64: controllers coordinate and check permissions, entities hold the business rules, and the domain declares ports that infrastructure adapters implement.
- **`ctx: ExecutionContext`.** The caller's identity on every protected operation: a user, an API client or the system identity used by `Scheduler`. Automatic jobs therefore pass through the same controllers and checks as people.
- **Views.** All classes are defined once in `class-diagram.pu`. The `$VIEW` line at the top selects `all`, `core`, `customers`, `invoicing`, `governance`, `application` or `types`; no view redefines a class. Controller-to-port dependencies appear only in the `application` and `core` views.
- **Colours.** Yellow: main entities (the domain model concepts plus `Reconciliation`). White: supporting entities and domain contracts. Blue: controllers. Green: ports. Grey: value objects and infrastructure.

| View | Image | Content |
| --- | --- | --- |
| `core` | [class-diagram-core.png](img/class-diagram-core.png) | Summary for review and presentation: the main invoicing flow with members hidden. Labels on the dashed dependencies name the real operations. Start here. |
| `all` | [class-diagram.png](img/class-diagram.png) | Every class and relationship except the controller-to-port dependencies. Very large: open it at full size. |
| `customers` | [class-diagram-customers.png](img/class-diagram-customers.png) | Customers, subscriptions, annual reviews, cancellation. |
| `invoicing` | [class-diagram-invoicing.png](img/class-diagram-invoicing.png) | Invoices, delivery, payments, reconciliations, reminders, issues. |
| `governance` | [class-diagram-governance.png](img/class-diagram-governance.png) | Users, approvals, audit, policies, automation, reports, backups. |
| `application` | [class-diagram-application.png](img/class-diagram-application.png) | Controllers, Scheduler, ports, adapters and their dependencies. |
| `types` | [class-diagram-types.png](img/class-diagram-types.png) | Value objects and enumerations. |

## 2. Main scenario traceability

| Use case | Controller operations | Domain and port operations |
| --- | --- | --- |
| UC-01 | `AccessController.login` | `UserRepository.findByEmail`, `BillingPolicy.isAuthorisedDomain`, `User.canLogin`, `User.verifyPassword`, `PasswordHasher.matches`, `User.openSession`, `ReportingOperationsController.loadWorkQueue` |
| UC-02 | `CustomerSubscriptionController.searchCustomers`, `CustomerSubscriptionController.previewCustomerChange`, `CustomerSubscriptionController.saveCustomer`, `CustomerSubscriptionController.getCustomerTimeline` | `CustomerRepository.search`, `Customer.validateData`, `CustomerRepository.findByTaxId`, `Customer.applyChange`, `CustomerRepository.save`, `AuditEntry.record`, `AuditRepository.append` |
| UC-03 | `AccessController.previewAssignment`, `AccessController.confirmAssignment` | `ExecutionContext.authorize`, `User.canAccess`, `Customer.assignResponsible`, `WorkTask.reassignTo`, `AuditEntry.record`, `AuditRepository.append` |
| UC-04 | `CustomerSubscriptionController.previewSubscription`, `CustomerSubscriptionController.confirmSubscription` | `Customer.validateForInvoicing`, `Subscription.validateActivation`, `Subscription.previewProration`, `Subscription.activate`, `SubscriptionRepository.save` |
| UC-05 | `InvoicingController.offerDraftDefaults`, `InvoicingController.prepareDraft`, `InvoicingController.previewDraft`, `InvoicingController.saveDraft` | `Invoice.createDraft`, `Invoice.addLine`, `Invoice.validateForIssuance`, `Invoice.recalculateTotal`, `Invoice.calculateDueDate`, `Invoice.isCurrentDraft`, `Invoice.deviationWarning`, `InvoiceRepository.save` |
| UC-06 | `Scheduler.onTick`, `InvoicingController.generateMonthlyInvoices`, `InvoicingController.prepareDraft`, `InvoicingController.issueInvoice` | `BillingPolicy.dueJobs`, `AutomationRun.open`, `SubscriptionRepository.findBillable`, `Subscription.isBillableIn`, `InvoiceRepository.findForSubscriptionPeriod`, `Subscription.buildRecurringProposal`, `AutomationRun.recordItem`, `Notification.create`, `AutomationRun.finish` |
| UC-07 | `Scheduler.onTick`, `CollectionsController.synchronizePayments`, `CollectionsController.receivePaymentNotification`, `CollectionsController.reconcileAutomatically` | `PaymentGateway.queryTransactions`, `PaymentGateway.verifyNotification`, `Payment.fromEvidence`, `PaymentRepository.isEventProcessed`, `PaymentRepository.findByProviderTransaction`, `InvoiceRepository.findOpenByReference`, `Payment.matchesExactly`, `Payment.allocateTo`, `Invoice.outstandingBalance`, `Invoice.refreshPaymentStatus`, `Notification.create` |
| UC-08 | `Scheduler.onTick`, `CollectionsController.runReminders` | `InvoiceRepository.findDueForFollowUp`, `Reminder.isDue`, `Invoice.outstandingBalance`, `Invoice.eligibleRecipients`, `ConfigurationRepository.currentTemplate`, `Reminder.prepareMessage`, `DeliveryAttempt.queue`, `CommunicationService.send`, `DeliveryAttempt.recordDispatch`, `Reminder.scheduleNext`, `Notification.create`, `AutomationRun.finish` |
| UC-09 | `ReportingOperationsController.loadWorkQueue`, `ReportingOperationsController.searchWork`, `ReportingOperationsController.openWorkItem`, `ReportingOperationsController.markNotification` | `WorkRepository.findWorkFor`, `WorkRepository.searchWork`, `ExecutionContext.authorize`, `User.canAccess`, `Notification.markRead`, `Notification.markHandled`, `WorkRepository.saveNotification` |
| UC-10 | `CustomerSubscriptionController.requestCancellation`, `ReportingOperationsController.queryObligations`, `CustomerSubscriptionController.confirmCancellation` | `ExecutionContext.authorize`, `WorkRepository.saveTask`, `InvoiceRepository.findOutstanding`, `Customer.calculateObligations`, `Cancellation.confirm`, `Subscription.stopBillingFrom`, `AuditRepository.append` |
| UC-11 | `ReportingOperationsController.queryObligationsViaApi` | `UserRepository.findApiClient`, `ApiClient.authenticate`, `ApiClient.allows`, `ApiClient.withinCallLimit`, `CustomerRepository.findByReference`, `InvoiceRepository.findOutstanding`, `Customer.calculateObligations`, `AuditEntry.record`, `AuditRepository.append` |
| UC-12 | `ReportingOperationsController.getFinancialIndicators`, `ReportingOperationsController.drillDown`, `ReportingOperationsController.generateExport`, `ReportingOperationsController.downloadOutput` | `ExecutionContext.authorize`, `InvoiceRepository.findMatching`, `ReportRepository.saveOutput`, `ReportOutput.isDownloadable`, `DocumentStorage.store`, `DocumentStorage.retrieve` |
| UC-13 | `ConfigurationController.getPolicy`, `ConfigurationController.previewPolicyChange`, `ConfigurationController.confirmPolicyChange` | `ConfigurationRepository.currentPolicy`, `BillingPolicy.validate`, `BillingPolicy.activate`, `ConfigurationRepository.savePolicy`, `AuditRepository.append` |
| UC-14 | `AuditBackupController.searchAudit`, `AuditBackupController.openAuditEntry`, `AuditBackupController.getAutomationHealth` | `AuditRepository.search`, `AutomationRunRepository.latestByJob`, `BackupRepository.latestValid` |
| UC-15 | `InvoicingController.previewCorrection`, `InvoicingController.correctInvoice`, `InvoicingController.prepareDraft`, `InvoicingController.issueInvoice` | `Invoice.createCorrection`, `AccountingPeriod.allowsFinancialChange`, `Invoice.linkCorrection`, `Invoice.adjustedTotal`, `Invoice.allocatedAmount`, `Invoice.outstandingBalance`, `Invoice.excessAmount`, `Customer.calculateObligations` |
| UC-16 | `CollectionsController.openIssue`, `CollectionsController.addComment`, `CollectionsController.resolveIssue` | `IssueRepository.save`, `Notification.create`, `Comment.create`, `IssueRepository.saveComment`, `BillingIssue.close`, `Invoice.resumeFollowUp` |
| UC-17 | `ApprovalController.listPending`, `ApprovalController.openRequest`, `ApprovalController.decide` | `ApprovalRepository.findPendingFor`, `BillingPolicy.requiredApproverRole`, `ApprovalRequest.canBeDecidedBy`, `ApprovalRequest.isProposalCurrent`, `ApprovalSubject.currentProposal`, `ApprovalRequest.approve`, `ApprovalRepository.save`, `Notification.create` |
| UC-18 | `ReportingOperationsController.previewPeriodClose`, `ReportingOperationsController.closePeriod` | `AccountingPeriod.blockingExceptions`, `AccountingPeriod.close`, `AccountingPeriodRepository.save`, `AuditRepository.append`, `AccountingPeriod.allowsFinancialChange` |
| UC-19 | `InvoicingController.previewIssuance`, `InvoicingController.issueInvoice`, `InvoicingController.sendInvoice` | `Customer.validateForInvoicing`, `Invoice.validateForIssuance`, `Invoice.isCurrentDraft`, `Invoice.isIssued`, `Invoice.requiresApproval`, `Invoice.hasCurrentApproval`, `AccountingPeriodRepository.findCovering`, `AccountingPeriod.allowsFinancialChange`, `ConfigurationRepository.activeSeries`, `InvoiceSeries.nextNumber`, `Invoice.issue`, `PdfRenderer.renderInvoice`, `DocumentStorage.store`, `Invoice.attachOriginalDocument`, `InvoiceRepository.save` |
| UC-20 | `InvoicingController.sendInvoice`, `InvoicingController.receiveDeliveryReport` | `ExecutionContext.authorize`, `DocumentStorage.exists`, `Invoice.eligibleRecipients`, `Contact.canReceive`, `ConfigurationRepository.currentTemplate`, `MessageTemplate.render`, `DeliveryAttempt.queue`, `CommunicationService.send`, `DeliveryAttempt.recordDispatch`, `CommunicationService.verifyDeliveryReport`, `InvoiceRepository.findAttemptByProviderRef`, `DeliveryAttempt.matches`, `DeliveryAttempt.recordObservedResult`, `Invoice.isNotified` |
| UC-21 | `Scheduler.onTick`, `AuditBackupController.createBackup` | `BillingPolicy.dueJobs`, `BackupEngine.createArchive`, `BackupEngine.verifyArchive`, `Backup.recordValidation`, `BackupRepository.save`, `AutomationRun.finish` |
| UC-22 | `AuditBackupController.previewRestore`, `AuditBackupController.confirmRestore`, `Scheduler.resumeInterruptedJobs` | `Backup.isRestorable`, `BackupEngine.restoreArchive`, `RecoveryExecution.recordValidation`, `RecoveryExecution.complete`, `BackupRepository.saveRecovery`, `AutomationRunRepository.findInterrupted`, `AutomationRun.missingItems` |

## 3. Design decisions to review

| Topic | Decision | Source |
| --- | --- | --- |
| Draft, issuance, sending | `prepareDraft`/`saveDraft`, `issueInvoice` and `sendInvoice` are separate operations. `Invoice.issue` is the only operation that assigns a number. | UC-05, UC-19, UC-20, FR2.4.1 |
| Recovery and resends | `resumeDocumentStage` and `resendInvoice` never call `Invoice.issue`. Each resend is a new `DeliveryAttempt` on the same invoice. | UC-19, UC-20, FR2.4.2, FR2.7.5 |
| Amounts | `Money` pairs `Decimal` with an explicit currency. `IssuedSnapshot` and `InvoiceDocument` are read-only. No operation converts between currencies. | FR2.11, FR2.6, BR-06, Out of Scope |
| Payments | `Reconciliation` is one allocation between one `Payment` and one `Invoice`, with the allocated amount, evidence and reversal data. It refines the domain model's direct many-to-many link. | UC-07, FR3.1 |
| Approvals | `ApprovalRequest` holds a read-only `ProposalSnapshot`, and `isProposalCurrent` rejects a decision on a changed proposal. `canBeDecidedBy` covers threshold role and separation of duties. | UC-17, FR11, FR11.1 |
| Cancellation | `Cancellation` has no association with `Invoice`. `Subscription.stopBillingFrom` affects future billing only. | UC-10, FR4.1, C4 |
| Audit | `AuditRepository` has `append` and `search` only, so editing is not expressible. | UC-14, FR9.1.1 |
| Policies | `BillingPolicy` is versioned and is read by `Scheduler` through `dueJobs`. Issued invoices keep their snapshots when a policy changes. | UC-13, FR13.3 |
| Backup and recovery | `Backup` and `RecoveryExecution` are separate. Only `confirmRestore` restores, and it is never scheduled. | UC-21, UC-22 |
| Comments and attachments | `Comment` and `Attachment` each have exactly one `AnnotationTarget`: a `Customer`, an `Invoice` or a `BillingIssue`. The multiplicity `1` rules out an element with no target or with two, so no issue has to be opened to comment on a customer or invoice. `scopeCustomer` and `scopeInvoice` give the scope that permissions follow. `openIssue` rejects an invoice of another customer. `User.isAdministrator` limits restricted notes; `Comment.notifiableMentions` limits mention notifications to users who can see the comment. `CommunicationService` accepts neither type. | FR12, FR12.1, FR12.2, UC-16 4a-4g, use case README |
| Delivery evidence | No operation accepts a status from a caller. `receiveDeliveryReport` takes only the channel and the raw report; as with `receivePaymentNotification`, the caller is a provider and not a user, so it has no `ctx` and its authority comes from `CommunicationService.verifyDeliveryReport`. `findAttemptByProviderRef` and `DeliveryAttempt.matches` tie the evidence to the attempt that was sent. An unverified or unmatched report changes nothing, and `processedEventIds` ignores repeats. `refreshDeliveryStatus` needs a `ctx` and obtains its evidence from `queryStatus`. | UC-20 steps 6-8, 7b, 7c, FR2.7.3, FR2.7.4, FR6.2.5, FR14.4 |

## 4. Corrections and balances

FR2.8.2 and UC-15 require balances to reflect both documents and verified allocations. The responsibilities are:

| Operation | Responsibility |
| --- | --- |
| `Invoice.createCorrection` | Builds a new corrective draft linked to the original. It changes neither the original nor any payment. |
| `Invoice.linkCorrection` | Runs once the correction is issued. From then on it counts in the original's balance; a draft or rejected correction never counts. |
| `Invoice.adjustedTotal` | On an original: its total plus its issued corrections. |
| `Invoice.allocatedAmount` | Active `Reconciliation` amounts across the original and its corrections. Reversed allocations do not count. |
| `Invoice.outstandingBalance` | `max(adjustedTotal - allocatedAmount, 0)` on an original. A corrective document returns 0, so the correction is not counted twice. |
| `Invoice.excessAmount` | `max(allocatedAmount - adjustedTotal, 0)`. It only reports a difference; it creates no payment, refund or allocation. |
| `Customer.calculateObligations` | Adds `outstandingBalance` per currency across issued invoices. It holds no balance rule of its own and never converts. |

The examples below use the proposed signed convention (decision 1 in section 9). All are in EUR unless stated.

| Case | Original | Issued correction | Active allocations | Outstanding | Excess |
| --- | --- | --- | --- | --- | --- |
| Reduction, nothing paid | 1000 | -200 | 0 | 800 (not 1000 + 800) | 0 |
| Reduction, part paid | 1000 | -200 | 300 | 500 | 0 |
| Reduction after full payment | 1000 | -200 | 1000 | 0 | 200 |
| Same case, the 1000 allocation reversed | 1000 | -200 | 0 | 800 | 0 |
| Increase after full payment | 1000 | +150 | 1000 | 150 | 0 |

**Excess.** In the third case the 200 stays visible as excess. No refund or payment results from the correction; a cash refund follows the separately authorised workflow of UC-15 extension 8a.

**Currencies.** A customer with the first case above and an unpaid 500 USD invoice has `outstandingByCurrency` = [800 EUR, 500 USD]. The amounts are never added. A correction uses the currency of its original, because `Money` does not add across currencies and each invoice has one currency (FR2.11).

## 5. Coverage of the functions reviewed

"Covered" means that the design represents the function. Nothing here has been implemented. Sub-requirements share the priority of their parent.

| Requirement | Priority | Status | Representation |
| --- | --- | --- | --- |
| FR8.3.3 Named views | Must | Covered | `ReportingOperationsController.saveNamedView`, `User.saveView`, `SavedView`, `SearchFilters`. Reopening a view goes through `ReportingOperationsController.searchWork`, which applies current scope. |
| FR8.3.4 Favourites and recents | Must | Covered | `ReportingOperationsController.setFavourite`, `ReportingOperationsController.listQuickAccess`, `User.setFavourite`, `User.recordOpened`, and the `recentCustomers` attribute of `User`, limited to 10. `listQuickAccess` rechecks scope (UC-09 2b). |
| FR7.1.2 Notification preferences | Should | Covered | `ReportingOperationsController.setNotificationPreference`, `User.setNotificationPreference`, `User.channelFor`, `ReportingOperationsController.sendDailyDigests`. `Notification` is stored for every event, so in-app events are retained (UC-09 1b). |
| FR7.2 Alert rules | Could | Proposed | `AlertRule`, `AlertCondition`, `ReportingOperationsController.saveAlertRule`, `ReportingOperationsController.evaluateAlertRules`, `AlertRule.matches`. UC-09 1c keeps this function in the contracts, so it is represented; the team has not recorded a decision to include or exclude it (decision 3 in section 9). |
| FR12.1 Comments | Should | Covered | See section 3. |
| FR12.2 Attachments | Could | Proposed | `CollectionsController.addAttachment`, `Attachment.checkLimits`, `Attachment.createDownloadLink`, `DownloadLink.isValid`, `CollectionsController.openAttachmentLink`. UC-16 4d-4g keep this function in the contracts; the same scope decision applies. |

## 6. Coordination with PR #64

PR #64 is still a proposal. The diagram uses its current names and does not modify that branch. These points need agreement before #46 and the sequence diagrams rely on them:

1. **Names used as published:** `PaymentGateway`, `CommunicationService`, `DocumentStorage`, `PdfRenderer`, `InvoiceRepository` and `Scheduler`. The grouped application components become `AccessController`, `CustomerSubscriptionController`, `InvoicingController`, `CollectionsController`, `ApprovalController`, `ReportingOperationsController`, `ConfigurationController` and `AuditBackupController`.
2. **`PaymentGateway` naming.** The contracts state that TurbineH does not operate a payment gateway. The port is kept with its published name but only queries and verifies transactions. The team may prefer to rename it in #64.
3. **Ports added here, not listed in #64:** `PasswordHasher` (UC-01), `AnnualRevenueProvider` (FR5.3 simulated source) and `BackupEngine` (UC-21, UC-22). #64 stores backups through a storage interface, but creating and restoring a data backup needs more than storing a file.
4. **Repositories.** #64 asks for repositories per aggregate without naming them, apart from `InvoiceRepository`. The other repository names are proposed here and are implemented by the `Persistence` component of #64.
5. **Adapters.** `DocumentStorageAdapter` and `PdfGeneratorAdapter` stand for the `Document Storage` and `PDF Generator` components of #64.

## 7. Handoff to the sequence diagram (#47)

The description of #47 still places the whole flow in UC-05. The contracts now split it, so the sequence should follow these stages. #47 also depends on the component diagram (#46), which is still open; lifelines must be confirmed against it.

| Stage | Entry operation | Main collaborators |
| --- | --- | --- |
| Preparation (UC-05) | `InvoicingController.prepareDraft`, `InvoicingController.saveDraft` | `Invoice.createDraft`, `Invoice.recalculateTotal`, `Invoice.calculateDueDate`, `InvoiceRepository.save`. No number is assigned. |
| Issuance (UC-19) | `InvoicingController.issueInvoice` | `Invoice.validateForIssuance`, `Invoice.hasCurrentApproval`, `AccountingPeriod.allowsFinancialChange`, `InvoiceSeries.nextNumber`, `Invoice.issue`, `PdfRenderer.renderInvoice`, `DocumentStorage.store`, `Invoice.attachOriginalDocument` |
| Sending (UC-20) | `InvoicingController.sendInvoice` | `Invoice.eligibleRecipients`, `MessageTemplate.render`, `DeliveryAttempt.queue`, `CommunicationService.send`, `InvoicingController.receiveDeliveryReport`, `CommunicationService.verifyDeliveryReport`, `DeliveryAttempt.recordObservedResult` |

## 8. Limits

- Operations cover the main scenarios and the main branches of the extensions.
- Roles are the `Role` enumeration plus `Capability` values rather than a class hierarchy, because the contracts require a specific capability check even for a Super Administrator.
- The diagram does not define tables, keys or column types; those belong to the ER diagram (#44).

## 9. Decisions pending from the team

The baseline does not settle these points. The proposals are design suggestions for the team to accept or change, not client statements.

| # | Decision | Proposal used in the diagram |
| --- | --- | --- |
| 1 | Does a corrective document hold a signed difference or the full replacement total? Can a correction itself be corrected? | Signed difference, always linked to the original invoice. A replacement total would change only `Invoice.adjustedTotal`. The fiscal form of a corrective document should be confirmed before this is fixed. |
| 2 | Where does excess appear, and can it be applied to another invoice? | Visible on the invoice through `Invoice.excessAmount`. It is left out of `DebtSnapshot`, is not netted against other invoices, and is not moved automatically. |
| 3 | Are the Could functions FR7.2 and FR12.2 implemented in this project? | Keep them represented as proposed until the team decides. Their contract extensions already exist in UC-09 and UC-16. |
| 4 | Is "outstanding balance above X" (FR7.2) measured per invoice or per customer, and is the closed set only the three examples of FR7.2? | Per invoice, with the three conditions named in FR7.2 as `AlertCondition`. |
| 5 | Which status does an invoice show when a correction leaves nothing to collect? | Keep `RECTIFIED`. The amounts come from the balance operations and never from the status. |
| 6 | How does each provider or its simulation prove the origin of a delivery report? | The diagram fixes only the port, `CommunicationService.verifyDeliveryReport`. The mechanism belongs to the architecture work in #64 and #46. |
| 7 | What are the attachment formats, maximum size and download link lifetime? | Configurable in `BillingPolicy` (`attachmentFormats`, `attachmentMaxMegabytes`, `downloadLinkMinutes`); the baseline gives no values. |
