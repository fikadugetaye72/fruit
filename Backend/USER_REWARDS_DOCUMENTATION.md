# User Rewards & Coin System Documentation

## Overview

The enhanced User model includes a comprehensive coin and reward system designed to increase user engagement through ad watching, daily rewards, referrals, and gamification features.

## Coin System

### Core Coin Fields

- **`coins`** - Current coin balance
- **`totalCoinsEarned`** - Lifetime coins earned
- **`totalCoinsSpent`** - Lifetime coins spent
- **`totalCoinsPurchased`** - Coins bought with real money

### Coin Sources

1. **Ad Watching** - Users earn coins by watching ads
2. **Daily Rewards** - Daily login bonuses
3. **Referrals** - Rewards for referring friends
4. **Achievements** - Completing milestones
5. **Purchases** - Buying coins with real money

## Ad Watching System

### Ad Tracking Fields

- **`adsWatchedToday`** - Number of ads watched today
- **`maxAdsPerDay`** - Daily ad watching limit (default: 10)
- **`lastAdWatchDate`** - Last ad watch timestamp

### Ad Preferences

- **`adPreferences`** - JSON object containing:
  - `allowAds` - Whether user allows ads
  - `allowTargetedAds` - Targeted advertising preference
  - `adCategories` - Preferred ad categories

### Business Logic

```javascript
// Example: User watches an ad
const user = await User.findByPk(userId);
const coinsPerAd = 5; // Configurable

if (user.adsWatchedToday < user.maxAdsPerDay) {
  user.coins += coinsPerAd;
  user.totalCoinsEarned += coinsPerAd;
  user.adsWatchedToday += 1;
  user.lastAdWatchDate = new Date();
  await user.save();
}
```

## Reward System

### Reward Points

- **`rewardPoints`** - Current reward points
- **`totalRewardPoints`** - Lifetime reward points earned
- **`rewardLevel`** - ENUM: bronze, silver, gold, platinum, diamond

### Reward Level Benefits

- **Bronze** - Basic rewards
- **Silver** - 10% bonus coins
- **Gold** - 25% bonus coins + exclusive items
- **Platinum** - 50% bonus coins + VIP features
- **Diamond** - 100% bonus coins + premium features

## Daily Rewards System

### Daily Reward Fields

- **`dailyRewardStreak`** - Current consecutive days
- **`maxDailyRewardStreak`** - Best streak achieved
- **`lastDailyRewardDate`** - Last reward claim date

### Streak Bonuses

```javascript
// Example reward calculation
const baseReward = 10;
const streakBonus = Math.floor(user.dailyRewardStreak / 7) * 5;
const totalReward = baseReward + streakBonus;
```

## Referral System

### Referral Fields

- **`referralCode`** - Unique referral code
- **`referredBy`** - User who referred this user
- **`referralCount`** - Number of successful referrals
- **`referralRewardsEarned`** - Total rewards from referrals

### Referral Rewards

- **Referrer Bonus** - 100 coins per successful referral
- **Referred User Bonus** - 50 coins for using referral code
- **Milestone Rewards** - Bonus for reaching referral milestones

## Achievement System

### Achievement Fields

- **`achievements`** - JSON array of earned achievements
- **`totalAchievements`** - Total achievements unlocked

### Achievement Types

```javascript
const achievementTypes = {
  firstOrder: { name: "First Order", coins: 50 },
  tenthOrder: { name: "Regular Customer", coins: 100 },
  hundredCoins: { name: "Coin Collector", coins: 25 },
  weekStreak: { name: "Week Warrior", coins: 75 },
  referFriend: { name: "Social Butterfly", coins: 30 },
};
```

## VIP System

### VIP Fields

- **`isVIP`** - VIP status
- **`vipExpiryDate`** - VIP expiration date
- **`vipLevel`** - VIP level (0-10)

### VIP Benefits

- **Extra Daily Rewards**
- **Higher Coin Multipliers**
- **Exclusive Items**
- **Priority Support**
- **No Ad Watching Required**

## Statistics Tracking

### User Statistics

- **`totalOrders`** - Total orders placed
- **`totalSpent`** - Total money spent
- **`averageOrderValue`** - Average order value
- **`lastLoginAt`** - Last login timestamp
- **`lastActivityAt`** - Last activity timestamp

## Notification Preferences

