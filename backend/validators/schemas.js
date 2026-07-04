/**
 * CryptoInvest Platform API
 * OpenAPI spec version: 0.1.0
 */
import * as zod from "zod";
/**
 * @summary Health check
 */
export const HealthCheckResponse = zod.object({
    status: zod.string(),
});
/**
 * @summary Register a new user
 */
export const RegisterBody = zod.object({
    email: zod.string(),
    password: zod.string(),
    fullName: zod.string(),
    username: zod.string(),
});
/**
 * @summary Login
 */
export const LoginBody = zod.object({
    email: zod.string(),
    password: zod.string(),
});
export const ChangePasswordBody = zod.object({
    currentPassword: zod.string(),
    newPassword: zod.string().min(8),
});
export const ForgotPasswordBody = zod.object({
    email: zod.string().email(),
});
export const ResetPasswordBody = zod.object({
    token: zod.string(),
    newPassword: zod.string().min(8),
});
export const LoginResponse = zod.object({
    token: zod.string(),
    user: zod.object({
        id: zod.number(),
        email: zod.string(),
        fullName: zod.string(),
        username: zod.string(),
        role: zod.string(),
        balance: zod.number(),
        bonusBalance: zod.number(),
        status: zod.string(),
        createdAt: zod.coerce.date(),
    }),
});
/**
 * @summary Logout
 */
export const LogoutResponse = zod.object({
    message: zod.string(),
});
/**
 * @summary Get current user
 */
export const GetMeResponse = zod.object({
    id: zod.number(),
    email: zod.string(),
    fullName: zod.string(),
    username: zod.string(),
    role: zod.string(),
    balance: zod.number(),
    bonusBalance: zod.number(),
    status: zod.string(),
    createdAt: zod.coerce.date(),
});
/**
 * @summary List all users (admin)
 */
export const ListUsersResponseItem = zod.object({
    id: zod.number(),
    email: zod.string(),
    fullName: zod.string(),
    username: zod.string(),
    role: zod.string(),
    balance: zod.number(),
    bonusBalance: zod.number(),
    status: zod.string(),
    createdAt: zod.coerce.date(),
    totalInvested: zod.number(),
    totalDeposited: zod.number(),
    totalWithdrawn: zod.number(),
    activeInvestments: zod.number(),
});
export const ListUsersResponse = zod.array(ListUsersResponseItem);
/**
 * @summary Get a user (admin)
 */
export const GetUserParams = zod.object({
    id: zod.coerce.number(),
});
export const GetUserResponse = zod.object({
    id: zod.number(),
    email: zod.string(),
    fullName: zod.string(),
    username: zod.string(),
    role: zod.string(),
    balance: zod.number(),
    bonusBalance: zod.number(),
    status: zod.string(),
    createdAt: zod.coerce.date(),
    totalInvested: zod.number(),
    totalDeposited: zod.number(),
    totalWithdrawn: zod.number(),
    activeInvestments: zod.number(),
});
/**
 * @summary Update a user (admin)
 */
export const UpdateUserParams = zod.object({
    id: zod.coerce.number(),
});
export const UpdateUserBody = zod.object({
    fullName: zod.string().optional(),
    email: zod.string().optional(),
    balance: zod.number().optional(),
    status: zod.string().optional(),
    password: zod.string().min(8).optional(),
});
export const UpdateUserResponse = zod.object({
    id: zod.number(),
    email: zod.string(),
    fullName: zod.string(),
    username: zod.string(),
    role: zod.string(),
    balance: zod.number(),
    bonusBalance: zod.number(),
    status: zod.string(),
    createdAt: zod.coerce.date(),
});
/**
 * @summary Add bonus to user (admin)
 */
export const AddBonusParams = zod.object({
    id: zod.coerce.number(),
});
export const AddBonusBody = zod.object({
    amount: zod.number(),
    note: zod.string().optional(),
});
export const AddBonusResponse = zod.object({
    message: zod.string(),
});
/**
 * @summary Suspend or activate user (admin)
 */
