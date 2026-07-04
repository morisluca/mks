
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type {
  AddBonusBody,
  AdminDashboard,
  AuthResponse,
  CreateDepositBody,
  CreateInvestmentBody,
  CreatePlanBody,
  CreateWalletBody,
  CreateWithdrawalBody,
  DepositWallet,
  ErrorResponse,
  HealthStatus,
  Investment,
  InvestmentWithUser,
  LoginBody,
  MessageResponse,
  Plan,
  PublicSettings,
  RegisterBody,
  SiteSettings,
  SuspendUserBody,
  Transaction,
  TransactionWithUser,
  UpdatePlanBody,
  UpdateSettingsBody,
  UpdateUserBody,
  UpdateWalletBody,
  User,
  UserDashboard,
  UserWithStats,
  ConnectWalletBody,
  WalletConnection,
} from "./api.schemas";

import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";

type AwaitedInput<T> = PromiseLike<T> | T;

type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * @summary Health check
 */
export const getHealthCheckUrl = () => {
  return `/healthz`;
};

export const healthCheck = async (
  options?: RequestInit,
): Promise<HealthStatus> => {
  return customFetch<HealthStatus>(getHealthCheckUrl(), {
    ...options,
    method: "GET",
  });
};

export const getHealthCheckQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/healthz`] as const;
};

export const getHealthCheckQueryOptions = <
  TData = Awaited<ReturnType<typeof healthCheck>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof healthCheck>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getHealthCheckQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({
    signal,
  }) => healthCheck({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof healthCheck>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type HealthCheckQueryResult = NonNullable<
  Awaited<ReturnType<typeof healthCheck>>
>;
export type HealthCheckQueryError = ErrorType<unknown>;

/**
 * @summary Health check
 */

export function useHealthCheck<
  TData = Awaited<ReturnType<typeof healthCheck>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof healthCheck>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getHealthCheckQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Register a new user
 */
export const getRegisterUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/auth/register`;
};

export const register = async (
  registerBody: RegisterBody,
  options?: RequestInit,
): Promise<AuthResponse> => {
  return customFetch<AuthResponse>(getRegisterUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(registerBody),
  });
};

