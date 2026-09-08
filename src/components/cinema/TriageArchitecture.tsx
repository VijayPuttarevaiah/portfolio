"use client";

import { useState } from "react";

const steps = [
  { name: "Detect", service: "CloudWatch → Step Functions", detail: "An alarm starts the incident workflow. CloudWatch evidence gives the diagnosis context about the Java / Spring Boot workload on ECS Fargate." },
  { name: "Diagnose", service: "Lambda + AWS Bedrock", detail: "Bedrock produces a structured diagnosis and names a proposed action. The model does not call AWS infrastructure APIs." },
  { name: "Decide", service: "Policy engine + DynamoDB", detail: "A deterministic policy decides whether to allow the proposed action or require human approval. Incident-ID conditional writes prevent duplicate remediation." },
  { name: "Remediate", service: "Approved action → Lambda", detail: "Only the approved path reaches remediation. Ten Lambda functions participate in the overall workflow, with least-privilege IAM separating responsibilities." },
  { name: "Verify", service: "Workload → CloudWatch evidence", detail: "The workflow verifies the result against the workload. Under 120 seconds MTTR is an engineering target for the auto-approved path, not a measured production result." },
];

export default function TriageArchitecture() {
  const [selected, setSelected] = useState(0);
  const [approval, setApproval] = useState(false);
  return (
    <div className="triage-architecture">
      <div className="triage-intro"><div><p className="cinema-label">INSIDE TRIAGE</p><h4>From alarm to verified recovery.</h4></div><span>Architecture walkthrough</span></div>
      <p className="triage-caption">Explore the workflow. This illustration does not connect to AWS or execute infrastructure actions.</p>
      <ol className="triage-flow" aria-label="Incident response stages">
        {steps.map((step, index) => <li key={step.name}><button type="button" aria-pressed={selected === index} aria-controls="triage-stage" onClick={() => setSelected(index)}><span className="triage-step-number">0{index + 1}</span><strong>{step.name}</strong><small>{step.service}</small></button></li>)}
      </ol>
      <div id="triage-stage" className="triage-stage" aria-live="polite"><h5>{steps[selected].name}</h5><p>{steps[selected].detail}</p></div>
      <div className="triage-policy"><label><input type="checkbox" checked={approval} onChange={(event) => setApproval(event.target.checked)} /> Explore the human-approval path</label><p aria-live="polite">{approval ? "Policy decision → Wait for human approval → Approved remediation → Verify" : "Policy decision → Auto-approved remediation → Verify"}</p></div>
      <a href="https://github.com/VijayPuttarevaiah/triage" target="_blank" rel="noreferrer noopener">Inspect the implementation on GitHub ↗</a>
    </div>
  );
}