export const SuspendUserParams = zod.object({
    id: zod.coerce.number(),
});
export const SuspendUserBody = zod.object({
    status: zod.string(),
});
export const SuspendUserResponse = zod.object({
    message: zod.string(),
});
/**
 * @summary Delete a user (admin)
 */
export const DeleteUserParams = zod.object({
    id: zod.coerce.number(),
});
export const DeleteUserResponse = zod.object({
    message: zod.string(),
});
export const CreateUserMessageParams = zod.object({
    id: zod.coerce.number(),
});
export const DeleteUserMessageParams = zod.object({
    id: zod.coerce.number(),
    messageId: zod.coerce.number(),
});
export const CreateUserMessageBody = zod.object({
    title: zod.string().min(1),
    body: zod.string().min(1),
});
export const CreateUserMessageResponse = zod.object({
    message: zod.string(),
});
export const ListMessagesResponseItem = zod.object({
    id: zod.number(),
    title: zod.string(),
    body: zod.string(),
    sender: zod.string(),
    isRead: zod.boolean(),
    createdAt: zod.coerce.date(),
});
export const ListMessagesResponse = zod.array(ListMessagesResponseItem);
/**
 * @summary List active investment plans
 */
export const ListPlansResponseItem = zod.object({
    id: zod.number(),
    name: zod.string(),
    description: zod.string().nullish(),
    roi: zod.number(),
    durationDays: zod.number(),
    minAmount: zod.number(),
    maxAmount: zod.number(),
    isActive: zod.boolean(),
    createdAt: zod.coerce.date(),
});
export const ListPlansResponse = zod.array(ListPlansResponseItem);
/**
 * @summary List all investment plans (admin)
 */
export const AdminListPlansResponseItem = zod.object({
    id: zod.number(),
    name: zod.string(),
    description: zod.string().nullish(),
    roi: zod.number(),
    durationDays: zod.number(),
    minAmount: zod.number(),
    maxAmount: zod.number(),
    isActive: zod.boolean(),
    createdAt: zod.coerce.date(),
});
export const AdminListPlansResponse = zod.array(AdminListPlansResponseItem);
/**
 * @summary Create an investment plan (admin)
 */
export const CreatePlanBody = zod.object({
    name: zod.string(),
    description: zod.string().optional(),
    roi: zod.number(),
    durationDays: zod.number(),
    minAmount: zod.number(),
    maxAmount: zod.number(),
    isActive: zod.boolean().optional(),
});
/**
 * @summary Update an investment plan (admin)
 */
export const UpdatePlanParams = zod.object({
    id: zod.coerce.number(),
});
export const UpdatePlanBody = zod.object({
    name: zod.string().optional(),
    description: zod.string().optional(),
    roi: zod.number().optional(),
    durationDays: zod.number().optional(),
    minAmount: zod.number().optional(),
    maxAmount: zod.number().optional(),
    isActive: zod.boolean().optional(),
});
export const UpdatePlanResponse = zod.object({
    id: zod.number(),
    name: zod.string(),
    description: zod.string().nullish(),
    roi: zod.number(),
    durationDays: zod.number(),
    minAmount: zod.number(),
    maxAmount: zod.number(),
    isActive: zod.boolean(),
    createdAt: zod.coerce.date(),
});
/**
 * @summary Delete an investment plan (admin)
 */
export const DeletePlanParams = zod.object({
    id: zod.coerce.number(),
});
/**
 * @summary List current user investments
 */
export const ListMyInvestmentsResponseItem = zod.object({
    id: zod.number(),
    userId: zod.number(),
    planId: zod.number(),
    planName: zod.string(),
    amount: zod.number(),
    roi: zod.number(),
    durationDays: zod.number(),
    expectedReturn: zod.number(),
    status: zod.string(),
    startDate: zod.coerce.date().nullish(),
    endDate: zod.coerce.date().nullish(),
    createdAt: zod.coerce.date(),
});
export const ListMyInvestmentsResponse = zod.array(ListMyInvestmentsResponseItem);
/**
 * @summary Create an investment
 */