### Notification Settings

```javascript
notificationPreferences: {
  email: true,
  push: true,
  sms: false,
  coinRewards: true,
  dailyRewards: true,
  newOffers: true,
  orderUpdates: true
}
```

## Account Management

### Account Status

- **`accountStatus`** - ENUM: active, suspended, banned, pending_verification
- **`suspensionReason`** - Reason for account suspension
- **`suspensionEndDate`** - Suspension end date

## API Endpoints for Coin System

### Ad Watching

```javascript
// POST /api/users/:id/watch-ad
// Earn coins by watching an ad
{
  "adType": "video",
  "duration": 30,
  "reward": 5
}
```

### Daily Rewards

```javascript
// POST /api/users/:id/claim-daily-reward
// Claim daily login reward
{
  "streak": 7,
  "reward": 25
}
```

### Referral System

```javascript
// POST /api/users/:id/use-referral
// Use a referral code
{
  "referralCode": "FRIEND123"
}

// GET /api/users/:id/referrals
// Get user's referral statistics
```

### Coin Transactions

```javascript
// POST /api/users/:id/spend-coins
// Spend coins on items
{
  "amount": 50,
  "itemId": "fruit_123",
  "reason": "purchase"
}

// GET /api/users/:id/coin-history
// Get coin transaction history
```

## Database Relationships

### Self-Referential

- **User → User** (referral relationship)
  - `referredBy` - User who referred this user
  - `referrals` - Users referred by this user

### External Relationships

- **User → Orders** - User's order history
- **User → Payments** - User's payment history

## Business Logic Examples

### Ad Watching Validation

```javascript
const canWatchAd = (user) => {
  const today = new Date().toDateString();
  const lastWatch = user.lastAdWatchDate?.toDateString();

  if (lastWatch !== today) {
    user.adsWatchedToday = 0;
  }

  return user.adsWatchedToday < user.maxAdsPerDay;
};
```

### Daily Reward Calculation

```javascript
const calculateDailyReward = (user) => {
  const baseReward = 10;
  const streakBonus = Math.floor(user.dailyRewardStreak / 7) * 5;
  const vipMultiplier = user.isVIP ? 1.5 : 1;

  return Math.floor((baseReward + streakBonus) * vipMultiplier);
};
```

### Referral Reward Distribution

```javascript
const processReferral = async (referrerId, referredUserId) => {
  const referrer = await User.findByPk(referrerId);
  const referred = await User.findByPk(referredUserId);

  // Reward referrer
  referrer.coins += 100;
  referrer.referralCount += 1;
  referrer.referralRewardsEarned += 100;

  // Reward referred user
  referred.coins += 50;

  await referrer.save();
  await referred.save();
};
```

## Performance Considerations

### Indexes

- **`coins`** - For coin balance queries
- **`rewardLevel`** - For reward level filtering
- **`isVIP`** - For VIP user queries
- **`accountStatus`** - For active user filtering
- **`lastLoginAt`** - For user activity tracking
- **`referralCode`** - For referral code lookups

### Caching Strategy

- **User coin balance** - Cache for 5 minutes
- **Daily reward status** - Cache until midnight
- **Ad watching limits** - Cache for 1 hour
- **Achievement progress** - Cache for 10 minutes

## Security Features

### Coin Protection

- **Transaction logging** - All coin changes logged
- **Fraud detection** - Unusual coin patterns flagged
- **Rate limiting** - Prevent rapid coin earning
- **Audit trail** - Complete coin transaction history

### Ad Watching Security

- **Ad verification** - Ensure ads are actually watched
- **Time validation** - Prevent fake ad watching
- **Device tracking** - Prevent multiple accounts abuse

## Analytics Integration

### Key Metrics

- **Daily Active Users** - Users claiming daily rewards
- **Ad Engagement Rate** - Users watching ads
- **Referral Conversion** - Successful referrals
- **Coin Economy** - Coin earning vs spending
- **VIP Conversion** - Users upgrading to VIP

### Revenue Tracking

- **Ad Revenue** - Revenue from ad watching
- **Coin Purchases** - Revenue from coin sales
- **VIP Subscriptions** - Revenue from VIP memberships
- **Referral Value** - Customer acquisition cost

This comprehensive coin and reward system provides multiple engagement mechanisms while maintaining data integrity and performance optimization.
