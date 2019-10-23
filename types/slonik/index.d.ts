// Type definitions for slonik 19.0
// Project: https://github.com/gajus/slonik#readme
// Definitions by: Sebastian Sebald <https://github.com/sebald>
//                 Misha Kaletsky <https://github.com/mmkal>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.1

/// <reference types="node" />

import { Readable } from 'stream';
import * as SlonikSymbol from './symbols';

//
// HELPER
// ----------------------------------------------------------------------
// This is `roarr` (https://github.com/gajus/roarr) in flow
export type LoggerType = (...args: string[]) => never;
export type MaybePromiseType<T> = T | Promise<T>;

export type StreamHandlerType = (stream: Readable) => void;

export type ComparisonOperatorType = '<' | '>' | '<=' | '>=' | '=' | '<>' | '!=';
export type LogicalBooleanOperatorType = 'AND' | 'OR';

//
// EXPRESSIONS AND TOKENS
// ----------------------------------------------------------------------

export type TypeNameIdentifierType =
  'bool' |
  'bytea' |
  'float4' |
  'float8' |
  'int2' |
  'int4' |
  'json' |
  'text' |
  'timestamptz';

export type SerializableValueType =
    | string
    | number
    | boolean
    | null
    | object
    | SerializableValueObject
    | SerializableValueArray;

export interface SerializableValueObject {
  [x: string]: SerializableValueType;
}

export interface SerializableValueArray
  extends ReadonlyArray<SerializableValueType> {}

export type PositionalParameterValuesType = ReadonlyArray<ValueExpressionType>;

export type NamedParameterValuesType = Record<string, ValueExpressionType>;

export interface ArraySqlTokenType {
    memberType: TypeNameIdentifierType | SqlTokenType;
    type: typeof SlonikSymbol.ArrayTokenSymbol;
    values: PositionalParameterValuesType;
}

export interface BinarySqlTokenType {
    data: Buffer;
    type: typeof SlonikSymbol.BinaryTokenSymbol;
}

export interface IdentifierSqlTokenType {
    names: ReadonlyArray<string>;
    type: typeof SlonikSymbol.IdentifierTokenSymbol;
}

export interface ListSqlTokenType {
    glue: SqlTokenType;
    members: ReadonlyArray<SqlTokenType>;
    type: typeof SlonikSymbol.ListTokenSymbol;
}

export interface JsonSqlTokenType {
    value: SerializableValueType;
    type: typeof SlonikSymbol.JsonTokenSymbol;
}

export type SqlSqlTokenType<T> = TaggedTemplateLiteralInvocationType<T>;

export interface UnnestSqlTokenType {
    columnTypes: ReadonlyArray<string>;
    tuples: ReadonlyArray<PositionalParameterValuesType>;
    type: typeof SlonikSymbol.UnnestTokenSymbol;
}

export type PrimitiveValueExpressionType = string | number | boolean | null | PrimitiveValueExpressionTypeArray;

export interface PrimitiveValueExpressionTypeArray extends Array<PrimitiveValueExpressionType> {}

export type SqlTokenType =
    ArraySqlTokenType |
    BinarySqlTokenType |
    IdentifierSqlTokenType |
    JsonSqlTokenType |
    ListSqlTokenType |
    SqlSqlTokenType<any> |
    UnnestSqlTokenType;

export type ValueExpressionType =
    SqlTokenType |
    PrimitiveValueExpressionType;

export type NamedAssignmentType = Record<string, ValueExpressionType>;

//
// DATABASE
// ----------------------------------------------------------------------
export interface FieldType {
    columnID: number;
    dataTypeID: number;
    dataTypeModifier: number;
    dataTypeSize: number;
    format: string;
    name: string;
    tableID: number;
}

export type DatabaseTransactionConnectionType = CommonQueryMethodsType & {
    transaction: <T>(handler: TransactionFunctionType<T>) => Promise<T>;
};

export type DatabasePoolConnectionType = CommonQueryMethodsType & {
    stream: (sql: TaggedTemplateLiteralInvocationType, streamHandler: StreamHandlerType) => Promise<null>,
    transaction: <T>(handler: TransactionFunctionType<T>) => Promise<T>;
};