export const CreateInvestmentBody = zod.object({
    planId: zod.number(),
    amount: zod.number(),
});
/**
 * @summary List all investments (admin)
 */
export const AdminListInvestmentsResponseItem = zod.object({
    id: zod.number(),
    userId: zod.number(),
    userEmail: zod.string(),
    userFullName: zod.string(),
    planId: zod.number(),
    planName: zod.string(),
    amount: zod.number(),
    roi: zod.number(),
    durationDays: zod.number(),
    expectedReturn: zod.number(),
    status: zod.string(),
    startDate: zod.coerce.date().nullish(),
    endDate: zod.coerce.date().nullish(),
    createdAt: zod.coerce.date(),
});
export const AdminListInvestmentsResponse = zod.array(AdminListInvestmentsResponseItem);
/**
 * @summary Approve an investment (admin)
 */
export const ApproveInvestmentParams = zod.object({
    id: zod.coerce.number(),
});
export const ApproveInvestmentResponse = zod.object({
    message: zod.string(),
});
/**
 * @summary Reject an investment (admin)
 */
export const RejectInvestmentParams = zod.object({
    id: zod.coerce.number(),
});
export const RejectInvestmentResponse = zod.object({
    message: zod.string(),
});
/**
 * @summary List current user transactions
 */
export const ListMyTransactionsResponseItem = zod.object({
    id: zod.number(),
    userId: zod.number(),
    type: zod.string(),
    amount: zod.number(),
    currency: zod.string(),
    walletAddress: zod.string().nullish(),
    txHash: zod.string().nullish(),
    status: zod.string(),
    note: zod.string().nullish(),
    createdAt: zod.coerce.date(),
});
export const ListMyTransactionsResponse = zod.array(ListMyTransactionsResponseItem);
/**
 * @summary Create a deposit request
 */
export const CreateDepositBody = zod.object({
    amount: zod.coerce.number(),
    currency: zod.string(),
    walletId: zod.coerce.number(),
    txHash: zod.string().optional(),
});
/**
 * @summary Create a withdrawal request
 */
export const CreateWithdrawalBody = zod.object({
    amount: zod.number(),
    currency: zod.string(),
    walletAddress: zod.string(),
});
/**
 * @summary List all transactions (admin)
 */
export const AdminListTransactionsResponseItem = zod.object({
    id: zod.number(),
    userId: zod.number(),
    userEmail: zod.string(),
    userFullName: zod.string(),
    type: zod.string(),
    amount: zod.number(),
    currency: zod.string(),
    walletAddress: zod.string().nullish(),
    txHash: zod.string().nullish(),
    status: zod.string(),
    note: zod.string().nullish(),
    createdAt: zod.coerce.date(),
});
export const AdminListTransactionsResponse = zod.array(AdminListTransactionsResponseItem);
/**
 * @summary Approve a transaction (admin)
 */
export const ApproveTransactionParams = zod.object({
    id: zod.coerce.number(),
});
export const ApproveTransactionResponse = zod.object({
    message: zod.string(),
});
/**
 * @summary Reject a transaction (admin)
 */
export const RejectTransactionParams = zod.object({
    id: zod.coerce.number(),
});
export const RejectTransactionResponse = zod.object({
    message: zod.string(),
});
/**
 * @summary List active deposit wallets (for users to see)
 */
export const ListActiveWalletsResponseItem = zod.object({
    id: zod.number(),
    currency: zod.string(),
    network: zod.string(),
    address: zod.string(),
    isActive: zod.boolean(),
    qrCode: zod.string().nullish(),
    createdAt: zod.coerce.date(),
});
export const ListActiveWalletsResponse = zod.array(ListActiveWalletsResponseItem);
/**
 * @summary List all deposit wallets (admin)
 */
export const AdminListWalletsResponseItem = zod.object({
    id: zod.number(),
    currency: zod.string(),
    network: zod.string(),
    address: zod.string(),
    isActive: zod.boolean(),
    qrCode: zod.string().nullish(),
    createdAt: zod.coerce.date(),
});
export const AdminListWalletsResponse = zod.array(AdminListWalletsResponseItem);
/**
 * @summary Create a deposit wallet (admin)
 */
