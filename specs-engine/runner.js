#!/usr/bin/env node
/**
 * specs-engine runner v5.4
 *
 * Phase 게이트 + 정량 검증 + 병렬 확대 + 구조 검증
 *
 * Usage:
 *   node runner.js <project-name> [phase]
 *   node runner.js void-breaker          # STATE.md 읽어서 다음 Phase부터
 *   node runner.js void-breaker design   # Design Phase 직행
 *   node runner.js --status void-breaker # 현재 상태 출력
 *   node runner.js --verify void-breaker # 정량 구조 검증 실행
 */

const fs = require("fs");
const path = require("path");

// ─── 설정 ────────────────────────────────────────────────────
const SPECS_DIR = path.join(process.cwd(), "specs");
const ENGINE_DIR = path.join(__dirname);
const TEMPLATES_DIR = path.join(ENGINE_DIR, "templates");
const RULES_DIR = path.join(ENGINE_DIR, "rules");

// ─── Phase 정의 ─────────────────────────────────────────────
//
// v5.4 변경:
//   - Planning 4-2를 3단계로 분할 (ch06 → ch07+ch08 병렬 → ch09)
//   - Design을 2단계로 분할 (ux + data-api 병렬 → security-infra-qa + domain)
//   - Implementation을 3 병렬로 분할 (dev-env, tasks, checklists)
//   - verify-impl 뒤에 gate: "spec-complete" 추가
//   - 정량 검증 함수 verifyStructure() 추가

const PHASES = [
  // ── Phase 1: Seed ──
  {
    id: "seed",
    name: "Seed",
    template: "seed.md",
    rules: [],
    preconditions: [],
  },
  // ── Phase 2a: Research (4 병렬) ──
  {
    id: "research",
    name: "Research",
    template: ["research/market.md", "research/competitor.md", "research/tech.md", "research/user.md"],
    parallel: true,
    agentCount: 4,
    rules: ["conventions.md"],
    preconditions: [{ file: "seed.md", required: true }],
  },
  // ── Phase 2b: Discovery ──
  {
    id: "discovery",
    name: "Discovery",
    template: "discovery.md",
    rules: ["roles.md", "types.md"],
    preconditions: [
      { file: "seed.md", required: true },
      { file: "research/market.md", required: true },
      { file: "research/competitor.md", required: true },
      { file: "research/tech.md", required: true },
      { file: "research/user.md", required: true },
    ],
  },
  // ── Phase 3: Skeleton ──
  {
    id: "skeleton",
    name: "Skeleton",
    template: "skeleton.md",
    rules: [],
    preconditions: [
      { file: "seed.md", required: true },
      { file: "context.md", required: true },
    ],
  },
  // ── Phase 4-1: Planning (Ch02-03 + Ch04-05) — 2 병렬 ──
  {
    id: "planning-1",
    name: "Planning (Ch02-03 + Ch04-05)",
    template: ["planning/ch02-03.md", "planning/ch04-05-contract.md"],
    parallel: true,
    agentCount: 2,
    rules: ["conventions.md", "roles.md"],
    preconditions: [
      { file: "context.md", required: true },
      { file: "skeleton.md", required: true },
      { file: "research/market.md", required: true },
      { file: "research/competitor.md", required: true },
      { file: "research/user.md", required: true },
    ],
  },
  // ── Phase 4-2a: Planning (Ch06 단독) ──
  {
    id: "planning-2a",
    name: "Planning (Ch06 기술개요)",
    template: "planning/ch06.md",
    rules: ["conventions.md"],
    preconditions: [
      { file: "planning/_contract.md", required: true },
      { file: "planning/05-product-definition.md", required: true },
    ],
  },
  // ── Phase 4-2b: Planning (Ch07 + Ch08) — 2 병렬 ──
  {
    id: "planning-2b",
    name: "Planning (Ch07 BM + Ch08 GTM)",
    template: ["planning/ch07.md", "planning/ch08.md"],
    parallel: true,
    agentCount: 2,
    rules: ["conventions.md"],
    preconditions: [
      { file: "planning/_contract.md", required: true },
      { file: "planning/05-product-definition.md", required: true },
      { file: "planning/04-user-analysis.md", required: true },
      { file: "planning/06-technical-overview.md", required: true },
    ],
  },
  // ── Phase 4-2c: Planning (Ch09 KPI) ──
  {
    id: "planning-2c",
    name: "Planning (Ch09 KPI)",
    template: "planning/ch09.md",
    rules: ["conventions.md"],
    preconditions: [
      { file: "planning/_contract.md", required: true },
      { file: "planning/07-business-model.md", required: true },
      { file: "planning/08-go-to-market.md", required: true },
    ],
  },
  // ── Phase 4-3: Planning (Ch10-12 + Ch01) ──
  {
    id: "planning-3",
    name: "Planning (Ch10-12 + Ch01)",
    template: "planning/ch10-12-01.md",
    rules: [],
    preconditions: [
      { file: "planning/_contract.md", required: true },
      { file: "planning/09-metrics-kpi.md", required: true },
    ],
  },
  // ── Phase 4-4: Assembly (기획서 조립 + postVerify) ──
  {
    id: "assembly",
    name: "Assembly (Phase 4-4)",
    template: "planning/assembly.md",
    rules: [],
    preconditions: [
      { file: "planning/_contract.md", required: true },
      { file: "skeleton.md", required: true },
      { file: "planning/01-executive-summary.md", required: true },
    ],
    postVerify: "verify/assembly-check.md",
  },
  // ── Phase 5: Verify (Planning) ──
  {
    id: "verify-planning",
    name: "Verify (Planning)",
    template: "verify/planning.md",
    rules: ["verify-patterns.md"],
    preconditions: [
      { file: "planning/_contract.md", required: true },
      { file: "context.md", required: true },
    ],
    structuralVerify: true,  // runner.js 정량 검증도 실행
  },
  // ── Phase 6a: Design (UX + Data-API) — 2 병렬 ──
  {
    id: "design-1",
    name: "Design (UX + Data-API)",
    template: ["design/ux.md", "design/data-api.md"],
    parallel: true,
    agentCount: 2,
    rules: ["roles.md"],
    preconditions: [
      { file: "context.md", required: true },
      { file: "planning/05-product-definition.md", required: true },
      { file: "planning/06-technical-overview.md", required: true },
    ],
  },
  // ── Phase 6b: Design (Security-Infra-QA + Domain) — 2 병렬 ──
  {
    id: "design-2",
    name: "Design (Security-Infra-QA + Domain)",
    template: ["design/security-infra-qa.md"],
    parallel: true,
    agentCount: 2,
    domainTemplate: "design/domain/",  // context.md type 기반 자동 선택
    rules: ["roles.md"],
    preconditions: [
      { file: "context.md", required: true },
      { file: "planning/05-product-definition.md", required: true },
      { file: "planning/06-technical-overview.md", required: true },
      { file: "design/api/api-endpoints.md", required: true },
      { file: "design/api/auth-flow.md", required: true },
    ],
  },
  // ── Phase 7: Verify (Design) ──
  {
    id: "verify-design",
    name: "Verify (Design)",
    template: "verify/design.md",
    rules: ["verify-patterns.md"],
    preconditions: [
      { file: "context.md", required: true },
      { file: "planning/05-product-definition.md", required: true },
    ],
    structuralVerify: true,
  },
  // ── Phase 8: Implementation (3 병렬) ──
  {
    id: "implementation",
    name: "Implementation",
    template: ["impl/dev-env.md", "impl/tasks.md", "impl/checklists.md"],
    parallel: true,
    agentCount: 3,
    rules: [],
    preconditions: [
      { file: "context.md", required: true },
      { file: "planning/05-product-definition.md", required: true },
      { file: "planning/06-technical-overview.md", required: true },
    ],
  },
  // ── Phase 9: Verify (Implementation) ──
  {
    id: "verify-impl",
    name: "Verify (Implementation)",
    template: "verify/impl.md",
    rules: ["verify-patterns.md"],
    preconditions: [
      { file: "context.md", required: true },
      { file: "planning/05-product-definition.md", required: true },
    ],
    structuralVerify: true,
  },
  // ── Phase 10: Presentation [선택] ──
  {
    id: "presentation",
    name: "Presentation",
    template: "presentation.md",
    optional: true,
    rules: [],
    preconditions: [
      { file: "context.md", required: true },
      { file: "planning/05-product-definition.md", required: true },
      { file: "planning/_contract.md", required: false },
    ],
  },
  // ── Phase 11: Infographic [선택] ──
  {
    id: "infographic",
    name: "Infographic",
    template: "infographic.md",
    optional: true,
    rules: [],
    preconditions: [
      { file: "context.md", required: true },
      { file: "planning/_contract.md", required: true },
    ],
    // ━━━ GATE: spec-complete ━━━
    // 여기까지가 "기획+설계+개발가이드+발표자료" 영역.
    // Phase 12(Build) 이후는 사용자가 명시적으로 요청해야 진행.
    gate: "spec-complete",
  },
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GATE: spec-complete — 아래부터는 실행(Execution) 영역
  // 사용자가 "빌드해줘", "배포까지" 등으로 명시 요청 시에만 진행
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ── Phase 12: Build ──
  {
    id: "build", name: "Build", template: "build.md", rules: [],
    zone: "execution",
    preconditions: [
      { file: "context.md", required: true },
      { file: "implementation/tasks/milestone-overview.md", required: true },
    ],
  },
  // ── Phase 13: Review ──
  {
    id: "review", name: "Review", template: "review.md", rules: [],
    zone: "execution",
    preconditions: [
      { file: "context.md", required: true },
      { file: "planning/05-product-definition.md", required: true },
    ],
  },
  // ── Phase 14: QA ──
  {
    id: "qa", name: "QA", template: "qa.md", rules: [],
    zone: "execution",
    preconditions: [
      { file: "design/qa/test-plan.md", required: true },
      { file: "design/qa/e2e-test-scenarios.md", required: true },
      { file: "planning/05-product-definition.md", required: true },
    ],
  },
  // ── Phase 15: Deploy ──
  {
    id: "deploy", name: "Deploy", template: "deploy.md", rules: [],
    zone: "execution",
    preconditions: [
      { file: "context.md", required: true },
      { file: "design/infra/hosting-decision.md", required: true },
    ],
  },
  // ── Phase 16: Maintain ──
  {
    id: "maintain", name: "Maintain", template: "maintain.md", rules: [],
    zone: "execution",
    preconditions: [
      { file: "context.md", required: true },
      { file: "planning/09-metrics-kpi.md", required: true },
    ],
  },
  // ── 부가 Phase: Update / Migrate [선택] ──
  {
    id: "update",
    name: "Update (부분 수정)",
    template: "update.md",
    optional: true,
    rules: [],
    preconditions: [
      { file: "context.md", required: true },
      { file: "planning/_contract.md", required: true },
    ],
  },
  {
    id: "migrate",
    name: "Migrate (버전 마이그레이션)",
    template: "migrate.md",
    optional: true,
    rules: [],
    preconditions: [],
  },
];