export type ConnectionRoutineType<T> = (connection: DatabasePoolConnectionType) => Promise<T>;

export type DatabasePoolType = CommonQueryMethodsType & {
    connect: <T>(connectionRoutine: ConnectionRoutineType<T>) => Promise<T>;
    stream: (sql: TaggedTemplateLiteralInvocationType, streamHandler: StreamHandlerType) => Promise<null>,
    transaction: <T>(handler: TransactionFunctionType<T>) => Promise<T>;
};

export type DatabaseConfigurationType =
    | string
    | {
        database?: string;
        host?: string;
        idleTimeoutMillis?: number;
        max?: number;
        password?: string;
        port?: number;
        user?: string;
    };

export type ConnectionTypeType =
    | 'EXPLICIT'
    | 'IMPLICIT_QUERY'
    | 'IMPLICIT_TRANSACTION';

export interface ConnectionContextType {
    /**
     * Unique connection ID
     */
    connectionId: string;
    connectionType: ConnectionTypeType;
    /**
     * Instance of Roarr logger with bound connection context parameters
     */
    log: LoggerType;
    /**
     * Unique connection pool ID
     */
    poolId: string;
}

export type DatabaseConnectionType = DatabasePoolConnectionType & DatabasePoolType;

//
// QUERY
// ----------------------------------------------------------------------
export type QueryIdType = string;

export interface QueryType {
    sql: string;
    values?: ReadonlyArray<PrimitiveValueExpressionType>;
}

export type QueryMethodType<RowType, Result> = (
    sql: TaggedTemplateLiteralInvocationType<RowType>,
    values?: PrimitiveValueExpressionType[]
) => Promise<Result>;
export type QueryMethodParams<T> = Parameters<QueryMethodType<T, never>>;

export interface NoticeType {
    code: string;
    length: number;
    message: string;
    name: string;
    severity: string;
    where: string;
}

export interface QueryResultType<T> {
    command: 'DELETE' | 'INSERT' | 'SELECT' | 'UPDATE';
    fields: ReadonlyArray<FieldType>;
    notices: ReadonlyArray<NoticeType>;
    oid: number | null;
    rowAsArray: boolean;
    rowCount: number;
    rows: ReadonlyArray<T>;
}

export type QueryResultRowColumnType = string | number;
export type QueryResultRowType<ColumnName extends string = string> = {
    [name in ColumnName]: QueryResultRowColumnType;
};

export type QueryAnyFirstFunctionType = <T>(...args: QueryMethodParams<T>) => Promise<Array<T[keyof T]>>;
export type QueryAnyFunctionType = <T>(...args: QueryMethodParams<T>) => Promise<T[]>;
export type QueryFunctionType = <T>(...args: QueryMethodParams<T>) => Promise<QueryResultType<T>>;
export type QueryManyFirstFunctionType = QueryAnyFirstFunctionType;
export type QueryManyFunctionType = QueryAnyFunctionType;
export type QueryMaybeOneFirstFunctionType = <T>(...args: QueryMethodParams<T>) => Promise<T[keyof T] | null>;
export type QueryMaybeOneFunctionType = <T>(...args: QueryMethodParams<T>) => Promise<T | null>;
export type QueryOneFirstFunctionType = <T>(...args: QueryMethodParams<T>) => Promise<T[keyof T]>;
export type QueryOneFunctionType = <T>(...args: QueryMethodParams<T>) => Promise<T>;

export interface CommonQueryMethodsType {
    any: QueryAnyFunctionType;
    anyFirst: QueryAnyFirstFunctionType;
    many: QueryManyFunctionType;
    manyFirst: QueryManyFirstFunctionType;
    maybeOne: QueryMaybeOneFunctionType;
    maybeOneFirst: QueryMaybeOneFirstFunctionType;
    one: QueryOneFunctionType;
    oneFirst: QueryOneFirstFunctionType;
    query: QueryFunctionType;
}

export interface CallSiteType {
    columnNumber: number;
    fileName: string | null;
    lineNumber: number;
}