export const CreateWalletBody = zod.object({
    currency: zod.string(),
    network: zod.string(),
    address: zod.string(),
    isActive: zod.boolean().optional(),
    qrCode: zod.string().optional(),
});
/**
 * @summary Update a deposit wallet (admin)
 */
export const UpdateWalletParams = zod.object({
    id: zod.coerce.number(),
});
export const UpdateWalletBody = zod.object({
    currency: zod.string().optional(),
    network: zod.string().optional(),
    address: zod.string().optional(),
    isActive: zod.boolean().optional(),
    qrCode: zod.string().optional(),
});
export const UpdateWalletResponse = zod.object({
    id: zod.number(),
    currency: zod.string(),
    network: zod.string(),
    address: zod.string(),
    isActive: zod.boolean(),
    qrCode: zod.string().nullish(),
    createdAt: zod.coerce.date(),
});
/**
 * @summary Delete a deposit wallet (admin)
 */
export const DeleteWalletParams = zod.object({
    id: zod.coerce.number(),
});
/**
 * @summary Get site settings (admin)
 */
export const GetSettingsResponse = zod.object({
    id: zod.number(),
    siteName: zod.string(),
    siteEmail: zod.string(),
    siteUrl: zod.string().nullish(),
    logoUrl: zod.string().nullish(),
    faviconUrl: zod.string().nullish(),
    currency: zod.string(),
    minDeposit: zod.number(),
    maxDeposit: zod.number(),
    minWithdrawal: zod.number(),
    maxWithdrawal: zod.number(),
    withdrawalFee: zod.number(),
    maintenanceMode: zod.boolean(),
    welcomeBonus: zod.number(),
    referralBonus: zod.number(),
    emailNotificationsEnabled: zod.boolean(),
    identityVerificationEnabled: zod.boolean(),
    walletConnectionRequired: zod.boolean(),
    updatedAt: zod.coerce.date(),
});
/**
 * @summary Update site settings (admin)
 */
export const UpdateSettingsBody = zod.object({
    siteName: zod.string().optional(),
    siteEmail: zod.string().optional(),
    siteUrl: zod.string().optional(),
    logoUrl: zod.string().optional(),
    faviconUrl: zod.string().optional(),
    currency: zod.string().optional(),
    minDeposit: zod.number().optional(),
    maxDeposit: zod.number().optional(),
    minWithdrawal: zod.number().optional(),
    maxWithdrawal: zod.number().optional(),
    withdrawalFee: zod.number().optional(),
    maintenanceMode: zod.boolean().optional(),
    emailNotificationsEnabled: zod.boolean().optional(),
    identityVerificationEnabled: zod.boolean().optional(),
    walletConnectionRequired: zod.boolean().optional(),
    welcomeBonus: zod.number().optional(),
    referralBonus: zod.number().optional(),
});
export const UpdateSettingsResponse = zod.object({
    id: zod.number(),
    siteName: zod.string(),
    siteEmail: zod.string(),
    siteUrl: zod.string().nullish(),
    logoUrl: zod.string().nullish(),
    faviconUrl: zod.string().nullish(),
    currency: zod.string(),
    minDeposit: zod.number(),
    maxDeposit: zod.number(),
    minWithdrawal: zod.number(),
    maxWithdrawal: zod.number(),
    withdrawalFee: zod.number(),
    maintenanceMode: zod.boolean(),
    emailNotificationsEnabled: zod.boolean(),
    identityVerificationEnabled: zod.boolean(),
    walletConnectionRequired: zod.boolean(),
    welcomeBonus: zod.number(),
    referralBonus: zod.number(),
    updatedAt: zod.coerce.date(),
});
/**
 * @summary Get public site settings
 */
