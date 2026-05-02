import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchExpensesByPeriod } from '@/modules/expenses/api/expenses.api'
import { fetchIncomesByPeriod } from '@/modules/income/api/income.api'

/** Sidebar “cash flow” for the **calendar** current month (not the expenses page period selector). */
export const useCashFlowStore = defineStore('cashFlow', () => {
  const cashFlowNet = ref<number | null>(null)
  const loading = ref(true)

  function calendarYearMonth() {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  }

  async function refresh() {
    loading.value = true
    const { year, month } = calendarYearMonth()
    try {
      const [expenses, incomes] = await Promise.all([
        fetchExpensesByPeriod(year, month),
        fetchIncomesByPeriod(year, month),
      ])
      const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
      const earned = incomes.reduce((sum, income) => sum + income.amount, 0)
      cashFlowNet.value = earned - spent
    } catch {
      cashFlowNet.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    cashFlowNet,
    loading,
    refresh,
    calendarYearMonth,
  }
})
