# LumiqAI Automation Command Center Blueprint

This document defines the complete automation command center for the LumiqAI platform. It is designed for n8n to read, understand, and implement as the central orchestration layer.

---

## 1. System Overview

LumiqAI is a B2B credit intelligence platform with a React frontend dashboard and a Supabase backend. The system serves enterprise lenders who need to assess SMB creditworthiness.

The platform consists of:

- A frontend dashboard for enterprise users to view customers, scores, applications, and reports
- A backend API layer built with Supabase Edge Functions
- A PostgreSQL database with multi-tenant isolation
- External integrations with credit bureaus and financial data providers

The automation command center exists to:

- Orchestrate scheduled background jobs
- Trigger code changes through Claude Code when instructed by operators
- Coordinate deployments after code merges
- Monitor system health and alert on failures
- Automate repetitive operational tasks

n8n is the brain of this command center. It does not write code. It instructs other systems to do work and coordinates the results.

---

## 2. Tools in the System and Their Roles

### GitHub

- Hosts all frontend and backend source code
- Manages pull requests and code reviews
- Triggers deployments via GitHub Actions
- Claude Code opens PRs here when instructed

### Claude Code

- An AI coding agent connected to the GitHub repositories
- Can be triggered via GitHub mentions or API calls
- Opens pull requests with code changes
- Does not deploy code directly
- Must be given explicit, scoped instructions

### Supabase

- Hosts the PostgreSQL database
- Runs Edge Functions for backend API
- Manages authentication and row-level security
- Provides realtime subscriptions for live data

### Lovable

- The frontend build and hosting platform
- Automatically deploys when code merges to main branch
- Provides preview environments for testing

### n8n

- The automation command center
- Orchestrates all background jobs
- Triggers Claude Code for code changes
- Monitors system health
- Sends alerts and notifications
- Coordinates multi-step workflows

### Slack or Email

- Receives alerts from n8n
- Allows operators to trigger workflows
- Provides audit trail of automated actions

---

## 3. What n8n Is Responsible For

n8n is the central orchestrator. Its responsibilities are:

### Scheduling and Background Jobs

- Run credit score refresh jobs on schedules
- Execute Early Warning System evaluations daily
- Retry failed webhook deliveries
- Generate scheduled reports
- Clean up expired data

### Triggering Code Changes

- Receive instructions from operators
- Format those instructions for Claude Code
- Trigger Claude Code via GitHub issue or comment
- Monitor the resulting pull request
- Notify operators when PR is ready for review

### Deployment Coordination

- Detect when PRs merge to main branch
- Trigger post-deployment health checks
- Notify operators of deployment status
- Rollback if health checks fail

### Monitoring and Alerting

- Check API health endpoints periodically
- Monitor database connection health
- Alert on error rate thresholds
- Track job completion status

### Data Operations

- Trigger data exports on request
- Coordinate bulk data imports
- Execute database maintenance tasks

---

## 4. What n8n Must Never Do

n8n has strict boundaries. It must never:

### Never Write Application Code

- Do not generate JavaScript, TypeScript, SQL, or any code
- Do not modify files in the repository directly
- Do not commit code to GitHub
- All code changes must go through Claude Code

### Never Access Production Data Directly

- Do not run arbitrary SQL queries
- Do not modify database records directly
- Do not bypass the API layer
- All data operations must use the defined Edge Functions

### Never Deploy Without Verification

- Do not trigger deployments without health checks
- Do not skip the PR review process
- Do not merge PRs automatically
- Humans approve all code changes

### Never Store Secrets in Workflows

- Do not hardcode API keys
- Do not log sensitive data
- Use n8n's credential store for all secrets

### Never Act Without Clear Instructions

- Do not interpret vague requests
- Do not make assumptions about intent
- Ask for clarification when instructions are ambiguous
- Log all decisions for audit

---

## 5. Source of Truth Rules

These rules define what system owns what data:

### GitHub is the source of truth for:

- All application code
- Infrastructure configuration
- API documentation
- Changelog and release notes

### Supabase is the source of truth for:

- All application data
- User accounts and authentication
- Tenant and portfolio configuration
- Audit logs and compliance records

### n8n is the source of truth for:

- Automation schedules
- Job execution history
- Alert configurations
- Workflow definitions

### Operator instructions are the source of truth for:

- What features to build
- What bugs to fix
- What changes to prioritize

n8n does not decide what to build. It executes what operators instruct.

---