// ─── 유틸리티 ────────────────────────────────────────────────

function fileExists(projectDir, relativePath) {
  return fs.existsSync(path.join(projectDir, relativePath));
}

function readFile(projectDir, relativePath) {
  const fullPath = path.join(projectDir, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf-8");
}

function getFileSize(projectDir, relativePath) {
  const fullPath = path.join(projectDir, relativePath);
  if (!fs.existsSync(fullPath)) return 0;
  return fs.statSync(fullPath).size;
}

function countLines(content) {
  if (!content) return 0;
  return content.split("\n").length;
}

function checkPreconditions(projectDir, phase) {
  const results = { pass: true, blocked: [], degraded: [] };

  for (const pre of phase.preconditions) {
    if (!fileExists(projectDir, pre.file)) {
      if (pre.required) {
        results.pass = false;
        results.blocked.push(pre.file);
      } else {
        results.degraded.push(pre.file);
      }
    }
  }

  return results;
}

function readState(projectDir) {
  const statePath = path.join(projectDir, "STATE.md");
  if (!fs.existsSync(statePath)) return null;
  return fs.readFileSync(statePath, "utf-8");
}

function getProjectType(projectDir) {
  const contextPath = path.join(projectDir, "context.md");
  if (!fs.existsSync(contextPath)) return null;
  const content = fs.readFileSync(contextPath, "utf-8");
  const typeMap = {
    "게임": "game", "웹 saas": "web-saas", "웹saas": "web-saas",
    "모바일 앱": "mobile", "모바일앱": "mobile",
    "데스크톱 앱": "desktop", "데스크톱앱": "desktop",
    "크롬 확장": "chrome-ext", "크롬확장": "chrome-ext",
    "api 서비스": "api-service", "api서비스": "api-service",
  };
  const directMatch = content.match(/유형[^\n]*?(?:\||:)\s*(game|web-saas|mobile|desktop|chrome-ext|api-service)/i);
  if (directMatch) return directMatch[1].toLowerCase();
  const korMatch = content.match(/유형[^\n]*?(?:\||:)\s*(게임|웹\s?SaaS|모바일\s?앱|데스크톱\s?앱|크롬\s?확장|API\s?서비스)/i);
  if (korMatch) return typeMap[korMatch[1].toLowerCase()] || null;
  return null;
}

// ─── 정량 구조 검증 (v5.4 신규) ──────────────────────────────
//
// LLM "판단"이 아닌 코드 레벨 "대조/계산"으로 검증.
// verifyStructure()는 Phase별 검증 전에 실행되어
// LLM 검증 에이전트에게 "이미 FAIL인 항목 목록"을 전달한다.

function verifyStructure(projectDir) {
  const results = { pass: true, checks: [] };

  // ── SV1: 필수 파일 존재 + 최소 크기 ──
  const requiredFiles = [
    { file: "seed.md", minBytes: 200 },
    { file: "context.md", minBytes: 500 },
    { file: "planning/_contract.md", minBytes: 300 },
    { file: "planning/01-executive-summary.md", minBytes: 200 },
    { file: "planning/05-product-definition.md", minBytes: 300 },
    { file: "planning/06-technical-overview.md", minBytes: 300 },
    { file: "planning/09-metrics-kpi.md", minBytes: 200 },
  ];

  for (const req of requiredFiles) {
    const size = getFileSize(projectDir, req.file);
    const exists = size > 0;
    const adequate = size >= req.minBytes;
    results.checks.push({
      id: "SV1",
      name: `파일 존재+크기: ${req.file}`,
      pass: exists && adequate,
      detail: exists ? `${size}B (최소 ${req.minBytes}B)` : "파일 없음",
    });
    if (exists && !adequate) results.pass = false;
    if (!exists) results.pass = false;
  }

  // ── SV2: Feature 수 일치 (contract C4 vs ch05) ──
  const contract = readFile(projectDir, "planning/_contract.md");
  const ch05 = readFile(projectDir, "planning/05-product-definition.md");
  if (contract && ch05) {
    // C4에서 Feature ID (F01, F02, ...) 개수
    const contractFeatures = (contract.match(/F\d{2,3}/g) || []);
    const contractUniqueIds = [...new Set(contractFeatures)];
    // ch05에서 Feature ID 개수
    const ch05Features = (ch05.match(/F\d{2,3}/g) || []);
    const ch05UniqueIds = [...new Set(ch05Features)];

    const match = contractUniqueIds.length > 0 && ch05UniqueIds.length > 0 &&
                  contractUniqueIds.length === ch05UniqueIds.length;
    results.checks.push({
      id: "SV2",
      name: "Feature 수 일치 (contract C4 vs ch05)",
      pass: match,
      detail: `contract: ${contractUniqueIds.length}개, ch05: ${ch05UniqueIds.length}개`,
    });
    if (!match && contractUniqueIds.length > 0) results.pass = false;
  }

  // ── SV3: 수치 교차검증 (contract C2 vs ch09) ──
  const ch09 = readFile(projectDir, "planning/09-metrics-kpi.md");
  if (contract && ch09) {
    // contract에서 주요 수치 추출 (MAU, 매출 등)
    const contractNumbers = extractKeyNumbers(contract, "C2");
    const ch09Numbers = extractKeyNumbers(ch09, "M12");

    if (contractNumbers.length > 0 && ch09Numbers.length > 0) {
      // MAU 수치가 양쪽에 있으면 대조
      const mauContract = findNumberByLabel(contractNumbers, "MAU");
      const mauCh09 = findNumberByLabel(ch09Numbers, "MAU");

      if (mauContract && mauCh09) {
        const ratio = Math.abs(mauContract - mauCh09) / Math.max(mauContract, mauCh09);
        const pass = ratio <= 0.10;  // 10% 이내
        results.checks.push({
          id: "SV3",
          name: "MAU 수치 교차검증 (contract vs ch09)",
          pass,
          detail: `contract: ${mauContract.toLocaleString()}, ch09: ${mauCh09.toLocaleString()}, 괴리: ${(ratio * 100).toFixed(1)}%`,
        });
        if (!pass) results.pass = false;
      }
    }
  }

  // ── SV4: 마일스톤 라벨 일치 (ch06 vs implementation/tasks) ──
  const ch06 = readFile(projectDir, "planning/06-technical-overview.md");
  const milestoneOverview = readFile(projectDir, "implementation/tasks/milestone-overview.md");
  if (ch06 && milestoneOverview) {
    const ch06Milestones = extractMilestoneLabels(ch06);
    const implMilestones = extractMilestoneLabels(milestoneOverview);

    if (ch06Milestones.length > 0 && implMilestones.length > 0) {
      const match = ch06Milestones.length === implMilestones.length;
      results.checks.push({
        id: "SV4",
        name: "마일스톤 수 일치 (ch06 vs implementation)",
        pass: match,
        detail: `ch06: ${ch06Milestones.length}개, impl: ${implMilestones.length}개`,
      });
      if (!match) results.pass = false;
    }
  }

  // ── SV5: API 엔드포인트 커버리지 (ch05 P0/P1 vs api-endpoints) ──
  const apiEndpoints = readFile(projectDir, "design/api/api-endpoints.md");
  if (ch05 && apiEndpoints) {
    // ch05에서 P0/P1 기능 ID 추출
    const p0p1Features = (ch05.match(/(?:P0|P1)[^\n]*F\d{2,3}/g) || []);
    const p0p1Ids = [...new Set(p0p1Features.map(m => {
      const fMatch = m.match(/F\d{2,3}/);
      return fMatch ? fMatch[0] : null;
    }).filter(Boolean))];

    // api-endpoints에서 참조된 Feature ID
    const apiFeatureRefs = [...new Set((apiEndpoints.match(/F\d{2,3}/g) || []))];

    const covered = p0p1Ids.filter(id => apiFeatureRefs.includes(id));
    const coverage = p0p1Ids.length > 0 ? covered.length / p0p1Ids.length : 1;

    results.checks.push({
      id: "SV5",
      name: "API 커버리지 (P0/P1 → api-endpoints)",
      pass: coverage >= 0.9,
      detail: `${covered.length}/${p0p1Ids.length} (${(coverage * 100).toFixed(0)}%)`,
    });
    if (coverage < 0.9 && p0p1Ids.length > 0) results.pass = false;
  }

  // ── SV6: 출처 태그 비율 ──
  const planningFiles = ["02-market-analysis.md", "03-competitive-analysis.md",
    "04-user-analysis.md", "05-product-definition.md", "06-technical-overview.md",
    "07-business-model.md", "08-go-to-market.md", "09-metrics-kpi.md"];

  let totalSources = 0;
  let totalEstimates = 0;
  let totalDataPoints = 0;

  for (const pf of planningFiles) {
    const content = readFile(projectDir, `planning/${pf}`);
    if (!content) continue;
    const sources = (content.match(/\[출처:/g) || []).length;
    const estimates = (content.match(/\[추정:/g) || []).length;
    totalSources += sources;
    totalEstimates += estimates;
    totalDataPoints += sources + estimates;
  }

  if (totalDataPoints > 0) {
    const sourceRate = totalSources / totalDataPoints;
    results.checks.push({
      id: "SV6",
      name: "출처 태그 비율 (planning 전체)",
      pass: sourceRate >= 0.7,
      detail: `출처: ${totalSources}, 추정: ${totalEstimates}, 비율: ${(sourceRate * 100).toFixed(0)}%`,
    });
    if (sourceRate < 0.7) results.pass = false;
  }

  // ── SV7: 챕터별 최소 헤딩 수 (빈 파일 방지) ──
  for (const pf of planningFiles) {
    const content = readFile(projectDir, `planning/${pf}`);
    if (!content) continue;
    const headings = (content.match(/^#{2,3}\s/gm) || []).length;
    if (headings < 3) {
      results.checks.push({
        id: "SV7",
        name: `최소 헤딩 (planning/${pf})`,
        pass: false,
        detail: `헤딩 ${headings}개 (최소 3개 필요)`,
      });
      results.pass = false;
    }
  }

  // ── SV8: 인프라 비용 3-way 대조 (ch06 = C7 = ch07) ──
  const ch07 = readFile(projectDir, "planning/07-business-model.md");
  if (ch06 && contract && ch07) {
    const ch06InfraCost = extractInfraCost(ch06);
    const c7InfraCost = extractInfraCost(contract);
    const ch07InfraCost = extractInfraCost(ch07);

    if (ch06InfraCost && c7InfraCost && ch07InfraCost) {
      const match = ch06InfraCost === c7InfraCost && c7InfraCost === ch07InfraCost;
      results.checks.push({
        id: "SV8",
        name: "인프라 비용 3-way 대조 (ch06=C7=ch07)",
        pass: match,
        detail: `ch06: ${ch06InfraCost}, C7: ${c7InfraCost}, ch07: ${ch07InfraCost}`,
      });
      if (!match) results.pass = false;
    }
  }

  return results;
}

// ─── 수치 추출 헬퍼 ──────────────────────────────────────────

function extractKeyNumbers(content, section) {
  const numbers = [];
  // "MAU" 근처 숫자 추출
  const mauMatch = content.match(/MAU[^\n]*?([\d,]+(?:\.\d+)?)\s*(?:명|만|K|k)?/i);
  if (mauMatch) {
    numbers.push({ label: "MAU", value: parseNumberStr(mauMatch[1]) });
  }
  // "매출" 또는 "MRR" 근처 숫자
  const revenueMatch = content.match(/(?:매출|MRR|revenue)[^\n]*?([\d,]+(?:\.\d+)?)\s*(?:원|만원|억|$|USD)?/i);
  if (revenueMatch) {
    numbers.push({ label: "revenue", value: parseNumberStr(revenueMatch[1]) });
  }
  return numbers;
}

function findNumberByLabel(numbers, label) {
  const found = numbers.find(n => n.label.toLowerCase().includes(label.toLowerCase()));
  return found ? found.value : null;
}

function parseNumberStr(str) {
  return parseFloat(str.replace(/,/g, "")) || 0;
}

function extractMilestoneLabels(content) {
  const labels = [];
  const regex = /(?:M\d|마일스톤\s*\d|Milestone\s*\d)[^\n]*/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    labels.push(match[0].trim());
  }
  return labels;
}

function extractInfraCost(content) {
  // "인프라" + "합계/총" 근처의 금액
  const match = content.match(/(?:인프라|infra)[^\n]*?(?:합계|총|total)[^\n]*?([\d,]+(?:\.\d+)?)\s*(?:원|만원|달러|\$|USD)/i);
  if (match) return match[1].replace(/,/g, "");
  // 역순 시도: 총합 + 인프라
  const match2 = content.match(/(?:합계|총|total)[^\n]*?(?:인프라|infra)[^\n]*?([\d,]+(?:\.\d+)?)/i);
  if (match2) return match2[1].replace(/,/g, "");
  return null;
}

// ─── 3-Tier 역할 시스템 (v5.4.1) ──────────────────────────────
//
// T1 핵심팀: 항상 토론 참여 (유형당 5~8명)
// T2 전문가: 주제 키워드 매칭 시 자동 소환 (유형당 15~25명)
// T3 레퍼런스: roles.md 전체 조직도 (딥다이브 시 수동 참조)
//
// T1은 프롬프트에 항상 주입, T2는 섹션 키워드 매칭으로 동적 주입

const ROLE_TIERS = {
  game: {
    t1: [
      { role: "게임 디렉터", perspective: "게임 전체 비전, 핵심 경험, 최종 디자인 판정" },
      { role: "시스템 기획자", perspective: "코어루프, 메카닉, 규칙 시스템" },
      { role: "아트 디렉터", perspective: "비주얼 스타일, 에셋 방향" },
      { role: "테크니컬 디렉터", perspective: "기술 스택, 아키텍처 총괄" },
      { role: "프로듀서", perspective: "일정, 리소스, 마일스톤" },
      { role: "BM 기획자", perspective: "과금 모델, 수익화 설계" },
      { role: "QA 리드", perspective: "품질 기준, 테스트 전략" },
      { role: "게임 분석가", perspective: "리텐션, KPI, 밸런스 지표" },
    ],
    t2: [
      { role: "전투 기획자", perspective: "전투 시스템, 타격감", keywords: ["전투", "combat", "pvp", "스킬", "무기", "액션"] },
      { role: "밸런스 기획자", perspective: "수치 밸런스, 확률, 재화", keywords: ["밸런스", "확률", "재화", "성장", "경제", "가챠"] },
      { role: "레벨 디자이너", perspective: "맵, 진행, 난이도 곡선", keywords: ["레벨", "맵", "스테이지", "난이도", "월드"] },
      { role: "내러티브 디자이너", perspective: "스토리, 세계관, 캐릭터 서사", keywords: ["스토리", "세계관", "내러티브", "시나리오", "대사", "퀘스트", "컷씬", "세계설정"] },
      { role: "경제 기획자", perspective: "재화 흐름, 싱크/소스", keywords: ["경제", "재화", "인앱", "상점", "거래", "인플레이션", "가챠", "루트박스", "수집", "뽑기"] },
      { role: "라이브 운영 기획자", perspective: "시즌, 이벤트, 패치", keywords: ["라이브", "이벤트", "시즌", "패치", "운영", "배틀패스", "시즌패스", "라이브서비스", "업데이트"] },
      { role: "UX 기획자", perspective: "게임 UX, 튜토리얼, 온보딩", keywords: ["ux", "튜토리얼", "온보딩", "ui 흐름", "접근성"] },
      { role: "소셜 기획자", perspective: "길드, 채팅, 소셜", keywords: ["소셜", "길드", "친구", "채팅", "커뮤니티", "멀티"] },
      { role: "컨셉 아티스트", perspective: "비주얼 컨셉, 캐릭터 디자인", keywords: ["컨셉", "아트", "캐릭터 디자인", "비주얼"] },
      { role: "테크니컬 아티스트", perspective: "셰이더, 렌더링 파이프라인", keywords: ["셰이더", "렌더링", "최적화", "에셋", "lod", "ta"] },
      { role: "사운드 디자이너", perspective: "효과음, BGM, 오디오 연출", keywords: ["사운드", "오디오", "bgm", "sfx", "음악", "보이스"] },
      { role: "리드 클라이언트 프로그래머", perspective: "클라이언트 아키텍처", keywords: ["클라이언트", "엔진", "렌더링", "물리", "unity", "unreal"] },
      { role: "게임 서버 프로그래머", perspective: "서버, 동기화, 매치메이킹", keywords: ["서버", "동기화", "매치메이킹", "넷코드", "네트워크", "백엔드"] },
      { role: "안티치트 엔지니어", perspective: "치트 방지, 보안", keywords: ["치트", "보안", "해킹", "변조", "안티치트"] },
      { role: "최적화 엔지니어", perspective: "FPS, 메모리, 로딩", keywords: ["성능", "최적화", "fps", "메모리", "프로파일링", "로딩"] },
      { role: "게임 DevOps", perspective: "빌드, CI/CD, 인프라", keywords: ["빌드", "ci/cd", "인프라", "배포", "서버 인프라", "클라우드"] },
      { role: "데이터 엔지니어", perspective: "텔레메트리, 분석 파이프라인", keywords: ["데이터", "분석", "텔레메트리", "etl", "대시보드"] },
      { role: "커뮤니티 매니저", perspective: "유저 소통, 피드백", keywords: ["커뮤니티", "유저", "피드백", "sns", "마케팅"] },
      { role: "로컬라이제이션 매니저", perspective: "다국어, 번역, 문화", keywords: ["로컬", "번역", "다국어", "i18n", "현지화"] },
      { role: "수익화 매니저", perspective: "매출 최적화, 가격 정책", keywords: ["수익", "매출", "과금", "결제", "가격", "monetization", "가챠", "루트박스", "배틀패스", "광고"] },
    ],
  },
  "web-saas": {
    t1: [
      { role: "프로덕트 디자이너", perspective: "사용자 여정, 와이어프레임, 프로토타입" },
      { role: "프론트엔드 엔지니어", perspective: "UI 구현, 상태 관리, 컴포넌트" },
      { role: "백엔드 엔지니어", perspective: "서버 로직, DB 설계, API" },
      { role: "DevOps / SRE", perspective: "CI/CD, 배포, 가용성" },
      { role: "보안 엔지니어", perspective: "OWASP, 취약점, 컴플라이언스" },
      { role: "프로덕트 매니저", perspective: "로드맵, 우선순위, 이해관계자" },
      { role: "QA 엔지니어", perspective: "테스트, 버그, 회귀" },
      { role: "프로덕트 분석가", perspective: "DAU/MAU, 리텐션, 코호트" },
    ],
    t2: [
      { role: "접근성 엔지니어", perspective: "WCAG, 스크린 리더", keywords: ["접근성", "a11y", "wcag", "스크린 리더"] },
      { role: "프론트엔드 성능 엔지니어", perspective: "Core Web Vitals, 번들", keywords: ["성능", "core web vitals", "번들", "렌더링", "최적화"] },
      { role: "디자인 시스템 리드", perspective: "디자인 토큰, 컴포넌트", keywords: ["디자인 시스템", "컴포넌트", "토큰", "storybook"] },
      { role: "인증·인가 엔지니어", perspective: "OAuth, SSO, MFA", keywords: ["인증", "로그인", "oauth", "sso", "mfa", "세션", "권한"] },
      { role: "결제 시스템 엔지니어", perspective: "PG, PCI-DSS, 정산", keywords: ["결제", "구독", "과금", "정산", "pg", "stripe"] },
      { role: "AI 엔지니어", perspective: "LLM, RAG, 에이전트", keywords: ["ai", "llm", "rag", "gpt", "에이전트", "ml"] },
      { role: "검색 엔지니어", perspective: "Elasticsearch, 랭킹", keywords: ["검색", "elasticsearch", "algolia", "랭킹"] },
      { role: "실시간 처리 엔지니어", perspective: "Kafka, 이벤트 드리븐", keywords: ["실시간", "kafka", "websocket", "이벤트", "스트리밍"] },
      { role: "클라우드 아키텍트", perspective: "AWS/GCP 설계, 비용", keywords: ["aws", "gcp", "azure", "클라우드", "인프라", "비용"] },
      { role: "그로스 엔지니어", perspective: "A/B 테스트, 퍼널 최적화", keywords: ["그로스", "a/b", "퍼널", "전환율", "실험"] },
      { role: "데이터 엔지니어", perspective: "ETL, 데이터 웨어하우스", keywords: ["데이터", "etl", "파이프라인", "웨어하우스", "dbt"] },
      { role: "다국어 엔지니어", perspective: "i18n, 번역, 로케일", keywords: ["다국어", "i18n", "번역", "로케일", "국제화"] },
      { role: "메시징 엔지니어", perspective: "푸시, 이메일, 알림", keywords: ["알림", "푸시", "이메일", "sms", "메시지", "notification"] },
      { role: "UX 라이터", perspective: "마이크로카피, 에러 메시지", keywords: ["카피", "텍스트", "에러 메시지", "온보딩 텍스트", "ux writing"] },
      { role: "핀옵스 엔지니어", perspective: "클라우드 비용 최적화", keywords: ["비용", "cost", "finops", "예산", "최적화"] },
    ],
  },
  mobile: {
    t1: [
      { role: "모바일 UX 디자이너", perspective: "터치 인터랙션, 플랫폼 가이드라인" },
      { role: "iOS 엔지니어", perspective: "Swift/SwiftUI, iOS 특화" },
      { role: "안드로이드 엔지니어", perspective: "Kotlin/Compose, Android 특화" },
      { role: "백엔드 설계자", perspective: "앱-서버 API, 동기화" },
      { role: "모바일 QA 엔지니어", perspective: "디바이스 팜, 회귀 테스트" },
      { role: "모바일 분석 엔지니어", perspective: "크래시, 이벤트 트래킹" },
    ],
    t2: [
      { role: "크로스플랫폼 엔지니어", perspective: "RN/Flutter, 공유 로직", keywords: ["react native", "flutter", "크로스플랫폼", "expo"] },
      { role: "모바일 성능 엔지니어", perspective: "배터리, 메모리, 시작 시간", keywords: ["성능", "배터리", "메모리", "프레임", "최적화"] },
      { role: "모바일 보안 엔지니어", perspective: "난독화, 인증서 피닝", keywords: ["보안", "난독화", "피닝", "탈옥", "루팅", "암호화"] },
      { role: "모바일 DevOps", perspective: "Fastlane, CI/CD, OTA", keywords: ["ci/cd", "fastlane", "배포", "빌드", "코드사이닝"] },
      { role: "ASO 전문가", perspective: "스토어 최적화, 다운로드", keywords: ["aso", "스토어", "키워드", "스크린샷", "다운로드"] },
      { role: "스토어 심사 대응", perspective: "Apple/Google 가이드라인", keywords: ["심사", "리젝", "가이드라인", "정책"] },
      { role: "모바일 접근성 엔지니어", perspective: "VoiceOver/TalkBack", keywords: ["접근성", "voiceover", "talkback", "a11y"] },
      { role: "모션 디자이너", perspective: "앱 애니메이션, 트랜지션", keywords: ["애니메이션", "모션", "트랜지션", "인터랙션"] },
    ],
  },
  "api-service": {
    t1: [
      { role: "API 설계자 / 아키텍트", perspective: "스키마, 버전 전략, 일관성" },
      { role: "API 엔지니어", perspective: "엔드포인트, 인증, Rate Limit" },
      { role: "DX 엔지니어", perspective: "API 사용성, 문서, 콘솔" },
      { role: "플랫폼 신뢰성 엔지니어", perspective: "가용성, SLA, 장애 대응" },
      { role: "API 보안 엔지니어", perspective: "OAuth/JWT, 입력 검증" },
    ],
    t2: [
      { role: "SDK 엔지니어", perspective: "멀티 언어 SDK, 코드 생성", keywords: ["sdk", "라이브러리", "코드 생성", "클라이언트"] },
      { role: "테크니컬 라이터", perspective: "API 레퍼런스, 튜토리얼", keywords: ["문서", "레퍼런스", "튜토리얼", "가이드"] },
      { role: "데벨로퍼 애드보킷", perspective: "개발자 커뮤니티, 피드백", keywords: ["커뮤니티", "데브렐", "온보딩", "피드백"] },
      { role: "분산 시스템 엔지니어", perspective: "샤딩, 복제, CAP", keywords: ["분산", "샤딩", "복제", "확장", "스케일"] },
      { role: "웹훅/이벤트 엔지니어", perspective: "이벤트 발행, 웹훅", keywords: ["웹훅", "이벤트", "콜백", "비동기"] },
      { role: "API 게이트웨이 엔지니어", perspective: "라우팅, 트래픽 제어", keywords: ["게이트웨이", "라우팅", "kong", "프록시"] },
      { role: "파트너 엔지니어", perspective: "외부 파트너 기술 지원", keywords: ["파트너", "연동", "통합", "협업"] },
    ],
  },
  desktop: {
    t1: [
      { role: "데스크톱 UX 디자이너", perspective: "네이티브 느낌, 단축키, 멀티윈도우" },
      { role: "크로스플랫폼 엔지니어", perspective: "Electron/Tauri, Win/Mac/Linux" },
      { role: "OS 통합 전문가", perspective: "파일 시스템, 레지스트리, 셸 확장" },
      { role: "데스크톱 보안 엔지니어", perspective: "코드 서명, 샌드박싱" },
      { role: "자동 업데이트 엔지니어", perspective: "OTA, 델타, 롤백" },
    ],
    t2: [
      { role: "데스크톱 성능 엔지니어", perspective: "메모리/CPU, GPU 가속", keywords: ["성능", "메모리", "cpu", "gpu", "최적화"] },
      { role: "인스톨러/패키징 엔지니어", perspective: "MSI/DMG, 코드 사이닝", keywords: ["인스톨러", "패키징", "설치", "msi", "dmg"] },
      { role: "Windows 엔지니어", perspective: "WinUI/WPF, 시스템 API", keywords: ["windows", "winui", "wpf", "win32"] },
      { role: "macOS 엔지니어", perspective: "AppKit/SwiftUI, Cocoa", keywords: ["mac", "macos", "appkit", "cocoa", "swift"] },
      { role: "Linux 엔지니어", perspective: "GTK/Qt, 배포판 호환", keywords: ["linux", "gtk", "qt", "snap", "flatpak", "appimage"] },
    ],
  },
  "chrome-ext": {
    t1: [
      { role: "확장 프론트엔드 엔지니어", perspective: "팝업/사이드패널, 콘텐츠 스크립트" },
      { role: "서비스 워커 엔지니어", perspective: "백그라운드, 메시지 패싱" },
      { role: "확장 보안/프라이버시 엔지니어", perspective: "권한 최소화, CSP" },
      { role: "웹스토어 퍼블리싱 전문가", perspective: "CWS 심사, 리스팅" },
    ],
    t2: [
      { role: "크로스 브라우저 호환성 엔지니어", perspective: "Firefox/Safari/Edge 호환", keywords: ["firefox", "safari", "edge", "호환", "크로스 브라우저"] },
      { role: "확장 DevTools 엔지니어", perspective: "DevTools 패널 확장", keywords: ["devtools", "디버깅", "개발자 도구"] },
      { role: "확장 UX 디자이너", perspective: "팝업/오버레이, 호스트 페이지 조화", keywords: ["ux", "ui", "디자인", "팝업", "오버레이"] },
    ],
  },
};

// 주제(섹션 제목/내용)에서 T2 전문가 키워드 매칭
function matchT2Experts(projectType, sectionText) {
  if (!ROLE_TIERS[projectType]) return [];
  const t2 = ROLE_TIERS[projectType].t2 || [];
  const lower = sectionText.toLowerCase();
  const matched = [];
  for (const expert of t2) {
    const hit = expert.keywords.some(kw => lower.includes(kw));
    if (hit) matched.push(expert);
  }
  return matched;
}

// 역할 프롬프트 블록 생성
function buildRoleBlock(projectType, sectionText) {
  if (!ROLE_TIERS[projectType]) return "";

  const tier = ROLE_TIERS[projectType];
  let block = "## 참여 역할 (3-Tier 시스템)\n\n";

  // T1 핵심팀 (항상)
  block += "### T1 핵심팀 (항상 참여)\n";
  block += "| 역할 | 관점 |\n|------|------|\n";
  for (const r of tier.t1) {
    block += `| **${r.role}** | ${r.perspective} |\n`;
  }

  // T2 전문가 (키워드 매칭)
  const t2Matched = matchT2Experts(projectType, sectionText || "");
  if (t2Matched.length > 0) {
    block += "\n### T2 전문가 (이 섹션 관련 자동 소환)\n";
    block += "| 역할 | 관점 |\n|------|------|\n";
    for (const r of t2Matched) {
      block += `| **${r.role}** | ${r.perspective} |\n`;
    }
  }

  block += "\n> T3 전체 조직도는 rules/roles.md 참조. 딥다이브 필요 시 추가 소환 가능.\n";
  return block;
}

// ─── 유형별 에이전트 역할 매핑 (v5.4) ─────────────────────────

const ROLE_MAP = {
  game: {
    label: "게임",
    "ux.md": "게임 UI/HUD 설계자",
    "data-api.md": "게임서버/네트워크 설계자",
    "security-infra-qa.md": "안티치트/서버권위 + 인프라 + QA",
    "impl/dev-env.md": "게임 클라이언트 환경 설정",
    "impl/tasks.md": "게임 마일스톤 (프로토→알파→베타→출시)",
    "impl/checklists.md": "게임 품질 체크리스트",
    terms: {
      "프론트엔드": "게임 클라이언트",
      "백엔드": "게임 서버",
      "API 설계": "클라이언트-서버 프로토콜",
      "인증": "플레이어 세션 관리",
      "보안": "안티치트 + 서버 권위",
      "DB 스키마": "게임 데이터 모델 (플레이어/인벤토리/매치)",
      "배포": "스토어 등록 + 패치 시스템",
      "모니터링": "크래시 리포트 + 밸런스 지표",
      "테스트": "플레이테스트 + 밸런스 QA",
    },
  },
  "web-saas": {
    label: "웹 SaaS",
    "ux.md": "UI/UX 디자이너",
    "data-api.md": "데이터 아키텍트 + API 설계자",
    "security-infra-qa.md": "보안 + DevOps + QA",
    "impl/dev-env.md": "프론트+백엔드 개발환경",
    "impl/tasks.md": "웹 마일스톤 (MVP→베타→퍼블릭→성장)",
    "impl/checklists.md": "웹 서비스 체크리스트",
    terms: {
      "프론트엔드": "프론트엔드",
      "백엔드": "백엔드/서버",
      "API 설계": "REST/GraphQL API",
      "인증": "사용자 인증/인가",
      "보안": "OWASP + 데이터 보호",
      "DB 스키마": "비즈니스 데이터 모델",
      "배포": "CI/CD + 호스팅",
      "모니터링": "APM + 에러 트래킹",
      "테스트": "E2E + 통합 테스트",
    },
  },
  mobile: {
    label: "모바일 앱",
    "ux.md": "모바일 UX 디자이너",
    "data-api.md": "백엔드 설계자",
    "security-infra-qa.md": "보안 + 성능 + QA",
    "impl/dev-env.md": "모바일 개발환경",
    "impl/tasks.md": "앱 마일스톤 (MVP→베타→심사→출시)",
    "impl/checklists.md": "앱 스토어 심사 체크리스트",
    terms: {
      "프론트엔드": "앱 클라이언트",
      "백엔드": "백엔드",
      "API 설계": "앱-서버 API",
      "인증": "소셜 로그인/생체 인증",
      "보안": "앱 변조 방지 + 암호화",
      "DB 스키마": "앱 데이터 모델",
      "배포": "앱 스토어 심사",
      "모니터링": "크래시 + ANR + 성능",
      "테스트": "디바이스 호환성 테스트",
    },
  },
  "api-service": {
    label: "API 서비스",
    "ux.md": null,  // API 서비스는 UX 스킵
    "data-api.md": "API 설계자 + 데이터 아키텍트",
    "security-infra-qa.md": "보안 + 인프라 + QA",
    "impl/dev-env.md": "API 서버 개발환경",
    "impl/tasks.md": "API 마일스톤 (알파→베타→퍼블릭→GA)",
    "impl/checklists.md": "API 서비스 체크리스트",
    terms: {
      "프론트엔드": "(없음)",
      "백엔드": "API 서버",
      "API 설계": "퍼블릭 API",
      "인증": "API Key/OAuth",
      "보안": "Rate Limit + 인증",
      "DB 스키마": "리소스 모델",
      "배포": "API 버전 관리",
      "모니터링": "가용성 + 레이턴시",
      "테스트": "부하/계약 테스트",
    },
  },
  desktop: {
    label: "데스크톱 앱",
    "ux.md": "데스크톱 UX 디자이너",
    "data-api.md": "시스템 설계자",
    "security-infra-qa.md": "크로스플랫폼 + 배포 + QA",
    "impl/dev-env.md": "데스크톱 빌드 환경",
    "impl/tasks.md": "데스크톱 마일스톤 (MVP→베타→RC→출시)",
    "impl/checklists.md": "데스크톱 배포 체크리스트",
    terms: {
      "프론트엔드": "데스크톱 UI",
      "백엔드": "로컬 서비스/IPC",
      "API 설계": "IPC 프로토콜",
      "인증": "라이선스 관리",
      "보안": "코드 서명 + 샌드박싱",
      "DB 스키마": "로컬 데이터 모델",
      "배포": "자동 업데이트 + 인스톨러",
      "모니터링": "크래시 리포트 + 텔레메트리",
      "테스트": "OS별 호환성 테스트",
    },
  },
  "chrome-ext": {
    label: "크롬 확장",
    "ux.md": "확장 UX 디자이너",
    "data-api.md": "웹 플랫폼 전문가",
    "security-infra-qa.md": "프라이버시 + QA",
    "impl/dev-env.md": "확장 개발환경",
    "impl/tasks.md": "확장 마일스톤 (MVP→베타→심사→출시)",
    "impl/checklists.md": "웹스토어 심사 체크리스트",
    terms: {
      "프론트엔드": "확장 UI (Popup/Content Script)",
      "백엔드": "Service Worker + 선택적 서버",
      "API 설계": "Chrome API + 메시징",
      "인증": "chrome.identity",
      "보안": "CSP + 권한 최소화",
      "DB 스키마": "chrome.storage 구조",
      "배포": "Chrome Web Store 심사",
      "모니터링": "에러 로깅",
      "테스트": "브라우저/사이트 호환성",
    },
  },
};

function buildTypeContext(projectDir, templateName, sectionHint) {
  const projectType = getProjectType(projectDir);
  if (!projectType || !ROLE_MAP[projectType]) return "";

  const map = ROLE_MAP[projectType];
  const role = map[templateName];

  // 해당 템플릿이 이 유형에서 스킵 대상이면 null 반환
  if (role === null) return null;

  let context = `## 프로젝트 유형 컨텍스트\n`;
  context += `유형: ${map.label}\n`;
  if (role) context += `당신의 역할: ${role}\n`;
  context += `\n### 용어 변환 (이 프로젝트에서)\n`;
  for (const [generic, specific] of Object.entries(map.terms)) {
    context += `- "${generic}" → "${specific}"\n`;
  }

  // 3-Tier 역할 블록 주입
  const roleBlock = buildRoleBlock(projectType, sectionHint || templateName);
  if (roleBlock) {
    context += `\n${roleBlock}`;
  }

  return context;
}

// ─── 프롬프트 빌더 ──────────────────────────────────────────

function buildPrompt(projectDir, phase) {
  const templates = Array.isArray(phase.template) ? phase.template : [phase.template];
  const parts = [];

  // 섹션 힌트: Phase 이름 + 템플릿 이름을 결합하여 T2 매칭에 사용
  const sectionHint = `${phase.name} ${phase.id} ${templates.join(" ")}`;

  // 유형별 컨텍스트 주입 (템플릿 앞에 위치)
  for (const t of templates) {
    const typeCtx = buildTypeContext(projectDir, t, sectionHint);
    if (typeCtx === null) {
      // 이 유형에서 해당 템플릿은 스킵 (예: API 서비스의 ux.md)
      continue;
    }
    if (typeCtx) {
      parts.push(typeCtx);
    }
  }

  // 템플릿 읽기
  for (const t of templates) {
    // 유형에서 스킵 대상이면 건너뜀
    const typeCtx = buildTypeContext(projectDir, t, sectionHint);
    if (typeCtx === null) continue;

    const tPath = path.join(TEMPLATES_DIR, t);
    if (fs.existsSync(tPath)) {
      parts.push(`## Template: ${t}\n\n${fs.readFileSync(tPath, "utf-8")}`);
    }
  }

  // 도메인 서브템플릿 자동 선택 (Phase 6: Design)
  if (phase.domainTemplate) {
    const projectType = getProjectType(projectDir);
    if (projectType) {
      const domainPath = path.join(TEMPLATES_DIR, phase.domainTemplate, `${projectType}.md`);
      if (fs.existsSync(domainPath)) {
        parts.push(`## Domain Template: ${projectType}\n\n${fs.readFileSync(domainPath, "utf-8")}`);
      }
    }
  }

  // 규칙 읽기
  for (const r of phase.rules) {
    const rPath = path.join(RULES_DIR, r);
    if (fs.existsSync(rPath)) {
      parts.push(`## Rules: ${r}\n\n${fs.readFileSync(rPath, "utf-8")}`);
    }
  }

  // 코어 규칙은 항상 주입
  const corePath = path.join(RULES_DIR, "core.md");
  if (fs.existsSync(corePath)) {
    parts.push(`## Core Rules\n\n${fs.readFileSync(corePath, "utf-8")}`);
  }

  // 복구 규칙은 항상 주입
  const recoveryPath = path.join(RULES_DIR, "recovery.md");
  if (fs.existsSync(recoveryPath)) {
    parts.push(`## Recovery Rules\n\n${fs.readFileSync(recoveryPath, "utf-8")}`);
  }

  // 정량 검증 결과 주입 (structuralVerify가 true인 Phase)
  if (phase.structuralVerify) {
    const sv = verifyStructure(projectDir);
    const failedChecks = sv.checks.filter(c => !c.pass);
    if (failedChecks.length > 0) {
      let svReport = "## Pre-Verify: 정량 구조 검증 결과 (코드 레벨)\n\n";
      svReport += "아래 항목은 runner.js가 코드로 검출한 **확정 FAIL** 입니다. 반드시 수정하세요.\n\n";
      svReport += "| ID | 항목 | 상세 |\n|-----|------|------|\n";
      for (const c of failedChecks) {
        svReport += `| ${c.id} | ${c.name} | ${c.detail} |\n`;
      }
      parts.push(svReport);
    }
  }

  return parts.join("\n\n---\n\n");
}

// ─── 출력 함수 ──────────────────────────────────────────────

function printStatus(projectName) {
  const projectDir = path.join(SPECS_DIR, projectName);
  if (!fs.existsSync(projectDir)) {
    console.log(`\u274c \ud504\ub85c\uc81d\ud2b8 "${projectName}" \uc5c6\uc74c`);
    return;
  }

  console.log(`\n\u2501\u2501\u2501 ${projectName} \uc0c1\ud0dc \u2501\u2501\u2501\n`);

  let gateReached = false;
  for (const phase of PHASES) {
    const check = checkPreconditions(projectDir, phase);
    const icon = check.pass ? "\u2705" : "\ud83d\udd34";
    const blocked = check.blocked.length > 0 ? ` (BLOCKED: ${check.blocked.join(", ")})` : "";
    const degraded = check.degraded.length > 0 ? ` (DEGRADE: ${check.degraded.join(", ")})` : "";
    const optional = phase.optional ? " [\uc120\ud0dd]" : "";
    const parallel = phase.parallel ? ` (${phase.agentCount || "?"}${"\ubcd1\ub82c"})` : "";
    const zone = phase.zone === "execution" ? " \ud83d\udee0\ufe0f" : "";

    console.log(`${icon} ${phase.name}${parallel}${optional}${zone}${blocked}${degraded}`);

    if (phase.gate === "spec-complete" && !gateReached) {
      gateReached = true;
      console.log(`\n  \u2501\u2501 GATE: spec-complete \u2501\u2501`);
      console.log(`  \uc5ec\uae30\uae4c\uc9c0 \uae30\ud68d+\uc124\uacc4+\uac1c\ubc1c\uac00\uc774\ub4dc. \uc544\ub798\ub294 \uc0ac\uc6a9\uc790 \uc694\uccad \uc2dc\ub9cc \uc9c4\ud589.\n`);
    }
  }

  console.log("");
}

function printVerify(projectName) {
  const projectDir = path.join(SPECS_DIR, projectName);
  if (!fs.existsSync(projectDir)) {
    console.log(`\u274c \ud504\ub85c\uc81d\ud2b8 "${projectName}" \uc5c6\uc74c`);
    return;
  }

  console.log(`\n\u2501\u2501\u2501 ${projectName} \uc815\ub7c9 \uad6c\uc870 \uac80\uc99d \u2501\u2501\u2501\n`);

  const results = verifyStructure(projectDir);

  for (const check of results.checks) {
    const icon = check.pass ? "\u2705" : "\u274c";
    console.log(`${icon} [${check.id}] ${check.name}`);
    console.log(`   ${check.detail}`);
  }

  const passed = results.checks.filter(c => c.pass).length;
  const total = results.checks.length;
  console.log(`\n\u2501\u2501\u2501 \uacb0\uacfc: ${passed}/${total} PASS ${results.pass ? "\u2705" : "\u274c"} \u2501\u2501\u2501\n`);
}

function printPhasePrompt(projectName, phaseId) {
  const projectDir = path.join(SPECS_DIR, projectName);
  if (!fs.existsSync(projectDir)) {
    console.log(`\u274c \ud504\ub85c\uc81d\ud2b8 "${projectName}" \uc5c6\uc74c`);
    return;
  }
  const phase = PHASES.find(p => p.id === phaseId);

  if (!phase) {
    console.log(`\u274c Phase "${phaseId}" \uc5c6\uc74c`);
    console.log(`\uc0ac\uc6a9 \uac00\ub2a5: ${PHASES.map(p => p.id).join(", ")}`);
    return;
  }

  const check = checkPreconditions(projectDir, phase);
  if (!check.pass) {
    console.log(`\n\ud83d\udd34 BLOCKED \u2014 \ub2e4\uc74c \ud30c\uc77c \ud544\uc694:\n`);
    for (const f of check.blocked) {
      console.log(`  - ${f}`);
    }
    return;
  }

  if (check.degraded.length > 0) {
    console.log(`\n\ud83d\udfe1 DEGRADE \ubaa8\ub4dc \u2014 \ub2e4\uc74c \ud30c\uc77c \ubd80\uc7ac:\n`);
    for (const f of check.degraded) {
      console.log(`  - ${f}`);
    }
    console.log("");
  }

  const prompt = buildPrompt(projectDir, phase);
  console.log(`\n\u2501\u2501\u2501 ${phase.name} \ud504\ub86c\ud504\ud2b8 (${prompt.length} chars) \u2501\u2501\u2501\n`);
  console.log(prompt);
}

// ─── CLI ─────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage:");
  console.log("  node runner.js --status <project>     # \uc0c1\ud0dc \ud655\uc778");
  console.log("  node runner.js --verify <project>     # \uc815\ub7c9 \uad6c\uc870 \uac80\uc99d");
  console.log("  node runner.js <project> <phase-id>   # Phase \ud504\ub86c\ud504\ud2b8 \uc0dd\uc131");
  console.log("  node runner.js --phases               # Phase \ubaa9\ub85d");
  process.exit(0);
}

if (args[0] === "--phases") {
  console.log("\nPhase \ubaa9\ub85d:\n");
  let gateShown = false;
  for (const p of PHASES) {
    const par = p.parallel ? ` (${p.agentCount || "?"}\ubcd1\ub82c)` : "";
    const opt = p.optional ? " [\uc120\ud0dd]" : "";
    const zone = p.zone === "execution" ? " \ud83d\udee0\ufe0f" : "";
    console.log(`  ${p.id}${par}${opt}${zone} \u2014 ${p.name}`);
    if (p.gate === "spec-complete" && !gateShown) {
      gateShown = true;
      console.log(`  --- GATE: spec-complete ---`);
    }
  }
  process.exit(0);
}

if (args[0] === "--status") {
  printStatus(args[1] || "");
  process.exit(0);
}

if (args[0] === "--verify") {
  printVerify(args[1] || "");
  process.exit(0);
}

if (args.length >= 2) {
  printPhasePrompt(args[0], args[1]);
} else {
  printStatus(args[0]);
}
