# Class Diagram Traceability

Companion to [class-diagram.pu](class-diagram.pu) (#45). The matrix shows which classes and operations carry the main success scenario of each [use case contract](use-cases/README.md). It describes a design; no application has been implemented or tested. `node scripts/validate-class-diagram.cjs` checks that every operation cited below exists with the same name in the diagram.

## 1. Reading the diagram

- **Base.** The 15 concepts of [domain-model.pu](domain-model.pu) keep their names, attributes and association multiplicities. The domain model is not changed by this diagram.
- **Layers.** Names follow the architecture proposal in PR #64: controllers coordinate and check permissions, entities hold the business rules, and the domain declares ports that infrastructure adapters implement.
- **`ctx: ExecutionContext`.** The caller's identity on every protected operation: a user, an API client or the system identity used by `Scheduler`. Automatic jobs therefore pass through the same controllers and checks as people.
- **Views.** All classes are defined once in `class-diagram.pu`. The `$VIEW` line at the top selects `all`, `customers`, `invoicing`, `governance`, `application` or `types`; no view redefines a class. Controller-to-port dependencies appear only in the `application` view.

| View | Image | Content |
| --- | --- | --- |
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
| UC-08 | `Scheduler.onTick`, `CollectionsController.runReminders` | `InvoiceRepository.findDueForFollowUp`, `Reminder.isDue`, `Invoice.outstandingBalance`, `Invoice.eligibleRecipients`, `ConfigurationRepository.currentTemplate`, `Reminder.prepareMessage`, `DeliveryAttempt.queue`, `CommunicationService.send`, `DeliveryAttempt.recordObservedResult`, `Reminder.scheduleNext`, `Notification.create`, `AutomationRun.finish` |
| UC-09 | `ReportingOperationsController.loadWorkQueue`, `ReportingOperationsController.searchWork`, `ReportingOperationsController.openWorkItem`, `ReportingOperationsController.markNotification` | `WorkRepository.findWorkFor`, `ExecutionContext.authorize`, `User.canAccess`, `Notification.markRead`, `Notification.markHandled`, `WorkRepository.saveNotification` |
| UC-10 | `CustomerSubscriptionController.requestCancellation`, `ReportingOperationsController.queryObligations`, `CustomerSubscriptionController.confirmCancellation` | `ExecutionContext.authorize`, `WorkRepository.saveTask`, `InvoiceRepository.findOutstanding`, `Customer.calculateObligations`, `Cancellation.confirm`, `Subscription.stopBillingFrom`, `AuditRepository.append` |
| UC-11 | `ReportingOperationsController.queryObligationsViaApi` | `UserRepository.findApiClient`, `ApiClient.authenticate`, `ApiClient.allows`, `ApiClient.withinCallLimit`, `CustomerRepository.findByReference`, `InvoiceRepository.findOutstanding`, `Customer.calculateObligations`, `AuditEntry.record`, `AuditRepository.append` |
| UC-12 | `ReportingOperationsController.getFinancialIndicators`, `ReportingOperationsController.drillDown`, `ReportingOperationsController.generateExport`, `ReportingOperationsController.downloadOutput` | `ExecutionContext.authorize`, `InvoiceRepository.findMatching`, `ReportRepository.saveOutput`, `ReportOutput.isDownloadable`, `DocumentStorage.store`, `DocumentStorage.retrieve` |
| UC-13 | `ConfigurationController.getPolicy`, `ConfigurationController.previewPolicyChange`, `ConfigurationController.confirmPolicyChange` | `ConfigurationRepository.currentPolicy`, `BillingPolicy.validate`, `BillingPolicy.activate`, `ConfigurationRepository.savePolicy`, `AuditRepository.append` |
| UC-14 | `AuditBackupController.searchAudit`, `AuditBackupController.openAuditEntry`, `AuditBackupController.getAutomationHealth` | `AuditRepository.search`, `AutomationRunRepository.latestByJob`, `BackupRepository.latestValid` |
| UC-15 | `InvoicingController.previewCorrection`, `InvoicingController.correctInvoice`, `InvoicingController.prepareDraft`, `InvoicingController.issueInvoice` | `Invoice.createCorrection`, `AccountingPeriod.allowsFinancialChange`, `Invoice.linkCorrection`, `Invoice.outstandingBalance`, `Customer.calculateObligations` |
| UC-16 | `CollectionsController.openIssue`, `CollectionsController.addIssueComment`, `CollectionsController.resolveIssue` | `IssueRepository.save`, `Notification.create`, `BillingIssue.addComment`, `BillingIssue.close`, `Invoice.resumeFollowUp` |
| UC-17 | `ApprovalController.listPending`, `ApprovalController.openRequest`, `ApprovalController.decide` | `ApprovalRepository.findPendingFor`, `BillingPolicy.requiredApproverRole`, `ApprovalRequest.canBeDecidedBy`, `ApprovalRequest.isProposalCurrent`, `ApprovalSubject.currentProposal`, `ApprovalRequest.approve`, `ApprovalRepository.save`, `Notification.create` |
| UC-18 | `ReportingOperationsController.previewPeriodClose`, `ReportingOperationsController.closePeriod` | `AccountingPeriod.blockingExceptions`, `AccountingPeriod.close`, `AccountingPeriodRepository.save`, `AuditRepository.append`, `AccountingPeriod.allowsFinancialChange` |
| UC-19 | `InvoicingController.previewIssuance`, `InvoicingController.issueInvoice`, `InvoicingController.sendInvoice` | `Customer.validateForInvoicing`, `Invoice.validateForIssuance`, `Invoice.isCurrentDraft`, `Invoice.isIssued`, `Invoice.requiresApproval`, `Invoice.hasCurrentApproval`, `AccountingPeriodRepository.findCovering`, `AccountingPeriod.allowsFinancialChange`, `ConfigurationRepository.activeSeries`, `InvoiceSeries.nextNumber`, `Invoice.issue`, `PdfRenderer.renderInvoice`, `DocumentStorage.store`, `Invoice.attachOriginalDocument`, `InvoiceRepository.save` |
| UC-20 | `InvoicingController.sendInvoice`, `InvoicingController.recordDeliveryResult` | `ExecutionContext.authorize`, `DocumentStorage.exists`, `Invoice.eligibleRecipients`, `Contact.canReceive`, `ConfigurationRepository.currentTemplate`, `MessageTemplate.render`, `DeliveryAttempt.queue`, `CommunicationService.send`, `DeliveryAttempt.recordObservedResult`, `Invoice.isNotified` |
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

## 4. Coordination with PR #64

PR #64 is still a proposal. The diagram uses its current names and does not modify that branch. These points need agreement before #46 and the sequence diagrams rely on them:

1. **Names used as published:** `PaymentGateway`, `CommunicationService`, `DocumentStorage`, `PdfRenderer`, `InvoiceRepository` and `Scheduler`. The grouped application components become `AccessController`, `CustomerSubscriptionController`, `InvoicingController`, `CollectionsController`, `ApprovalController`, `ReportingOperationsController`, `ConfigurationController` and `AuditBackupController`.
2. **`PaymentGateway` naming.** The contracts state that TurbineH does not operate a payment gateway. The port is kept with its published name but only queries and verifies transactions. The team may prefer to rename it in #64.
3. **Ports added here, not listed in #64:** `PasswordHasher` (UC-01), `AnnualRevenueProvider` (FR5.3 simulated source) and `BackupEngine` (UC-21, UC-22). #64 stores backups through a storage interface, but creating and restoring a data backup needs more than storing a file.
4. **Repositories.** #64 asks for repositories per aggregate without naming them, apart from `InvoiceRepository`. The other repository names are proposed here and are implemented by the `Persistence` component of #64.
5. **Adapters.** `DocumentStorageAdapter` and `PdfGeneratorAdapter` stand for the `Document Storage` and `PDF Generator` components of #64.

## 5. Handoff to the sequence diagram (#47)

The description of #47 still places the whole flow in UC-05. The contracts now split it, so the sequence should follow these stages. #47 also depends on the component diagram (#46), which is still open; lifelines must be confirmed against it.

| Stage | Entry operation | Main collaborators |
| --- | --- | --- |
| Preparation (UC-05) | `InvoicingController.prepareDraft`, `InvoicingController.saveDraft` | `Invoice.createDraft`, `Invoice.recalculateTotal`, `Invoice.calculateDueDate`, `InvoiceRepository.save`. No number is assigned. |
| Issuance (UC-19) | `InvoicingController.issueInvoice` | `Invoice.validateForIssuance`, `Invoice.hasCurrentApproval`, `AccountingPeriod.allowsFinancialChange`, `InvoiceSeries.nextNumber`, `Invoice.issue`, `PdfRenderer.renderInvoice`, `DocumentStorage.store`, `Invoice.attachOriginalDocument` |
| Sending (UC-20) | `InvoicingController.sendInvoice` | `Invoice.eligibleRecipients`, `MessageTemplate.render`, `DeliveryAttempt.queue`, `CommunicationService.send`, `InvoicingController.recordDeliveryResult`, `DeliveryAttempt.recordObservedResult` |

## 6. Limits

- Operations cover the main scenarios and the main branches of the extensions. Per-user conveniences are not modelled as classes: saved views, favourites, notification preferences (FR8.3.3, FR8.3.4, FR7.1.2) and alert rules (FR7.2). They can be added if the team wants them in this diagram.
- Roles are the `Role` enumeration plus `Capability` values rather than a class hierarchy, because the contracts require a specific capability check even for a Super Administrator.
- The diagram does not define tables, keys or column types; those belong to the ER diagram (#44).
