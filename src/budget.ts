import type { Env } from './types';
import { getMonthlyBudget, getTodayGenerationCount, incrementBudget } from './db';
import { notifyBudgetAlert } from './notify';

export interface BudgetCheck {
  allowed: boolean;
  reason?: string;
  monthlyUsed: number;
  monthlyLimit: number;
  dailyUsed: number;
  dailyLimit: number;
}

export async function checkBudget(env: Env): Promise<BudgetCheck> {
  const maxDaily = parseInt(env.MAX_DAILY_GENERATIONS || '4', 10);
  const maxMonthlyUsd = parseFloat(env.MAX_MONTHLY_USD || '50');

  const dailyUsed = await getTodayGenerationCount(env.DB);
  const { totalCost } = await getMonthlyBudget(env.DB);

  if (dailyUsed >= maxDaily) {
    return {
      allowed: false,
      reason: `Daily limit reached: ${dailyUsed}/${maxDaily}`,
      monthlyUsed: totalCost,
      monthlyLimit: maxMonthlyUsd,
      dailyUsed,
      dailyLimit: maxDaily,
    };
  }

  if (totalCost >= maxMonthlyUsd) {
    return {
      allowed: false,
      reason: `Monthly budget exhausted: $${totalCost.toFixed(2)}/$${maxMonthlyUsd}`,
      monthlyUsed: totalCost,
      monthlyLimit: maxMonthlyUsd,
      dailyUsed,
      dailyLimit: maxDaily,
    };
  }

  const pct = Math.round((totalCost / maxMonthlyUsd) * 100);
  if (pct >= 80 && pct < 100) {
    await notifyBudgetAlert(env, pct, totalCost, maxMonthlyUsd).catch(() => {});
  }

  return {
    allowed: true,
    monthlyUsed: totalCost,
    monthlyLimit: maxMonthlyUsd,
    dailyUsed,
    dailyLimit: maxDaily,
  };
}

export async function recordGeneration(env: Env, estimatedCostUsd: number): Promise<void> {
  await incrementBudget(env.DB, estimatedCostUsd);
}

export function estimateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * 3;
  const outputCost = (outputTokens / 1_000_000) * 15;
  return inputCost + outputCost;
}
