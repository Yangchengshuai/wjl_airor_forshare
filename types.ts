
export interface ProjectInputs {
  background: string;
  monthlyHours: number; // 节省工时
  hrMonthlySalary: number; // HR运营人员月薪
  devManMonths: number; // 产研人月数量
  devManMonthCostWan: number; // 单人月成本（万元）
  opexYearlyWan: number; // 年度运营支出（万元）
  capexWan: number; // 一次性外部采购成本（万元）
}

export interface CalculationResult {
  hourlyRate: number; // 计算出的时薪
  monthlyBenefit: number; // 计算出的月度人力节省价值
  monthlyOpex: number; // 月度运营支出
  monthlyNetFlow: number; // 月度净现金流 (收益 - 支出)
  
  initialDevCost: number; // 初始研发成本
  initialCapex: number; // 初始采购成本
  totalInitialInvestment: number; // 总初始投入
  
  breakEvenMonth: number | null; // 回本月份
  roiPercent: number; // 3年期 ROI
  threeYearNetProfit: number; // 3年期净利润
  isPositive: boolean;
}

export interface ChartDataPoint {
  month: number;
  cumulativeCashFlow: number; // 累计净现金流
  investmentLine: number; // 参考线（通常是0，或者总投入）
}

export interface Assessment {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  inputs: ProjectInputs;
  ai_analysis?: string; // Persisted AI Analysis
}
