import * as userModel from '../models/user.model.js';
import * as aiUsageModel from '../models/aiUsage.model.js';

export async function getUsers(req, res) {
  try {
    const users = await userModel.findAll();
    const planDistribution = await userModel.getPlanDistribution();

    const distribution = { free: 0, student: 0, pro: 0 };
    planDistribution.forEach((row) => {
      distribution[row.plan] = row.count;
    });

    res.json({
      success: true,
      data: {
        users,
        plan_distribution: distribution,
        total_users: users.length,
      },
      error: null,
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch users',
    });
  }
}

export async function getUsage(req, res) {
  try {
    const summary = await aiUsageModel.getSummary();
    const recent = await aiUsageModel.getRecent(25);

    res.json({
      success: true,
      data: {
        summary,
        recent,
      },
      error: null,
    });
  } catch (error) {
    console.error('Admin usage error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch AI usage',
    });
  }
}