export interface QueryContextType {
    /**
     * Unique connection ID
     */
    connectionId: string;
    /**
     * Instance of Roarr logger with bound query context parameters
     */
    log: LoggerType;
    /**
     * A copy of the query before `transformQuery` middleware
     */
    originalQuery: QueryType;
    /**
     * Unique connection pool ID
     */
    poolId: string;
    /**
     * Unique query ID
     */
    queryId: QueryIdType;
    stackTrace: CallSiteType[] | null;
    /**
     * `process.hrtime.bigint()` for when query was received.
     */
    queryInputTime: number;
    /**
     * Unique transaction ID
     */
    transactionId?: string;
}

//
// SQL (TAGGED TEMPLATE)
// ----------------------------------------------------------------------
export interface TaggedTemplateLiteralInvocationType<Result = QueryResultRowType> {
    sql: string;
    type: typeof SlonikSymbol.SqlTokenSymbol;
    values: ValueExpressionType[];
}

export const sql: SqlTaggedTemplateType;

export type IdentifierNormalizerType = (identifierName: string) => string;

export interface SqlTagConfigurationType {
    normalizeIdentifier?: IdentifierNormalizerType;
}

export function createSqlTag(configuration?: SqlTagConfigurationType): SqlTaggedTemplateType;

export interface SqlTaggedTemplateType {
    // tslint:disable-next-line no-unnecessary-generics (the sql<Foo>`select foo` is cleaner in this case than casting with 'as')
    <T = QueryResultRowType>(template: TemplateStringsArray, ...vals: ValueExpressionType[]): SqlSqlTokenType<T>;
    array: (
        values: PrimitiveValueExpressionType[],
        memberType: string
    ) => ArraySqlTokenType;
    identifier: (
        names: string[]
    ) => IdentifierSqlTokenType;
    json: (
        value: SerializableValueType
    ) => JsonSqlTokenType;
    join: (
      members: ReadonlyArray<ValueExpressionType>,
      glue: SqlTokenType,
    ) => ListSqlTokenType;
    raw: (
        rawSql: string,
        values?: ReadonlyArray<PrimitiveValueExpressionType>
    ) => SqlTokenType;
    unnest: (
        // Value might be ReadonlyArray<ReadonlyArray<PrimitiveValueExpressionType>>,
        // or it can be infinitely nested array, e.g.
        // https://github.com/gajus/slonik/issues/44
        tuples: ReadonlyArray<ReadonlyArray<any>>,
        columnTypes: ReadonlyArray<string>
    ) => UnnestSqlTokenType;
}

export interface SqlFragmentType {
    parameters: PrimitiveValueExpressionType[];
    sql: string;
}

//
// POOL
// ----------------------------------------------------------------------
export interface PoolContextType {
    /**
     * Instance of Roarr logger with bound connection context parameters
     */
    log: LoggerType;
    /**
     * Unique connection pool ID
     */
    poolId: string;
    /**
     * The query that is initiating the connection
     */
    query: TaggedTemplateLiteralInvocationType | null;
}

export function createPool(
    connectionConfiguration: DatabaseConfigurationType,
    clientUserConfiguration?: ClientUserConfigurationType
): DatabasePoolType;

//
// TRANSACTION
// ----------------------------------------------------------------------
export type TransactionFunctionType<T> = (
    connection: DatabaseTransactionConnectionType
) => Promise<T>;

//
// INTERCEPTOR
// ----------------------------------------------------------------------
export interface InterceptorType {
    afterPoolConnection?: (
        connectionContext: ConnectionContextType,
        connection: DatabasePoolConnectionType
    ) => MaybePromiseType<void>;
    afterQueryExecution?: (
        queryContext: QueryContextType,
        query: QueryType,
        result: QueryResultType<QueryResultRowType>
    ) => MaybePromiseType<QueryResultType<QueryResultRowType>>;
    beforePoolConnection?: (
        connectionContext: PoolContextType
    ) => MaybePromiseType<DatabasePoolType | null | undefined>;
    beforePoolConnectionRelease?: (
        connectionContext: ConnectionContextType,
        connection: DatabasePoolConnectionType
    ) => MaybePromiseType<void>;
    beforeQueryExecution?: (
        queryContext: QueryContextType,
        query: QueryType
    ) => MaybePromiseType<QueryResultType<QueryResultRowType> | undefined>;
    queryExecutionError?: (
        queryContext: QueryContextType,
        query: QueryType,
        error: SlonikError
    ) => MaybePromiseType<void>;
    transformQuery?: (
        queryContext: QueryContextType,
        query: QueryType
    ) => QueryType;
    transformRow?: (
        queryContext: QueryContextType,
        query: QueryType,
        row: QueryResultRowType,
        fields: FieldType[]
    ) => QueryResultRowType;
}