export const getRegisterMutationOptions = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof register>>,
    TError,
    { data: BodyType<RegisterBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof register>>,
  TError,
  { data: BodyType<RegisterBody> },
  TContext
> => {
  const mutationKey = ["register"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof register>>,
    { data: BodyType<RegisterBody> }
  > = (props) => {
    const { data } = props ?? {};

    return register(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RegisterMutationResult = NonNullable<
  Awaited<ReturnType<typeof register>>
>;
export type RegisterMutationBody = BodyType<RegisterBody>;
export type RegisterMutationError = ErrorType<ErrorResponse>;

/**
 * @summary Register a new user
 */
export const useRegister = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof register>>, 
    TError,
    { data: BodyType<RegisterBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof register>>,
  TError,
  { data: BodyType<RegisterBody> },
  TContext
> => {
  return useMutation(getRegisterMutationOptions(options));
};

/**
 * @summary Login
 */
export const getLoginUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/auth/login`;
};

export const login = async (
  loginBody: LoginBody,
  options?: RequestInit,
): Promise<AuthResponse> => {
  return customFetch<AuthResponse>(getLoginUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(loginBody),
  });
};

export const getLoginMutationOptions = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof login>>,
    TError,
    { data: BodyType<LoginBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof login>>,
  TError,
  { data: BodyType<LoginBody> },
  TContext
> => {
  const mutationKey = ["login"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof login>>,
    { data: BodyType<LoginBody> }
  > = (props) => {
    const { data } = props ?? {};

    return login(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type LoginMutationResult = NonNullable<
  Awaited<ReturnType<typeof login>>
>;
export type LoginMutationBody = BodyType<LoginBody>;
export type LoginMutationError = ErrorType<ErrorResponse>;

/**
 * @summary Login
 */
export const useLogin = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof login>>,
    TError,
    { data: BodyType<LoginBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof login>>,
  TError,
  { data: BodyType<LoginBody> },
  TContext
> => {
  return useMutation(getLoginMutationOptions(options));
};

/**
 * @summary Logout
 */
export const getLogoutUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/auth/logout`;
};

export const logout = async (
  options?: RequestInit,
): Promise<MessageResponse> => {
  return customFetch<MessageResponse>(getLogoutUrl(), {
    ...options,
    method: "POST",
  });
};

export const getLogoutMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof logout>>,
    TError,
    void,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof logout>>,
  TError,
  void,
  TContext
> => {
  const mutationKey = ["logout"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof logout>>,
    void
  > = () => {
    return logout(requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type LogoutMutationResult = NonNullable<
  Awaited<ReturnType<typeof logout>>
>;

export type LogoutMutationError = ErrorType<unknown>;

/**
 * @summary Logout
 */
export const useLogout = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof logout>>,
    TError,
    void,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof logout>>,
  TError,
  void,
  TContext
> => {
  return useMutation(getLogoutMutationOptions(options));
};

/**
 * @summary Get current user
 */
export const getGetMeUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/auth/me`;
};

export const getMe = async (options?: RequestInit): Promise<User> => {
  return customFetch<User>(getGetMeUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetMeQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/auth/me`] as const;
};

export const getGetMeQueryOptions = <
  TData = Awaited<ReturnType<typeof getMe>>,
  TError = ErrorType<ErrorResponse>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMeQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMe>>> = ({
    signal,
  }) => getMe({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getMe>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get current user
 */

export function useGetMe<
  TData = Awaited<ReturnType<typeof getMe>>,
  TError = ErrorType<ErrorResponse>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetMeQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List all users (admin)
 */
export const getListUsersUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/users`;
};

export const listUsers = async (
  options?: RequestInit,
): Promise<UserWithStats[]> => {
  return customFetch<UserWithStats[]>(getListUsersUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListUsersQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/admin/users`] as const;
};

export const getListUsersQueryOptions = <
  TData = Awaited<ReturnType<typeof listUsers>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListUsersQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listUsers>>> = ({
    signal,
  }) => listUsers({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listUsers>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListUsersQueryResult = NonNullable<
  Awaited<ReturnType<typeof listUsers>>
>;
export type ListUsersQueryError = ErrorType<unknown>;

/**
 * @summary List all users (admin)
 */

export function useListUsers<
  TData = Awaited<ReturnType<typeof listUsers>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListUsersQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get a user (admin)
 */
export const getGetUserUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/users/${id}`;
};

export const getUser = async (
  id: number,
  options?: RequestInit,
): Promise<UserWithStats> => {
  return customFetch<UserWithStats>(getGetUserUrl(id), {
    ...options,
    method: "GET",
  });
};

export const getGetUserQueryKey = (id: number) => {
  return [`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`] as const;
};

export const getGetUserQueryOptions = <
  TData = Awaited<ReturnType<typeof getUser>>,
  TError = ErrorType<ErrorResponse>,
>(
  id: number,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUserQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUser>>> = ({
    signal,
  }) => getUser(id, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: QueryKey;
  };
};

export type GetUserQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUser>>
>;
export type GetUserQueryError = ErrorType<ErrorResponse>;

/**
 * @summary Get a user (admin)
 */

export function useGetUser<
  TData = Awaited<ReturnType<typeof getUser>>,
  TError = ErrorType<ErrorResponse>,
>(
  id: number,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUserQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Update a user (admin)
 */
export const getUpdateUserUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/users/${id}`;
};

export const updateUser = async (
  id: number,
  updateUserBody: UpdateUserBody,
  options?: RequestInit,
): Promise<User> => {
  return customFetch<User>(getUpdateUserUrl(id), {
    ...options,
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(updateUserBody),
  });
};

export const getUpdateUserMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateUser>>,
    TError,
    { id: number; data: BodyType<UpdateUserBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateUser>>,
  TError,
  { id: number; data: BodyType<UpdateUserBody> },
  TContext
> => {
  const mutationKey = ["updateUser"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateUser>>,
    { id: number; data: BodyType<UpdateUserBody> }
  > = (props) => {
    const { id, data } = props ?? {};

    return updateUser(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateUser>>
>;
export type UpdateUserMutationBody = BodyType<UpdateUserBody>;
export type UpdateUserMutationError = ErrorType<unknown>;

/**
 * @summary Update a user (admin)
 */
export const useUpdateUser = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateUser>>,
    TError,
    { id: number; data: BodyType<UpdateUserBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof updateUser>>,
  TError,
  { id: number; data: BodyType<UpdateUserBody> },
  TContext
> => {
  return useMutation(getUpdateUserMutationOptions(options));
};

/**
 * @summary Add bonus to user (admin)
 */
export const getAddBonusUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/users/${id}/bonus`;
};

export const addBonus = async (
  id: number,
  addBonusBody: AddBonusBody,
  options?: RequestInit,
): Promise<MessageResponse> => {
  return customFetch<MessageResponse>(getAddBonusUrl(id), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(addBonusBody),
  });
};

export const getAddBonusMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addBonus>>,
    TError,
    { id: number; data: BodyType<AddBonusBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof addBonus>>,
  TError,
  { id: number; data: BodyType<AddBonusBody> },
  TContext
> => {
  const mutationKey = ["addBonus"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof addBonus>>,
    { id: number; data: BodyType<AddBonusBody> }
  > = (props) => {
    const { id, data } = props ?? {};

    return addBonus(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type AddBonusMutationResult = NonNullable<
  Awaited<ReturnType<typeof addBonus>>
>;
export type AddBonusMutationBody = BodyType<AddBonusBody>;
export type AddBonusMutationError = ErrorType<unknown>;

/**
 * @summary Add bonus to user (admin)
 */
export const useAddBonus = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addBonus>>,
    TError,
    { id: number; data: BodyType<AddBonusBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof addBonus>>,
  TError,
  { id: number; data: BodyType<AddBonusBody> },
  TContext
> => {
  return useMutation(getAddBonusMutationOptions(options));
};

/**
 * @summary Suspend or activate user (admin)
 */
export const getSuspendUserUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/users/${id}/suspend`;
};

export const suspendUser = async (
  id: number,
  suspendUserBody: SuspendUserBody,
  options?: RequestInit,
): Promise<MessageResponse> => {
  return customFetch<MessageResponse>(getSuspendUserUrl(id), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(suspendUserBody),
  });
};

export const getSuspendUserMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof suspendUser>>,
    TError,
    { id: number; data: BodyType<SuspendUserBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof suspendUser>>,
  TError,
  { id: number; data: BodyType<SuspendUserBody> },
  TContext
> => {
  const mutationKey = ["suspendUser"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof suspendUser>>,
    { id: number; data: BodyType<SuspendUserBody> }
  > = (props) => {
    const { id, data } = props ?? {};

    return suspendUser(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type SuspendUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof suspendUser>>
>;
export type SuspendUserMutationBody = BodyType<SuspendUserBody>;
export type SuspendUserMutationError = ErrorType<unknown>;

/**
 * @summary Suspend or activate user (admin)
 */
export const useSuspendUser = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof suspendUser>>,
    TError,
    { id: number; data: BodyType<SuspendUserBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof suspendUser>>,
  TError,
  { id: number; data: BodyType<SuspendUserBody> },
  TContext
> => {
  return useMutation(getSuspendUserMutationOptions(options));
};

/**
 * @summary Delete a user (admin)
 */
export const getDeleteUserUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/users/${id}`;
};

export const deleteUser = async (
  id: number,
  options?: RequestInit,
): Promise<MessageResponse> => {
  return customFetch<MessageResponse>(getDeleteUserUrl(id), {
    ...options,
    method: "DELETE",
  });
};

export const getDeleteUserMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUser>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteUser>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = ["deleteUser"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteUser>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteUser(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteUser>>
>;
export type DeleteUserMutationError = ErrorType<unknown>;

/**
 * @summary Delete a user (admin)
 */
export const useDeleteUser = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUser>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteUser>>,
  TError,
  { id: number },
  TContext
> => {
  return useMutation(getDeleteUserMutationOptions(options));
};

/**
 * @summary List active investment plans
 */
export const getListPlansUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/plans`;
};

export const listPlans = async (options?: RequestInit): Promise<Plan[]> => {
  return customFetch<Plan[]>(getListPlansUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListPlansQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/plans`] as const;
};

export const getListPlansQueryOptions = <
  TData = Awaited<ReturnType<typeof listPlans>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listPlans>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListPlansQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listPlans>>> = ({
    signal,
  }) => listPlans({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listPlans>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListPlansQueryResult = NonNullable<
  Awaited<ReturnType<typeof listPlans>>
>;
export type ListPlansQueryError = ErrorType<unknown>;

/**
 * @summary List active investment plans
 */

export function useListPlans<
  TData = Awaited<ReturnType<typeof listPlans>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listPlans>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListPlansQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List all investment plans (admin)
 */
export const getAdminListPlansUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/plans`;
};

export const adminListPlans = async (
  options?: RequestInit,
): Promise<Plan[]> => {
  return customFetch<Plan[]>(getAdminListPlansUrl(), {
    ...options,
    method: "GET",
  });
};

export const getAdminListPlansQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/admin/plans`] as const;
};

export const getAdminListPlansQueryOptions = <
  TData = Awaited<ReturnType<typeof adminListPlans>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof adminListPlans>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getAdminListPlansQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof adminListPlans>>> = ({
    signal,
  }) => adminListPlans({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof adminListPlans>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type AdminListPlansQueryResult = NonNullable<
  Awaited<ReturnType<typeof adminListPlans>>
>;
export type AdminListPlansQueryError = ErrorType<unknown>;

/**
 * @summary List all investment plans (admin)
 */

export function useAdminListPlans<
  TData = Awaited<ReturnType<typeof adminListPlans>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof adminListPlans>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getAdminListPlansQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Create an investment plan (admin)
 */
export const getCreatePlanUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/plans`;
};

export const createPlan = async (
  createPlanBody: CreatePlanBody,
  options?: RequestInit,
): Promise<Plan> => {
  return customFetch<Plan>(getCreatePlanUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createPlanBody),
  });
};

export const getCreatePlanMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createPlan>>,
    TError,
    { data: BodyType<CreatePlanBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createPlan>>,
  TError,
  { data: BodyType<CreatePlanBody> },
  TContext
> => {
  const mutationKey = ["createPlan"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createPlan>>,
    { data: BodyType<CreatePlanBody> }
  > = (props) => {
    const { data } = props ?? {};

    return createPlan(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreatePlanMutationResult = NonNullable<
  Awaited<ReturnType<typeof createPlan>>
>;
export type CreatePlanMutationBody = BodyType<CreatePlanBody>;
export type CreatePlanMutationError = ErrorType<unknown>;

/**
 * @summary Create an investment plan (admin)
 */
export const useCreatePlan = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createPlan>>,
    TError,
    { data: BodyType<CreatePlanBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof createPlan>>,
  TError,
  { data: BodyType<CreatePlanBody> },
  TContext
> => {
  return useMutation(getCreatePlanMutationOptions(options));
};

/**
 * @summary Update an investment plan (admin)
 */
export const getUpdatePlanUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/plans/${id}`;
};

export const updatePlan = async (
  id: number,
  updatePlanBody: UpdatePlanBody,
  options?: RequestInit,
): Promise<Plan> => {
  return customFetch<Plan>(getUpdatePlanUrl(id), {
    ...options,
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(updatePlanBody),
  });
};

export const getUpdatePlanMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updatePlan>>,
    TError,
    { id: number; data: BodyType<UpdatePlanBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updatePlan>>,
  TError,
  { id: number; data: BodyType<UpdatePlanBody> },
  TContext
> => {
  const mutationKey = ["updatePlan"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updatePlan>>,
    { id: number; data: BodyType<UpdatePlanBody> }
  > = (props) => {
    const { id, data } = props ?? {};

    return updatePlan(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdatePlanMutationResult = NonNullable<
  Awaited<ReturnType<typeof updatePlan>>
>;
export type UpdatePlanMutationBody = BodyType<UpdatePlanBody>;
export type UpdatePlanMutationError = ErrorType<unknown>;

/**
 * @summary Update an investment plan (admin)
 */
export const useUpdatePlan = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updatePlan>>,
    TError,
    { id: number; data: BodyType<UpdatePlanBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof updatePlan>>,
  TError,
  { id: number; data: BodyType<UpdatePlanBody> },
  TContext
> => {
  return useMutation(getUpdatePlanMutationOptions(options));
};

/**
 * @summary Delete an investment plan (admin)
 */
export const getDeletePlanUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/plans/${id}`;
};

export const deletePlan = async (
  id: number,
  options?: RequestInit,
): Promise<void> => {
  return customFetch<void>(getDeletePlanUrl(id), {
    ...options,
    method: "DELETE",
  });
};

export const getDeletePlanMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deletePlan>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deletePlan>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = ["deletePlan"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deletePlan>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deletePlan(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeletePlanMutationResult = NonNullable<
  Awaited<ReturnType<typeof deletePlan>>
>;

export type DeletePlanMutationError = ErrorType<unknown>;

/**
 * @summary Delete an investment plan (admin)
 */
export const useDeletePlan = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deletePlan>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof deletePlan>>,
  TError,
  { id: number },
  TContext
> => {
  return useMutation(getDeletePlanMutationOptions(options));
};

/**
 * @summary List current user investments
 */
export const getListMyInvestmentsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/investments`;
};

export const listMyInvestments = async (
  options?: RequestInit,
): Promise<Investment[]> => {
  return customFetch<Investment[]>(getListMyInvestmentsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListMyInvestmentsQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/investments`] as const;
};

export const getListMyInvestmentsQueryOptions = <
  TData = Awaited<ReturnType<typeof listMyInvestments>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listMyInvestments>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListMyInvestmentsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listMyInvestments>>
  > = ({ signal }) => listMyInvestments({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listMyInvestments>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListMyInvestmentsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listMyInvestments>>
>;
export type ListMyInvestmentsQueryError = ErrorType<unknown>;

/**
 * @summary List current user investments
 */

export function useListMyInvestments<
  TData = Awaited<ReturnType<typeof listMyInvestments>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listMyInvestments>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListMyInvestmentsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Create an investment
 */
export const getCreateInvestmentUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/investments`;
};

export const createInvestment = async (
  createInvestmentBody: CreateInvestmentBody,
  options?: RequestInit,
): Promise<Investment> => {
  return customFetch<Investment>(getCreateInvestmentUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createInvestmentBody),
  });
};

export const getCreateInvestmentMutationOptions = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createInvestment>>,
    TError,
    { data: BodyType<CreateInvestmentBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createInvestment>>,
  TError,
  { data: BodyType<CreateInvestmentBody> },
  TContext
> => {
  const mutationKey = ["createInvestment"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createInvestment>>,
    { data: BodyType<CreateInvestmentBody> }
  > = (props) => {
    const { data } = props ?? {};

    return createInvestment(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateInvestmentMutationResult = NonNullable<
  Awaited<ReturnType<typeof createInvestment>>
>;
export type CreateInvestmentMutationBody = BodyType<CreateInvestmentBody>;
export type CreateInvestmentMutationError = ErrorType<ErrorResponse>;

/**
 * @summary Create an investment
 */
export const useCreateInvestment = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createInvestment>>,
    TError,
    { data: BodyType<CreateInvestmentBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof createInvestment>>,
  TError,
  { data: BodyType<CreateInvestmentBody> },
  TContext
> => {
  return useMutation(getCreateInvestmentMutationOptions(options));
};

/**
 * @summary List all investments (admin)
 */
export const getAdminListInvestmentsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/investments`;
};

export const adminListInvestments = async (
  options?: RequestInit,
): Promise<InvestmentWithUser[]> => {
  return customFetch<InvestmentWithUser[]>(getAdminListInvestmentsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getAdminListInvestmentsQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/admin/investments`] as const;
};

export const getAdminListInvestmentsQueryOptions = <
  TData = Awaited<ReturnType<typeof adminListInvestments>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof adminListInvestments>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getAdminListInvestmentsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof adminListInvestments>>
  > = ({ signal }) => adminListInvestments({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof adminListInvestments>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type AdminListInvestmentsQueryResult = NonNullable<
  Awaited<ReturnType<typeof adminListInvestments>>
>;
export type AdminListInvestmentsQueryError = ErrorType<unknown>;

/**
 * @summary List all investments (admin)
 */

export function useAdminListInvestments<
  TData = Awaited<ReturnType<typeof adminListInvestments>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof adminListInvestments>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getAdminListInvestmentsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Approve an investment (admin)
 */
export const getApproveInvestmentUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/investments/${id}/approve`;
};

export const approveInvestment = async (
  id: number,
  options?: RequestInit,
): Promise<MessageResponse> => {
  return customFetch<MessageResponse>(getApproveInvestmentUrl(id), {
    ...options,
    method: "POST",
  });
};

export const getApproveInvestmentMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof approveInvestment>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof approveInvestment>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = ["approveInvestment"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof approveInvestment>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return approveInvestment(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type ApproveInvestmentMutationResult = NonNullable<
  Awaited<ReturnType<typeof approveInvestment>>
>;

export type ApproveInvestmentMutationError = ErrorType<unknown>;

/**
 * @summary Approve an investment (admin)
 */
export const useApproveInvestment = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof approveInvestment>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof approveInvestment>>,
  TError,
  { id: number },
  TContext
> => {
  return useMutation(getApproveInvestmentMutationOptions(options));
};

/**
 * @summary Reject an investment (admin)
 */
export const getRejectInvestmentUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/investments/${id}/reject`;
};

export const rejectInvestment = async (
  id: number,
  options?: RequestInit,
): Promise<MessageResponse> => {
  return customFetch<MessageResponse>(getRejectInvestmentUrl(id), {
    ...options,
    method: "POST",
  });
};

export const getRejectInvestmentMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof rejectInvestment>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof rejectInvestment>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = ["rejectInvestment"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof rejectInvestment>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return rejectInvestment(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RejectInvestmentMutationResult = NonNullable<
  Awaited<ReturnType<typeof rejectInvestment>>
>;

export type RejectInvestmentMutationError = ErrorType<unknown>;

/**
 * @summary Reject an investment (admin)
 */
export const useRejectInvestment = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof rejectInvestment>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof rejectInvestment>>,
  TError,
  { id: number },
  TContext
> => {
  return useMutation(getRejectInvestmentMutationOptions(options));
};

/**
 * @summary Delete a completed investment (admin)
 */
export const getDeleteInvestmentUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/investments/${id}`;
};

export const deleteInvestment = async (
  id: number,
  options?: RequestInit,
): Promise<void> => {
  return customFetch<void>(getDeleteInvestmentUrl(id), {
    ...options,
    method: "DELETE",
  });
};

export const getDeleteInvestmentMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteInvestment>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteInvestment>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = ["deleteInvestment"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteInvestment>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteInvestment(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteInvestmentMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteInvestment>>
>;
export type DeleteInvestmentMutationError = ErrorType<unknown>;

/**
 * @summary Delete a completed investment (admin)
 */
export const useDeleteInvestment = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteInvestment>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteInvestment>>,
  TError,
  { id: number },
  TContext
> => {
  return useMutation(getDeleteInvestmentMutationOptions(options));
};

/**
 * @summary List current user transactions
 */
export const getListMyTransactionsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/transactions`;
};

export const listMyTransactions = async (
  options?: RequestInit,
): Promise<Transaction[]> => {
  return customFetch<Transaction[]>(getListMyTransactionsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListMyTransactionsQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/transactions`] as const;
};

export const getListMyTransactionsQueryOptions = <
  TData = Awaited<ReturnType<typeof listMyTransactions>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listMyTransactions>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListMyTransactionsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listMyTransactions>>
  > = ({ signal }) => listMyTransactions({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listMyTransactions>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListMyTransactionsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listMyTransactions>>
>;
export type ListMyTransactionsQueryError = ErrorType<unknown>;

/**
 * @summary List current user transactions
 */

export function useListMyTransactions<
  TData = Awaited<ReturnType<typeof listMyTransactions>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listMyTransactions>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListMyTransactionsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Create a deposit request
 */
export const getCreateDepositUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/transactions/deposit`;
};

export const createDeposit = async (
  createDepositBody: CreateDepositBody,
  options?: RequestInit,
): Promise<Transaction> => {
  return customFetch<Transaction>(getCreateDepositUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createDepositBody),
  });
};

export const getCreateDepositMutationOptions = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createDeposit>>,
    TError,
    { data: BodyType<CreateDepositBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createDeposit>>,
  TError,
  { data: BodyType<CreateDepositBody> },
  TContext
> => {
  const mutationKey = ["createDeposit"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createDeposit>>,
    { data: BodyType<CreateDepositBody> }
  > = (props) => {
    const { data } = props ?? {};

    return createDeposit(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateDepositMutationResult = NonNullable<
  Awaited<ReturnType<typeof createDeposit>>
>;
export type CreateDepositMutationBody = BodyType<CreateDepositBody>;
export type CreateDepositMutationError = ErrorType<ErrorResponse>;

/**
 * @summary Create a deposit request
 */
export const useCreateDeposit = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createDeposit>>,
    TError,
    { data: BodyType<CreateDepositBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof createDeposit>>,
  TError,
  { data: BodyType<CreateDepositBody> },
  TContext
> => {
  return useMutation(getCreateDepositMutationOptions(options));
};

/**
 * @summary Create a withdrawal request
 */
export const getCreateWithdrawalUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/transactions/withdraw`;
};

export const createWithdrawal = async (
  createWithdrawalBody: CreateWithdrawalBody,
  options?: RequestInit,
): Promise<Transaction> => {
  return customFetch<Transaction>(getCreateWithdrawalUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createWithdrawalBody),
  });
};

export const getCreateWithdrawalMutationOptions = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createWithdrawal>>,
    TError,
    { data: BodyType<CreateWithdrawalBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createWithdrawal>>,
  TError,
  { data: BodyType<CreateWithdrawalBody> },
  TContext
> => {
  const mutationKey = ["createWithdrawal"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createWithdrawal>>,
    { data: BodyType<CreateWithdrawalBody> }
  > = (props) => {
    const { data } = props ?? {};

    return createWithdrawal(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateWithdrawalMutationResult = NonNullable<
  Awaited<ReturnType<typeof createWithdrawal>>
>;
export type CreateWithdrawalMutationBody = BodyType<CreateWithdrawalBody>;
export type CreateWithdrawalMutationError = ErrorType<ErrorResponse>;

/**
 * @summary Create a withdrawal request
 */
export const useCreateWithdrawal = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createWithdrawal>>,
    TError,
    { data: BodyType<CreateWithdrawalBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof createWithdrawal>>,
  TError,
  { data: BodyType<CreateWithdrawalBody> },
  TContext
> => {
  return useMutation(getCreateWithdrawalMutationOptions(options));
};
 
/**
 * @summary List all transactions (admin)
 */
export const getAdminListTransactionsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/transactions`;
};

export const adminListTransactions = async (
  options?: RequestInit,
): Promise<TransactionWithUser[]> => {
  return customFetch<TransactionWithUser[]>(getAdminListTransactionsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getAdminListTransactionsQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/admin/transactions`] as const;
};

export const getAdminListTransactionsQueryOptions = <
  TData = Awaited<ReturnType<typeof adminListTransactions>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof adminListTransactions>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getAdminListTransactionsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof adminListTransactions>>
  > = ({ signal }) => adminListTransactions({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof adminListTransactions>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type AdminListTransactionsQueryResult = NonNullable<
  Awaited<ReturnType<typeof adminListTransactions>>
>;
export type AdminListTransactionsQueryError = ErrorType<unknown>;

/**
 * @summary List all transactions (admin)
 */

export function useAdminListTransactions<
  TData = Awaited<ReturnType<typeof adminListTransactions>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof adminListTransactions>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getAdminListTransactionsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Approve a transaction (admin)
 */
export const getApproveTransactionUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/transactions/${id}/approve`;
};

export const approveTransaction = async (
  id: number,
  options?: RequestInit,
): Promise<MessageResponse> => {
  return customFetch<MessageResponse>(getApproveTransactionUrl(id), {
    ...options,
    method: "POST",
  });
};

export const getApproveTransactionMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof approveTransaction>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof approveTransaction>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = ["approveTransaction"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof approveTransaction>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return approveTransaction(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type ApproveTransactionMutationResult = NonNullable<
  Awaited<ReturnType<typeof approveTransaction>>
>;

export type ApproveTransactionMutationError = ErrorType<unknown>;

/**
 * @summary Approve a transaction (admin)
 */
export const useApproveTransaction = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof approveTransaction>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof approveTransaction>>,
  TError,
  { id: number },
  TContext
> => {
  return useMutation(getApproveTransactionMutationOptions(options));
};

/**
 * @summary Reject a transaction (admin)
 */
export const getRejectTransactionUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/transactions/${id}/reject`;
};

export const rejectTransaction = async (
  id: number,
  options?: RequestInit,
): Promise<MessageResponse> => {
  return customFetch<MessageResponse>(getRejectTransactionUrl(id), {
    ...options,
    method: "POST",
  });
};

export const getRejectTransactionMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof rejectTransaction>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof rejectTransaction>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = ["rejectTransaction"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof rejectTransaction>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return rejectTransaction(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RejectTransactionMutationResult = NonNullable<
  Awaited<ReturnType<typeof rejectTransaction>>
>;

export type RejectTransactionMutationError = ErrorType<unknown>;

/**
 * @summary Reject a transaction (admin)
 */
export const useRejectTransaction = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof rejectTransaction>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof rejectTransaction>>,
  TError,
  { id: number },
  TContext
> => {
  return useMutation(getRejectTransactionMutationOptions(options));
};

/**
 * @summary Delete a completed transaction (admin)
 */
export const getDeleteTransactionUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/transactions/${id}`;
};

export const deleteTransaction = async (
  id: number,
  options?: RequestInit,
): Promise<void> => {
  return customFetch<void>(getDeleteTransactionUrl(id), {
    ...options,
    method: "DELETE",
  });
};

export const getDeleteTransactionMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteTransaction>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteTransaction>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = ["deleteTransaction"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteTransaction>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteTransaction(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteTransactionMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteTransaction>>
>;
export type DeleteTransactionMutationError = ErrorType<unknown>;

/**
 * @summary Delete a completed transaction (admin)
 */
export const useDeleteTransaction = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteTransaction>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteTransaction>>,
  TError,
  { id: number },
  TContext
> => {
  return useMutation(getDeleteTransactionMutationOptions(options));
};

/**
 * @summary List active deposit wallets (for users to see)
 */
export const getListActiveWalletsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/wallets`;
};

export const listActiveWallets = async (
  options?: RequestInit,
): Promise<DepositWallet[]> => {
  return customFetch<DepositWallet[]>(getListActiveWalletsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListActiveWalletsQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/wallets`] as const;
};

export const getListActiveWalletsQueryOptions = <
  TData = Awaited<ReturnType<typeof listActiveWallets>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listActiveWallets>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListActiveWalletsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listActiveWallets>>
  > = ({ signal }) => listActiveWallets({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listActiveWallets>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListActiveWalletsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listActiveWallets>>
>;
export type ListActiveWalletsQueryError = ErrorType<unknown>;

/**
 * @summary List active deposit wallets (for users to see)
 */

export function useListActiveWallets<
  TData = Awaited<ReturnType<typeof listActiveWallets>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listActiveWallets>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListActiveWalletsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List all deposit wallets (admin)
 */
export const getAdminListWalletsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/wallets`;
};

export const adminListWallets = async (
  options?: RequestInit,
): Promise<DepositWallet[]> => {
  return customFetch<DepositWallet[]>(getAdminListWalletsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getAdminListWalletsQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/admin/wallets`] as const;
};

export const getAdminListWalletsQueryOptions = <
  TData = Awaited<ReturnType<typeof adminListWallets>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof adminListWallets>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getAdminListWalletsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof adminListWallets>>
  > = ({ signal }) => adminListWallets({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof adminListWallets>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type AdminListWalletsQueryResult = NonNullable<
  Awaited<ReturnType<typeof adminListWallets>>
>;
export type AdminListWalletsQueryError = ErrorType<unknown>;

/**
 * @summary List all deposit wallets (admin)
 */

export function useAdminListWallets<
  TData = Awaited<ReturnType<typeof adminListWallets>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof adminListWallets>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getAdminListWalletsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Create a deposit wallet (admin)
 */
export const getCreateWalletUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/wallets`;
};

export const createWallet = async (
  createWalletBody: CreateWalletBody,
  options?: RequestInit,
): Promise<DepositWallet> => {
  return customFetch<DepositWallet>(getCreateWalletUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createWalletBody),
  });
};

export const getCreateWalletMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createWallet>>,
    TError,
    { data: BodyType<CreateWalletBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createWallet>>,
  TError,
  { data: BodyType<CreateWalletBody> },
  TContext
> => {
  const mutationKey = ["createWallet"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createWallet>>,
    { data: BodyType<CreateWalletBody> }
  > = (props) => {
    const { data } = props ?? {};

    return createWallet(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateWalletMutationResult = NonNullable<
  Awaited<ReturnType<typeof createWallet>>
>;
export type CreateWalletMutationBody = BodyType<CreateWalletBody>;
export type CreateWalletMutationError = ErrorType<unknown>;

/**
 * @summary Create a deposit wallet (admin)
 */
export const useCreateWallet = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createWallet>>,
    TError,
    { data: BodyType<CreateWalletBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof createWallet>>,
  TError,
  { data: BodyType<CreateWalletBody> },
  TContext
> => {
  return useMutation(getCreateWalletMutationOptions(options));
};

/**
 * @summary Update a deposit wallet (admin)
 */
export const getUpdateWalletUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/wallets/${id}`;
};

export const updateWallet = async (
  id: number,
  updateWalletBody: UpdateWalletBody,
  options?: RequestInit,
): Promise<DepositWallet> => {
  return customFetch<DepositWallet>(getUpdateWalletUrl(id), {
    ...options,
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(updateWalletBody),
  });
};

export const getUpdateWalletMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateWallet>>,
    TError,
    { id: number; data: BodyType<UpdateWalletBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateWallet>>,
  TError,
  { id: number; data: BodyType<UpdateWalletBody> },
  TContext
> => {
  const mutationKey = ["updateWallet"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateWallet>>,
    { id: number; data: BodyType<UpdateWalletBody> }
  > = (props) => {
    const { id, data } = props ?? {};

    return updateWallet(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateWalletMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateWallet>>
>;
export type UpdateWalletMutationBody = BodyType<UpdateWalletBody>;
export type UpdateWalletMutationError = ErrorType<unknown>;

/**
 * @summary Update a deposit wallet (admin)
 */
export const useUpdateWallet = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateWallet>>,
    TError,
    { id: number; data: BodyType<UpdateWalletBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof updateWallet>>,
  TError,
  { id: number; data: BodyType<UpdateWalletBody> },
  TContext
> => {
  return useMutation(getUpdateWalletMutationOptions(options));
};

/**
 * @summary Delete a deposit wallet (admin)
 */
export const getDeleteWalletUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/admin/wallets/${id}`;
};

export const deleteWallet = async (
  id: number,
  options?: RequestInit,
): Promise<void> => {
  return customFetch<void>(getDeleteWalletUrl(id), {
    ...options,
    method: "DELETE",
  });
};

export const getDeleteWalletMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteWallet>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteWallet>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = ["deleteWallet"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteWallet>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteWallet(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteWalletMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteWallet>>
>;

export type DeleteWalletMutationError = ErrorType<unknown>;

/**
 * @summary Delete a deposit wallet (admin)
 */
export const useDeleteWallet = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteWallet>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteWallet>>,
  TError,
  { id: number },
  TContext
> => {
  return useMutation(getDeleteWalletMutationOptions(options));
};

/**
 * @summary Get site settings (admin)
 */
export const getGetSettingsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/settings`;
};

export const getSettings = async (
  options?: RequestInit,
): Promise<SiteSettings> => {
  return customFetch<SiteSettings>(getGetSettingsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetSettingsQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/admin/settings`] as const;
};

export const getGetSettingsQueryOptions = <
  TData = Awaited<ReturnType<typeof getSettings>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getSettings>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSettingsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSettings>>> = ({
    signal,
  }) => getSettings({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getSettings>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetSettingsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSettings>>
>;
export type GetSettingsQueryError = ErrorType<unknown>;

/**
 * @summary Get site settings (admin)
 */

export function useGetSettings<
  TData = Awaited<ReturnType<typeof getSettings>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getSettings>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetSettingsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Update site settings (admin)
 */
export const getUpdateSettingsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/settings`;
};

export const updateSettings = async (
  updateSettingsBody: UpdateSettingsBody,
  options?: RequestInit,
): Promise<SiteSettings> => {
  return customFetch<SiteSettings>(getUpdateSettingsUrl(), {
    ...options,
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(updateSettingsBody),
  });
};

export const getUpdateSettingsMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateSettings>>,
    TError,
    { data: BodyType<UpdateSettingsBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateSettings>>,
  TError,
  { data: BodyType<UpdateSettingsBody> },
  TContext
> => {
  const mutationKey = ["updateSettings"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateSettings>>,
    { data: BodyType<UpdateSettingsBody> }
  > = (props) => {
    const { data } = props ?? {};

    return updateSettings(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateSettingsMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateSettings>>
>;
export type UpdateSettingsMutationBody = BodyType<UpdateSettingsBody>;
export type UpdateSettingsMutationError = ErrorType<unknown>;

/**
 * @summary Update site settings (admin)
 */
export const useUpdateSettings = <
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateSettings>>,
    TError,
    { data: BodyType<UpdateSettingsBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof updateSettings>>,
  TError,
  { data: BodyType<UpdateSettingsBody> },
  TContext
> => {
  return useMutation(getUpdateSettingsMutationOptions(options));
};

/**
 * @summary Get public site settings
 */
export const getGetPublicSettingsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/settings`;
};

export const getPublicSettings = async (
  options?: RequestInit,
): Promise<PublicSettings> => {
  return customFetch<PublicSettings>(getGetPublicSettingsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetPublicSettingsQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/settings`] as const;
};

export const getGetPublicSettingsQueryOptions = <
  TData = Awaited<ReturnType<typeof getPublicSettings>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getPublicSettings>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetPublicSettingsQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getPublicSettings>>
  > = ({ signal }) => getPublicSettings({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getPublicSettings>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetPublicSettingsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getPublicSettings>>
>;
export type GetPublicSettingsQueryError = ErrorType<unknown>;

/**
 * @summary Get public site settings
 */

export function useGetPublicSettings<
  TData = Awaited<ReturnType<typeof getPublicSettings>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getPublicSettings>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetPublicSettingsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get admin dashboard summary
 */ 
export const getGetAdminDashboardUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/dashboard`;
};

export const getAdminDashboard = async (
  options?: RequestInit,
): Promise<AdminDashboard> => {
  return customFetch<AdminDashboard>(getGetAdminDashboardUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetAdminDashboardQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/admin/dashboard`] as const;
};

export const getGetAdminDashboardQueryOptions = <
  TData = Awaited<ReturnType<typeof getAdminDashboard>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getAdminDashboard>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAdminDashboardQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getAdminDashboard>>
  > = ({ signal }) => getAdminDashboard({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getAdminDashboard>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetAdminDashboardQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAdminDashboard>>
>;
export type GetAdminDashboardQueryError = ErrorType<unknown>;

/**
 * @summary Get admin dashboard summary
 */

export function useGetAdminDashboard<
  TData = Awaited<ReturnType<typeof getAdminDashboard>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getAdminDashboard>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetAdminDashboardQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Get user dashboard summary
 */
export const getGetUserDashboardUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/dashboard`;
};

export const getUserDashboard = async (
  options?: RequestInit,
): Promise<UserDashboard> => {
  return customFetch<UserDashboard>(getGetUserDashboardUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetUserDashboardQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/dashboard`] as const;
};

export const getGetUserDashboardQueryOptions = <
  TData = Awaited<ReturnType<typeof getUserDashboard>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getUserDashboard>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUserDashboardQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getUserDashboard>>
  > = ({ signal }) => getUserDashboard({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUserDashboard>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUserDashboardQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUserDashboard>>
>;
export type GetUserDashboardQueryError = ErrorType<unknown>;

/**
 * @summary Get user dashboard summary
 */

export function useGetUserDashboard<
  TData = Awaited<ReturnType<typeof getUserDashboard>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getUserDashboard>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUserDashboardQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List wallet connections (admin)
 */
export const getAdminListWalletConnectionsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/admin/wallet-connections`;
};

export const adminListWalletConnections = async (
  options?: RequestInit,
): Promise<WalletConnection[]> => {
  return customFetch<WalletConnection[]>(getAdminListWalletConnectionsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getAdminListWalletConnectionsQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/admin/wallet-connections`] as const;
};

export const getAdminListWalletConnectionsQueryOptions = <
  TData = Awaited<ReturnType<typeof adminListWalletConnections>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof adminListWalletConnections>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getAdminListWalletConnectionsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof adminListWalletConnections>>> = ({
    signal,
  }) => adminListWalletConnections({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof adminListWalletConnections>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type AdminListWalletConnectionsQueryResult = NonNullable<
  Awaited<ReturnType<typeof adminListWalletConnections>>
>;
export type AdminListWalletConnectionsQueryError = ErrorType<unknown>;

/**
 * @summary List wallet connections (admin)
 */
export function useAdminListWalletConnections<
  TData = Awaited<ReturnType<typeof adminListWalletConnections>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof adminListWalletConnections>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getAdminListWalletConnectionsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary List user wallet connections
 */
export const getListWalletConnectionsUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/wallet-connections`;
};

export const listWalletConnections = async (
  options?: RequestInit,
): Promise<WalletConnection[]> => {
  return customFetch<WalletConnection[]>(getListWalletConnectionsUrl(), {
    ...options,
    method: "GET",
  });
};

export const getListWalletConnectionsQueryKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/wallet-connections`] as const;
};

export const getListWalletConnectionsQueryOptions = <
  TData = Awaited<ReturnType<typeof listWalletConnections>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listWalletConnections>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListWalletConnectionsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listWalletConnections>>> = ({
    signal,
  }) => listWalletConnections({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listWalletConnections>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ListWalletConnectionsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listWalletConnections>>
>;
export type ListWalletConnectionsQueryError = ErrorType<unknown>;

/**
 * @summary List user wallet connections
 */
export function useListWalletConnections<
  TData = Awaited<ReturnType<typeof listWalletConnections>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof listWalletConnections>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListWalletConnectionsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * @summary Connect a wallet
 */
export const getConnectWalletUrl = () => {
  return `${import.meta.env.VITE_API_URL}/api/wallet-connections`;
};

export const connectWallet = async (
  connectWalletBody: BodyType<ConnectWalletBody>,
  options?: RequestInit,
): Promise<WalletConnection> => {
  return customFetch<WalletConnection>(getConnectWalletUrl(), {
    ...options,
    method: "POST",
    body: JSON.stringify(connectWalletBody),
  });
};

export const getConnectWalletMutationKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/wallet-connections`] as const;
};

export const getConnectWalletMutationOptions = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof connectWallet>>,
    TError,
    { data: BodyType<ConnectWalletBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof connectWallet>>,
  TError,
  { data: BodyType<ConnectWalletBody> },
  TContext
> => {
  const mutationKey = getConnectWalletMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...mutationKey, ...options.mutation } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof connectWallet>>,
    { data: BodyType<ConnectWalletBody> }
  > = (props) => {
    const { data } = props ?? {};

    return connectWallet(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type ConnectWalletMutationResult = NonNullable<
  Awaited<ReturnType<typeof connectWallet>>
>;
export type ConnectWalletMutationBody = BodyType<ConnectWalletBody>;
export type ConnectWalletMutationError = ErrorType<ErrorResponse>;

/**
 * @summary Connect a wallet
 */
export const useConnectWallet = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof connectWallet>>,
    TError,
    { data: BodyType<ConnectWalletBody> },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof connectWallet>>,
  TError,
  { data: BodyType<ConnectWalletBody> },
  TContext
> => {
  const mutationOptions = getConnectWalletMutationOptions(options);

  return useMutation(mutationOptions);
};

/**
 * @summary Disconnect a wallet
 */
export const getDisconnectWalletUrl = (id: number) => {
  return `${import.meta.env.VITE_API_URL}/api/wallet-connections/${id}`;
};

export const disconnectWallet = async (
  id: number,
  options?: RequestInit,
): Promise<MessageResponse> => {
  return customFetch<MessageResponse>(getDisconnectWalletUrl(id), {
    ...options,
    method: "DELETE",
  });
};

export const getDisconnectWalletMutationKey = () => {
  return [`${import.meta.env.VITE_API_URL}/api/wallet-connections`] as const;
};

export const getDisconnectWalletMutationOptions = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof disconnectWallet>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof disconnectWallet>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationKey = getDisconnectWalletMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...mutationKey, ...options.mutation } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof disconnectWallet>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return disconnectWallet(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DisconnectWalletMutationResult = NonNullable<
  Awaited<ReturnType<typeof disconnectWallet>>
>;
export type DisconnectWalletMutationError = ErrorType<ErrorResponse>;

/**
 * @summary Disconnect a wallet
 */
export const useDisconnectWallet = <
  TError = ErrorType<ErrorResponse>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof disconnectWallet>>,
    TError,
    { id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof disconnectWallet>>,
  TError,
  { id: number },
  TContext
> => {
  const mutationOptions = getDisconnectWalletMutationOptions(options);

  return useMutation(mutationOptions);
};
