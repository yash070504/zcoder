// ═══════════════════════════════════════════════════════════════════
// metricsService.js — Prometheus Observability & Telemetry Service
//
// Exposes standard Prometheus-formatted metrics at /metrics:
// - Total HTTP requests by path & method
// - Code execution queue depth & active workers
// - Judge verdict counter (ACCEPTED, WRONG_ANSWER, TLE, etc.)
// - Response time histograms / averages
// ═══════════════════════════════════════════════════════════════════

class MetricsService {
  constructor() {
    this.httpRequestsTotal = new Map(); // "GET /api/execute" -> count
    this.verdictsTotal = {
      ACCEPTED: 0,
      WRONG_ANSWER: 0,
      TIME_LIMIT_EXCEEDED: 0,
      COMPILATION_ERROR: 0,
      RUNTIME_ERROR: 0,
      SECURITY_VIOLATION: 0
    };
    this.submissionsTotal = 0;
    this.aiAnalysesTotal = 0;
    this.startTime = Date.now();
  }

  recordHttpRequest(method, route, statusCode) {
    const key = `${method} ${route} ${statusCode}`;
    const current = this.httpRequestsTotal.get(key) || 0;
    this.httpRequestsTotal.set(key, current + 1);
  }

  recordVerdict(verdict) {
    this.submissionsTotal++;
    const codeMap = {
      AC: "ACCEPTED",
      WA: "WRONG_ANSWER",
      TLE: "TIME_LIMIT_EXCEEDED",
      CE: "COMPILATION_ERROR",
      RE: "RUNTIME_ERROR",
      SV: "SECURITY_VIOLATION"
    };
    const key = codeMap[verdict] || verdict;
    if (this.verdictsTotal[key] !== undefined) {
      this.verdictsTotal[key]++;
    }
  }

  recordAiAnalysis() {
    this.aiAnalysesTotal++;
  }

  /**
   * Generates Prometheus text-based metrics format for scraping.
   */
  getPrometheusMetrics(queueStats = {}) {
    const lines = [];

    lines.push("# HELP zcoder_uptime_seconds Total application uptime in seconds");
    lines.push("# TYPE zcoder_uptime_seconds gauge");
    lines.push(`zcoder_uptime_seconds ${((Date.now() - this.startTime) / 1000).toFixed(2)}`);

    lines.push("# HELP zcoder_submissions_total Total code judge submissions");
    lines.push("# TYPE zcoder_submissions_total counter");
    lines.push(`zcoder_submissions_total ${this.submissionsTotal}`);

    lines.push("# HELP zcoder_ai_analyses_total Total AI complexity & hint queries");
    lines.push("# TYPE zcoder_ai_analyses_total counter");
    lines.push(`zcoder_ai_analyses_total ${this.aiAnalysesTotal}`);

    lines.push("# HELP zcoder_judge_verdict_total Total judge verdicts categorized");
    lines.push("# TYPE zcoder_judge_verdict_total counter");
    for (const [verdict, count] of Object.entries(this.verdictsTotal)) {
      lines.push(`zcoder_judge_verdict_total{verdict="${verdict}"} ${count}`);
    }

    if (queueStats) {
      lines.push("# HELP zcoder_judge_queue_backlog Active submissions waiting in queue");
      lines.push("# TYPE zcoder_judge_queue_backlog gauge");
      lines.push(`zcoder_judge_queue_backlog ${queueStats.queueLength || 0}`);

      lines.push("# HELP zcoder_judge_active_workers Currently executing worker threads");
      lines.push("# TYPE zcoder_judge_active_workers gauge");
      lines.push(`zcoder_judge_active_workers ${queueStats.activeWorkers || 0}`);
    }

    lines.push("# HELP zcoder_http_requests_total Total incoming HTTP requests");
    lines.push("# TYPE zcoder_http_requests_total counter");
    for (const [key, count] of this.httpRequestsTotal.entries()) {
      const [method, route, status] = key.split(" ");
      lines.push(`zcoder_http_requests_total{method="${method}",path="${route}",status="${status}"} ${count}`);
    }

    return lines.join("\n") + "\n";
  }
}

const metricsService = new MetricsService();
module.exports = metricsService;
