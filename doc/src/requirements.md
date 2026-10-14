# Software Requirements
> High-level specification outlining business goals, user needs, and technical behavior for the system.

## Business Requirements
> Answering the "What for?" or "Why?" of the business (commercial, financial, or strategic goals).

- BR-01: Delete the manual creation of bills and payment prosecution for liberating the CEO the administrative charge and allowing the team to focus on 
         the main product and enterprise growth.
- BR-02: Provide an independent and internal web product from Brain for centralization, automatization and payment follow-up.
- BR-03: Reduce to the minimum the execution time of any administrative procedure or billing to under one minute, avoiding steep learning curves.
- BR-04: Guaranteeing the Cash-Flow assuring the bill payment in a standard term of 5 days, preventing clients for unsubscribing with debts.
- BR-05: Providing the company of an operative basis for scaling clients, preparing the operative for future administrative departments.
- BR-06: Assuring anual update of the recurrent incomes revising the anual facturation stretch of each client for adjusting prices automatically.
- BR-07: Proposing finalcial visibility direction of the performance and the accounting statement of the company revenue.
- BR-08: Minimizing the development and technological infrastructure using free, or low cost solutions according to the budget of a Start-up.

## User Requirements
> Answering "What does the user want to achieve?" (Customer or actor goals).

- UR-01: ...
- UR-02: ...
- UR-03: ...

## System Requirements
> Technical translation of user and business goals into executable functional capabilities and quality constraints.

### Functional Requirements
> Answering "What the system does to fulfill user requirements?" (Inputs, outputs, calculations, and technical behavior).

- FR-01: ...
  - Dependencies / Relationships: ...
- FR-02: ...
  - Dependencies / Relationships: ...
- FR-03: ...
  - Dependencies / Relationships: ...

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