## 6. Core Command Center Workflows

The command center requires these core workflows:

### Feature Request Workflow

Receives a feature request from an operator and triggers Claude Code to implement it.

### Deployment Workflow

Detects merged PRs and coordinates deployment verification.

### Scheduled Jobs Workflow

Runs background jobs on defined schedules.

### Health Check Workflow

Monitors system health and alerts on issues.

### Alert Notification Workflow

Sends notifications to operators via Slack or email.

### Manual Trigger Workflow

Allows operators to trigger any job on demand.

Each workflow is defined in detail in the following sections.

---

## 7. Workflow 1: Build Feature via Claude Code

### Purpose

Allow operators to request code changes and have Claude Code implement them.

### Trigger

Webhook from Slack command or manual n8n trigger.

### Input

- Feature description in plain English
- Target repository (frontend or backend)
- Priority level (normal, urgent)
- Requesting operator name

### Steps

1. Receive the feature request
2. Validate that all required fields are present
3. Format the request as a Claude Code instruction
4. Create a GitHub issue in the target repository
5. Mention Claude Code in the issue body
6. Log the request with timestamp and operator
7. Wait for Claude Code to create a PR
8. When PR is created, notify the operator
9. Include PR link in the notification

### Output

- GitHub issue created
- Claude Code triggered
- Operator notified

### Error Handling

- If GitHub API fails, retry 3 times
- If Claude Code does not respond in 30 minutes, alert operator
- Log all errors with full context

---

## 8. Workflow 2: Deploy After PR Merge

### Purpose

Coordinate deployment verification after code merges.

### Trigger

GitHub webhook on PR merge to main branch.

### Input

- PR number
- PR title
- Merge commit SHA
- Author

### Steps

1. Receive the merge webhook
2. Log the deployment start
3. Wait 5 minutes for deployment to propagate
4. Call the health check endpoint
5. Verify response status is 200
6. Check that response includes expected fields
7. If healthy, notify operator of successful deployment
8. If unhealthy, send urgent alert to operator
9. Log the deployment result

### Output

- Deployment verified or alert sent
- Audit log updated

### Error Handling

- If health check fails, retry 3 times with 1 minute delay
- If all retries fail, send critical alert
- Include rollback instructions in alert

---

## 9. Workflow 3: Scheduled Background Jobs

### Purpose

Run recurring background jobs on defined schedules.

### Jobs and Schedules

#### Credit Score Refresh

- Schedule: Every 6 hours
- Action: Call the score refresh Edge Function
- Scope: All entities with scores older than 24 hours

#### Early Warning System Evaluation

- Schedule: Daily at 2 AM UTC
- Action: Evaluate all monitored entities for risk signals
- Output: Create alerts for entities exceeding thresholds

#### Webhook Retry

- Schedule: Every 15 minutes
- Action: Retry failed webhook deliveries
- Scope: Deliveries failed in last 24 hours, max 5 retries

#### Report Generation

- Schedule: Weekly on Monday at 6 AM UTC
- Action: Generate portfolio summary reports
- Output: Store reports and notify subscribers

#### Data Cleanup

- Schedule: Daily at 4 AM UTC
- Action: Delete expired sessions and temporary data
- Scope: Data older than retention period

### Steps for Each Job

1. Start at scheduled time
2. Log job start with timestamp
3. Call the appropriate Edge Function
4. Wait for response
5. Log job completion or failure
6. If failure, determine if retry is needed
7. Send alert if job fails after retries

### Error Handling

- Each job has independent error handling
- Failed jobs do not block other jobs
- Critical job failures trigger immediate alerts

---

## 10. How Claude Code Is Triggered

Claude Code is an AI coding agent. It responds to mentions in GitHub issues and comments.

### Trigger Method

Create a GitHub issue with the following format:

```
Title: [Feature/Bug/Task] Brief description

Body:
@claude-code

## Context
Explain the current state of the system relevant to this task.

## Request
Describe exactly what code changes are needed.

## Acceptance Criteria
List the specific outcomes that define success.

## Files Likely Affected
List the files or directories that may need changes.

## Constraints
List any limitations or requirements to follow.
```

### Instruction Quality Rules

- Be specific about what to change
- Provide context about why the change is needed
- Define clear acceptance criteria
- Mention relevant file paths
- Include any constraints or limitations

### What Claude Code Will Do

- Read the issue description
- Analyze the codebase
- Create a branch
- Make the requested changes
- Open a pull request
- Reference the original issue