/**
 * Default interceptors:
 * - [Field name transformation interceptor](https://github.com/gajus/slonik#field-name-transformation-interceptor)
 * - [Query normalization interceptor](https://github.com/gajus/slonik#query-normalization-interceptor)
 *
 * See official [readme](https://github.com/gajus/slonik#default-interceptors) for more information.
 */
export function createInterceptorPreset(): InterceptorType[];

export function createFieldNameTransformationInterceptor(configuration: {
    format: string,
    test?: (field: FieldType) => boolean
}): InterceptorType;
export function createQueryNormalizationInterceptor(configuration?: {
    stripComments?: boolean;
}): InterceptorType;
export function createBenchmarkingInterceptor(): InterceptorType;

//
// TYPE PARSER
// ----------------------------------------------------------------------
export interface TypeParserType<T = unknown> {
    /**
     * Value of "pg_type"."typname" (e.g. "int8", "timestamp", "timestamptz")
     */
    name: string;
    parse: (value: string) => T;
}

export function createBigintTypeParser(): TypeParserType<number>;
export function createTimestampTypeParser(): TypeParserType<number | null>;
export function createTimestampWithTimeZoneTypeParser(): TypeParserType<number | null>;

/**
 * Default type parsers.
 *
 * These interceptors are enabled by default:
 * - `int8`: Produces an integer.
 * - `timestamp`: Produces a unix timestamp (in milliseconds).
 * - `timestamptz`: Produces a unix timestamp (in milliseconds).
 */
export function createTypeParserPreset(): TypeParserType[];

//
// CLIENT
// ----------------------------------------------------------------------
export interface ClientConfigurationType {
    /** Dictates whether to capture stack trace before executing query. Middlewares access stack trace through query execution context. (Default: true) */
    captureStackTrace?: boolean;

    /** Timeout (in milliseconds) after which an error is raised if cannot cannot be established. (Default: 5000) */
    connectionTimeout?: number;

    /** Timeout (in milliseconds) after which idle clients are closed. (Default: 5000) */
    idleTimeout?: number;

    /** Do not allow more than this many connections. (Default: 10) */
    maximumPoolSize?: number;

    /** Add more server connections to pool if below this number. (Default: 1) */
    minimumPoolSize?: number;

    /**
     * An array of [Slonik interceptors](https://github.com/gajus/slonik#slonik-interceptors)
     */
    interceptors?: InterceptorType[];
    /**
     * An array of [Slonik type parsers](https://github.com/gajus/slonik#slonik-type-parsers)
     */
    typeParsers?: TypeParserType[];
}

// tslint:disable-next-line no-empty-interface
export interface ClientUserConfigurationType extends ClientConfigurationType {}

//
// ERRORS
// ----------------------------------------------------------------------
export class SlonikError extends Error {}
export class InvalidInputError extends SlonikError {}
export class UnexpectedStateError extends SlonikError {}
export class ConnectionError extends SlonikError {}
export class QueryCancelledError extends SlonikError {
  originalError: Error;
  constructor(error: Error);
}
export class BackendTerminatedError extends SlonikError {
  originalError: Error;
  constructor(error: Error)
}
export class NotFoundError extends SlonikError {}
export class DataIntegrityError extends SlonikError {}
export class IntegrityConstraintViolationError extends SlonikError {
  constraint: string;
  originalError: Error;
  constructor(error: Error, constraint: string);
}
export class NotNullIntegrityConstraintViolationError extends IntegrityConstraintViolationError {}
export class ForeignKeyIntegrityConstraintViolationError extends IntegrityConstraintViolationError {}
export class UniqueIntegrityConstraintViolationError extends IntegrityConstraintViolationError {}
export class CheckIntegrityConstraintViolationError extends IntegrityConstraintViolationError {}