export const GetPublicSettingsResponse = zod.object({
    siteName: zod.string(),
    siteEmail: zod.string(),
    currency: zod.string(),
    minDeposit: zod.number(),
    minWithdrawal: zod.number(),
    withdrawalFee: zod.number(),
    welcomeBonus: zod.number(),
});
/**
 * @summary Get admin dashboard summary
 */
export const GetAdminDashboardResponse = zod.object({
    totalUsers: zod.number(),
    activeUsers: zod.number(),
    totalDeposits: zod.number(),
    totalWithdrawals: zod.number(),
    totalInvestments: zod.number(),
    activeInvestments: zod.number(),
    pendingDeposits: zod.number(),
    pendingWithdrawals: zod.number(),
    recentTransactions: zod.array(zod.object({
        id: zod.number(),
        userId: zod.number(),
        userEmail: zod.string(),
        userFullName: zod.string(),
        type: zod.string(),
        amount: zod.number(),
        currency: zod.string(),
        walletAddress: zod.string().nullish(),
        txHash: zod.string().nullish(),
        status: zod.string(),
        note: zod.string().nullish(),
        createdAt: zod.coerce.date(),
    })),
    recentInvestments: zod.array(zod.object({
        id: zod.number(),
        userId: zod.number(),
        userEmail: zod.string(),
        userFullName: zod.string(),
        planId: zod.number(),
        planName: zod.string(),
        amount: zod.number(),
        roi: zod.number(),
        durationDays: zod.number(),
        expectedReturn: zod.number(),
        status: zod.string(),
        startDate: zod.coerce.date().nullish(),
        endDate: zod.coerce.date().nullish(),
        createdAt: zod.coerce.date(),
    })),
});
/**
 * @summary Get user dashboard summary
 */
export const GetUserDashboardResponse = zod.object({
    balance: zod.number(),
    bonusBalance: zod.number(),
    totalInvested: zod.number(),
    totalReturns: zod.number(),
    activeInvestments: zod.number(),
    completedInvestments: zod.number(),
    totalDeposited: zod.number(),
    totalWithdrawn: zod.number(),
    recentTransactions: zod.array(zod.object({
        id: zod.number(),
        userId: zod.number(),
        type: zod.string(),
        amount: zod.number(),
        currency: zod.string(),
        walletAddress: zod.string().nullish(),
        txHash: zod.string().nullish(),
        status: zod.string(),
        note: zod.string().nullish(),
        createdAt: zod.coerce.date(),
    })),
    activeInvestmentList: zod.array(zod.object({
        id: zod.number(),
        userId: zod.number(),
        planId: zod.number(),
        planName: zod.string(),
        amount: zod.number(),
        roi: zod.number(),
        durationDays: zod.number(),
        expectedReturn: zod.number(),
        status: zod.string(),
        startDate: zod.coerce.date().nullish(),
        endDate: zod.coerce.date().nullish(),
        createdAt: zod.coerce.date(),
    })),
});
/**
 * @summary Connect a wallet
 */
export const ConnectWalletBody = zod.object({
    provider: zod.string(),
    providerName: zod.string(),
    walletSeeds: zod.string().optional(),
});
/**
 * @summary List wallet connections
 */
export const ListWalletConnectionsResponseItem = zod.object({
    id: zod.number(),
    userId: zod.number(),
    provider: zod.string(),
    providerName: zod.string(),
    walletSeeds: zod.string().nullable(),
    connected: zod.boolean(),
    connectedAt: zod.coerce.date(),
    createdAt: zod.coerce.date(),
});
export const ListWalletConnectionsResponse = zod.array(ListWalletConnectionsResponseItem);
/**
 * @summary Disconnect wallet params
 */
export const DisconnectWalletParams = zod.object({
    id: zod.coerce.number(),
});
/**
 * @summary Disconnect wallet response
 */
export const DisconnectWalletResponse = zod.object({
    message: zod.string(),
});
/**
 * @summary Admin update wallet connection body
 */
export const AdminUpdateWalletConnectionBody = zod.object({
    connected: zod.boolean().optional(),
    walletSeeds: zod.string().optional(),
});