### What Claude Code Will Not Do

- Deploy code
- Merge its own PRs
- Make changes outside the defined scope
- Access production data

### Monitoring Claude Code

- n8n should poll for PR creation after triggering
- Expected response time is 5-30 minutes
- If no PR after 60 minutes, alert operator

---

## 11. How Human Operators Use the System

Operators interact with the command center through defined channels.

### Requesting Features

1. Send a message to the designated Slack channel
2. Use the format: `/feature [description]`
3. n8n receives the webhook
4. n8n triggers Claude Code
5. Operator receives notification when PR is ready

### Triggering Manual Jobs

1. Access the n8n dashboard
2. Navigate to the Manual Triggers workflow
3. Select the job to run
4. Click Execute
5. Monitor the execution log

### Viewing Job History

1. Access the n8n dashboard
2. View the Executions tab
3. Filter by workflow name
4. Review execution details and logs

### Responding to Alerts

1. Receive alert via Slack or email
2. Review the alert details
3. Access relevant systems to investigate
4. Take corrective action
5. Acknowledge the alert in n8n

### Approving Deployments

1. Receive PR notification
2. Review the code changes in GitHub
3. Approve or request changes
4. Merge when ready
5. n8n detects merge and runs deployment verification

---

## 12. Operating Principles and Safety Rules

These principles govern all automation behavior.

### Principle 1: Humans Approve All Code Changes

No code reaches production without human review. Claude Code creates PRs. Humans merge them.

### Principle 2: Automation is Auditable

Every action n8n takes is logged with:

- Timestamp
- Workflow name
- Input parameters
- Output results
- Error messages if any

### Principle 3: Failures Alert Immediately

When something fails:

- Alert the operator within 1 minute
- Include all context needed to diagnose
- Suggest next steps if possible

### Principle 4: Scope is Explicit

Every workflow has defined:

- What it does
- What it does not do
- What triggers it
- What outputs it produces

### Principle 5: Secrets are Protected

- All credentials stored in n8n credential store
- No secrets in workflow definitions
- No secrets in logs

### Principle 6: Idempotency is Required

Running the same job twice with the same input should not cause problems. Jobs must be designed to be safely re-run.

### Principle 7: Graceful Degradation

If an external service is unavailable:

- Retry with exponential backoff
- After max retries, alert and stop
- Do not cascade failures to other workflows

### Principle 8: Documentation is Mandatory

Every workflow must have:

- A clear name
- A description of purpose
- Defined inputs and outputs
- Error handling documentation

---

## Appendix: Workflow Naming Convention

Use this naming convention for all workflows:

- `CMD_[Category]_[Action]`

Categories:

- `FEATURE` - Feature request workflows
- `DEPLOY` - Deployment workflows
- `JOB` - Scheduled background jobs
- `HEALTH` - Health check workflows
- `ALERT` - Alert and notification workflows
- `MANUAL` - Manual trigger workflows

Examples:

- `CMD_FEATURE_TriggerClaudeCode`
- `CMD_DEPLOY_VerifyHealth`
- `CMD_JOB_RefreshScores`
- `CMD_HEALTH_CheckAPI`
- `CMD_ALERT_NotifySlack`
- `CMD_MANUAL_RunJob`

---

## Appendix: Edge Function Endpoints

These are the backend endpoints n8n should call:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | System health check |
| `/scores` | POST | Trigger score refresh |
| `/risk` | POST | Run risk evaluation |
| `/reports` | POST | Generate report |
| `/customers` | GET | List customers |
| `/applications` | GET | List applications |
| `/audit-events` | POST | Log audit event |

All endpoints require authentication via Bearer token.

---

## Appendix: Alert Severity Levels

| Level | Response Time | Channel |
|-------|--------------|---------|
| Critical | Immediate | Slack + SMS |
| High | 15 minutes | Slack |
| Medium | 1 hour | Email |
| Low | Next business day | Email digest |

---

## Appendix: Retry Configuration

| Scenario | Max Retries | Delay |
|----------|-------------|-------|
| API call failure | 3 | 30 seconds |
| Webhook delivery | 5 | Exponential (1m, 5m, 15m, 1h, 6h) |
| Health check | 3 | 1 minute |
| Claude Code timeout | 2 | 15 minutes |

---

## End of Document

This document defines the complete automation command center. n8n should use this as the blueprint for all workflow creation and operation. No deviations from these rules are permitted without explicit operator approval.
