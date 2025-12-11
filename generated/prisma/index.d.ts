
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model RoleRequirement
 * 
 */
export type RoleRequirement = $Result.DefaultSelection<Prisma.$RoleRequirementPayload>
/**
 * Model Freelancer
 * 
 */
export type Freelancer = $Result.DefaultSelection<Prisma.$FreelancerPayload>
/**
 * Model Assignment
 * 
 */
export type Assignment = $Result.DefaultSelection<Prisma.$AssignmentPayload>
/**
 * Model MoodboardItem
 * 
 */
export type MoodboardItem = $Result.DefaultSelection<Prisma.$MoodboardItemPayload>
/**
 * Model MoodboardCollection
 * 
 */
export type MoodboardCollection = $Result.DefaultSelection<Prisma.$MoodboardCollectionPayload>
/**
 * Model MoodboardCollectionItem
 * 
 */
export type MoodboardCollectionItem = $Result.DefaultSelection<Prisma.$MoodboardCollectionItemPayload>
/**
 * Model Script
 * 
 */
export type Script = $Result.DefaultSelection<Prisma.$ScriptPayload>
/**
 * Model KnowledgeSource
 * 
 */
export type KnowledgeSource = $Result.DefaultSelection<Prisma.$KnowledgeSourcePayload>
/**
 * Model Transcript
 * 
 */
export type Transcript = $Result.DefaultSelection<Prisma.$TranscriptPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ProjectStatus: {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DELIVERED: 'DELIVERED',
  ARCHIVED: 'ARCHIVED'
};

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]


export const FreelancerStatus: {
  AVAILABLE: 'AVAILABLE',
  BUSY: 'BUSY',
  UNAVAILABLE: 'UNAVAILABLE'
};

export type FreelancerStatus = (typeof FreelancerStatus)[keyof typeof FreelancerStatus]


export const AssignmentStatus: {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ON_HOLD: 'ON_HOLD'
};

export type AssignmentStatus = (typeof AssignmentStatus)[keyof typeof AssignmentStatus]


export const TranscriptStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type TranscriptStatus = (typeof TranscriptStatus)[keyof typeof TranscriptStatus]

}

export type ProjectStatus = $Enums.ProjectStatus

export const ProjectStatus: typeof $Enums.ProjectStatus

export type FreelancerStatus = $Enums.FreelancerStatus

export const FreelancerStatus: typeof $Enums.FreelancerStatus

export type AssignmentStatus = $Enums.AssignmentStatus

export const AssignmentStatus: typeof $Enums.AssignmentStatus

export type TranscriptStatus = $Enums.TranscriptStatus

export const TranscriptStatus: typeof $Enums.TranscriptStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roleRequirement`: Exposes CRUD operations for the **RoleRequirement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoleRequirements
    * const roleRequirements = await prisma.roleRequirement.findMany()
    * ```
    */
  get roleRequirement(): Prisma.RoleRequirementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.freelancer`: Exposes CRUD operations for the **Freelancer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Freelancers
    * const freelancers = await prisma.freelancer.findMany()
    * ```
    */
  get freelancer(): Prisma.FreelancerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assignment`: Exposes CRUD operations for the **Assignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Assignments
    * const assignments = await prisma.assignment.findMany()
    * ```
    */
  get assignment(): Prisma.AssignmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.moodboardItem`: Exposes CRUD operations for the **MoodboardItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MoodboardItems
    * const moodboardItems = await prisma.moodboardItem.findMany()
    * ```
    */
  get moodboardItem(): Prisma.MoodboardItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.moodboardCollection`: Exposes CRUD operations for the **MoodboardCollection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MoodboardCollections
    * const moodboardCollections = await prisma.moodboardCollection.findMany()
    * ```
    */
  get moodboardCollection(): Prisma.MoodboardCollectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.moodboardCollectionItem`: Exposes CRUD operations for the **MoodboardCollectionItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MoodboardCollectionItems
    * const moodboardCollectionItems = await prisma.moodboardCollectionItem.findMany()
    * ```
    */
  get moodboardCollectionItem(): Prisma.MoodboardCollectionItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.script`: Exposes CRUD operations for the **Script** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Scripts
    * const scripts = await prisma.script.findMany()
    * ```
    */
  get script(): Prisma.ScriptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.knowledgeSource`: Exposes CRUD operations for the **KnowledgeSource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KnowledgeSources
    * const knowledgeSources = await prisma.knowledgeSource.findMany()
    * ```
    */
  get knowledgeSource(): Prisma.KnowledgeSourceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transcript`: Exposes CRUD operations for the **Transcript** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transcripts
    * const transcripts = await prisma.transcript.findMany()
    * ```
    */
  get transcript(): Prisma.TranscriptDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.1.0
   * Query Engine version: ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Project: 'Project',
    RoleRequirement: 'RoleRequirement',
    Freelancer: 'Freelancer',
    Assignment: 'Assignment',
    MoodboardItem: 'MoodboardItem',
    MoodboardCollection: 'MoodboardCollection',
    MoodboardCollectionItem: 'MoodboardCollectionItem',
    Script: 'Script',
    KnowledgeSource: 'KnowledgeSource',
    Transcript: 'Transcript'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "project" | "roleRequirement" | "freelancer" | "assignment" | "moodboardItem" | "moodboardCollection" | "moodboardCollectionItem" | "script" | "knowledgeSource" | "transcript"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      RoleRequirement: {
        payload: Prisma.$RoleRequirementPayload<ExtArgs>
        fields: Prisma.RoleRequirementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleRequirementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleRequirementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload>
          }
          findFirst: {
            args: Prisma.RoleRequirementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleRequirementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload>
          }
          findMany: {
            args: Prisma.RoleRequirementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload>[]
          }
          create: {
            args: Prisma.RoleRequirementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload>
          }
          createMany: {
            args: Prisma.RoleRequirementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleRequirementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload>[]
          }
          delete: {
            args: Prisma.RoleRequirementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload>
          }
          update: {
            args: Prisma.RoleRequirementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload>
          }
          deleteMany: {
            args: Prisma.RoleRequirementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleRequirementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleRequirementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload>[]
          }
          upsert: {
            args: Prisma.RoleRequirementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleRequirementPayload>
          }
          aggregate: {
            args: Prisma.RoleRequirementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoleRequirement>
          }
          groupBy: {
            args: Prisma.RoleRequirementGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleRequirementGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleRequirementCountArgs<ExtArgs>
            result: $Utils.Optional<RoleRequirementCountAggregateOutputType> | number
          }
        }
      }
      Freelancer: {
        payload: Prisma.$FreelancerPayload<ExtArgs>
        fields: Prisma.FreelancerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FreelancerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FreelancerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload>
          }
          findFirst: {
            args: Prisma.FreelancerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FreelancerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload>
          }
          findMany: {
            args: Prisma.FreelancerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload>[]
          }
          create: {
            args: Prisma.FreelancerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload>
          }
          createMany: {
            args: Prisma.FreelancerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FreelancerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload>[]
          }
          delete: {
            args: Prisma.FreelancerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload>
          }
          update: {
            args: Prisma.FreelancerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload>
          }
          deleteMany: {
            args: Prisma.FreelancerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FreelancerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FreelancerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload>[]
          }
          upsert: {
            args: Prisma.FreelancerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FreelancerPayload>
          }
          aggregate: {
            args: Prisma.FreelancerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFreelancer>
          }
          groupBy: {
            args: Prisma.FreelancerGroupByArgs<ExtArgs>
            result: $Utils.Optional<FreelancerGroupByOutputType>[]
          }
          count: {
            args: Prisma.FreelancerCountArgs<ExtArgs>
            result: $Utils.Optional<FreelancerCountAggregateOutputType> | number
          }
        }
      }
      Assignment: {
        payload: Prisma.$AssignmentPayload<ExtArgs>
        fields: Prisma.AssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload>
          }
          findFirst: {
            args: Prisma.AssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload>
          }
          findMany: {
            args: Prisma.AssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload>[]
          }
          create: {
            args: Prisma.AssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload>
          }
          createMany: {
            args: Prisma.AssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload>[]
          }
          delete: {
            args: Prisma.AssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload>
          }
          update: {
            args: Prisma.AssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload>
          }
          deleteMany: {
            args: Prisma.AssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AssignmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload>[]
          }
          upsert: {
            args: Prisma.AssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssignmentPayload>
          }
          aggregate: {
            args: Prisma.AssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssignment>
          }
          groupBy: {
            args: Prisma.AssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<AssignmentCountAggregateOutputType> | number
          }
        }
      }
      MoodboardItem: {
        payload: Prisma.$MoodboardItemPayload<ExtArgs>
        fields: Prisma.MoodboardItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MoodboardItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MoodboardItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload>
          }
          findFirst: {
            args: Prisma.MoodboardItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MoodboardItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload>
          }
          findMany: {
            args: Prisma.MoodboardItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload>[]
          }
          create: {
            args: Prisma.MoodboardItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload>
          }
          createMany: {
            args: Prisma.MoodboardItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MoodboardItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload>[]
          }
          delete: {
            args: Prisma.MoodboardItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload>
          }
          update: {
            args: Prisma.MoodboardItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload>
          }
          deleteMany: {
            args: Prisma.MoodboardItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MoodboardItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MoodboardItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload>[]
          }
          upsert: {
            args: Prisma.MoodboardItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardItemPayload>
          }
          aggregate: {
            args: Prisma.MoodboardItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMoodboardItem>
          }
          groupBy: {
            args: Prisma.MoodboardItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<MoodboardItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.MoodboardItemCountArgs<ExtArgs>
            result: $Utils.Optional<MoodboardItemCountAggregateOutputType> | number
          }
        }
      }
      MoodboardCollection: {
        payload: Prisma.$MoodboardCollectionPayload<ExtArgs>
        fields: Prisma.MoodboardCollectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MoodboardCollectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MoodboardCollectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload>
          }
          findFirst: {
            args: Prisma.MoodboardCollectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MoodboardCollectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload>
          }
          findMany: {
            args: Prisma.MoodboardCollectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload>[]
          }
          create: {
            args: Prisma.MoodboardCollectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload>
          }
          createMany: {
            args: Prisma.MoodboardCollectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MoodboardCollectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload>[]
          }
          delete: {
            args: Prisma.MoodboardCollectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload>
          }
          update: {
            args: Prisma.MoodboardCollectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload>
          }
          deleteMany: {
            args: Prisma.MoodboardCollectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MoodboardCollectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MoodboardCollectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload>[]
          }
          upsert: {
            args: Prisma.MoodboardCollectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionPayload>
          }
          aggregate: {
            args: Prisma.MoodboardCollectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMoodboardCollection>
          }
          groupBy: {
            args: Prisma.MoodboardCollectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<MoodboardCollectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.MoodboardCollectionCountArgs<ExtArgs>
            result: $Utils.Optional<MoodboardCollectionCountAggregateOutputType> | number
          }
        }
      }
      MoodboardCollectionItem: {
        payload: Prisma.$MoodboardCollectionItemPayload<ExtArgs>
        fields: Prisma.MoodboardCollectionItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MoodboardCollectionItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MoodboardCollectionItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload>
          }
          findFirst: {
            args: Prisma.MoodboardCollectionItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MoodboardCollectionItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload>
          }
          findMany: {
            args: Prisma.MoodboardCollectionItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload>[]
          }
          create: {
            args: Prisma.MoodboardCollectionItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload>
          }
          createMany: {
            args: Prisma.MoodboardCollectionItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MoodboardCollectionItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload>[]
          }
          delete: {
            args: Prisma.MoodboardCollectionItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload>
          }
          update: {
            args: Prisma.MoodboardCollectionItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload>
          }
          deleteMany: {
            args: Prisma.MoodboardCollectionItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MoodboardCollectionItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MoodboardCollectionItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload>[]
          }
          upsert: {
            args: Prisma.MoodboardCollectionItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MoodboardCollectionItemPayload>
          }
          aggregate: {
            args: Prisma.MoodboardCollectionItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMoodboardCollectionItem>
          }
          groupBy: {
            args: Prisma.MoodboardCollectionItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<MoodboardCollectionItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.MoodboardCollectionItemCountArgs<ExtArgs>
            result: $Utils.Optional<MoodboardCollectionItemCountAggregateOutputType> | number
          }
        }
      }
      Script: {
        payload: Prisma.$ScriptPayload<ExtArgs>
        fields: Prisma.ScriptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScriptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScriptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload>
          }
          findFirst: {
            args: Prisma.ScriptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScriptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload>
          }
          findMany: {
            args: Prisma.ScriptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload>[]
          }
          create: {
            args: Prisma.ScriptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload>
          }
          createMany: {
            args: Prisma.ScriptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScriptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload>[]
          }
          delete: {
            args: Prisma.ScriptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload>
          }
          update: {
            args: Prisma.ScriptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload>
          }
          deleteMany: {
            args: Prisma.ScriptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScriptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScriptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload>[]
          }
          upsert: {
            args: Prisma.ScriptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScriptPayload>
          }
          aggregate: {
            args: Prisma.ScriptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScript>
          }
          groupBy: {
            args: Prisma.ScriptGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScriptGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScriptCountArgs<ExtArgs>
            result: $Utils.Optional<ScriptCountAggregateOutputType> | number
          }
        }
      }
      KnowledgeSource: {
        payload: Prisma.$KnowledgeSourcePayload<ExtArgs>
        fields: Prisma.KnowledgeSourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KnowledgeSourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KnowledgeSourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload>
          }
          findFirst: {
            args: Prisma.KnowledgeSourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KnowledgeSourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload>
          }
          findMany: {
            args: Prisma.KnowledgeSourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload>[]
          }
          create: {
            args: Prisma.KnowledgeSourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload>
          }
          createMany: {
            args: Prisma.KnowledgeSourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KnowledgeSourceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload>[]
          }
          delete: {
            args: Prisma.KnowledgeSourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload>
          }
          update: {
            args: Prisma.KnowledgeSourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload>
          }
          deleteMany: {
            args: Prisma.KnowledgeSourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KnowledgeSourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KnowledgeSourceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload>[]
          }
          upsert: {
            args: Prisma.KnowledgeSourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeSourcePayload>
          }
          aggregate: {
            args: Prisma.KnowledgeSourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKnowledgeSource>
          }
          groupBy: {
            args: Prisma.KnowledgeSourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeSourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.KnowledgeSourceCountArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeSourceCountAggregateOutputType> | number
          }
        }
      }
      Transcript: {
        payload: Prisma.$TranscriptPayload<ExtArgs>
        fields: Prisma.TranscriptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranscriptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranscriptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          findFirst: {
            args: Prisma.TranscriptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranscriptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          findMany: {
            args: Prisma.TranscriptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          create: {
            args: Prisma.TranscriptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          createMany: {
            args: Prisma.TranscriptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TranscriptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          delete: {
            args: Prisma.TranscriptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          update: {
            args: Prisma.TranscriptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          deleteMany: {
            args: Prisma.TranscriptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranscriptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TranscriptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          upsert: {
            args: Prisma.TranscriptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          aggregate: {
            args: Prisma.TranscriptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranscript>
          }
          groupBy: {
            args: Prisma.TranscriptGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranscriptGroupByOutputType>[]
          }
          count: {
            args: Prisma.TranscriptCountArgs<ExtArgs>
            result: $Utils.Optional<TranscriptCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    project?: ProjectOmit
    roleRequirement?: RoleRequirementOmit
    freelancer?: FreelancerOmit
    assignment?: AssignmentOmit
    moodboardItem?: MoodboardItemOmit
    moodboardCollection?: MoodboardCollectionOmit
    moodboardCollectionItem?: MoodboardCollectionItemOmit
    script?: ScriptOmit
    knowledgeSource?: KnowledgeSourceOmit
    transcript?: TranscriptOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    projects: number
    assignments: number
    scripts: number
    knowledgeSources: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | UserCountOutputTypeCountProjectsArgs
    assignments?: boolean | UserCountOutputTypeCountAssignmentsArgs
    scripts?: boolean | UserCountOutputTypeCountScriptsArgs
    knowledgeSources?: boolean | UserCountOutputTypeCountKnowledgeSourcesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssignmentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountScriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScriptWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountKnowledgeSourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KnowledgeSourceWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    roleRequirements: number
    assignments: number
    scripts: number
    moodboardItems: number
    knowledgeSources: number
    transcripts: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roleRequirements?: boolean | ProjectCountOutputTypeCountRoleRequirementsArgs
    assignments?: boolean | ProjectCountOutputTypeCountAssignmentsArgs
    scripts?: boolean | ProjectCountOutputTypeCountScriptsArgs
    moodboardItems?: boolean | ProjectCountOutputTypeCountMoodboardItemsArgs
    knowledgeSources?: boolean | ProjectCountOutputTypeCountKnowledgeSourcesArgs
    transcripts?: boolean | ProjectCountOutputTypeCountTranscriptsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountRoleRequirementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleRequirementWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssignmentWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountScriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScriptWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountMoodboardItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MoodboardItemWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountKnowledgeSourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KnowledgeSourceWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountTranscriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptWhereInput
  }


  /**
   * Count Type FreelancerCountOutputType
   */

  export type FreelancerCountOutputType = {
    assignments: number
  }

  export type FreelancerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignments?: boolean | FreelancerCountOutputTypeCountAssignmentsArgs
  }

  // Custom InputTypes
  /**
   * FreelancerCountOutputType without action
   */
  export type FreelancerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreelancerCountOutputType
     */
    select?: FreelancerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FreelancerCountOutputType without action
   */
  export type FreelancerCountOutputTypeCountAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssignmentWhereInput
  }


  /**
   * Count Type MoodboardItemCountOutputType
   */

  export type MoodboardItemCountOutputType = {
    collections: number
  }

  export type MoodboardItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collections?: boolean | MoodboardItemCountOutputTypeCountCollectionsArgs
  }

  // Custom InputTypes
  /**
   * MoodboardItemCountOutputType without action
   */
  export type MoodboardItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItemCountOutputType
     */
    select?: MoodboardItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MoodboardItemCountOutputType without action
   */
  export type MoodboardItemCountOutputTypeCountCollectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MoodboardCollectionItemWhereInput
  }


  /**
   * Count Type MoodboardCollectionCountOutputType
   */

  export type MoodboardCollectionCountOutputType = {
    items: number
  }

  export type MoodboardCollectionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | MoodboardCollectionCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * MoodboardCollectionCountOutputType without action
   */
  export type MoodboardCollectionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionCountOutputType
     */
    select?: MoodboardCollectionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MoodboardCollectionCountOutputType without action
   */
  export type MoodboardCollectionCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MoodboardCollectionItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatar: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatar: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    avatar: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatar?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatar?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatar?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    avatar: string | null
    role: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatar?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | User$projectsArgs<ExtArgs>
    assignments?: boolean | User$assignmentsArgs<ExtArgs>
    scripts?: boolean | User$scriptsArgs<ExtArgs>
    knowledgeSources?: boolean | User$knowledgeSourcesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatar?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatar?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    avatar?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "avatar" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | User$projectsArgs<ExtArgs>
    assignments?: boolean | User$assignmentsArgs<ExtArgs>
    scripts?: boolean | User$scriptsArgs<ExtArgs>
    knowledgeSources?: boolean | User$knowledgeSourcesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      assignments: Prisma.$AssignmentPayload<ExtArgs>[]
      scripts: Prisma.$ScriptPayload<ExtArgs>[]
      knowledgeSources: Prisma.$KnowledgeSourcePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      avatar: string | null
      role: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends User$projectsArgs<ExtArgs> = {}>(args?: Subset<T, User$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    assignments<T extends User$assignmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    scripts<T extends User$scriptsArgs<ExtArgs> = {}>(args?: Subset<T, User$scriptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    knowledgeSources<T extends User$knowledgeSourcesArgs<ExtArgs> = {}>(args?: Subset<T, User$knowledgeSourcesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.projects
   */
  export type User$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.assignments
   */
  export type User$assignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    where?: AssignmentWhereInput
    orderBy?: AssignmentOrderByWithRelationInput | AssignmentOrderByWithRelationInput[]
    cursor?: AssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssignmentScalarFieldEnum | AssignmentScalarFieldEnum[]
  }

  /**
   * User.scripts
   */
  export type User$scriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    where?: ScriptWhereInput
    orderBy?: ScriptOrderByWithRelationInput | ScriptOrderByWithRelationInput[]
    cursor?: ScriptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScriptScalarFieldEnum | ScriptScalarFieldEnum[]
  }

  /**
   * User.knowledgeSources
   */
  export type User$knowledgeSourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    where?: KnowledgeSourceWhereInput
    orderBy?: KnowledgeSourceOrderByWithRelationInput | KnowledgeSourceOrderByWithRelationInput[]
    cursor?: KnowledgeSourceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KnowledgeSourceScalarFieldEnum | KnowledgeSourceScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectAvgAggregateOutputType = {
    budget: number | null
  }

  export type ProjectSumAggregateOutputType = {
    budget: number | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    title: string | null
    name: string | null
    description: string | null
    client: string | null
    clientName: string | null
    status: $Enums.ProjectStatus | null
    startDate: Date | null
    endDate: Date | null
    budget: number | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    title: string | null
    name: string | null
    description: string | null
    client: string | null
    clientName: string | null
    status: $Enums.ProjectStatus | null
    startDate: Date | null
    endDate: Date | null
    budget: number | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    title: number
    name: number
    description: number
    client: number
    clientName: number
    status: number
    startDate: number
    endDate: number
    budget: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type ProjectAvgAggregateInputType = {
    budget?: true
  }

  export type ProjectSumAggregateInputType = {
    budget?: true
  }

  export type ProjectMinAggregateInputType = {
    id?: true
    title?: true
    name?: true
    description?: true
    client?: true
    clientName?: true
    status?: true
    startDate?: true
    endDate?: true
    budget?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    title?: true
    name?: true
    description?: true
    client?: true
    clientName?: true
    status?: true
    startDate?: true
    endDate?: true
    budget?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    title?: true
    name?: true
    description?: true
    client?: true
    clientName?: true
    status?: true
    startDate?: true
    endDate?: true
    budget?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _avg?: ProjectAvgAggregateInputType
    _sum?: ProjectSumAggregateInputType
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    title: string | null
    name: string | null
    description: string | null
    client: string | null
    clientName: string | null
    status: $Enums.ProjectStatus
    startDate: Date | null
    endDate: Date | null
    budget: number | null
    createdAt: Date
    updatedAt: Date
    userId: string | null
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    name?: boolean
    description?: boolean
    client?: boolean
    clientName?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    budget?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | Project$userArgs<ExtArgs>
    roleRequirements?: boolean | Project$roleRequirementsArgs<ExtArgs>
    assignments?: boolean | Project$assignmentsArgs<ExtArgs>
    scripts?: boolean | Project$scriptsArgs<ExtArgs>
    moodboardItems?: boolean | Project$moodboardItemsArgs<ExtArgs>
    knowledgeSources?: boolean | Project$knowledgeSourcesArgs<ExtArgs>
    transcripts?: boolean | Project$transcriptsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    name?: boolean
    description?: boolean
    client?: boolean
    clientName?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    budget?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | Project$userArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    name?: boolean
    description?: boolean
    client?: boolean
    clientName?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    budget?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | Project$userArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    title?: boolean
    name?: boolean
    description?: boolean
    client?: boolean
    clientName?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    budget?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "name" | "description" | "client" | "clientName" | "status" | "startDate" | "endDate" | "budget" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Project$userArgs<ExtArgs>
    roleRequirements?: boolean | Project$roleRequirementsArgs<ExtArgs>
    assignments?: boolean | Project$assignmentsArgs<ExtArgs>
    scripts?: boolean | Project$scriptsArgs<ExtArgs>
    moodboardItems?: boolean | Project$moodboardItemsArgs<ExtArgs>
    knowledgeSources?: boolean | Project$knowledgeSourcesArgs<ExtArgs>
    transcripts?: boolean | Project$transcriptsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Project$userArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Project$userArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      roleRequirements: Prisma.$RoleRequirementPayload<ExtArgs>[]
      assignments: Prisma.$AssignmentPayload<ExtArgs>[]
      scripts: Prisma.$ScriptPayload<ExtArgs>[]
      moodboardItems: Prisma.$MoodboardItemPayload<ExtArgs>[]
      knowledgeSources: Prisma.$KnowledgeSourcePayload<ExtArgs>[]
      transcripts: Prisma.$TranscriptPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      name: string | null
      description: string | null
      client: string | null
      clientName: string | null
      status: $Enums.ProjectStatus
      startDate: Date | null
      endDate: Date | null
      budget: number | null
      createdAt: Date
      updatedAt: Date
      userId: string | null
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Project$userArgs<ExtArgs> = {}>(args?: Subset<T, Project$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    roleRequirements<T extends Project$roleRequirementsArgs<ExtArgs> = {}>(args?: Subset<T, Project$roleRequirementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    assignments<T extends Project$assignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Project$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    scripts<T extends Project$scriptsArgs<ExtArgs> = {}>(args?: Subset<T, Project$scriptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    moodboardItems<T extends Project$moodboardItemsArgs<ExtArgs> = {}>(args?: Subset<T, Project$moodboardItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    knowledgeSources<T extends Project$knowledgeSourcesArgs<ExtArgs> = {}>(args?: Subset<T, Project$knowledgeSourcesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transcripts<T extends Project$transcriptsArgs<ExtArgs> = {}>(args?: Subset<T, Project$transcriptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly title: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly client: FieldRef<"Project", 'String'>
    readonly clientName: FieldRef<"Project", 'String'>
    readonly status: FieldRef<"Project", 'ProjectStatus'>
    readonly startDate: FieldRef<"Project", 'DateTime'>
    readonly endDate: FieldRef<"Project", 'DateTime'>
    readonly budget: FieldRef<"Project", 'Float'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
    readonly userId: FieldRef<"Project", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.user
   */
  export type Project$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Project.roleRequirements
   */
  export type Project$roleRequirementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
    where?: RoleRequirementWhereInput
    orderBy?: RoleRequirementOrderByWithRelationInput | RoleRequirementOrderByWithRelationInput[]
    cursor?: RoleRequirementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoleRequirementScalarFieldEnum | RoleRequirementScalarFieldEnum[]
  }

  /**
   * Project.assignments
   */
  export type Project$assignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    where?: AssignmentWhereInput
    orderBy?: AssignmentOrderByWithRelationInput | AssignmentOrderByWithRelationInput[]
    cursor?: AssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssignmentScalarFieldEnum | AssignmentScalarFieldEnum[]
  }

  /**
   * Project.scripts
   */
  export type Project$scriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    where?: ScriptWhereInput
    orderBy?: ScriptOrderByWithRelationInput | ScriptOrderByWithRelationInput[]
    cursor?: ScriptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScriptScalarFieldEnum | ScriptScalarFieldEnum[]
  }

  /**
   * Project.moodboardItems
   */
  export type Project$moodboardItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
    where?: MoodboardItemWhereInput
    orderBy?: MoodboardItemOrderByWithRelationInput | MoodboardItemOrderByWithRelationInput[]
    cursor?: MoodboardItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MoodboardItemScalarFieldEnum | MoodboardItemScalarFieldEnum[]
  }

  /**
   * Project.knowledgeSources
   */
  export type Project$knowledgeSourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    where?: KnowledgeSourceWhereInput
    orderBy?: KnowledgeSourceOrderByWithRelationInput | KnowledgeSourceOrderByWithRelationInput[]
    cursor?: KnowledgeSourceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KnowledgeSourceScalarFieldEnum | KnowledgeSourceScalarFieldEnum[]
  }

  /**
   * Project.transcripts
   */
  export type Project$transcriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    where?: TranscriptWhereInput
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    cursor?: TranscriptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model RoleRequirement
   */

  export type AggregateRoleRequirement = {
    _count: RoleRequirementCountAggregateOutputType | null
    _avg: RoleRequirementAvgAggregateOutputType | null
    _sum: RoleRequirementSumAggregateOutputType | null
    _min: RoleRequirementMinAggregateOutputType | null
    _max: RoleRequirementMaxAggregateOutputType | null
  }

  export type RoleRequirementAvgAggregateOutputType = {
    count: number | null
  }

  export type RoleRequirementSumAggregateOutputType = {
    count: number | null
  }

  export type RoleRequirementMinAggregateOutputType = {
    id: string | null
    role: string | null
    count: number | null
    projectId: string | null
  }

  export type RoleRequirementMaxAggregateOutputType = {
    id: string | null
    role: string | null
    count: number | null
    projectId: string | null
  }

  export type RoleRequirementCountAggregateOutputType = {
    id: number
    role: number
    count: number
    skills: number
    projectId: number
    _all: number
  }


  export type RoleRequirementAvgAggregateInputType = {
    count?: true
  }

  export type RoleRequirementSumAggregateInputType = {
    count?: true
  }

  export type RoleRequirementMinAggregateInputType = {
    id?: true
    role?: true
    count?: true
    projectId?: true
  }

  export type RoleRequirementMaxAggregateInputType = {
    id?: true
    role?: true
    count?: true
    projectId?: true
  }

  export type RoleRequirementCountAggregateInputType = {
    id?: true
    role?: true
    count?: true
    skills?: true
    projectId?: true
    _all?: true
  }

  export type RoleRequirementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleRequirement to aggregate.
     */
    where?: RoleRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleRequirements to fetch.
     */
    orderBy?: RoleRequirementOrderByWithRelationInput | RoleRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleRequirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoleRequirements
    **/
    _count?: true | RoleRequirementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoleRequirementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoleRequirementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleRequirementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleRequirementMaxAggregateInputType
  }

  export type GetRoleRequirementAggregateType<T extends RoleRequirementAggregateArgs> = {
        [P in keyof T & keyof AggregateRoleRequirement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoleRequirement[P]>
      : GetScalarType<T[P], AggregateRoleRequirement[P]>
  }




  export type RoleRequirementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleRequirementWhereInput
    orderBy?: RoleRequirementOrderByWithAggregationInput | RoleRequirementOrderByWithAggregationInput[]
    by: RoleRequirementScalarFieldEnum[] | RoleRequirementScalarFieldEnum
    having?: RoleRequirementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleRequirementCountAggregateInputType | true
    _avg?: RoleRequirementAvgAggregateInputType
    _sum?: RoleRequirementSumAggregateInputType
    _min?: RoleRequirementMinAggregateInputType
    _max?: RoleRequirementMaxAggregateInputType
  }

  export type RoleRequirementGroupByOutputType = {
    id: string
    role: string
    count: number | null
    skills: string[]
    projectId: string
    _count: RoleRequirementCountAggregateOutputType | null
    _avg: RoleRequirementAvgAggregateOutputType | null
    _sum: RoleRequirementSumAggregateOutputType | null
    _min: RoleRequirementMinAggregateOutputType | null
    _max: RoleRequirementMaxAggregateOutputType | null
  }

  type GetRoleRequirementGroupByPayload<T extends RoleRequirementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleRequirementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleRequirementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleRequirementGroupByOutputType[P]>
            : GetScalarType<T[P], RoleRequirementGroupByOutputType[P]>
        }
      >
    >


  export type RoleRequirementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    count?: boolean
    skills?: boolean
    projectId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleRequirement"]>

  export type RoleRequirementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    count?: boolean
    skills?: boolean
    projectId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleRequirement"]>

  export type RoleRequirementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    count?: boolean
    skills?: boolean
    projectId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleRequirement"]>

  export type RoleRequirementSelectScalar = {
    id?: boolean
    role?: boolean
    count?: boolean
    skills?: boolean
    projectId?: boolean
  }

  export type RoleRequirementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role" | "count" | "skills" | "projectId", ExtArgs["result"]["roleRequirement"]>
  export type RoleRequirementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type RoleRequirementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type RoleRequirementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $RoleRequirementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoleRequirement"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      role: string
      count: number | null
      skills: string[]
      projectId: string
    }, ExtArgs["result"]["roleRequirement"]>
    composites: {}
  }

  type RoleRequirementGetPayload<S extends boolean | null | undefined | RoleRequirementDefaultArgs> = $Result.GetResult<Prisma.$RoleRequirementPayload, S>

  type RoleRequirementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleRequirementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleRequirementCountAggregateInputType | true
    }

  export interface RoleRequirementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoleRequirement'], meta: { name: 'RoleRequirement' } }
    /**
     * Find zero or one RoleRequirement that matches the filter.
     * @param {RoleRequirementFindUniqueArgs} args - Arguments to find a RoleRequirement
     * @example
     * // Get one RoleRequirement
     * const roleRequirement = await prisma.roleRequirement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleRequirementFindUniqueArgs>(args: SelectSubset<T, RoleRequirementFindUniqueArgs<ExtArgs>>): Prisma__RoleRequirementClient<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoleRequirement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleRequirementFindUniqueOrThrowArgs} args - Arguments to find a RoleRequirement
     * @example
     * // Get one RoleRequirement
     * const roleRequirement = await prisma.roleRequirement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleRequirementFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleRequirementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleRequirementClient<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleRequirement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleRequirementFindFirstArgs} args - Arguments to find a RoleRequirement
     * @example
     * // Get one RoleRequirement
     * const roleRequirement = await prisma.roleRequirement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleRequirementFindFirstArgs>(args?: SelectSubset<T, RoleRequirementFindFirstArgs<ExtArgs>>): Prisma__RoleRequirementClient<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleRequirement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleRequirementFindFirstOrThrowArgs} args - Arguments to find a RoleRequirement
     * @example
     * // Get one RoleRequirement
     * const roleRequirement = await prisma.roleRequirement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleRequirementFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleRequirementFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleRequirementClient<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoleRequirements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleRequirementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoleRequirements
     * const roleRequirements = await prisma.roleRequirement.findMany()
     * 
     * // Get first 10 RoleRequirements
     * const roleRequirements = await prisma.roleRequirement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleRequirementWithIdOnly = await prisma.roleRequirement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleRequirementFindManyArgs>(args?: SelectSubset<T, RoleRequirementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoleRequirement.
     * @param {RoleRequirementCreateArgs} args - Arguments to create a RoleRequirement.
     * @example
     * // Create one RoleRequirement
     * const RoleRequirement = await prisma.roleRequirement.create({
     *   data: {
     *     // ... data to create a RoleRequirement
     *   }
     * })
     * 
     */
    create<T extends RoleRequirementCreateArgs>(args: SelectSubset<T, RoleRequirementCreateArgs<ExtArgs>>): Prisma__RoleRequirementClient<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoleRequirements.
     * @param {RoleRequirementCreateManyArgs} args - Arguments to create many RoleRequirements.
     * @example
     * // Create many RoleRequirements
     * const roleRequirement = await prisma.roleRequirement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleRequirementCreateManyArgs>(args?: SelectSubset<T, RoleRequirementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoleRequirements and returns the data saved in the database.
     * @param {RoleRequirementCreateManyAndReturnArgs} args - Arguments to create many RoleRequirements.
     * @example
     * // Create many RoleRequirements
     * const roleRequirement = await prisma.roleRequirement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoleRequirements and only return the `id`
     * const roleRequirementWithIdOnly = await prisma.roleRequirement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleRequirementCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleRequirementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoleRequirement.
     * @param {RoleRequirementDeleteArgs} args - Arguments to delete one RoleRequirement.
     * @example
     * // Delete one RoleRequirement
     * const RoleRequirement = await prisma.roleRequirement.delete({
     *   where: {
     *     // ... filter to delete one RoleRequirement
     *   }
     * })
     * 
     */
    delete<T extends RoleRequirementDeleteArgs>(args: SelectSubset<T, RoleRequirementDeleteArgs<ExtArgs>>): Prisma__RoleRequirementClient<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoleRequirement.
     * @param {RoleRequirementUpdateArgs} args - Arguments to update one RoleRequirement.
     * @example
     * // Update one RoleRequirement
     * const roleRequirement = await prisma.roleRequirement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleRequirementUpdateArgs>(args: SelectSubset<T, RoleRequirementUpdateArgs<ExtArgs>>): Prisma__RoleRequirementClient<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoleRequirements.
     * @param {RoleRequirementDeleteManyArgs} args - Arguments to filter RoleRequirements to delete.
     * @example
     * // Delete a few RoleRequirements
     * const { count } = await prisma.roleRequirement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleRequirementDeleteManyArgs>(args?: SelectSubset<T, RoleRequirementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleRequirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleRequirementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoleRequirements
     * const roleRequirement = await prisma.roleRequirement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleRequirementUpdateManyArgs>(args: SelectSubset<T, RoleRequirementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleRequirements and returns the data updated in the database.
     * @param {RoleRequirementUpdateManyAndReturnArgs} args - Arguments to update many RoleRequirements.
     * @example
     * // Update many RoleRequirements
     * const roleRequirement = await prisma.roleRequirement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoleRequirements and only return the `id`
     * const roleRequirementWithIdOnly = await prisma.roleRequirement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleRequirementUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleRequirementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoleRequirement.
     * @param {RoleRequirementUpsertArgs} args - Arguments to update or create a RoleRequirement.
     * @example
     * // Update or create a RoleRequirement
     * const roleRequirement = await prisma.roleRequirement.upsert({
     *   create: {
     *     // ... data to create a RoleRequirement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoleRequirement we want to update
     *   }
     * })
     */
    upsert<T extends RoleRequirementUpsertArgs>(args: SelectSubset<T, RoleRequirementUpsertArgs<ExtArgs>>): Prisma__RoleRequirementClient<$Result.GetResult<Prisma.$RoleRequirementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoleRequirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleRequirementCountArgs} args - Arguments to filter RoleRequirements to count.
     * @example
     * // Count the number of RoleRequirements
     * const count = await prisma.roleRequirement.count({
     *   where: {
     *     // ... the filter for the RoleRequirements we want to count
     *   }
     * })
    **/
    count<T extends RoleRequirementCountArgs>(
      args?: Subset<T, RoleRequirementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleRequirementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoleRequirement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleRequirementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleRequirementAggregateArgs>(args: Subset<T, RoleRequirementAggregateArgs>): Prisma.PrismaPromise<GetRoleRequirementAggregateType<T>>

    /**
     * Group by RoleRequirement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleRequirementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleRequirementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleRequirementGroupByArgs['orderBy'] }
        : { orderBy?: RoleRequirementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleRequirementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleRequirementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoleRequirement model
   */
  readonly fields: RoleRequirementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoleRequirement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleRequirementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoleRequirement model
   */
  interface RoleRequirementFieldRefs {
    readonly id: FieldRef<"RoleRequirement", 'String'>
    readonly role: FieldRef<"RoleRequirement", 'String'>
    readonly count: FieldRef<"RoleRequirement", 'Int'>
    readonly skills: FieldRef<"RoleRequirement", 'String[]'>
    readonly projectId: FieldRef<"RoleRequirement", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RoleRequirement findUnique
   */
  export type RoleRequirementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
    /**
     * Filter, which RoleRequirement to fetch.
     */
    where: RoleRequirementWhereUniqueInput
  }

  /**
   * RoleRequirement findUniqueOrThrow
   */
  export type RoleRequirementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
    /**
     * Filter, which RoleRequirement to fetch.
     */
    where: RoleRequirementWhereUniqueInput
  }

  /**
   * RoleRequirement findFirst
   */
  export type RoleRequirementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
    /**
     * Filter, which RoleRequirement to fetch.
     */
    where?: RoleRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleRequirements to fetch.
     */
    orderBy?: RoleRequirementOrderByWithRelationInput | RoleRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleRequirements.
     */
    cursor?: RoleRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleRequirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleRequirements.
     */
    distinct?: RoleRequirementScalarFieldEnum | RoleRequirementScalarFieldEnum[]
  }

  /**
   * RoleRequirement findFirstOrThrow
   */
  export type RoleRequirementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
    /**
     * Filter, which RoleRequirement to fetch.
     */
    where?: RoleRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleRequirements to fetch.
     */
    orderBy?: RoleRequirementOrderByWithRelationInput | RoleRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleRequirements.
     */
    cursor?: RoleRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleRequirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleRequirements.
     */
    distinct?: RoleRequirementScalarFieldEnum | RoleRequirementScalarFieldEnum[]
  }

  /**
   * RoleRequirement findMany
   */
  export type RoleRequirementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
    /**
     * Filter, which RoleRequirements to fetch.
     */
    where?: RoleRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleRequirements to fetch.
     */
    orderBy?: RoleRequirementOrderByWithRelationInput | RoleRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoleRequirements.
     */
    cursor?: RoleRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleRequirements.
     */
    skip?: number
    distinct?: RoleRequirementScalarFieldEnum | RoleRequirementScalarFieldEnum[]
  }

  /**
   * RoleRequirement create
   */
  export type RoleRequirementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
    /**
     * The data needed to create a RoleRequirement.
     */
    data: XOR<RoleRequirementCreateInput, RoleRequirementUncheckedCreateInput>
  }

  /**
   * RoleRequirement createMany
   */
  export type RoleRequirementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoleRequirements.
     */
    data: RoleRequirementCreateManyInput | RoleRequirementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoleRequirement createManyAndReturn
   */
  export type RoleRequirementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * The data used to create many RoleRequirements.
     */
    data: RoleRequirementCreateManyInput | RoleRequirementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoleRequirement update
   */
  export type RoleRequirementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
    /**
     * The data needed to update a RoleRequirement.
     */
    data: XOR<RoleRequirementUpdateInput, RoleRequirementUncheckedUpdateInput>
    /**
     * Choose, which RoleRequirement to update.
     */
    where: RoleRequirementWhereUniqueInput
  }

  /**
   * RoleRequirement updateMany
   */
  export type RoleRequirementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoleRequirements.
     */
    data: XOR<RoleRequirementUpdateManyMutationInput, RoleRequirementUncheckedUpdateManyInput>
    /**
     * Filter which RoleRequirements to update
     */
    where?: RoleRequirementWhereInput
    /**
     * Limit how many RoleRequirements to update.
     */
    limit?: number
  }

  /**
   * RoleRequirement updateManyAndReturn
   */
  export type RoleRequirementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * The data used to update RoleRequirements.
     */
    data: XOR<RoleRequirementUpdateManyMutationInput, RoleRequirementUncheckedUpdateManyInput>
    /**
     * Filter which RoleRequirements to update
     */
    where?: RoleRequirementWhereInput
    /**
     * Limit how many RoleRequirements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoleRequirement upsert
   */
  export type RoleRequirementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
    /**
     * The filter to search for the RoleRequirement to update in case it exists.
     */
    where: RoleRequirementWhereUniqueInput
    /**
     * In case the RoleRequirement found by the `where` argument doesn't exist, create a new RoleRequirement with this data.
     */
    create: XOR<RoleRequirementCreateInput, RoleRequirementUncheckedCreateInput>
    /**
     * In case the RoleRequirement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleRequirementUpdateInput, RoleRequirementUncheckedUpdateInput>
  }

  /**
   * RoleRequirement delete
   */
  export type RoleRequirementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
    /**
     * Filter which RoleRequirement to delete.
     */
    where: RoleRequirementWhereUniqueInput
  }

  /**
   * RoleRequirement deleteMany
   */
  export type RoleRequirementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleRequirements to delete
     */
    where?: RoleRequirementWhereInput
    /**
     * Limit how many RoleRequirements to delete.
     */
    limit?: number
  }

  /**
   * RoleRequirement without action
   */
  export type RoleRequirementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleRequirement
     */
    select?: RoleRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleRequirement
     */
    omit?: RoleRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleRequirementInclude<ExtArgs> | null
  }


  /**
   * Model Freelancer
   */

  export type AggregateFreelancer = {
    _count: FreelancerCountAggregateOutputType | null
    _avg: FreelancerAvgAggregateOutputType | null
    _sum: FreelancerSumAggregateOutputType | null
    _min: FreelancerMinAggregateOutputType | null
    _max: FreelancerMaxAggregateOutputType | null
  }

  export type FreelancerAvgAggregateOutputType = {
    rate: number | null
    rating: number | null
  }

  export type FreelancerSumAggregateOutputType = {
    rate: number | null
    rating: number | null
  }

  export type FreelancerMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    contactInfo: string | null
    role: string | null
    rate: number | null
    status: $Enums.FreelancerStatus | null
    bio: string | null
    phone: string | null
    location: string | null
    availability: string | null
    portfolio: string | null
    notes: string | null
    rating: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FreelancerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    contactInfo: string | null
    role: string | null
    rate: number | null
    status: $Enums.FreelancerStatus | null
    bio: string | null
    phone: string | null
    location: string | null
    availability: string | null
    portfolio: string | null
    notes: string | null
    rating: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FreelancerCountAggregateOutputType = {
    id: number
    name: number
    email: number
    contactInfo: number
    skills: number
    role: number
    rate: number
    status: number
    bio: number
    phone: number
    location: number
    availability: number
    portfolio: number
    notes: number
    rating: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FreelancerAvgAggregateInputType = {
    rate?: true
    rating?: true
  }

  export type FreelancerSumAggregateInputType = {
    rate?: true
    rating?: true
  }

  export type FreelancerMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    contactInfo?: true
    role?: true
    rate?: true
    status?: true
    bio?: true
    phone?: true
    location?: true
    availability?: true
    portfolio?: true
    notes?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FreelancerMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    contactInfo?: true
    role?: true
    rate?: true
    status?: true
    bio?: true
    phone?: true
    location?: true
    availability?: true
    portfolio?: true
    notes?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FreelancerCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    contactInfo?: true
    skills?: true
    role?: true
    rate?: true
    status?: true
    bio?: true
    phone?: true
    location?: true
    availability?: true
    portfolio?: true
    notes?: true
    rating?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FreelancerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Freelancer to aggregate.
     */
    where?: FreelancerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Freelancers to fetch.
     */
    orderBy?: FreelancerOrderByWithRelationInput | FreelancerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FreelancerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Freelancers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Freelancers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Freelancers
    **/
    _count?: true | FreelancerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FreelancerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FreelancerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FreelancerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FreelancerMaxAggregateInputType
  }

  export type GetFreelancerAggregateType<T extends FreelancerAggregateArgs> = {
        [P in keyof T & keyof AggregateFreelancer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFreelancer[P]>
      : GetScalarType<T[P], AggregateFreelancer[P]>
  }




  export type FreelancerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FreelancerWhereInput
    orderBy?: FreelancerOrderByWithAggregationInput | FreelancerOrderByWithAggregationInput[]
    by: FreelancerScalarFieldEnum[] | FreelancerScalarFieldEnum
    having?: FreelancerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FreelancerCountAggregateInputType | true
    _avg?: FreelancerAvgAggregateInputType
    _sum?: FreelancerSumAggregateInputType
    _min?: FreelancerMinAggregateInputType
    _max?: FreelancerMaxAggregateInputType
  }

  export type FreelancerGroupByOutputType = {
    id: string
    name: string
    email: string | null
    contactInfo: string | null
    skills: string[]
    role: string | null
    rate: number | null
    status: $Enums.FreelancerStatus
    bio: string | null
    phone: string | null
    location: string | null
    availability: string | null
    portfolio: string | null
    notes: string | null
    rating: number | null
    createdAt: Date
    updatedAt: Date
    _count: FreelancerCountAggregateOutputType | null
    _avg: FreelancerAvgAggregateOutputType | null
    _sum: FreelancerSumAggregateOutputType | null
    _min: FreelancerMinAggregateOutputType | null
    _max: FreelancerMaxAggregateOutputType | null
  }

  type GetFreelancerGroupByPayload<T extends FreelancerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FreelancerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FreelancerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FreelancerGroupByOutputType[P]>
            : GetScalarType<T[P], FreelancerGroupByOutputType[P]>
        }
      >
    >


  export type FreelancerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    contactInfo?: boolean
    skills?: boolean
    role?: boolean
    rate?: boolean
    status?: boolean
    bio?: boolean
    phone?: boolean
    location?: boolean
    availability?: boolean
    portfolio?: boolean
    notes?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assignments?: boolean | Freelancer$assignmentsArgs<ExtArgs>
    _count?: boolean | FreelancerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["freelancer"]>

  export type FreelancerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    contactInfo?: boolean
    skills?: boolean
    role?: boolean
    rate?: boolean
    status?: boolean
    bio?: boolean
    phone?: boolean
    location?: boolean
    availability?: boolean
    portfolio?: boolean
    notes?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["freelancer"]>

  export type FreelancerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    contactInfo?: boolean
    skills?: boolean
    role?: boolean
    rate?: boolean
    status?: boolean
    bio?: boolean
    phone?: boolean
    location?: boolean
    availability?: boolean
    portfolio?: boolean
    notes?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["freelancer"]>

  export type FreelancerSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    contactInfo?: boolean
    skills?: boolean
    role?: boolean
    rate?: boolean
    status?: boolean
    bio?: boolean
    phone?: boolean
    location?: boolean
    availability?: boolean
    portfolio?: boolean
    notes?: boolean
    rating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FreelancerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "contactInfo" | "skills" | "role" | "rate" | "status" | "bio" | "phone" | "location" | "availability" | "portfolio" | "notes" | "rating" | "createdAt" | "updatedAt", ExtArgs["result"]["freelancer"]>
  export type FreelancerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignments?: boolean | Freelancer$assignmentsArgs<ExtArgs>
    _count?: boolean | FreelancerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FreelancerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type FreelancerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FreelancerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Freelancer"
    objects: {
      assignments: Prisma.$AssignmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string | null
      contactInfo: string | null
      skills: string[]
      role: string | null
      rate: number | null
      status: $Enums.FreelancerStatus
      bio: string | null
      phone: string | null
      location: string | null
      availability: string | null
      portfolio: string | null
      notes: string | null
      rating: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["freelancer"]>
    composites: {}
  }

  type FreelancerGetPayload<S extends boolean | null | undefined | FreelancerDefaultArgs> = $Result.GetResult<Prisma.$FreelancerPayload, S>

  type FreelancerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FreelancerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FreelancerCountAggregateInputType | true
    }

  export interface FreelancerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Freelancer'], meta: { name: 'Freelancer' } }
    /**
     * Find zero or one Freelancer that matches the filter.
     * @param {FreelancerFindUniqueArgs} args - Arguments to find a Freelancer
     * @example
     * // Get one Freelancer
     * const freelancer = await prisma.freelancer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FreelancerFindUniqueArgs>(args: SelectSubset<T, FreelancerFindUniqueArgs<ExtArgs>>): Prisma__FreelancerClient<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Freelancer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FreelancerFindUniqueOrThrowArgs} args - Arguments to find a Freelancer
     * @example
     * // Get one Freelancer
     * const freelancer = await prisma.freelancer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FreelancerFindUniqueOrThrowArgs>(args: SelectSubset<T, FreelancerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FreelancerClient<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Freelancer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreelancerFindFirstArgs} args - Arguments to find a Freelancer
     * @example
     * // Get one Freelancer
     * const freelancer = await prisma.freelancer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FreelancerFindFirstArgs>(args?: SelectSubset<T, FreelancerFindFirstArgs<ExtArgs>>): Prisma__FreelancerClient<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Freelancer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreelancerFindFirstOrThrowArgs} args - Arguments to find a Freelancer
     * @example
     * // Get one Freelancer
     * const freelancer = await prisma.freelancer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FreelancerFindFirstOrThrowArgs>(args?: SelectSubset<T, FreelancerFindFirstOrThrowArgs<ExtArgs>>): Prisma__FreelancerClient<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Freelancers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreelancerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Freelancers
     * const freelancers = await prisma.freelancer.findMany()
     * 
     * // Get first 10 Freelancers
     * const freelancers = await prisma.freelancer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const freelancerWithIdOnly = await prisma.freelancer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FreelancerFindManyArgs>(args?: SelectSubset<T, FreelancerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Freelancer.
     * @param {FreelancerCreateArgs} args - Arguments to create a Freelancer.
     * @example
     * // Create one Freelancer
     * const Freelancer = await prisma.freelancer.create({
     *   data: {
     *     // ... data to create a Freelancer
     *   }
     * })
     * 
     */
    create<T extends FreelancerCreateArgs>(args: SelectSubset<T, FreelancerCreateArgs<ExtArgs>>): Prisma__FreelancerClient<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Freelancers.
     * @param {FreelancerCreateManyArgs} args - Arguments to create many Freelancers.
     * @example
     * // Create many Freelancers
     * const freelancer = await prisma.freelancer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FreelancerCreateManyArgs>(args?: SelectSubset<T, FreelancerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Freelancers and returns the data saved in the database.
     * @param {FreelancerCreateManyAndReturnArgs} args - Arguments to create many Freelancers.
     * @example
     * // Create many Freelancers
     * const freelancer = await prisma.freelancer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Freelancers and only return the `id`
     * const freelancerWithIdOnly = await prisma.freelancer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FreelancerCreateManyAndReturnArgs>(args?: SelectSubset<T, FreelancerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Freelancer.
     * @param {FreelancerDeleteArgs} args - Arguments to delete one Freelancer.
     * @example
     * // Delete one Freelancer
     * const Freelancer = await prisma.freelancer.delete({
     *   where: {
     *     // ... filter to delete one Freelancer
     *   }
     * })
     * 
     */
    delete<T extends FreelancerDeleteArgs>(args: SelectSubset<T, FreelancerDeleteArgs<ExtArgs>>): Prisma__FreelancerClient<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Freelancer.
     * @param {FreelancerUpdateArgs} args - Arguments to update one Freelancer.
     * @example
     * // Update one Freelancer
     * const freelancer = await prisma.freelancer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FreelancerUpdateArgs>(args: SelectSubset<T, FreelancerUpdateArgs<ExtArgs>>): Prisma__FreelancerClient<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Freelancers.
     * @param {FreelancerDeleteManyArgs} args - Arguments to filter Freelancers to delete.
     * @example
     * // Delete a few Freelancers
     * const { count } = await prisma.freelancer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FreelancerDeleteManyArgs>(args?: SelectSubset<T, FreelancerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Freelancers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreelancerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Freelancers
     * const freelancer = await prisma.freelancer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FreelancerUpdateManyArgs>(args: SelectSubset<T, FreelancerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Freelancers and returns the data updated in the database.
     * @param {FreelancerUpdateManyAndReturnArgs} args - Arguments to update many Freelancers.
     * @example
     * // Update many Freelancers
     * const freelancer = await prisma.freelancer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Freelancers and only return the `id`
     * const freelancerWithIdOnly = await prisma.freelancer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FreelancerUpdateManyAndReturnArgs>(args: SelectSubset<T, FreelancerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Freelancer.
     * @param {FreelancerUpsertArgs} args - Arguments to update or create a Freelancer.
     * @example
     * // Update or create a Freelancer
     * const freelancer = await prisma.freelancer.upsert({
     *   create: {
     *     // ... data to create a Freelancer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Freelancer we want to update
     *   }
     * })
     */
    upsert<T extends FreelancerUpsertArgs>(args: SelectSubset<T, FreelancerUpsertArgs<ExtArgs>>): Prisma__FreelancerClient<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Freelancers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreelancerCountArgs} args - Arguments to filter Freelancers to count.
     * @example
     * // Count the number of Freelancers
     * const count = await prisma.freelancer.count({
     *   where: {
     *     // ... the filter for the Freelancers we want to count
     *   }
     * })
    **/
    count<T extends FreelancerCountArgs>(
      args?: Subset<T, FreelancerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FreelancerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Freelancer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreelancerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FreelancerAggregateArgs>(args: Subset<T, FreelancerAggregateArgs>): Prisma.PrismaPromise<GetFreelancerAggregateType<T>>

    /**
     * Group by Freelancer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreelancerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FreelancerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FreelancerGroupByArgs['orderBy'] }
        : { orderBy?: FreelancerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FreelancerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFreelancerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Freelancer model
   */
  readonly fields: FreelancerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Freelancer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FreelancerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assignments<T extends Freelancer$assignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Freelancer$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Freelancer model
   */
  interface FreelancerFieldRefs {
    readonly id: FieldRef<"Freelancer", 'String'>
    readonly name: FieldRef<"Freelancer", 'String'>
    readonly email: FieldRef<"Freelancer", 'String'>
    readonly contactInfo: FieldRef<"Freelancer", 'String'>
    readonly skills: FieldRef<"Freelancer", 'String[]'>
    readonly role: FieldRef<"Freelancer", 'String'>
    readonly rate: FieldRef<"Freelancer", 'Float'>
    readonly status: FieldRef<"Freelancer", 'FreelancerStatus'>
    readonly bio: FieldRef<"Freelancer", 'String'>
    readonly phone: FieldRef<"Freelancer", 'String'>
    readonly location: FieldRef<"Freelancer", 'String'>
    readonly availability: FieldRef<"Freelancer", 'String'>
    readonly portfolio: FieldRef<"Freelancer", 'String'>
    readonly notes: FieldRef<"Freelancer", 'String'>
    readonly rating: FieldRef<"Freelancer", 'Float'>
    readonly createdAt: FieldRef<"Freelancer", 'DateTime'>
    readonly updatedAt: FieldRef<"Freelancer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Freelancer findUnique
   */
  export type FreelancerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FreelancerInclude<ExtArgs> | null
    /**
     * Filter, which Freelancer to fetch.
     */
    where: FreelancerWhereUniqueInput
  }

  /**
   * Freelancer findUniqueOrThrow
   */
  export type FreelancerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FreelancerInclude<ExtArgs> | null
    /**
     * Filter, which Freelancer to fetch.
     */
    where: FreelancerWhereUniqueInput
  }

  /**
   * Freelancer findFirst
   */
  export type FreelancerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FreelancerInclude<ExtArgs> | null
    /**
     * Filter, which Freelancer to fetch.
     */
    where?: FreelancerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Freelancers to fetch.
     */
    orderBy?: FreelancerOrderByWithRelationInput | FreelancerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Freelancers.
     */
    cursor?: FreelancerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Freelancers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Freelancers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Freelancers.
     */
    distinct?: FreelancerScalarFieldEnum | FreelancerScalarFieldEnum[]
  }

  /**
   * Freelancer findFirstOrThrow
   */
  export type FreelancerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FreelancerInclude<ExtArgs> | null
    /**
     * Filter, which Freelancer to fetch.
     */
    where?: FreelancerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Freelancers to fetch.
     */
    orderBy?: FreelancerOrderByWithRelationInput | FreelancerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Freelancers.
     */
    cursor?: FreelancerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Freelancers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Freelancers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Freelancers.
     */
    distinct?: FreelancerScalarFieldEnum | FreelancerScalarFieldEnum[]
  }

  /**
   * Freelancer findMany
   */
  export type FreelancerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FreelancerInclude<ExtArgs> | null
    /**
     * Filter, which Freelancers to fetch.
     */
    where?: FreelancerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Freelancers to fetch.
     */
    orderBy?: FreelancerOrderByWithRelationInput | FreelancerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Freelancers.
     */
    cursor?: FreelancerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Freelancers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Freelancers.
     */
    skip?: number
    distinct?: FreelancerScalarFieldEnum | FreelancerScalarFieldEnum[]
  }

  /**
   * Freelancer create
   */
  export type FreelancerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FreelancerInclude<ExtArgs> | null
    /**
     * The data needed to create a Freelancer.
     */
    data: XOR<FreelancerCreateInput, FreelancerUncheckedCreateInput>
  }

  /**
   * Freelancer createMany
   */
  export type FreelancerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Freelancers.
     */
    data: FreelancerCreateManyInput | FreelancerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Freelancer createManyAndReturn
   */
  export type FreelancerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * The data used to create many Freelancers.
     */
    data: FreelancerCreateManyInput | FreelancerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Freelancer update
   */
  export type FreelancerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FreelancerInclude<ExtArgs> | null
    /**
     * The data needed to update a Freelancer.
     */
    data: XOR<FreelancerUpdateInput, FreelancerUncheckedUpdateInput>
    /**
     * Choose, which Freelancer to update.
     */
    where: FreelancerWhereUniqueInput
  }

  /**
   * Freelancer updateMany
   */
  export type FreelancerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Freelancers.
     */
    data: XOR<FreelancerUpdateManyMutationInput, FreelancerUncheckedUpdateManyInput>
    /**
     * Filter which Freelancers to update
     */
    where?: FreelancerWhereInput
    /**
     * Limit how many Freelancers to update.
     */
    limit?: number
  }

  /**
   * Freelancer updateManyAndReturn
   */
  export type FreelancerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * The data used to update Freelancers.
     */
    data: XOR<FreelancerUpdateManyMutationInput, FreelancerUncheckedUpdateManyInput>
    /**
     * Filter which Freelancers to update
     */
    where?: FreelancerWhereInput
    /**
     * Limit how many Freelancers to update.
     */
    limit?: number
  }

  /**
   * Freelancer upsert
   */
  export type FreelancerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FreelancerInclude<ExtArgs> | null
    /**
     * The filter to search for the Freelancer to update in case it exists.
     */
    where: FreelancerWhereUniqueInput
    /**
     * In case the Freelancer found by the `where` argument doesn't exist, create a new Freelancer with this data.
     */
    create: XOR<FreelancerCreateInput, FreelancerUncheckedCreateInput>
    /**
     * In case the Freelancer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FreelancerUpdateInput, FreelancerUncheckedUpdateInput>
  }

  /**
   * Freelancer delete
   */
  export type FreelancerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FreelancerInclude<ExtArgs> | null
    /**
     * Filter which Freelancer to delete.
     */
    where: FreelancerWhereUniqueInput
  }

  /**
   * Freelancer deleteMany
   */
  export type FreelancerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Freelancers to delete
     */
    where?: FreelancerWhereInput
    /**
     * Limit how many Freelancers to delete.
     */
    limit?: number
  }

  /**
   * Freelancer.assignments
   */
  export type Freelancer$assignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    where?: AssignmentWhereInput
    orderBy?: AssignmentOrderByWithRelationInput | AssignmentOrderByWithRelationInput[]
    cursor?: AssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssignmentScalarFieldEnum | AssignmentScalarFieldEnum[]
  }

  /**
   * Freelancer without action
   */
  export type FreelancerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Freelancer
     */
    select?: FreelancerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Freelancer
     */
    omit?: FreelancerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FreelancerInclude<ExtArgs> | null
  }


  /**
   * Model Assignment
   */

  export type AggregateAssignment = {
    _count: AssignmentCountAggregateOutputType | null
    _avg: AssignmentAvgAggregateOutputType | null
    _sum: AssignmentSumAggregateOutputType | null
    _min: AssignmentMinAggregateOutputType | null
    _max: AssignmentMaxAggregateOutputType | null
  }

  export type AssignmentAvgAggregateOutputType = {
    allocation: number | null
  }

  export type AssignmentSumAggregateOutputType = {
    allocation: number | null
  }

  export type AssignmentMinAggregateOutputType = {
    id: string | null
    freelancerId: string | null
    projectId: string | null
    startDate: Date | null
    endDate: Date | null
    allocation: number | null
    status: $Enums.AssignmentStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type AssignmentMaxAggregateOutputType = {
    id: string | null
    freelancerId: string | null
    projectId: string | null
    startDate: Date | null
    endDate: Date | null
    allocation: number | null
    status: $Enums.AssignmentStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type AssignmentCountAggregateOutputType = {
    id: number
    freelancerId: number
    projectId: number
    startDate: number
    endDate: number
    allocation: number
    status: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type AssignmentAvgAggregateInputType = {
    allocation?: true
  }

  export type AssignmentSumAggregateInputType = {
    allocation?: true
  }

  export type AssignmentMinAggregateInputType = {
    id?: true
    freelancerId?: true
    projectId?: true
    startDate?: true
    endDate?: true
    allocation?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type AssignmentMaxAggregateInputType = {
    id?: true
    freelancerId?: true
    projectId?: true
    startDate?: true
    endDate?: true
    allocation?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type AssignmentCountAggregateInputType = {
    id?: true
    freelancerId?: true
    projectId?: true
    startDate?: true
    endDate?: true
    allocation?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type AssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assignment to aggregate.
     */
    where?: AssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assignments to fetch.
     */
    orderBy?: AssignmentOrderByWithRelationInput | AssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Assignments
    **/
    _count?: true | AssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssignmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssignmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssignmentMaxAggregateInputType
  }

  export type GetAssignmentAggregateType<T extends AssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssignment[P]>
      : GetScalarType<T[P], AggregateAssignment[P]>
  }




  export type AssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssignmentWhereInput
    orderBy?: AssignmentOrderByWithAggregationInput | AssignmentOrderByWithAggregationInput[]
    by: AssignmentScalarFieldEnum[] | AssignmentScalarFieldEnum
    having?: AssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssignmentCountAggregateInputType | true
    _avg?: AssignmentAvgAggregateInputType
    _sum?: AssignmentSumAggregateInputType
    _min?: AssignmentMinAggregateInputType
    _max?: AssignmentMaxAggregateInputType
  }

  export type AssignmentGroupByOutputType = {
    id: string
    freelancerId: string
    projectId: string
    startDate: Date | null
    endDate: Date | null
    allocation: number | null
    status: $Enums.AssignmentStatus
    createdAt: Date
    updatedAt: Date
    userId: string | null
    _count: AssignmentCountAggregateOutputType | null
    _avg: AssignmentAvgAggregateOutputType | null
    _sum: AssignmentSumAggregateOutputType | null
    _min: AssignmentMinAggregateOutputType | null
    _max: AssignmentMaxAggregateOutputType | null
  }

  type GetAssignmentGroupByPayload<T extends AssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], AssignmentGroupByOutputType[P]>
        }
      >
    >


  export type AssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    freelancerId?: boolean
    projectId?: boolean
    startDate?: boolean
    endDate?: boolean
    allocation?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    freelancer?: boolean | FreelancerDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Assignment$userArgs<ExtArgs>
  }, ExtArgs["result"]["assignment"]>

  export type AssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    freelancerId?: boolean
    projectId?: boolean
    startDate?: boolean
    endDate?: boolean
    allocation?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    freelancer?: boolean | FreelancerDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Assignment$userArgs<ExtArgs>
  }, ExtArgs["result"]["assignment"]>

  export type AssignmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    freelancerId?: boolean
    projectId?: boolean
    startDate?: boolean
    endDate?: boolean
    allocation?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    freelancer?: boolean | FreelancerDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Assignment$userArgs<ExtArgs>
  }, ExtArgs["result"]["assignment"]>

  export type AssignmentSelectScalar = {
    id?: boolean
    freelancerId?: boolean
    projectId?: boolean
    startDate?: boolean
    endDate?: boolean
    allocation?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type AssignmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "freelancerId" | "projectId" | "startDate" | "endDate" | "allocation" | "status" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["assignment"]>
  export type AssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    freelancer?: boolean | FreelancerDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Assignment$userArgs<ExtArgs>
  }
  export type AssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    freelancer?: boolean | FreelancerDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Assignment$userArgs<ExtArgs>
  }
  export type AssignmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    freelancer?: boolean | FreelancerDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Assignment$userArgs<ExtArgs>
  }

  export type $AssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Assignment"
    objects: {
      freelancer: Prisma.$FreelancerPayload<ExtArgs>
      project: Prisma.$ProjectPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      freelancerId: string
      projectId: string
      startDate: Date | null
      endDate: Date | null
      allocation: number | null
      status: $Enums.AssignmentStatus
      createdAt: Date
      updatedAt: Date
      userId: string | null
    }, ExtArgs["result"]["assignment"]>
    composites: {}
  }

  type AssignmentGetPayload<S extends boolean | null | undefined | AssignmentDefaultArgs> = $Result.GetResult<Prisma.$AssignmentPayload, S>

  type AssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssignmentCountAggregateInputType | true
    }

  export interface AssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Assignment'], meta: { name: 'Assignment' } }
    /**
     * Find zero or one Assignment that matches the filter.
     * @param {AssignmentFindUniqueArgs} args - Arguments to find a Assignment
     * @example
     * // Get one Assignment
     * const assignment = await prisma.assignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssignmentFindUniqueArgs>(args: SelectSubset<T, AssignmentFindUniqueArgs<ExtArgs>>): Prisma__AssignmentClient<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Assignment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssignmentFindUniqueOrThrowArgs} args - Arguments to find a Assignment
     * @example
     * // Get one Assignment
     * const assignment = await prisma.assignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssignmentClient<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Assignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssignmentFindFirstArgs} args - Arguments to find a Assignment
     * @example
     * // Get one Assignment
     * const assignment = await prisma.assignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssignmentFindFirstArgs>(args?: SelectSubset<T, AssignmentFindFirstArgs<ExtArgs>>): Prisma__AssignmentClient<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Assignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssignmentFindFirstOrThrowArgs} args - Arguments to find a Assignment
     * @example
     * // Get one Assignment
     * const assignment = await prisma.assignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssignmentClient<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Assignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assignments
     * const assignments = await prisma.assignment.findMany()
     * 
     * // Get first 10 Assignments
     * const assignments = await prisma.assignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assignmentWithIdOnly = await prisma.assignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssignmentFindManyArgs>(args?: SelectSubset<T, AssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Assignment.
     * @param {AssignmentCreateArgs} args - Arguments to create a Assignment.
     * @example
     * // Create one Assignment
     * const Assignment = await prisma.assignment.create({
     *   data: {
     *     // ... data to create a Assignment
     *   }
     * })
     * 
     */
    create<T extends AssignmentCreateArgs>(args: SelectSubset<T, AssignmentCreateArgs<ExtArgs>>): Prisma__AssignmentClient<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Assignments.
     * @param {AssignmentCreateManyArgs} args - Arguments to create many Assignments.
     * @example
     * // Create many Assignments
     * const assignment = await prisma.assignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssignmentCreateManyArgs>(args?: SelectSubset<T, AssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Assignments and returns the data saved in the database.
     * @param {AssignmentCreateManyAndReturnArgs} args - Arguments to create many Assignments.
     * @example
     * // Create many Assignments
     * const assignment = await prisma.assignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Assignments and only return the `id`
     * const assignmentWithIdOnly = await prisma.assignment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Assignment.
     * @param {AssignmentDeleteArgs} args - Arguments to delete one Assignment.
     * @example
     * // Delete one Assignment
     * const Assignment = await prisma.assignment.delete({
     *   where: {
     *     // ... filter to delete one Assignment
     *   }
     * })
     * 
     */
    delete<T extends AssignmentDeleteArgs>(args: SelectSubset<T, AssignmentDeleteArgs<ExtArgs>>): Prisma__AssignmentClient<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Assignment.
     * @param {AssignmentUpdateArgs} args - Arguments to update one Assignment.
     * @example
     * // Update one Assignment
     * const assignment = await prisma.assignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssignmentUpdateArgs>(args: SelectSubset<T, AssignmentUpdateArgs<ExtArgs>>): Prisma__AssignmentClient<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Assignments.
     * @param {AssignmentDeleteManyArgs} args - Arguments to filter Assignments to delete.
     * @example
     * // Delete a few Assignments
     * const { count } = await prisma.assignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssignmentDeleteManyArgs>(args?: SelectSubset<T, AssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assignments
     * const assignment = await prisma.assignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssignmentUpdateManyArgs>(args: SelectSubset<T, AssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assignments and returns the data updated in the database.
     * @param {AssignmentUpdateManyAndReturnArgs} args - Arguments to update many Assignments.
     * @example
     * // Update many Assignments
     * const assignment = await prisma.assignment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Assignments and only return the `id`
     * const assignmentWithIdOnly = await prisma.assignment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AssignmentUpdateManyAndReturnArgs>(args: SelectSubset<T, AssignmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Assignment.
     * @param {AssignmentUpsertArgs} args - Arguments to update or create a Assignment.
     * @example
     * // Update or create a Assignment
     * const assignment = await prisma.assignment.upsert({
     *   create: {
     *     // ... data to create a Assignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Assignment we want to update
     *   }
     * })
     */
    upsert<T extends AssignmentUpsertArgs>(args: SelectSubset<T, AssignmentUpsertArgs<ExtArgs>>): Prisma__AssignmentClient<$Result.GetResult<Prisma.$AssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Assignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssignmentCountArgs} args - Arguments to filter Assignments to count.
     * @example
     * // Count the number of Assignments
     * const count = await prisma.assignment.count({
     *   where: {
     *     // ... the filter for the Assignments we want to count
     *   }
     * })
    **/
    count<T extends AssignmentCountArgs>(
      args?: Subset<T, AssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Assignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssignmentAggregateArgs>(args: Subset<T, AssignmentAggregateArgs>): Prisma.PrismaPromise<GetAssignmentAggregateType<T>>

    /**
     * Group by Assignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssignmentGroupByArgs['orderBy'] }
        : { orderBy?: AssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Assignment model
   */
  readonly fields: AssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Assignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    freelancer<T extends FreelancerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FreelancerDefaultArgs<ExtArgs>>): Prisma__FreelancerClient<$Result.GetResult<Prisma.$FreelancerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends Assignment$userArgs<ExtArgs> = {}>(args?: Subset<T, Assignment$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Assignment model
   */
  interface AssignmentFieldRefs {
    readonly id: FieldRef<"Assignment", 'String'>
    readonly freelancerId: FieldRef<"Assignment", 'String'>
    readonly projectId: FieldRef<"Assignment", 'String'>
    readonly startDate: FieldRef<"Assignment", 'DateTime'>
    readonly endDate: FieldRef<"Assignment", 'DateTime'>
    readonly allocation: FieldRef<"Assignment", 'Float'>
    readonly status: FieldRef<"Assignment", 'AssignmentStatus'>
    readonly createdAt: FieldRef<"Assignment", 'DateTime'>
    readonly updatedAt: FieldRef<"Assignment", 'DateTime'>
    readonly userId: FieldRef<"Assignment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Assignment findUnique
   */
  export type AssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    /**
     * Filter, which Assignment to fetch.
     */
    where: AssignmentWhereUniqueInput
  }

  /**
   * Assignment findUniqueOrThrow
   */
  export type AssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    /**
     * Filter, which Assignment to fetch.
     */
    where: AssignmentWhereUniqueInput
  }

  /**
   * Assignment findFirst
   */
  export type AssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    /**
     * Filter, which Assignment to fetch.
     */
    where?: AssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assignments to fetch.
     */
    orderBy?: AssignmentOrderByWithRelationInput | AssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assignments.
     */
    cursor?: AssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assignments.
     */
    distinct?: AssignmentScalarFieldEnum | AssignmentScalarFieldEnum[]
  }

  /**
   * Assignment findFirstOrThrow
   */
  export type AssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    /**
     * Filter, which Assignment to fetch.
     */
    where?: AssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assignments to fetch.
     */
    orderBy?: AssignmentOrderByWithRelationInput | AssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assignments.
     */
    cursor?: AssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assignments.
     */
    distinct?: AssignmentScalarFieldEnum | AssignmentScalarFieldEnum[]
  }

  /**
   * Assignment findMany
   */
  export type AssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    /**
     * Filter, which Assignments to fetch.
     */
    where?: AssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assignments to fetch.
     */
    orderBy?: AssignmentOrderByWithRelationInput | AssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Assignments.
     */
    cursor?: AssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assignments.
     */
    skip?: number
    distinct?: AssignmentScalarFieldEnum | AssignmentScalarFieldEnum[]
  }

  /**
   * Assignment create
   */
  export type AssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Assignment.
     */
    data: XOR<AssignmentCreateInput, AssignmentUncheckedCreateInput>
  }

  /**
   * Assignment createMany
   */
  export type AssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Assignments.
     */
    data: AssignmentCreateManyInput | AssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Assignment createManyAndReturn
   */
  export type AssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * The data used to create many Assignments.
     */
    data: AssignmentCreateManyInput | AssignmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Assignment update
   */
  export type AssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Assignment.
     */
    data: XOR<AssignmentUpdateInput, AssignmentUncheckedUpdateInput>
    /**
     * Choose, which Assignment to update.
     */
    where: AssignmentWhereUniqueInput
  }

  /**
   * Assignment updateMany
   */
  export type AssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Assignments.
     */
    data: XOR<AssignmentUpdateManyMutationInput, AssignmentUncheckedUpdateManyInput>
    /**
     * Filter which Assignments to update
     */
    where?: AssignmentWhereInput
    /**
     * Limit how many Assignments to update.
     */
    limit?: number
  }

  /**
   * Assignment updateManyAndReturn
   */
  export type AssignmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * The data used to update Assignments.
     */
    data: XOR<AssignmentUpdateManyMutationInput, AssignmentUncheckedUpdateManyInput>
    /**
     * Filter which Assignments to update
     */
    where?: AssignmentWhereInput
    /**
     * Limit how many Assignments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Assignment upsert
   */
  export type AssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Assignment to update in case it exists.
     */
    where: AssignmentWhereUniqueInput
    /**
     * In case the Assignment found by the `where` argument doesn't exist, create a new Assignment with this data.
     */
    create: XOR<AssignmentCreateInput, AssignmentUncheckedCreateInput>
    /**
     * In case the Assignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssignmentUpdateInput, AssignmentUncheckedUpdateInput>
  }

  /**
   * Assignment delete
   */
  export type AssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
    /**
     * Filter which Assignment to delete.
     */
    where: AssignmentWhereUniqueInput
  }

  /**
   * Assignment deleteMany
   */
  export type AssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assignments to delete
     */
    where?: AssignmentWhereInput
    /**
     * Limit how many Assignments to delete.
     */
    limit?: number
  }

  /**
   * Assignment.user
   */
  export type Assignment$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Assignment without action
   */
  export type AssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Assignment
     */
    select?: AssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Assignment
     */
    omit?: AssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssignmentInclude<ExtArgs> | null
  }


  /**
   * Model MoodboardItem
   */

  export type AggregateMoodboardItem = {
    _count: MoodboardItemCountAggregateOutputType | null
    _min: MoodboardItemMinAggregateOutputType | null
    _max: MoodboardItemMaxAggregateOutputType | null
  }

  export type MoodboardItemMinAggregateOutputType = {
    id: string | null
    url: string | null
    title: string | null
    description: string | null
    shotType: string | null
    source: string | null
    isFavorite: boolean | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MoodboardItemMaxAggregateOutputType = {
    id: string | null
    url: string | null
    title: string | null
    description: string | null
    shotType: string | null
    source: string | null
    isFavorite: boolean | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MoodboardItemCountAggregateOutputType = {
    id: number
    url: number
    title: number
    description: number
    tags: number
    moods: number
    colors: number
    shotType: number
    source: number
    metadata: number
    isFavorite: number
    projectId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MoodboardItemMinAggregateInputType = {
    id?: true
    url?: true
    title?: true
    description?: true
    shotType?: true
    source?: true
    isFavorite?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MoodboardItemMaxAggregateInputType = {
    id?: true
    url?: true
    title?: true
    description?: true
    shotType?: true
    source?: true
    isFavorite?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MoodboardItemCountAggregateInputType = {
    id?: true
    url?: true
    title?: true
    description?: true
    tags?: true
    moods?: true
    colors?: true
    shotType?: true
    source?: true
    metadata?: true
    isFavorite?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MoodboardItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MoodboardItem to aggregate.
     */
    where?: MoodboardItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardItems to fetch.
     */
    orderBy?: MoodboardItemOrderByWithRelationInput | MoodboardItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MoodboardItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MoodboardItems
    **/
    _count?: true | MoodboardItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MoodboardItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MoodboardItemMaxAggregateInputType
  }

  export type GetMoodboardItemAggregateType<T extends MoodboardItemAggregateArgs> = {
        [P in keyof T & keyof AggregateMoodboardItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMoodboardItem[P]>
      : GetScalarType<T[P], AggregateMoodboardItem[P]>
  }




  export type MoodboardItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MoodboardItemWhereInput
    orderBy?: MoodboardItemOrderByWithAggregationInput | MoodboardItemOrderByWithAggregationInput[]
    by: MoodboardItemScalarFieldEnum[] | MoodboardItemScalarFieldEnum
    having?: MoodboardItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MoodboardItemCountAggregateInputType | true
    _min?: MoodboardItemMinAggregateInputType
    _max?: MoodboardItemMaxAggregateInputType
  }

  export type MoodboardItemGroupByOutputType = {
    id: string
    url: string
    title: string | null
    description: string | null
    tags: string[]
    moods: string[]
    colors: string[]
    shotType: string | null
    source: string
    metadata: JsonValue | null
    isFavorite: boolean
    projectId: string
    createdAt: Date
    updatedAt: Date
    _count: MoodboardItemCountAggregateOutputType | null
    _min: MoodboardItemMinAggregateOutputType | null
    _max: MoodboardItemMaxAggregateOutputType | null
  }

  type GetMoodboardItemGroupByPayload<T extends MoodboardItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MoodboardItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MoodboardItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MoodboardItemGroupByOutputType[P]>
            : GetScalarType<T[P], MoodboardItemGroupByOutputType[P]>
        }
      >
    >


  export type MoodboardItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    tags?: boolean
    moods?: boolean
    colors?: boolean
    shotType?: boolean
    source?: boolean
    metadata?: boolean
    isFavorite?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    collections?: boolean | MoodboardItem$collectionsArgs<ExtArgs>
    _count?: boolean | MoodboardItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moodboardItem"]>

  export type MoodboardItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    tags?: boolean
    moods?: boolean
    colors?: boolean
    shotType?: boolean
    source?: boolean
    metadata?: boolean
    isFavorite?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moodboardItem"]>

  export type MoodboardItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    tags?: boolean
    moods?: boolean
    colors?: boolean
    shotType?: boolean
    source?: boolean
    metadata?: boolean
    isFavorite?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moodboardItem"]>

  export type MoodboardItemSelectScalar = {
    id?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    tags?: boolean
    moods?: boolean
    colors?: boolean
    shotType?: boolean
    source?: boolean
    metadata?: boolean
    isFavorite?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MoodboardItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "title" | "description" | "tags" | "moods" | "colors" | "shotType" | "source" | "metadata" | "isFavorite" | "projectId" | "createdAt" | "updatedAt", ExtArgs["result"]["moodboardItem"]>
  export type MoodboardItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    collections?: boolean | MoodboardItem$collectionsArgs<ExtArgs>
    _count?: boolean | MoodboardItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MoodboardItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type MoodboardItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $MoodboardItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MoodboardItem"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      collections: Prisma.$MoodboardCollectionItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      title: string | null
      description: string | null
      tags: string[]
      moods: string[]
      colors: string[]
      shotType: string | null
      source: string
      metadata: Prisma.JsonValue | null
      isFavorite: boolean
      projectId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["moodboardItem"]>
    composites: {}
  }

  type MoodboardItemGetPayload<S extends boolean | null | undefined | MoodboardItemDefaultArgs> = $Result.GetResult<Prisma.$MoodboardItemPayload, S>

  type MoodboardItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MoodboardItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MoodboardItemCountAggregateInputType | true
    }

  export interface MoodboardItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MoodboardItem'], meta: { name: 'MoodboardItem' } }
    /**
     * Find zero or one MoodboardItem that matches the filter.
     * @param {MoodboardItemFindUniqueArgs} args - Arguments to find a MoodboardItem
     * @example
     * // Get one MoodboardItem
     * const moodboardItem = await prisma.moodboardItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MoodboardItemFindUniqueArgs>(args: SelectSubset<T, MoodboardItemFindUniqueArgs<ExtArgs>>): Prisma__MoodboardItemClient<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MoodboardItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MoodboardItemFindUniqueOrThrowArgs} args - Arguments to find a MoodboardItem
     * @example
     * // Get one MoodboardItem
     * const moodboardItem = await prisma.moodboardItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MoodboardItemFindUniqueOrThrowArgs>(args: SelectSubset<T, MoodboardItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MoodboardItemClient<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MoodboardItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardItemFindFirstArgs} args - Arguments to find a MoodboardItem
     * @example
     * // Get one MoodboardItem
     * const moodboardItem = await prisma.moodboardItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MoodboardItemFindFirstArgs>(args?: SelectSubset<T, MoodboardItemFindFirstArgs<ExtArgs>>): Prisma__MoodboardItemClient<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MoodboardItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardItemFindFirstOrThrowArgs} args - Arguments to find a MoodboardItem
     * @example
     * // Get one MoodboardItem
     * const moodboardItem = await prisma.moodboardItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MoodboardItemFindFirstOrThrowArgs>(args?: SelectSubset<T, MoodboardItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__MoodboardItemClient<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MoodboardItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MoodboardItems
     * const moodboardItems = await prisma.moodboardItem.findMany()
     * 
     * // Get first 10 MoodboardItems
     * const moodboardItems = await prisma.moodboardItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moodboardItemWithIdOnly = await prisma.moodboardItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MoodboardItemFindManyArgs>(args?: SelectSubset<T, MoodboardItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MoodboardItem.
     * @param {MoodboardItemCreateArgs} args - Arguments to create a MoodboardItem.
     * @example
     * // Create one MoodboardItem
     * const MoodboardItem = await prisma.moodboardItem.create({
     *   data: {
     *     // ... data to create a MoodboardItem
     *   }
     * })
     * 
     */
    create<T extends MoodboardItemCreateArgs>(args: SelectSubset<T, MoodboardItemCreateArgs<ExtArgs>>): Prisma__MoodboardItemClient<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MoodboardItems.
     * @param {MoodboardItemCreateManyArgs} args - Arguments to create many MoodboardItems.
     * @example
     * // Create many MoodboardItems
     * const moodboardItem = await prisma.moodboardItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MoodboardItemCreateManyArgs>(args?: SelectSubset<T, MoodboardItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MoodboardItems and returns the data saved in the database.
     * @param {MoodboardItemCreateManyAndReturnArgs} args - Arguments to create many MoodboardItems.
     * @example
     * // Create many MoodboardItems
     * const moodboardItem = await prisma.moodboardItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MoodboardItems and only return the `id`
     * const moodboardItemWithIdOnly = await prisma.moodboardItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MoodboardItemCreateManyAndReturnArgs>(args?: SelectSubset<T, MoodboardItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MoodboardItem.
     * @param {MoodboardItemDeleteArgs} args - Arguments to delete one MoodboardItem.
     * @example
     * // Delete one MoodboardItem
     * const MoodboardItem = await prisma.moodboardItem.delete({
     *   where: {
     *     // ... filter to delete one MoodboardItem
     *   }
     * })
     * 
     */
    delete<T extends MoodboardItemDeleteArgs>(args: SelectSubset<T, MoodboardItemDeleteArgs<ExtArgs>>): Prisma__MoodboardItemClient<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MoodboardItem.
     * @param {MoodboardItemUpdateArgs} args - Arguments to update one MoodboardItem.
     * @example
     * // Update one MoodboardItem
     * const moodboardItem = await prisma.moodboardItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MoodboardItemUpdateArgs>(args: SelectSubset<T, MoodboardItemUpdateArgs<ExtArgs>>): Prisma__MoodboardItemClient<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MoodboardItems.
     * @param {MoodboardItemDeleteManyArgs} args - Arguments to filter MoodboardItems to delete.
     * @example
     * // Delete a few MoodboardItems
     * const { count } = await prisma.moodboardItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MoodboardItemDeleteManyArgs>(args?: SelectSubset<T, MoodboardItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MoodboardItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MoodboardItems
     * const moodboardItem = await prisma.moodboardItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MoodboardItemUpdateManyArgs>(args: SelectSubset<T, MoodboardItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MoodboardItems and returns the data updated in the database.
     * @param {MoodboardItemUpdateManyAndReturnArgs} args - Arguments to update many MoodboardItems.
     * @example
     * // Update many MoodboardItems
     * const moodboardItem = await prisma.moodboardItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MoodboardItems and only return the `id`
     * const moodboardItemWithIdOnly = await prisma.moodboardItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MoodboardItemUpdateManyAndReturnArgs>(args: SelectSubset<T, MoodboardItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MoodboardItem.
     * @param {MoodboardItemUpsertArgs} args - Arguments to update or create a MoodboardItem.
     * @example
     * // Update or create a MoodboardItem
     * const moodboardItem = await prisma.moodboardItem.upsert({
     *   create: {
     *     // ... data to create a MoodboardItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MoodboardItem we want to update
     *   }
     * })
     */
    upsert<T extends MoodboardItemUpsertArgs>(args: SelectSubset<T, MoodboardItemUpsertArgs<ExtArgs>>): Prisma__MoodboardItemClient<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MoodboardItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardItemCountArgs} args - Arguments to filter MoodboardItems to count.
     * @example
     * // Count the number of MoodboardItems
     * const count = await prisma.moodboardItem.count({
     *   where: {
     *     // ... the filter for the MoodboardItems we want to count
     *   }
     * })
    **/
    count<T extends MoodboardItemCountArgs>(
      args?: Subset<T, MoodboardItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MoodboardItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MoodboardItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MoodboardItemAggregateArgs>(args: Subset<T, MoodboardItemAggregateArgs>): Prisma.PrismaPromise<GetMoodboardItemAggregateType<T>>

    /**
     * Group by MoodboardItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MoodboardItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MoodboardItemGroupByArgs['orderBy'] }
        : { orderBy?: MoodboardItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MoodboardItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMoodboardItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MoodboardItem model
   */
  readonly fields: MoodboardItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MoodboardItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MoodboardItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    collections<T extends MoodboardItem$collectionsArgs<ExtArgs> = {}>(args?: Subset<T, MoodboardItem$collectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MoodboardItem model
   */
  interface MoodboardItemFieldRefs {
    readonly id: FieldRef<"MoodboardItem", 'String'>
    readonly url: FieldRef<"MoodboardItem", 'String'>
    readonly title: FieldRef<"MoodboardItem", 'String'>
    readonly description: FieldRef<"MoodboardItem", 'String'>
    readonly tags: FieldRef<"MoodboardItem", 'String[]'>
    readonly moods: FieldRef<"MoodboardItem", 'String[]'>
    readonly colors: FieldRef<"MoodboardItem", 'String[]'>
    readonly shotType: FieldRef<"MoodboardItem", 'String'>
    readonly source: FieldRef<"MoodboardItem", 'String'>
    readonly metadata: FieldRef<"MoodboardItem", 'Json'>
    readonly isFavorite: FieldRef<"MoodboardItem", 'Boolean'>
    readonly projectId: FieldRef<"MoodboardItem", 'String'>
    readonly createdAt: FieldRef<"MoodboardItem", 'DateTime'>
    readonly updatedAt: FieldRef<"MoodboardItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MoodboardItem findUnique
   */
  export type MoodboardItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardItem to fetch.
     */
    where: MoodboardItemWhereUniqueInput
  }

  /**
   * MoodboardItem findUniqueOrThrow
   */
  export type MoodboardItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardItem to fetch.
     */
    where: MoodboardItemWhereUniqueInput
  }

  /**
   * MoodboardItem findFirst
   */
  export type MoodboardItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardItem to fetch.
     */
    where?: MoodboardItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardItems to fetch.
     */
    orderBy?: MoodboardItemOrderByWithRelationInput | MoodboardItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MoodboardItems.
     */
    cursor?: MoodboardItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MoodboardItems.
     */
    distinct?: MoodboardItemScalarFieldEnum | MoodboardItemScalarFieldEnum[]
  }

  /**
   * MoodboardItem findFirstOrThrow
   */
  export type MoodboardItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardItem to fetch.
     */
    where?: MoodboardItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardItems to fetch.
     */
    orderBy?: MoodboardItemOrderByWithRelationInput | MoodboardItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MoodboardItems.
     */
    cursor?: MoodboardItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MoodboardItems.
     */
    distinct?: MoodboardItemScalarFieldEnum | MoodboardItemScalarFieldEnum[]
  }

  /**
   * MoodboardItem findMany
   */
  export type MoodboardItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardItems to fetch.
     */
    where?: MoodboardItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardItems to fetch.
     */
    orderBy?: MoodboardItemOrderByWithRelationInput | MoodboardItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MoodboardItems.
     */
    cursor?: MoodboardItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardItems.
     */
    skip?: number
    distinct?: MoodboardItemScalarFieldEnum | MoodboardItemScalarFieldEnum[]
  }

  /**
   * MoodboardItem create
   */
  export type MoodboardItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
    /**
     * The data needed to create a MoodboardItem.
     */
    data: XOR<MoodboardItemCreateInput, MoodboardItemUncheckedCreateInput>
  }

  /**
   * MoodboardItem createMany
   */
  export type MoodboardItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MoodboardItems.
     */
    data: MoodboardItemCreateManyInput | MoodboardItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MoodboardItem createManyAndReturn
   */
  export type MoodboardItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * The data used to create many MoodboardItems.
     */
    data: MoodboardItemCreateManyInput | MoodboardItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MoodboardItem update
   */
  export type MoodboardItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
    /**
     * The data needed to update a MoodboardItem.
     */
    data: XOR<MoodboardItemUpdateInput, MoodboardItemUncheckedUpdateInput>
    /**
     * Choose, which MoodboardItem to update.
     */
    where: MoodboardItemWhereUniqueInput
  }

  /**
   * MoodboardItem updateMany
   */
  export type MoodboardItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MoodboardItems.
     */
    data: XOR<MoodboardItemUpdateManyMutationInput, MoodboardItemUncheckedUpdateManyInput>
    /**
     * Filter which MoodboardItems to update
     */
    where?: MoodboardItemWhereInput
    /**
     * Limit how many MoodboardItems to update.
     */
    limit?: number
  }

  /**
   * MoodboardItem updateManyAndReturn
   */
  export type MoodboardItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * The data used to update MoodboardItems.
     */
    data: XOR<MoodboardItemUpdateManyMutationInput, MoodboardItemUncheckedUpdateManyInput>
    /**
     * Filter which MoodboardItems to update
     */
    where?: MoodboardItemWhereInput
    /**
     * Limit how many MoodboardItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MoodboardItem upsert
   */
  export type MoodboardItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
    /**
     * The filter to search for the MoodboardItem to update in case it exists.
     */
    where: MoodboardItemWhereUniqueInput
    /**
     * In case the MoodboardItem found by the `where` argument doesn't exist, create a new MoodboardItem with this data.
     */
    create: XOR<MoodboardItemCreateInput, MoodboardItemUncheckedCreateInput>
    /**
     * In case the MoodboardItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MoodboardItemUpdateInput, MoodboardItemUncheckedUpdateInput>
  }

  /**
   * MoodboardItem delete
   */
  export type MoodboardItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
    /**
     * Filter which MoodboardItem to delete.
     */
    where: MoodboardItemWhereUniqueInput
  }

  /**
   * MoodboardItem deleteMany
   */
  export type MoodboardItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MoodboardItems to delete
     */
    where?: MoodboardItemWhereInput
    /**
     * Limit how many MoodboardItems to delete.
     */
    limit?: number
  }

  /**
   * MoodboardItem.collections
   */
  export type MoodboardItem$collectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    where?: MoodboardCollectionItemWhereInput
    orderBy?: MoodboardCollectionItemOrderByWithRelationInput | MoodboardCollectionItemOrderByWithRelationInput[]
    cursor?: MoodboardCollectionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MoodboardCollectionItemScalarFieldEnum | MoodboardCollectionItemScalarFieldEnum[]
  }

  /**
   * MoodboardItem without action
   */
  export type MoodboardItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardItem
     */
    select?: MoodboardItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardItem
     */
    omit?: MoodboardItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardItemInclude<ExtArgs> | null
  }


  /**
   * Model MoodboardCollection
   */

  export type AggregateMoodboardCollection = {
    _count: MoodboardCollectionCountAggregateOutputType | null
    _min: MoodboardCollectionMinAggregateOutputType | null
    _max: MoodboardCollectionMaxAggregateOutputType | null
  }

  export type MoodboardCollectionMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MoodboardCollectionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MoodboardCollectionCountAggregateOutputType = {
    id: number
    name: number
    description: number
    projectId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MoodboardCollectionMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MoodboardCollectionMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MoodboardCollectionCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MoodboardCollectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MoodboardCollection to aggregate.
     */
    where?: MoodboardCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardCollections to fetch.
     */
    orderBy?: MoodboardCollectionOrderByWithRelationInput | MoodboardCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MoodboardCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MoodboardCollections
    **/
    _count?: true | MoodboardCollectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MoodboardCollectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MoodboardCollectionMaxAggregateInputType
  }

  export type GetMoodboardCollectionAggregateType<T extends MoodboardCollectionAggregateArgs> = {
        [P in keyof T & keyof AggregateMoodboardCollection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMoodboardCollection[P]>
      : GetScalarType<T[P], AggregateMoodboardCollection[P]>
  }




  export type MoodboardCollectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MoodboardCollectionWhereInput
    orderBy?: MoodboardCollectionOrderByWithAggregationInput | MoodboardCollectionOrderByWithAggregationInput[]
    by: MoodboardCollectionScalarFieldEnum[] | MoodboardCollectionScalarFieldEnum
    having?: MoodboardCollectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MoodboardCollectionCountAggregateInputType | true
    _min?: MoodboardCollectionMinAggregateInputType
    _max?: MoodboardCollectionMaxAggregateInputType
  }

  export type MoodboardCollectionGroupByOutputType = {
    id: string
    name: string
    description: string | null
    projectId: string
    createdAt: Date
    updatedAt: Date
    _count: MoodboardCollectionCountAggregateOutputType | null
    _min: MoodboardCollectionMinAggregateOutputType | null
    _max: MoodboardCollectionMaxAggregateOutputType | null
  }

  type GetMoodboardCollectionGroupByPayload<T extends MoodboardCollectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MoodboardCollectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MoodboardCollectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MoodboardCollectionGroupByOutputType[P]>
            : GetScalarType<T[P], MoodboardCollectionGroupByOutputType[P]>
        }
      >
    >


  export type MoodboardCollectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | MoodboardCollection$itemsArgs<ExtArgs>
    _count?: boolean | MoodboardCollectionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moodboardCollection"]>

  export type MoodboardCollectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["moodboardCollection"]>

  export type MoodboardCollectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["moodboardCollection"]>

  export type MoodboardCollectionSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MoodboardCollectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "projectId" | "createdAt" | "updatedAt", ExtArgs["result"]["moodboardCollection"]>
  export type MoodboardCollectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | MoodboardCollection$itemsArgs<ExtArgs>
    _count?: boolean | MoodboardCollectionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MoodboardCollectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MoodboardCollectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MoodboardCollectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MoodboardCollection"
    objects: {
      items: Prisma.$MoodboardCollectionItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      projectId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["moodboardCollection"]>
    composites: {}
  }

  type MoodboardCollectionGetPayload<S extends boolean | null | undefined | MoodboardCollectionDefaultArgs> = $Result.GetResult<Prisma.$MoodboardCollectionPayload, S>

  type MoodboardCollectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MoodboardCollectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MoodboardCollectionCountAggregateInputType | true
    }

  export interface MoodboardCollectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MoodboardCollection'], meta: { name: 'MoodboardCollection' } }
    /**
     * Find zero or one MoodboardCollection that matches the filter.
     * @param {MoodboardCollectionFindUniqueArgs} args - Arguments to find a MoodboardCollection
     * @example
     * // Get one MoodboardCollection
     * const moodboardCollection = await prisma.moodboardCollection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MoodboardCollectionFindUniqueArgs>(args: SelectSubset<T, MoodboardCollectionFindUniqueArgs<ExtArgs>>): Prisma__MoodboardCollectionClient<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MoodboardCollection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MoodboardCollectionFindUniqueOrThrowArgs} args - Arguments to find a MoodboardCollection
     * @example
     * // Get one MoodboardCollection
     * const moodboardCollection = await prisma.moodboardCollection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MoodboardCollectionFindUniqueOrThrowArgs>(args: SelectSubset<T, MoodboardCollectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MoodboardCollectionClient<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MoodboardCollection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionFindFirstArgs} args - Arguments to find a MoodboardCollection
     * @example
     * // Get one MoodboardCollection
     * const moodboardCollection = await prisma.moodboardCollection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MoodboardCollectionFindFirstArgs>(args?: SelectSubset<T, MoodboardCollectionFindFirstArgs<ExtArgs>>): Prisma__MoodboardCollectionClient<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MoodboardCollection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionFindFirstOrThrowArgs} args - Arguments to find a MoodboardCollection
     * @example
     * // Get one MoodboardCollection
     * const moodboardCollection = await prisma.moodboardCollection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MoodboardCollectionFindFirstOrThrowArgs>(args?: SelectSubset<T, MoodboardCollectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__MoodboardCollectionClient<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MoodboardCollections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MoodboardCollections
     * const moodboardCollections = await prisma.moodboardCollection.findMany()
     * 
     * // Get first 10 MoodboardCollections
     * const moodboardCollections = await prisma.moodboardCollection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moodboardCollectionWithIdOnly = await prisma.moodboardCollection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MoodboardCollectionFindManyArgs>(args?: SelectSubset<T, MoodboardCollectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MoodboardCollection.
     * @param {MoodboardCollectionCreateArgs} args - Arguments to create a MoodboardCollection.
     * @example
     * // Create one MoodboardCollection
     * const MoodboardCollection = await prisma.moodboardCollection.create({
     *   data: {
     *     // ... data to create a MoodboardCollection
     *   }
     * })
     * 
     */
    create<T extends MoodboardCollectionCreateArgs>(args: SelectSubset<T, MoodboardCollectionCreateArgs<ExtArgs>>): Prisma__MoodboardCollectionClient<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MoodboardCollections.
     * @param {MoodboardCollectionCreateManyArgs} args - Arguments to create many MoodboardCollections.
     * @example
     * // Create many MoodboardCollections
     * const moodboardCollection = await prisma.moodboardCollection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MoodboardCollectionCreateManyArgs>(args?: SelectSubset<T, MoodboardCollectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MoodboardCollections and returns the data saved in the database.
     * @param {MoodboardCollectionCreateManyAndReturnArgs} args - Arguments to create many MoodboardCollections.
     * @example
     * // Create many MoodboardCollections
     * const moodboardCollection = await prisma.moodboardCollection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MoodboardCollections and only return the `id`
     * const moodboardCollectionWithIdOnly = await prisma.moodboardCollection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MoodboardCollectionCreateManyAndReturnArgs>(args?: SelectSubset<T, MoodboardCollectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MoodboardCollection.
     * @param {MoodboardCollectionDeleteArgs} args - Arguments to delete one MoodboardCollection.
     * @example
     * // Delete one MoodboardCollection
     * const MoodboardCollection = await prisma.moodboardCollection.delete({
     *   where: {
     *     // ... filter to delete one MoodboardCollection
     *   }
     * })
     * 
     */
    delete<T extends MoodboardCollectionDeleteArgs>(args: SelectSubset<T, MoodboardCollectionDeleteArgs<ExtArgs>>): Prisma__MoodboardCollectionClient<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MoodboardCollection.
     * @param {MoodboardCollectionUpdateArgs} args - Arguments to update one MoodboardCollection.
     * @example
     * // Update one MoodboardCollection
     * const moodboardCollection = await prisma.moodboardCollection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MoodboardCollectionUpdateArgs>(args: SelectSubset<T, MoodboardCollectionUpdateArgs<ExtArgs>>): Prisma__MoodboardCollectionClient<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MoodboardCollections.
     * @param {MoodboardCollectionDeleteManyArgs} args - Arguments to filter MoodboardCollections to delete.
     * @example
     * // Delete a few MoodboardCollections
     * const { count } = await prisma.moodboardCollection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MoodboardCollectionDeleteManyArgs>(args?: SelectSubset<T, MoodboardCollectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MoodboardCollections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MoodboardCollections
     * const moodboardCollection = await prisma.moodboardCollection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MoodboardCollectionUpdateManyArgs>(args: SelectSubset<T, MoodboardCollectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MoodboardCollections and returns the data updated in the database.
     * @param {MoodboardCollectionUpdateManyAndReturnArgs} args - Arguments to update many MoodboardCollections.
     * @example
     * // Update many MoodboardCollections
     * const moodboardCollection = await prisma.moodboardCollection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MoodboardCollections and only return the `id`
     * const moodboardCollectionWithIdOnly = await prisma.moodboardCollection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MoodboardCollectionUpdateManyAndReturnArgs>(args: SelectSubset<T, MoodboardCollectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MoodboardCollection.
     * @param {MoodboardCollectionUpsertArgs} args - Arguments to update or create a MoodboardCollection.
     * @example
     * // Update or create a MoodboardCollection
     * const moodboardCollection = await prisma.moodboardCollection.upsert({
     *   create: {
     *     // ... data to create a MoodboardCollection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MoodboardCollection we want to update
     *   }
     * })
     */
    upsert<T extends MoodboardCollectionUpsertArgs>(args: SelectSubset<T, MoodboardCollectionUpsertArgs<ExtArgs>>): Prisma__MoodboardCollectionClient<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MoodboardCollections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionCountArgs} args - Arguments to filter MoodboardCollections to count.
     * @example
     * // Count the number of MoodboardCollections
     * const count = await prisma.moodboardCollection.count({
     *   where: {
     *     // ... the filter for the MoodboardCollections we want to count
     *   }
     * })
    **/
    count<T extends MoodboardCollectionCountArgs>(
      args?: Subset<T, MoodboardCollectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MoodboardCollectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MoodboardCollection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MoodboardCollectionAggregateArgs>(args: Subset<T, MoodboardCollectionAggregateArgs>): Prisma.PrismaPromise<GetMoodboardCollectionAggregateType<T>>

    /**
     * Group by MoodboardCollection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MoodboardCollectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MoodboardCollectionGroupByArgs['orderBy'] }
        : { orderBy?: MoodboardCollectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MoodboardCollectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMoodboardCollectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MoodboardCollection model
   */
  readonly fields: MoodboardCollectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MoodboardCollection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MoodboardCollectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends MoodboardCollection$itemsArgs<ExtArgs> = {}>(args?: Subset<T, MoodboardCollection$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MoodboardCollection model
   */
  interface MoodboardCollectionFieldRefs {
    readonly id: FieldRef<"MoodboardCollection", 'String'>
    readonly name: FieldRef<"MoodboardCollection", 'String'>
    readonly description: FieldRef<"MoodboardCollection", 'String'>
    readonly projectId: FieldRef<"MoodboardCollection", 'String'>
    readonly createdAt: FieldRef<"MoodboardCollection", 'DateTime'>
    readonly updatedAt: FieldRef<"MoodboardCollection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MoodboardCollection findUnique
   */
  export type MoodboardCollectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardCollection to fetch.
     */
    where: MoodboardCollectionWhereUniqueInput
  }

  /**
   * MoodboardCollection findUniqueOrThrow
   */
  export type MoodboardCollectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardCollection to fetch.
     */
    where: MoodboardCollectionWhereUniqueInput
  }

  /**
   * MoodboardCollection findFirst
   */
  export type MoodboardCollectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardCollection to fetch.
     */
    where?: MoodboardCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardCollections to fetch.
     */
    orderBy?: MoodboardCollectionOrderByWithRelationInput | MoodboardCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MoodboardCollections.
     */
    cursor?: MoodboardCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MoodboardCollections.
     */
    distinct?: MoodboardCollectionScalarFieldEnum | MoodboardCollectionScalarFieldEnum[]
  }

  /**
   * MoodboardCollection findFirstOrThrow
   */
  export type MoodboardCollectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardCollection to fetch.
     */
    where?: MoodboardCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardCollections to fetch.
     */
    orderBy?: MoodboardCollectionOrderByWithRelationInput | MoodboardCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MoodboardCollections.
     */
    cursor?: MoodboardCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MoodboardCollections.
     */
    distinct?: MoodboardCollectionScalarFieldEnum | MoodboardCollectionScalarFieldEnum[]
  }

  /**
   * MoodboardCollection findMany
   */
  export type MoodboardCollectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardCollections to fetch.
     */
    where?: MoodboardCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardCollections to fetch.
     */
    orderBy?: MoodboardCollectionOrderByWithRelationInput | MoodboardCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MoodboardCollections.
     */
    cursor?: MoodboardCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardCollections.
     */
    skip?: number
    distinct?: MoodboardCollectionScalarFieldEnum | MoodboardCollectionScalarFieldEnum[]
  }

  /**
   * MoodboardCollection create
   */
  export type MoodboardCollectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionInclude<ExtArgs> | null
    /**
     * The data needed to create a MoodboardCollection.
     */
    data: XOR<MoodboardCollectionCreateInput, MoodboardCollectionUncheckedCreateInput>
  }

  /**
   * MoodboardCollection createMany
   */
  export type MoodboardCollectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MoodboardCollections.
     */
    data: MoodboardCollectionCreateManyInput | MoodboardCollectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MoodboardCollection createManyAndReturn
   */
  export type MoodboardCollectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * The data used to create many MoodboardCollections.
     */
    data: MoodboardCollectionCreateManyInput | MoodboardCollectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MoodboardCollection update
   */
  export type MoodboardCollectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionInclude<ExtArgs> | null
    /**
     * The data needed to update a MoodboardCollection.
     */
    data: XOR<MoodboardCollectionUpdateInput, MoodboardCollectionUncheckedUpdateInput>
    /**
     * Choose, which MoodboardCollection to update.
     */
    where: MoodboardCollectionWhereUniqueInput
  }

  /**
   * MoodboardCollection updateMany
   */
  export type MoodboardCollectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MoodboardCollections.
     */
    data: XOR<MoodboardCollectionUpdateManyMutationInput, MoodboardCollectionUncheckedUpdateManyInput>
    /**
     * Filter which MoodboardCollections to update
     */
    where?: MoodboardCollectionWhereInput
    /**
     * Limit how many MoodboardCollections to update.
     */
    limit?: number
  }

  /**
   * MoodboardCollection updateManyAndReturn
   */
  export type MoodboardCollectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * The data used to update MoodboardCollections.
     */
    data: XOR<MoodboardCollectionUpdateManyMutationInput, MoodboardCollectionUncheckedUpdateManyInput>
    /**
     * Filter which MoodboardCollections to update
     */
    where?: MoodboardCollectionWhereInput
    /**
     * Limit how many MoodboardCollections to update.
     */
    limit?: number
  }

  /**
   * MoodboardCollection upsert
   */
  export type MoodboardCollectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionInclude<ExtArgs> | null
    /**
     * The filter to search for the MoodboardCollection to update in case it exists.
     */
    where: MoodboardCollectionWhereUniqueInput
    /**
     * In case the MoodboardCollection found by the `where` argument doesn't exist, create a new MoodboardCollection with this data.
     */
    create: XOR<MoodboardCollectionCreateInput, MoodboardCollectionUncheckedCreateInput>
    /**
     * In case the MoodboardCollection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MoodboardCollectionUpdateInput, MoodboardCollectionUncheckedUpdateInput>
  }

  /**
   * MoodboardCollection delete
   */
  export type MoodboardCollectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionInclude<ExtArgs> | null
    /**
     * Filter which MoodboardCollection to delete.
     */
    where: MoodboardCollectionWhereUniqueInput
  }

  /**
   * MoodboardCollection deleteMany
   */
  export type MoodboardCollectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MoodboardCollections to delete
     */
    where?: MoodboardCollectionWhereInput
    /**
     * Limit how many MoodboardCollections to delete.
     */
    limit?: number
  }

  /**
   * MoodboardCollection.items
   */
  export type MoodboardCollection$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    where?: MoodboardCollectionItemWhereInput
    orderBy?: MoodboardCollectionItemOrderByWithRelationInput | MoodboardCollectionItemOrderByWithRelationInput[]
    cursor?: MoodboardCollectionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MoodboardCollectionItemScalarFieldEnum | MoodboardCollectionItemScalarFieldEnum[]
  }

  /**
   * MoodboardCollection without action
   */
  export type MoodboardCollectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollection
     */
    select?: MoodboardCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollection
     */
    omit?: MoodboardCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionInclude<ExtArgs> | null
  }


  /**
   * Model MoodboardCollectionItem
   */

  export type AggregateMoodboardCollectionItem = {
    _count: MoodboardCollectionItemCountAggregateOutputType | null
    _min: MoodboardCollectionItemMinAggregateOutputType | null
    _max: MoodboardCollectionItemMaxAggregateOutputType | null
  }

  export type MoodboardCollectionItemMinAggregateOutputType = {
    id: string | null
    collectionId: string | null
    moodboardItemId: string | null
  }

  export type MoodboardCollectionItemMaxAggregateOutputType = {
    id: string | null
    collectionId: string | null
    moodboardItemId: string | null
  }

  export type MoodboardCollectionItemCountAggregateOutputType = {
    id: number
    collectionId: number
    moodboardItemId: number
    _all: number
  }


  export type MoodboardCollectionItemMinAggregateInputType = {
    id?: true
    collectionId?: true
    moodboardItemId?: true
  }

  export type MoodboardCollectionItemMaxAggregateInputType = {
    id?: true
    collectionId?: true
    moodboardItemId?: true
  }

  export type MoodboardCollectionItemCountAggregateInputType = {
    id?: true
    collectionId?: true
    moodboardItemId?: true
    _all?: true
  }

  export type MoodboardCollectionItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MoodboardCollectionItem to aggregate.
     */
    where?: MoodboardCollectionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardCollectionItems to fetch.
     */
    orderBy?: MoodboardCollectionItemOrderByWithRelationInput | MoodboardCollectionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MoodboardCollectionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardCollectionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardCollectionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MoodboardCollectionItems
    **/
    _count?: true | MoodboardCollectionItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MoodboardCollectionItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MoodboardCollectionItemMaxAggregateInputType
  }

  export type GetMoodboardCollectionItemAggregateType<T extends MoodboardCollectionItemAggregateArgs> = {
        [P in keyof T & keyof AggregateMoodboardCollectionItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMoodboardCollectionItem[P]>
      : GetScalarType<T[P], AggregateMoodboardCollectionItem[P]>
  }




  export type MoodboardCollectionItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MoodboardCollectionItemWhereInput
    orderBy?: MoodboardCollectionItemOrderByWithAggregationInput | MoodboardCollectionItemOrderByWithAggregationInput[]
    by: MoodboardCollectionItemScalarFieldEnum[] | MoodboardCollectionItemScalarFieldEnum
    having?: MoodboardCollectionItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MoodboardCollectionItemCountAggregateInputType | true
    _min?: MoodboardCollectionItemMinAggregateInputType
    _max?: MoodboardCollectionItemMaxAggregateInputType
  }

  export type MoodboardCollectionItemGroupByOutputType = {
    id: string
    collectionId: string
    moodboardItemId: string
    _count: MoodboardCollectionItemCountAggregateOutputType | null
    _min: MoodboardCollectionItemMinAggregateOutputType | null
    _max: MoodboardCollectionItemMaxAggregateOutputType | null
  }

  type GetMoodboardCollectionItemGroupByPayload<T extends MoodboardCollectionItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MoodboardCollectionItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MoodboardCollectionItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MoodboardCollectionItemGroupByOutputType[P]>
            : GetScalarType<T[P], MoodboardCollectionItemGroupByOutputType[P]>
        }
      >
    >


  export type MoodboardCollectionItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    collectionId?: boolean
    moodboardItemId?: boolean
    collection?: boolean | MoodboardCollectionDefaultArgs<ExtArgs>
    item?: boolean | MoodboardItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moodboardCollectionItem"]>

  export type MoodboardCollectionItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    collectionId?: boolean
    moodboardItemId?: boolean
    collection?: boolean | MoodboardCollectionDefaultArgs<ExtArgs>
    item?: boolean | MoodboardItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moodboardCollectionItem"]>

  export type MoodboardCollectionItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    collectionId?: boolean
    moodboardItemId?: boolean
    collection?: boolean | MoodboardCollectionDefaultArgs<ExtArgs>
    item?: boolean | MoodboardItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moodboardCollectionItem"]>

  export type MoodboardCollectionItemSelectScalar = {
    id?: boolean
    collectionId?: boolean
    moodboardItemId?: boolean
  }

  export type MoodboardCollectionItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "collectionId" | "moodboardItemId", ExtArgs["result"]["moodboardCollectionItem"]>
  export type MoodboardCollectionItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | MoodboardCollectionDefaultArgs<ExtArgs>
    item?: boolean | MoodboardItemDefaultArgs<ExtArgs>
  }
  export type MoodboardCollectionItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | MoodboardCollectionDefaultArgs<ExtArgs>
    item?: boolean | MoodboardItemDefaultArgs<ExtArgs>
  }
  export type MoodboardCollectionItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | MoodboardCollectionDefaultArgs<ExtArgs>
    item?: boolean | MoodboardItemDefaultArgs<ExtArgs>
  }

  export type $MoodboardCollectionItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MoodboardCollectionItem"
    objects: {
      collection: Prisma.$MoodboardCollectionPayload<ExtArgs>
      item: Prisma.$MoodboardItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      collectionId: string
      moodboardItemId: string
    }, ExtArgs["result"]["moodboardCollectionItem"]>
    composites: {}
  }

  type MoodboardCollectionItemGetPayload<S extends boolean | null | undefined | MoodboardCollectionItemDefaultArgs> = $Result.GetResult<Prisma.$MoodboardCollectionItemPayload, S>

  type MoodboardCollectionItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MoodboardCollectionItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MoodboardCollectionItemCountAggregateInputType | true
    }

  export interface MoodboardCollectionItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MoodboardCollectionItem'], meta: { name: 'MoodboardCollectionItem' } }
    /**
     * Find zero or one MoodboardCollectionItem that matches the filter.
     * @param {MoodboardCollectionItemFindUniqueArgs} args - Arguments to find a MoodboardCollectionItem
     * @example
     * // Get one MoodboardCollectionItem
     * const moodboardCollectionItem = await prisma.moodboardCollectionItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MoodboardCollectionItemFindUniqueArgs>(args: SelectSubset<T, MoodboardCollectionItemFindUniqueArgs<ExtArgs>>): Prisma__MoodboardCollectionItemClient<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MoodboardCollectionItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MoodboardCollectionItemFindUniqueOrThrowArgs} args - Arguments to find a MoodboardCollectionItem
     * @example
     * // Get one MoodboardCollectionItem
     * const moodboardCollectionItem = await prisma.moodboardCollectionItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MoodboardCollectionItemFindUniqueOrThrowArgs>(args: SelectSubset<T, MoodboardCollectionItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MoodboardCollectionItemClient<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MoodboardCollectionItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionItemFindFirstArgs} args - Arguments to find a MoodboardCollectionItem
     * @example
     * // Get one MoodboardCollectionItem
     * const moodboardCollectionItem = await prisma.moodboardCollectionItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MoodboardCollectionItemFindFirstArgs>(args?: SelectSubset<T, MoodboardCollectionItemFindFirstArgs<ExtArgs>>): Prisma__MoodboardCollectionItemClient<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MoodboardCollectionItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionItemFindFirstOrThrowArgs} args - Arguments to find a MoodboardCollectionItem
     * @example
     * // Get one MoodboardCollectionItem
     * const moodboardCollectionItem = await prisma.moodboardCollectionItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MoodboardCollectionItemFindFirstOrThrowArgs>(args?: SelectSubset<T, MoodboardCollectionItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__MoodboardCollectionItemClient<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MoodboardCollectionItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MoodboardCollectionItems
     * const moodboardCollectionItems = await prisma.moodboardCollectionItem.findMany()
     * 
     * // Get first 10 MoodboardCollectionItems
     * const moodboardCollectionItems = await prisma.moodboardCollectionItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moodboardCollectionItemWithIdOnly = await prisma.moodboardCollectionItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MoodboardCollectionItemFindManyArgs>(args?: SelectSubset<T, MoodboardCollectionItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MoodboardCollectionItem.
     * @param {MoodboardCollectionItemCreateArgs} args - Arguments to create a MoodboardCollectionItem.
     * @example
     * // Create one MoodboardCollectionItem
     * const MoodboardCollectionItem = await prisma.moodboardCollectionItem.create({
     *   data: {
     *     // ... data to create a MoodboardCollectionItem
     *   }
     * })
     * 
     */
    create<T extends MoodboardCollectionItemCreateArgs>(args: SelectSubset<T, MoodboardCollectionItemCreateArgs<ExtArgs>>): Prisma__MoodboardCollectionItemClient<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MoodboardCollectionItems.
     * @param {MoodboardCollectionItemCreateManyArgs} args - Arguments to create many MoodboardCollectionItems.
     * @example
     * // Create many MoodboardCollectionItems
     * const moodboardCollectionItem = await prisma.moodboardCollectionItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MoodboardCollectionItemCreateManyArgs>(args?: SelectSubset<T, MoodboardCollectionItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MoodboardCollectionItems and returns the data saved in the database.
     * @param {MoodboardCollectionItemCreateManyAndReturnArgs} args - Arguments to create many MoodboardCollectionItems.
     * @example
     * // Create many MoodboardCollectionItems
     * const moodboardCollectionItem = await prisma.moodboardCollectionItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MoodboardCollectionItems and only return the `id`
     * const moodboardCollectionItemWithIdOnly = await prisma.moodboardCollectionItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MoodboardCollectionItemCreateManyAndReturnArgs>(args?: SelectSubset<T, MoodboardCollectionItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MoodboardCollectionItem.
     * @param {MoodboardCollectionItemDeleteArgs} args - Arguments to delete one MoodboardCollectionItem.
     * @example
     * // Delete one MoodboardCollectionItem
     * const MoodboardCollectionItem = await prisma.moodboardCollectionItem.delete({
     *   where: {
     *     // ... filter to delete one MoodboardCollectionItem
     *   }
     * })
     * 
     */
    delete<T extends MoodboardCollectionItemDeleteArgs>(args: SelectSubset<T, MoodboardCollectionItemDeleteArgs<ExtArgs>>): Prisma__MoodboardCollectionItemClient<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MoodboardCollectionItem.
     * @param {MoodboardCollectionItemUpdateArgs} args - Arguments to update one MoodboardCollectionItem.
     * @example
     * // Update one MoodboardCollectionItem
     * const moodboardCollectionItem = await prisma.moodboardCollectionItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MoodboardCollectionItemUpdateArgs>(args: SelectSubset<T, MoodboardCollectionItemUpdateArgs<ExtArgs>>): Prisma__MoodboardCollectionItemClient<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MoodboardCollectionItems.
     * @param {MoodboardCollectionItemDeleteManyArgs} args - Arguments to filter MoodboardCollectionItems to delete.
     * @example
     * // Delete a few MoodboardCollectionItems
     * const { count } = await prisma.moodboardCollectionItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MoodboardCollectionItemDeleteManyArgs>(args?: SelectSubset<T, MoodboardCollectionItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MoodboardCollectionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MoodboardCollectionItems
     * const moodboardCollectionItem = await prisma.moodboardCollectionItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MoodboardCollectionItemUpdateManyArgs>(args: SelectSubset<T, MoodboardCollectionItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MoodboardCollectionItems and returns the data updated in the database.
     * @param {MoodboardCollectionItemUpdateManyAndReturnArgs} args - Arguments to update many MoodboardCollectionItems.
     * @example
     * // Update many MoodboardCollectionItems
     * const moodboardCollectionItem = await prisma.moodboardCollectionItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MoodboardCollectionItems and only return the `id`
     * const moodboardCollectionItemWithIdOnly = await prisma.moodboardCollectionItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MoodboardCollectionItemUpdateManyAndReturnArgs>(args: SelectSubset<T, MoodboardCollectionItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MoodboardCollectionItem.
     * @param {MoodboardCollectionItemUpsertArgs} args - Arguments to update or create a MoodboardCollectionItem.
     * @example
     * // Update or create a MoodboardCollectionItem
     * const moodboardCollectionItem = await prisma.moodboardCollectionItem.upsert({
     *   create: {
     *     // ... data to create a MoodboardCollectionItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MoodboardCollectionItem we want to update
     *   }
     * })
     */
    upsert<T extends MoodboardCollectionItemUpsertArgs>(args: SelectSubset<T, MoodboardCollectionItemUpsertArgs<ExtArgs>>): Prisma__MoodboardCollectionItemClient<$Result.GetResult<Prisma.$MoodboardCollectionItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MoodboardCollectionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionItemCountArgs} args - Arguments to filter MoodboardCollectionItems to count.
     * @example
     * // Count the number of MoodboardCollectionItems
     * const count = await prisma.moodboardCollectionItem.count({
     *   where: {
     *     // ... the filter for the MoodboardCollectionItems we want to count
     *   }
     * })
    **/
    count<T extends MoodboardCollectionItemCountArgs>(
      args?: Subset<T, MoodboardCollectionItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MoodboardCollectionItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MoodboardCollectionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MoodboardCollectionItemAggregateArgs>(args: Subset<T, MoodboardCollectionItemAggregateArgs>): Prisma.PrismaPromise<GetMoodboardCollectionItemAggregateType<T>>

    /**
     * Group by MoodboardCollectionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MoodboardCollectionItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MoodboardCollectionItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MoodboardCollectionItemGroupByArgs['orderBy'] }
        : { orderBy?: MoodboardCollectionItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MoodboardCollectionItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMoodboardCollectionItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MoodboardCollectionItem model
   */
  readonly fields: MoodboardCollectionItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MoodboardCollectionItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MoodboardCollectionItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    collection<T extends MoodboardCollectionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MoodboardCollectionDefaultArgs<ExtArgs>>): Prisma__MoodboardCollectionClient<$Result.GetResult<Prisma.$MoodboardCollectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    item<T extends MoodboardItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MoodboardItemDefaultArgs<ExtArgs>>): Prisma__MoodboardItemClient<$Result.GetResult<Prisma.$MoodboardItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MoodboardCollectionItem model
   */
  interface MoodboardCollectionItemFieldRefs {
    readonly id: FieldRef<"MoodboardCollectionItem", 'String'>
    readonly collectionId: FieldRef<"MoodboardCollectionItem", 'String'>
    readonly moodboardItemId: FieldRef<"MoodboardCollectionItem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * MoodboardCollectionItem findUnique
   */
  export type MoodboardCollectionItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardCollectionItem to fetch.
     */
    where: MoodboardCollectionItemWhereUniqueInput
  }

  /**
   * MoodboardCollectionItem findUniqueOrThrow
   */
  export type MoodboardCollectionItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardCollectionItem to fetch.
     */
    where: MoodboardCollectionItemWhereUniqueInput
  }

  /**
   * MoodboardCollectionItem findFirst
   */
  export type MoodboardCollectionItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardCollectionItem to fetch.
     */
    where?: MoodboardCollectionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardCollectionItems to fetch.
     */
    orderBy?: MoodboardCollectionItemOrderByWithRelationInput | MoodboardCollectionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MoodboardCollectionItems.
     */
    cursor?: MoodboardCollectionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardCollectionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardCollectionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MoodboardCollectionItems.
     */
    distinct?: MoodboardCollectionItemScalarFieldEnum | MoodboardCollectionItemScalarFieldEnum[]
  }

  /**
   * MoodboardCollectionItem findFirstOrThrow
   */
  export type MoodboardCollectionItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardCollectionItem to fetch.
     */
    where?: MoodboardCollectionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardCollectionItems to fetch.
     */
    orderBy?: MoodboardCollectionItemOrderByWithRelationInput | MoodboardCollectionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MoodboardCollectionItems.
     */
    cursor?: MoodboardCollectionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardCollectionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardCollectionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MoodboardCollectionItems.
     */
    distinct?: MoodboardCollectionItemScalarFieldEnum | MoodboardCollectionItemScalarFieldEnum[]
  }

  /**
   * MoodboardCollectionItem findMany
   */
  export type MoodboardCollectionItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    /**
     * Filter, which MoodboardCollectionItems to fetch.
     */
    where?: MoodboardCollectionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MoodboardCollectionItems to fetch.
     */
    orderBy?: MoodboardCollectionItemOrderByWithRelationInput | MoodboardCollectionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MoodboardCollectionItems.
     */
    cursor?: MoodboardCollectionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MoodboardCollectionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MoodboardCollectionItems.
     */
    skip?: number
    distinct?: MoodboardCollectionItemScalarFieldEnum | MoodboardCollectionItemScalarFieldEnum[]
  }

  /**
   * MoodboardCollectionItem create
   */
  export type MoodboardCollectionItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    /**
     * The data needed to create a MoodboardCollectionItem.
     */
    data: XOR<MoodboardCollectionItemCreateInput, MoodboardCollectionItemUncheckedCreateInput>
  }

  /**
   * MoodboardCollectionItem createMany
   */
  export type MoodboardCollectionItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MoodboardCollectionItems.
     */
    data: MoodboardCollectionItemCreateManyInput | MoodboardCollectionItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MoodboardCollectionItem createManyAndReturn
   */
  export type MoodboardCollectionItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * The data used to create many MoodboardCollectionItems.
     */
    data: MoodboardCollectionItemCreateManyInput | MoodboardCollectionItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MoodboardCollectionItem update
   */
  export type MoodboardCollectionItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    /**
     * The data needed to update a MoodboardCollectionItem.
     */
    data: XOR<MoodboardCollectionItemUpdateInput, MoodboardCollectionItemUncheckedUpdateInput>
    /**
     * Choose, which MoodboardCollectionItem to update.
     */
    where: MoodboardCollectionItemWhereUniqueInput
  }

  /**
   * MoodboardCollectionItem updateMany
   */
  export type MoodboardCollectionItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MoodboardCollectionItems.
     */
    data: XOR<MoodboardCollectionItemUpdateManyMutationInput, MoodboardCollectionItemUncheckedUpdateManyInput>
    /**
     * Filter which MoodboardCollectionItems to update
     */
    where?: MoodboardCollectionItemWhereInput
    /**
     * Limit how many MoodboardCollectionItems to update.
     */
    limit?: number
  }

  /**
   * MoodboardCollectionItem updateManyAndReturn
   */
  export type MoodboardCollectionItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * The data used to update MoodboardCollectionItems.
     */
    data: XOR<MoodboardCollectionItemUpdateManyMutationInput, MoodboardCollectionItemUncheckedUpdateManyInput>
    /**
     * Filter which MoodboardCollectionItems to update
     */
    where?: MoodboardCollectionItemWhereInput
    /**
     * Limit how many MoodboardCollectionItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MoodboardCollectionItem upsert
   */
  export type MoodboardCollectionItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    /**
     * The filter to search for the MoodboardCollectionItem to update in case it exists.
     */
    where: MoodboardCollectionItemWhereUniqueInput
    /**
     * In case the MoodboardCollectionItem found by the `where` argument doesn't exist, create a new MoodboardCollectionItem with this data.
     */
    create: XOR<MoodboardCollectionItemCreateInput, MoodboardCollectionItemUncheckedCreateInput>
    /**
     * In case the MoodboardCollectionItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MoodboardCollectionItemUpdateInput, MoodboardCollectionItemUncheckedUpdateInput>
  }

  /**
   * MoodboardCollectionItem delete
   */
  export type MoodboardCollectionItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
    /**
     * Filter which MoodboardCollectionItem to delete.
     */
    where: MoodboardCollectionItemWhereUniqueInput
  }

  /**
   * MoodboardCollectionItem deleteMany
   */
  export type MoodboardCollectionItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MoodboardCollectionItems to delete
     */
    where?: MoodboardCollectionItemWhereInput
    /**
     * Limit how many MoodboardCollectionItems to delete.
     */
    limit?: number
  }

  /**
   * MoodboardCollectionItem without action
   */
  export type MoodboardCollectionItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MoodboardCollectionItem
     */
    select?: MoodboardCollectionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MoodboardCollectionItem
     */
    omit?: MoodboardCollectionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MoodboardCollectionItemInclude<ExtArgs> | null
  }


  /**
   * Model Script
   */

  export type AggregateScript = {
    _count: ScriptCountAggregateOutputType | null
    _min: ScriptMinAggregateOutputType | null
    _max: ScriptMaxAggregateOutputType | null
  }

  export type ScriptMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    projectId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScriptMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    projectId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScriptCountAggregateOutputType = {
    id: number
    title: number
    content: number
    tags: number
    projectId: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ScriptMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    projectId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScriptMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    projectId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScriptCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    tags?: true
    projectId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ScriptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Script to aggregate.
     */
    where?: ScriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scripts to fetch.
     */
    orderBy?: ScriptOrderByWithRelationInput | ScriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Scripts
    **/
    _count?: true | ScriptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScriptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScriptMaxAggregateInputType
  }

  export type GetScriptAggregateType<T extends ScriptAggregateArgs> = {
        [P in keyof T & keyof AggregateScript]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScript[P]>
      : GetScalarType<T[P], AggregateScript[P]>
  }




  export type ScriptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScriptWhereInput
    orderBy?: ScriptOrderByWithAggregationInput | ScriptOrderByWithAggregationInput[]
    by: ScriptScalarFieldEnum[] | ScriptScalarFieldEnum
    having?: ScriptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScriptCountAggregateInputType | true
    _min?: ScriptMinAggregateInputType
    _max?: ScriptMaxAggregateInputType
  }

  export type ScriptGroupByOutputType = {
    id: string
    title: string | null
    content: string | null
    tags: string[]
    projectId: string
    userId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ScriptCountAggregateOutputType | null
    _min: ScriptMinAggregateOutputType | null
    _max: ScriptMaxAggregateOutputType | null
  }

  type GetScriptGroupByPayload<T extends ScriptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScriptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScriptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScriptGroupByOutputType[P]>
            : GetScalarType<T[P], ScriptGroupByOutputType[P]>
        }
      >
    >


  export type ScriptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    tags?: boolean
    projectId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Script$userArgs<ExtArgs>
  }, ExtArgs["result"]["script"]>

  export type ScriptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    tags?: boolean
    projectId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Script$userArgs<ExtArgs>
  }, ExtArgs["result"]["script"]>

  export type ScriptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    tags?: boolean
    projectId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Script$userArgs<ExtArgs>
  }, ExtArgs["result"]["script"]>

  export type ScriptSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    tags?: boolean
    projectId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ScriptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "tags" | "projectId" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["script"]>
  export type ScriptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Script$userArgs<ExtArgs>
  }
  export type ScriptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Script$userArgs<ExtArgs>
  }
  export type ScriptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | Script$userArgs<ExtArgs>
  }

  export type $ScriptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Script"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      content: string | null
      tags: string[]
      projectId: string
      userId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["script"]>
    composites: {}
  }

  type ScriptGetPayload<S extends boolean | null | undefined | ScriptDefaultArgs> = $Result.GetResult<Prisma.$ScriptPayload, S>

  type ScriptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScriptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScriptCountAggregateInputType | true
    }

  export interface ScriptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Script'], meta: { name: 'Script' } }
    /**
     * Find zero or one Script that matches the filter.
     * @param {ScriptFindUniqueArgs} args - Arguments to find a Script
     * @example
     * // Get one Script
     * const script = await prisma.script.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScriptFindUniqueArgs>(args: SelectSubset<T, ScriptFindUniqueArgs<ExtArgs>>): Prisma__ScriptClient<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Script that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScriptFindUniqueOrThrowArgs} args - Arguments to find a Script
     * @example
     * // Get one Script
     * const script = await prisma.script.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScriptFindUniqueOrThrowArgs>(args: SelectSubset<T, ScriptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScriptClient<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Script that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScriptFindFirstArgs} args - Arguments to find a Script
     * @example
     * // Get one Script
     * const script = await prisma.script.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScriptFindFirstArgs>(args?: SelectSubset<T, ScriptFindFirstArgs<ExtArgs>>): Prisma__ScriptClient<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Script that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScriptFindFirstOrThrowArgs} args - Arguments to find a Script
     * @example
     * // Get one Script
     * const script = await prisma.script.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScriptFindFirstOrThrowArgs>(args?: SelectSubset<T, ScriptFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScriptClient<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Scripts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScriptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Scripts
     * const scripts = await prisma.script.findMany()
     * 
     * // Get first 10 Scripts
     * const scripts = await prisma.script.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scriptWithIdOnly = await prisma.script.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScriptFindManyArgs>(args?: SelectSubset<T, ScriptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Script.
     * @param {ScriptCreateArgs} args - Arguments to create a Script.
     * @example
     * // Create one Script
     * const Script = await prisma.script.create({
     *   data: {
     *     // ... data to create a Script
     *   }
     * })
     * 
     */
    create<T extends ScriptCreateArgs>(args: SelectSubset<T, ScriptCreateArgs<ExtArgs>>): Prisma__ScriptClient<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Scripts.
     * @param {ScriptCreateManyArgs} args - Arguments to create many Scripts.
     * @example
     * // Create many Scripts
     * const script = await prisma.script.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScriptCreateManyArgs>(args?: SelectSubset<T, ScriptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Scripts and returns the data saved in the database.
     * @param {ScriptCreateManyAndReturnArgs} args - Arguments to create many Scripts.
     * @example
     * // Create many Scripts
     * const script = await prisma.script.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Scripts and only return the `id`
     * const scriptWithIdOnly = await prisma.script.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScriptCreateManyAndReturnArgs>(args?: SelectSubset<T, ScriptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Script.
     * @param {ScriptDeleteArgs} args - Arguments to delete one Script.
     * @example
     * // Delete one Script
     * const Script = await prisma.script.delete({
     *   where: {
     *     // ... filter to delete one Script
     *   }
     * })
     * 
     */
    delete<T extends ScriptDeleteArgs>(args: SelectSubset<T, ScriptDeleteArgs<ExtArgs>>): Prisma__ScriptClient<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Script.
     * @param {ScriptUpdateArgs} args - Arguments to update one Script.
     * @example
     * // Update one Script
     * const script = await prisma.script.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScriptUpdateArgs>(args: SelectSubset<T, ScriptUpdateArgs<ExtArgs>>): Prisma__ScriptClient<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Scripts.
     * @param {ScriptDeleteManyArgs} args - Arguments to filter Scripts to delete.
     * @example
     * // Delete a few Scripts
     * const { count } = await prisma.script.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScriptDeleteManyArgs>(args?: SelectSubset<T, ScriptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Scripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScriptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Scripts
     * const script = await prisma.script.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScriptUpdateManyArgs>(args: SelectSubset<T, ScriptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Scripts and returns the data updated in the database.
     * @param {ScriptUpdateManyAndReturnArgs} args - Arguments to update many Scripts.
     * @example
     * // Update many Scripts
     * const script = await prisma.script.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Scripts and only return the `id`
     * const scriptWithIdOnly = await prisma.script.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ScriptUpdateManyAndReturnArgs>(args: SelectSubset<T, ScriptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Script.
     * @param {ScriptUpsertArgs} args - Arguments to update or create a Script.
     * @example
     * // Update or create a Script
     * const script = await prisma.script.upsert({
     *   create: {
     *     // ... data to create a Script
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Script we want to update
     *   }
     * })
     */
    upsert<T extends ScriptUpsertArgs>(args: SelectSubset<T, ScriptUpsertArgs<ExtArgs>>): Prisma__ScriptClient<$Result.GetResult<Prisma.$ScriptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Scripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScriptCountArgs} args - Arguments to filter Scripts to count.
     * @example
     * // Count the number of Scripts
     * const count = await prisma.script.count({
     *   where: {
     *     // ... the filter for the Scripts we want to count
     *   }
     * })
    **/
    count<T extends ScriptCountArgs>(
      args?: Subset<T, ScriptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScriptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Script.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScriptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScriptAggregateArgs>(args: Subset<T, ScriptAggregateArgs>): Prisma.PrismaPromise<GetScriptAggregateType<T>>

    /**
     * Group by Script.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScriptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScriptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScriptGroupByArgs['orderBy'] }
        : { orderBy?: ScriptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScriptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScriptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Script model
   */
  readonly fields: ScriptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Script.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScriptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends Script$userArgs<ExtArgs> = {}>(args?: Subset<T, Script$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Script model
   */
  interface ScriptFieldRefs {
    readonly id: FieldRef<"Script", 'String'>
    readonly title: FieldRef<"Script", 'String'>
    readonly content: FieldRef<"Script", 'String'>
    readonly tags: FieldRef<"Script", 'String[]'>
    readonly projectId: FieldRef<"Script", 'String'>
    readonly userId: FieldRef<"Script", 'String'>
    readonly createdAt: FieldRef<"Script", 'DateTime'>
    readonly updatedAt: FieldRef<"Script", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Script findUnique
   */
  export type ScriptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    /**
     * Filter, which Script to fetch.
     */
    where: ScriptWhereUniqueInput
  }

  /**
   * Script findUniqueOrThrow
   */
  export type ScriptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    /**
     * Filter, which Script to fetch.
     */
    where: ScriptWhereUniqueInput
  }

  /**
   * Script findFirst
   */
  export type ScriptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    /**
     * Filter, which Script to fetch.
     */
    where?: ScriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scripts to fetch.
     */
    orderBy?: ScriptOrderByWithRelationInput | ScriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Scripts.
     */
    cursor?: ScriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Scripts.
     */
    distinct?: ScriptScalarFieldEnum | ScriptScalarFieldEnum[]
  }

  /**
   * Script findFirstOrThrow
   */
  export type ScriptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    /**
     * Filter, which Script to fetch.
     */
    where?: ScriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scripts to fetch.
     */
    orderBy?: ScriptOrderByWithRelationInput | ScriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Scripts.
     */
    cursor?: ScriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Scripts.
     */
    distinct?: ScriptScalarFieldEnum | ScriptScalarFieldEnum[]
  }

  /**
   * Script findMany
   */
  export type ScriptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    /**
     * Filter, which Scripts to fetch.
     */
    where?: ScriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scripts to fetch.
     */
    orderBy?: ScriptOrderByWithRelationInput | ScriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Scripts.
     */
    cursor?: ScriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scripts.
     */
    skip?: number
    distinct?: ScriptScalarFieldEnum | ScriptScalarFieldEnum[]
  }

  /**
   * Script create
   */
  export type ScriptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    /**
     * The data needed to create a Script.
     */
    data: XOR<ScriptCreateInput, ScriptUncheckedCreateInput>
  }

  /**
   * Script createMany
   */
  export type ScriptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Scripts.
     */
    data: ScriptCreateManyInput | ScriptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Script createManyAndReturn
   */
  export type ScriptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * The data used to create many Scripts.
     */
    data: ScriptCreateManyInput | ScriptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Script update
   */
  export type ScriptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    /**
     * The data needed to update a Script.
     */
    data: XOR<ScriptUpdateInput, ScriptUncheckedUpdateInput>
    /**
     * Choose, which Script to update.
     */
    where: ScriptWhereUniqueInput
  }

  /**
   * Script updateMany
   */
  export type ScriptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Scripts.
     */
    data: XOR<ScriptUpdateManyMutationInput, ScriptUncheckedUpdateManyInput>
    /**
     * Filter which Scripts to update
     */
    where?: ScriptWhereInput
    /**
     * Limit how many Scripts to update.
     */
    limit?: number
  }

  /**
   * Script updateManyAndReturn
   */
  export type ScriptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * The data used to update Scripts.
     */
    data: XOR<ScriptUpdateManyMutationInput, ScriptUncheckedUpdateManyInput>
    /**
     * Filter which Scripts to update
     */
    where?: ScriptWhereInput
    /**
     * Limit how many Scripts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Script upsert
   */
  export type ScriptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    /**
     * The filter to search for the Script to update in case it exists.
     */
    where: ScriptWhereUniqueInput
    /**
     * In case the Script found by the `where` argument doesn't exist, create a new Script with this data.
     */
    create: XOR<ScriptCreateInput, ScriptUncheckedCreateInput>
    /**
     * In case the Script was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScriptUpdateInput, ScriptUncheckedUpdateInput>
  }

  /**
   * Script delete
   */
  export type ScriptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
    /**
     * Filter which Script to delete.
     */
    where: ScriptWhereUniqueInput
  }

  /**
   * Script deleteMany
   */
  export type ScriptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Scripts to delete
     */
    where?: ScriptWhereInput
    /**
     * Limit how many Scripts to delete.
     */
    limit?: number
  }

  /**
   * Script.user
   */
  export type Script$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Script without action
   */
  export type ScriptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Script
     */
    select?: ScriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Script
     */
    omit?: ScriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScriptInclude<ExtArgs> | null
  }


  /**
   * Model KnowledgeSource
   */

  export type AggregateKnowledgeSource = {
    _count: KnowledgeSourceCountAggregateOutputType | null
    _min: KnowledgeSourceMinAggregateOutputType | null
    _max: KnowledgeSourceMaxAggregateOutputType | null
  }

  export type KnowledgeSourceMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    category: string | null
    sourceType: string | null
    sourceId: string | null
    projectId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KnowledgeSourceMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    category: string | null
    sourceType: string | null
    sourceId: string | null
    projectId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KnowledgeSourceCountAggregateOutputType = {
    id: number
    title: number
    content: number
    category: number
    sourceType: number
    sourceId: number
    projectId: number
    userId: number
    metadata: number
    embedding: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KnowledgeSourceMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    category?: true
    sourceType?: true
    sourceId?: true
    projectId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KnowledgeSourceMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    category?: true
    sourceType?: true
    sourceId?: true
    projectId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KnowledgeSourceCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    category?: true
    sourceType?: true
    sourceId?: true
    projectId?: true
    userId?: true
    metadata?: true
    embedding?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KnowledgeSourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeSource to aggregate.
     */
    where?: KnowledgeSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeSources to fetch.
     */
    orderBy?: KnowledgeSourceOrderByWithRelationInput | KnowledgeSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KnowledgeSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KnowledgeSources
    **/
    _count?: true | KnowledgeSourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KnowledgeSourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KnowledgeSourceMaxAggregateInputType
  }

  export type GetKnowledgeSourceAggregateType<T extends KnowledgeSourceAggregateArgs> = {
        [P in keyof T & keyof AggregateKnowledgeSource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKnowledgeSource[P]>
      : GetScalarType<T[P], AggregateKnowledgeSource[P]>
  }




  export type KnowledgeSourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KnowledgeSourceWhereInput
    orderBy?: KnowledgeSourceOrderByWithAggregationInput | KnowledgeSourceOrderByWithAggregationInput[]
    by: KnowledgeSourceScalarFieldEnum[] | KnowledgeSourceScalarFieldEnum
    having?: KnowledgeSourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KnowledgeSourceCountAggregateInputType | true
    _min?: KnowledgeSourceMinAggregateInputType
    _max?: KnowledgeSourceMaxAggregateInputType
  }

  export type KnowledgeSourceGroupByOutputType = {
    id: string
    title: string
    content: string
    category: string
    sourceType: string
    sourceId: string | null
    projectId: string | null
    userId: string | null
    metadata: JsonValue | null
    embedding: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: KnowledgeSourceCountAggregateOutputType | null
    _min: KnowledgeSourceMinAggregateOutputType | null
    _max: KnowledgeSourceMaxAggregateOutputType | null
  }

  type GetKnowledgeSourceGroupByPayload<T extends KnowledgeSourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KnowledgeSourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KnowledgeSourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KnowledgeSourceGroupByOutputType[P]>
            : GetScalarType<T[P], KnowledgeSourceGroupByOutputType[P]>
        }
      >
    >


  export type KnowledgeSourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    sourceType?: boolean
    sourceId?: boolean
    projectId?: boolean
    userId?: boolean
    metadata?: boolean
    embedding?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | KnowledgeSource$projectArgs<ExtArgs>
    user?: boolean | KnowledgeSource$userArgs<ExtArgs>
  }, ExtArgs["result"]["knowledgeSource"]>

  export type KnowledgeSourceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    sourceType?: boolean
    sourceId?: boolean
    projectId?: boolean
    userId?: boolean
    metadata?: boolean
    embedding?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | KnowledgeSource$projectArgs<ExtArgs>
    user?: boolean | KnowledgeSource$userArgs<ExtArgs>
  }, ExtArgs["result"]["knowledgeSource"]>

  export type KnowledgeSourceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    sourceType?: boolean
    sourceId?: boolean
    projectId?: boolean
    userId?: boolean
    metadata?: boolean
    embedding?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | KnowledgeSource$projectArgs<ExtArgs>
    user?: boolean | KnowledgeSource$userArgs<ExtArgs>
  }, ExtArgs["result"]["knowledgeSource"]>

  export type KnowledgeSourceSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    category?: boolean
    sourceType?: boolean
    sourceId?: boolean
    projectId?: boolean
    userId?: boolean
    metadata?: boolean
    embedding?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KnowledgeSourceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "category" | "sourceType" | "sourceId" | "projectId" | "userId" | "metadata" | "embedding" | "createdAt" | "updatedAt", ExtArgs["result"]["knowledgeSource"]>
  export type KnowledgeSourceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | KnowledgeSource$projectArgs<ExtArgs>
    user?: boolean | KnowledgeSource$userArgs<ExtArgs>
  }
  export type KnowledgeSourceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | KnowledgeSource$projectArgs<ExtArgs>
    user?: boolean | KnowledgeSource$userArgs<ExtArgs>
  }
  export type KnowledgeSourceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | KnowledgeSource$projectArgs<ExtArgs>
    user?: boolean | KnowledgeSource$userArgs<ExtArgs>
  }

  export type $KnowledgeSourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KnowledgeSource"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      category: string
      sourceType: string
      sourceId: string | null
      projectId: string | null
      userId: string | null
      metadata: Prisma.JsonValue | null
      embedding: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["knowledgeSource"]>
    composites: {}
  }

  type KnowledgeSourceGetPayload<S extends boolean | null | undefined | KnowledgeSourceDefaultArgs> = $Result.GetResult<Prisma.$KnowledgeSourcePayload, S>

  type KnowledgeSourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KnowledgeSourceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KnowledgeSourceCountAggregateInputType | true
    }

  export interface KnowledgeSourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KnowledgeSource'], meta: { name: 'KnowledgeSource' } }
    /**
     * Find zero or one KnowledgeSource that matches the filter.
     * @param {KnowledgeSourceFindUniqueArgs} args - Arguments to find a KnowledgeSource
     * @example
     * // Get one KnowledgeSource
     * const knowledgeSource = await prisma.knowledgeSource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KnowledgeSourceFindUniqueArgs>(args: SelectSubset<T, KnowledgeSourceFindUniqueArgs<ExtArgs>>): Prisma__KnowledgeSourceClient<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KnowledgeSource that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KnowledgeSourceFindUniqueOrThrowArgs} args - Arguments to find a KnowledgeSource
     * @example
     * // Get one KnowledgeSource
     * const knowledgeSource = await prisma.knowledgeSource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KnowledgeSourceFindUniqueOrThrowArgs>(args: SelectSubset<T, KnowledgeSourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KnowledgeSourceClient<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeSource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeSourceFindFirstArgs} args - Arguments to find a KnowledgeSource
     * @example
     * // Get one KnowledgeSource
     * const knowledgeSource = await prisma.knowledgeSource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KnowledgeSourceFindFirstArgs>(args?: SelectSubset<T, KnowledgeSourceFindFirstArgs<ExtArgs>>): Prisma__KnowledgeSourceClient<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeSource that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeSourceFindFirstOrThrowArgs} args - Arguments to find a KnowledgeSource
     * @example
     * // Get one KnowledgeSource
     * const knowledgeSource = await prisma.knowledgeSource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KnowledgeSourceFindFirstOrThrowArgs>(args?: SelectSubset<T, KnowledgeSourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__KnowledgeSourceClient<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KnowledgeSources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeSourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KnowledgeSources
     * const knowledgeSources = await prisma.knowledgeSource.findMany()
     * 
     * // Get first 10 KnowledgeSources
     * const knowledgeSources = await prisma.knowledgeSource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const knowledgeSourceWithIdOnly = await prisma.knowledgeSource.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KnowledgeSourceFindManyArgs>(args?: SelectSubset<T, KnowledgeSourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KnowledgeSource.
     * @param {KnowledgeSourceCreateArgs} args - Arguments to create a KnowledgeSource.
     * @example
     * // Create one KnowledgeSource
     * const KnowledgeSource = await prisma.knowledgeSource.create({
     *   data: {
     *     // ... data to create a KnowledgeSource
     *   }
     * })
     * 
     */
    create<T extends KnowledgeSourceCreateArgs>(args: SelectSubset<T, KnowledgeSourceCreateArgs<ExtArgs>>): Prisma__KnowledgeSourceClient<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KnowledgeSources.
     * @param {KnowledgeSourceCreateManyArgs} args - Arguments to create many KnowledgeSources.
     * @example
     * // Create many KnowledgeSources
     * const knowledgeSource = await prisma.knowledgeSource.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KnowledgeSourceCreateManyArgs>(args?: SelectSubset<T, KnowledgeSourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KnowledgeSources and returns the data saved in the database.
     * @param {KnowledgeSourceCreateManyAndReturnArgs} args - Arguments to create many KnowledgeSources.
     * @example
     * // Create many KnowledgeSources
     * const knowledgeSource = await prisma.knowledgeSource.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KnowledgeSources and only return the `id`
     * const knowledgeSourceWithIdOnly = await prisma.knowledgeSource.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KnowledgeSourceCreateManyAndReturnArgs>(args?: SelectSubset<T, KnowledgeSourceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KnowledgeSource.
     * @param {KnowledgeSourceDeleteArgs} args - Arguments to delete one KnowledgeSource.
     * @example
     * // Delete one KnowledgeSource
     * const KnowledgeSource = await prisma.knowledgeSource.delete({
     *   where: {
     *     // ... filter to delete one KnowledgeSource
     *   }
     * })
     * 
     */
    delete<T extends KnowledgeSourceDeleteArgs>(args: SelectSubset<T, KnowledgeSourceDeleteArgs<ExtArgs>>): Prisma__KnowledgeSourceClient<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KnowledgeSource.
     * @param {KnowledgeSourceUpdateArgs} args - Arguments to update one KnowledgeSource.
     * @example
     * // Update one KnowledgeSource
     * const knowledgeSource = await prisma.knowledgeSource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KnowledgeSourceUpdateArgs>(args: SelectSubset<T, KnowledgeSourceUpdateArgs<ExtArgs>>): Prisma__KnowledgeSourceClient<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KnowledgeSources.
     * @param {KnowledgeSourceDeleteManyArgs} args - Arguments to filter KnowledgeSources to delete.
     * @example
     * // Delete a few KnowledgeSources
     * const { count } = await prisma.knowledgeSource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KnowledgeSourceDeleteManyArgs>(args?: SelectSubset<T, KnowledgeSourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeSources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeSourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KnowledgeSources
     * const knowledgeSource = await prisma.knowledgeSource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KnowledgeSourceUpdateManyArgs>(args: SelectSubset<T, KnowledgeSourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeSources and returns the data updated in the database.
     * @param {KnowledgeSourceUpdateManyAndReturnArgs} args - Arguments to update many KnowledgeSources.
     * @example
     * // Update many KnowledgeSources
     * const knowledgeSource = await prisma.knowledgeSource.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KnowledgeSources and only return the `id`
     * const knowledgeSourceWithIdOnly = await prisma.knowledgeSource.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KnowledgeSourceUpdateManyAndReturnArgs>(args: SelectSubset<T, KnowledgeSourceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KnowledgeSource.
     * @param {KnowledgeSourceUpsertArgs} args - Arguments to update or create a KnowledgeSource.
     * @example
     * // Update or create a KnowledgeSource
     * const knowledgeSource = await prisma.knowledgeSource.upsert({
     *   create: {
     *     // ... data to create a KnowledgeSource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KnowledgeSource we want to update
     *   }
     * })
     */
    upsert<T extends KnowledgeSourceUpsertArgs>(args: SelectSubset<T, KnowledgeSourceUpsertArgs<ExtArgs>>): Prisma__KnowledgeSourceClient<$Result.GetResult<Prisma.$KnowledgeSourcePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KnowledgeSources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeSourceCountArgs} args - Arguments to filter KnowledgeSources to count.
     * @example
     * // Count the number of KnowledgeSources
     * const count = await prisma.knowledgeSource.count({
     *   where: {
     *     // ... the filter for the KnowledgeSources we want to count
     *   }
     * })
    **/
    count<T extends KnowledgeSourceCountArgs>(
      args?: Subset<T, KnowledgeSourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KnowledgeSourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KnowledgeSource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeSourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KnowledgeSourceAggregateArgs>(args: Subset<T, KnowledgeSourceAggregateArgs>): Prisma.PrismaPromise<GetKnowledgeSourceAggregateType<T>>

    /**
     * Group by KnowledgeSource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeSourceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KnowledgeSourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KnowledgeSourceGroupByArgs['orderBy'] }
        : { orderBy?: KnowledgeSourceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KnowledgeSourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKnowledgeSourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KnowledgeSource model
   */
  readonly fields: KnowledgeSourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KnowledgeSource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KnowledgeSourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends KnowledgeSource$projectArgs<ExtArgs> = {}>(args?: Subset<T, KnowledgeSource$projectArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends KnowledgeSource$userArgs<ExtArgs> = {}>(args?: Subset<T, KnowledgeSource$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KnowledgeSource model
   */
  interface KnowledgeSourceFieldRefs {
    readonly id: FieldRef<"KnowledgeSource", 'String'>
    readonly title: FieldRef<"KnowledgeSource", 'String'>
    readonly content: FieldRef<"KnowledgeSource", 'String'>
    readonly category: FieldRef<"KnowledgeSource", 'String'>
    readonly sourceType: FieldRef<"KnowledgeSource", 'String'>
    readonly sourceId: FieldRef<"KnowledgeSource", 'String'>
    readonly projectId: FieldRef<"KnowledgeSource", 'String'>
    readonly userId: FieldRef<"KnowledgeSource", 'String'>
    readonly metadata: FieldRef<"KnowledgeSource", 'Json'>
    readonly embedding: FieldRef<"KnowledgeSource", 'Json'>
    readonly createdAt: FieldRef<"KnowledgeSource", 'DateTime'>
    readonly updatedAt: FieldRef<"KnowledgeSource", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KnowledgeSource findUnique
   */
  export type KnowledgeSourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeSource to fetch.
     */
    where: KnowledgeSourceWhereUniqueInput
  }

  /**
   * KnowledgeSource findUniqueOrThrow
   */
  export type KnowledgeSourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeSource to fetch.
     */
    where: KnowledgeSourceWhereUniqueInput
  }

  /**
   * KnowledgeSource findFirst
   */
  export type KnowledgeSourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeSource to fetch.
     */
    where?: KnowledgeSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeSources to fetch.
     */
    orderBy?: KnowledgeSourceOrderByWithRelationInput | KnowledgeSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeSources.
     */
    cursor?: KnowledgeSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeSources.
     */
    distinct?: KnowledgeSourceScalarFieldEnum | KnowledgeSourceScalarFieldEnum[]
  }

  /**
   * KnowledgeSource findFirstOrThrow
   */
  export type KnowledgeSourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeSource to fetch.
     */
    where?: KnowledgeSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeSources to fetch.
     */
    orderBy?: KnowledgeSourceOrderByWithRelationInput | KnowledgeSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeSources.
     */
    cursor?: KnowledgeSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeSources.
     */
    distinct?: KnowledgeSourceScalarFieldEnum | KnowledgeSourceScalarFieldEnum[]
  }

  /**
   * KnowledgeSource findMany
   */
  export type KnowledgeSourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeSources to fetch.
     */
    where?: KnowledgeSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeSources to fetch.
     */
    orderBy?: KnowledgeSourceOrderByWithRelationInput | KnowledgeSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KnowledgeSources.
     */
    cursor?: KnowledgeSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeSources.
     */
    skip?: number
    distinct?: KnowledgeSourceScalarFieldEnum | KnowledgeSourceScalarFieldEnum[]
  }

  /**
   * KnowledgeSource create
   */
  export type KnowledgeSourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    /**
     * The data needed to create a KnowledgeSource.
     */
    data: XOR<KnowledgeSourceCreateInput, KnowledgeSourceUncheckedCreateInput>
  }

  /**
   * KnowledgeSource createMany
   */
  export type KnowledgeSourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KnowledgeSources.
     */
    data: KnowledgeSourceCreateManyInput | KnowledgeSourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KnowledgeSource createManyAndReturn
   */
  export type KnowledgeSourceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * The data used to create many KnowledgeSources.
     */
    data: KnowledgeSourceCreateManyInput | KnowledgeSourceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KnowledgeSource update
   */
  export type KnowledgeSourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    /**
     * The data needed to update a KnowledgeSource.
     */
    data: XOR<KnowledgeSourceUpdateInput, KnowledgeSourceUncheckedUpdateInput>
    /**
     * Choose, which KnowledgeSource to update.
     */
    where: KnowledgeSourceWhereUniqueInput
  }

  /**
   * KnowledgeSource updateMany
   */
  export type KnowledgeSourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KnowledgeSources.
     */
    data: XOR<KnowledgeSourceUpdateManyMutationInput, KnowledgeSourceUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeSources to update
     */
    where?: KnowledgeSourceWhereInput
    /**
     * Limit how many KnowledgeSources to update.
     */
    limit?: number
  }

  /**
   * KnowledgeSource updateManyAndReturn
   */
  export type KnowledgeSourceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * The data used to update KnowledgeSources.
     */
    data: XOR<KnowledgeSourceUpdateManyMutationInput, KnowledgeSourceUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeSources to update
     */
    where?: KnowledgeSourceWhereInput
    /**
     * Limit how many KnowledgeSources to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KnowledgeSource upsert
   */
  export type KnowledgeSourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    /**
     * The filter to search for the KnowledgeSource to update in case it exists.
     */
    where: KnowledgeSourceWhereUniqueInput
    /**
     * In case the KnowledgeSource found by the `where` argument doesn't exist, create a new KnowledgeSource with this data.
     */
    create: XOR<KnowledgeSourceCreateInput, KnowledgeSourceUncheckedCreateInput>
    /**
     * In case the KnowledgeSource was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KnowledgeSourceUpdateInput, KnowledgeSourceUncheckedUpdateInput>
  }

  /**
   * KnowledgeSource delete
   */
  export type KnowledgeSourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
    /**
     * Filter which KnowledgeSource to delete.
     */
    where: KnowledgeSourceWhereUniqueInput
  }

  /**
   * KnowledgeSource deleteMany
   */
  export type KnowledgeSourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeSources to delete
     */
    where?: KnowledgeSourceWhereInput
    /**
     * Limit how many KnowledgeSources to delete.
     */
    limit?: number
  }

  /**
   * KnowledgeSource.project
   */
  export type KnowledgeSource$projectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
  }

  /**
   * KnowledgeSource.user
   */
  export type KnowledgeSource$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * KnowledgeSource without action
   */
  export type KnowledgeSourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeSource
     */
    select?: KnowledgeSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeSource
     */
    omit?: KnowledgeSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeSourceInclude<ExtArgs> | null
  }


  /**
   * Model Transcript
   */

  export type AggregateTranscript = {
    _count: TranscriptCountAggregateOutputType | null
    _min: TranscriptMinAggregateOutputType | null
    _max: TranscriptMaxAggregateOutputType | null
  }

  export type TranscriptMinAggregateOutputType = {
    id: string | null
    jobId: string | null
    title: string | null
    content: string | null
    sourceUrl: string | null
    status: $Enums.TranscriptStatus | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TranscriptMaxAggregateOutputType = {
    id: string | null
    jobId: string | null
    title: string | null
    content: string | null
    sourceUrl: string | null
    status: $Enums.TranscriptStatus | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TranscriptCountAggregateOutputType = {
    id: number
    jobId: number
    title: number
    content: number
    sourceUrl: number
    status: number
    projectId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TranscriptMinAggregateInputType = {
    id?: true
    jobId?: true
    title?: true
    content?: true
    sourceUrl?: true
    status?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TranscriptMaxAggregateInputType = {
    id?: true
    jobId?: true
    title?: true
    content?: true
    sourceUrl?: true
    status?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TranscriptCountAggregateInputType = {
    id?: true
    jobId?: true
    title?: true
    content?: true
    sourceUrl?: true
    status?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TranscriptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transcript to aggregate.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transcripts
    **/
    _count?: true | TranscriptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranscriptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranscriptMaxAggregateInputType
  }

  export type GetTranscriptAggregateType<T extends TranscriptAggregateArgs> = {
        [P in keyof T & keyof AggregateTranscript]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranscript[P]>
      : GetScalarType<T[P], AggregateTranscript[P]>
  }




  export type TranscriptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptWhereInput
    orderBy?: TranscriptOrderByWithAggregationInput | TranscriptOrderByWithAggregationInput[]
    by: TranscriptScalarFieldEnum[] | TranscriptScalarFieldEnum
    having?: TranscriptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranscriptCountAggregateInputType | true
    _min?: TranscriptMinAggregateInputType
    _max?: TranscriptMaxAggregateInputType
  }

  export type TranscriptGroupByOutputType = {
    id: string
    jobId: string
    title: string | null
    content: string | null
    sourceUrl: string | null
    status: $Enums.TranscriptStatus
    projectId: string | null
    createdAt: Date
    updatedAt: Date
    _count: TranscriptCountAggregateOutputType | null
    _min: TranscriptMinAggregateOutputType | null
    _max: TranscriptMaxAggregateOutputType | null
  }

  type GetTranscriptGroupByPayload<T extends TranscriptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranscriptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranscriptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranscriptGroupByOutputType[P]>
            : GetScalarType<T[P], TranscriptGroupByOutputType[P]>
        }
      >
    >


  export type TranscriptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    title?: boolean
    content?: boolean
    sourceUrl?: boolean
    status?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | Transcript$projectArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    title?: boolean
    content?: boolean
    sourceUrl?: boolean
    status?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | Transcript$projectArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    title?: boolean
    content?: boolean
    sourceUrl?: boolean
    status?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | Transcript$projectArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectScalar = {
    id?: boolean
    jobId?: boolean
    title?: boolean
    content?: boolean
    sourceUrl?: boolean
    status?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TranscriptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "jobId" | "title" | "content" | "sourceUrl" | "status" | "projectId" | "createdAt" | "updatedAt", ExtArgs["result"]["transcript"]>
  export type TranscriptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | Transcript$projectArgs<ExtArgs>
  }
  export type TranscriptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | Transcript$projectArgs<ExtArgs>
  }
  export type TranscriptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | Transcript$projectArgs<ExtArgs>
  }

  export type $TranscriptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transcript"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      jobId: string
      title: string | null
      content: string | null
      sourceUrl: string | null
      status: $Enums.TranscriptStatus
      projectId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transcript"]>
    composites: {}
  }

  type TranscriptGetPayload<S extends boolean | null | undefined | TranscriptDefaultArgs> = $Result.GetResult<Prisma.$TranscriptPayload, S>

  type TranscriptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TranscriptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TranscriptCountAggregateInputType | true
    }

  export interface TranscriptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transcript'], meta: { name: 'Transcript' } }
    /**
     * Find zero or one Transcript that matches the filter.
     * @param {TranscriptFindUniqueArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranscriptFindUniqueArgs>(args: SelectSubset<T, TranscriptFindUniqueArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transcript that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TranscriptFindUniqueOrThrowArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranscriptFindUniqueOrThrowArgs>(args: SelectSubset<T, TranscriptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transcript that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindFirstArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranscriptFindFirstArgs>(args?: SelectSubset<T, TranscriptFindFirstArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transcript that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindFirstOrThrowArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranscriptFindFirstOrThrowArgs>(args?: SelectSubset<T, TranscriptFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transcripts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transcripts
     * const transcripts = await prisma.transcript.findMany()
     * 
     * // Get first 10 Transcripts
     * const transcripts = await prisma.transcript.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transcriptWithIdOnly = await prisma.transcript.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranscriptFindManyArgs>(args?: SelectSubset<T, TranscriptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transcript.
     * @param {TranscriptCreateArgs} args - Arguments to create a Transcript.
     * @example
     * // Create one Transcript
     * const Transcript = await prisma.transcript.create({
     *   data: {
     *     // ... data to create a Transcript
     *   }
     * })
     * 
     */
    create<T extends TranscriptCreateArgs>(args: SelectSubset<T, TranscriptCreateArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transcripts.
     * @param {TranscriptCreateManyArgs} args - Arguments to create many Transcripts.
     * @example
     * // Create many Transcripts
     * const transcript = await prisma.transcript.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranscriptCreateManyArgs>(args?: SelectSubset<T, TranscriptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transcripts and returns the data saved in the database.
     * @param {TranscriptCreateManyAndReturnArgs} args - Arguments to create many Transcripts.
     * @example
     * // Create many Transcripts
     * const transcript = await prisma.transcript.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transcripts and only return the `id`
     * const transcriptWithIdOnly = await prisma.transcript.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TranscriptCreateManyAndReturnArgs>(args?: SelectSubset<T, TranscriptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transcript.
     * @param {TranscriptDeleteArgs} args - Arguments to delete one Transcript.
     * @example
     * // Delete one Transcript
     * const Transcript = await prisma.transcript.delete({
     *   where: {
     *     // ... filter to delete one Transcript
     *   }
     * })
     * 
     */
    delete<T extends TranscriptDeleteArgs>(args: SelectSubset<T, TranscriptDeleteArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transcript.
     * @param {TranscriptUpdateArgs} args - Arguments to update one Transcript.
     * @example
     * // Update one Transcript
     * const transcript = await prisma.transcript.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranscriptUpdateArgs>(args: SelectSubset<T, TranscriptUpdateArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transcripts.
     * @param {TranscriptDeleteManyArgs} args - Arguments to filter Transcripts to delete.
     * @example
     * // Delete a few Transcripts
     * const { count } = await prisma.transcript.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranscriptDeleteManyArgs>(args?: SelectSubset<T, TranscriptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transcripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transcripts
     * const transcript = await prisma.transcript.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranscriptUpdateManyArgs>(args: SelectSubset<T, TranscriptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transcripts and returns the data updated in the database.
     * @param {TranscriptUpdateManyAndReturnArgs} args - Arguments to update many Transcripts.
     * @example
     * // Update many Transcripts
     * const transcript = await prisma.transcript.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transcripts and only return the `id`
     * const transcriptWithIdOnly = await prisma.transcript.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TranscriptUpdateManyAndReturnArgs>(args: SelectSubset<T, TranscriptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transcript.
     * @param {TranscriptUpsertArgs} args - Arguments to update or create a Transcript.
     * @example
     * // Update or create a Transcript
     * const transcript = await prisma.transcript.upsert({
     *   create: {
     *     // ... data to create a Transcript
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transcript we want to update
     *   }
     * })
     */
    upsert<T extends TranscriptUpsertArgs>(args: SelectSubset<T, TranscriptUpsertArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transcripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptCountArgs} args - Arguments to filter Transcripts to count.
     * @example
     * // Count the number of Transcripts
     * const count = await prisma.transcript.count({
     *   where: {
     *     // ... the filter for the Transcripts we want to count
     *   }
     * })
    **/
    count<T extends TranscriptCountArgs>(
      args?: Subset<T, TranscriptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranscriptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transcript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TranscriptAggregateArgs>(args: Subset<T, TranscriptAggregateArgs>): Prisma.PrismaPromise<GetTranscriptAggregateType<T>>

    /**
     * Group by Transcript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TranscriptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranscriptGroupByArgs['orderBy'] }
        : { orderBy?: TranscriptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TranscriptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranscriptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transcript model
   */
  readonly fields: TranscriptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transcript.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranscriptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends Transcript$projectArgs<ExtArgs> = {}>(args?: Subset<T, Transcript$projectArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transcript model
   */
  interface TranscriptFieldRefs {
    readonly id: FieldRef<"Transcript", 'String'>
    readonly jobId: FieldRef<"Transcript", 'String'>
    readonly title: FieldRef<"Transcript", 'String'>
    readonly content: FieldRef<"Transcript", 'String'>
    readonly sourceUrl: FieldRef<"Transcript", 'String'>
    readonly status: FieldRef<"Transcript", 'TranscriptStatus'>
    readonly projectId: FieldRef<"Transcript", 'String'>
    readonly createdAt: FieldRef<"Transcript", 'DateTime'>
    readonly updatedAt: FieldRef<"Transcript", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transcript findUnique
   */
  export type TranscriptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript findUniqueOrThrow
   */
  export type TranscriptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript findFirst
   */
  export type TranscriptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript findFirstOrThrow
   */
  export type TranscriptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript findMany
   */
  export type TranscriptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcripts to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript create
   */
  export type TranscriptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The data needed to create a Transcript.
     */
    data: XOR<TranscriptCreateInput, TranscriptUncheckedCreateInput>
  }

  /**
   * Transcript createMany
   */
  export type TranscriptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transcripts.
     */
    data: TranscriptCreateManyInput | TranscriptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transcript createManyAndReturn
   */
  export type TranscriptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * The data used to create many Transcripts.
     */
    data: TranscriptCreateManyInput | TranscriptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transcript update
   */
  export type TranscriptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The data needed to update a Transcript.
     */
    data: XOR<TranscriptUpdateInput, TranscriptUncheckedUpdateInput>
    /**
     * Choose, which Transcript to update.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript updateMany
   */
  export type TranscriptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transcripts.
     */
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyInput>
    /**
     * Filter which Transcripts to update
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to update.
     */
    limit?: number
  }

  /**
   * Transcript updateManyAndReturn
   */
  export type TranscriptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * The data used to update Transcripts.
     */
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyInput>
    /**
     * Filter which Transcripts to update
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transcript upsert
   */
  export type TranscriptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The filter to search for the Transcript to update in case it exists.
     */
    where: TranscriptWhereUniqueInput
    /**
     * In case the Transcript found by the `where` argument doesn't exist, create a new Transcript with this data.
     */
    create: XOR<TranscriptCreateInput, TranscriptUncheckedCreateInput>
    /**
     * In case the Transcript was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranscriptUpdateInput, TranscriptUncheckedUpdateInput>
  }

  /**
   * Transcript delete
   */
  export type TranscriptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter which Transcript to delete.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript deleteMany
   */
  export type TranscriptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transcripts to delete
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to delete.
     */
    limit?: number
  }

  /**
   * Transcript.project
   */
  export type Transcript$projectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
  }

  /**
   * Transcript without action
   */
  export type TranscriptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    avatar: 'avatar',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    title: 'title',
    name: 'name',
    description: 'description',
    client: 'client',
    clientName: 'clientName',
    status: 'status',
    startDate: 'startDate',
    endDate: 'endDate',
    budget: 'budget',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const RoleRequirementScalarFieldEnum: {
    id: 'id',
    role: 'role',
    count: 'count',
    skills: 'skills',
    projectId: 'projectId'
  };

  export type RoleRequirementScalarFieldEnum = (typeof RoleRequirementScalarFieldEnum)[keyof typeof RoleRequirementScalarFieldEnum]


  export const FreelancerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    contactInfo: 'contactInfo',
    skills: 'skills',
    role: 'role',
    rate: 'rate',
    status: 'status',
    bio: 'bio',
    phone: 'phone',
    location: 'location',
    availability: 'availability',
    portfolio: 'portfolio',
    notes: 'notes',
    rating: 'rating',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FreelancerScalarFieldEnum = (typeof FreelancerScalarFieldEnum)[keyof typeof FreelancerScalarFieldEnum]


  export const AssignmentScalarFieldEnum: {
    id: 'id',
    freelancerId: 'freelancerId',
    projectId: 'projectId',
    startDate: 'startDate',
    endDate: 'endDate',
    allocation: 'allocation',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type AssignmentScalarFieldEnum = (typeof AssignmentScalarFieldEnum)[keyof typeof AssignmentScalarFieldEnum]


  export const MoodboardItemScalarFieldEnum: {
    id: 'id',
    url: 'url',
    title: 'title',
    description: 'description',
    tags: 'tags',
    moods: 'moods',
    colors: 'colors',
    shotType: 'shotType',
    source: 'source',
    metadata: 'metadata',
    isFavorite: 'isFavorite',
    projectId: 'projectId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MoodboardItemScalarFieldEnum = (typeof MoodboardItemScalarFieldEnum)[keyof typeof MoodboardItemScalarFieldEnum]


  export const MoodboardCollectionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    projectId: 'projectId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MoodboardCollectionScalarFieldEnum = (typeof MoodboardCollectionScalarFieldEnum)[keyof typeof MoodboardCollectionScalarFieldEnum]


  export const MoodboardCollectionItemScalarFieldEnum: {
    id: 'id',
    collectionId: 'collectionId',
    moodboardItemId: 'moodboardItemId'
  };

  export type MoodboardCollectionItemScalarFieldEnum = (typeof MoodboardCollectionItemScalarFieldEnum)[keyof typeof MoodboardCollectionItemScalarFieldEnum]


  export const ScriptScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    tags: 'tags',
    projectId: 'projectId',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ScriptScalarFieldEnum = (typeof ScriptScalarFieldEnum)[keyof typeof ScriptScalarFieldEnum]


  export const KnowledgeSourceScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    category: 'category',
    sourceType: 'sourceType',
    sourceId: 'sourceId',
    projectId: 'projectId',
    userId: 'userId',
    metadata: 'metadata',
    embedding: 'embedding',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KnowledgeSourceScalarFieldEnum = (typeof KnowledgeSourceScalarFieldEnum)[keyof typeof KnowledgeSourceScalarFieldEnum]


  export const TranscriptScalarFieldEnum: {
    id: 'id',
    jobId: 'jobId',
    title: 'title',
    content: 'content',
    sourceUrl: 'sourceUrl',
    status: 'status',
    projectId: 'projectId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TranscriptScalarFieldEnum = (typeof TranscriptScalarFieldEnum)[keyof typeof TranscriptScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ProjectStatus'
   */
  export type EnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus'>
    


  /**
   * Reference to a field of type 'ProjectStatus[]'
   */
  export type ListEnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'FreelancerStatus'
   */
  export type EnumFreelancerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FreelancerStatus'>
    


  /**
   * Reference to a field of type 'FreelancerStatus[]'
   */
  export type ListEnumFreelancerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FreelancerStatus[]'>
    


  /**
   * Reference to a field of type 'AssignmentStatus'
   */
  export type EnumAssignmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssignmentStatus'>
    


  /**
   * Reference to a field of type 'AssignmentStatus[]'
   */
  export type ListEnumAssignmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssignmentStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'TranscriptStatus'
   */
  export type EnumTranscriptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TranscriptStatus'>
    


  /**
   * Reference to a field of type 'TranscriptStatus[]'
   */
  export type ListEnumTranscriptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TranscriptStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    projects?: ProjectListRelationFilter
    assignments?: AssignmentListRelationFilter
    scripts?: ScriptListRelationFilter
    knowledgeSources?: KnowledgeSourceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
    assignments?: AssignmentOrderByRelationAggregateInput
    scripts?: ScriptOrderByRelationAggregateInput
    knowledgeSources?: KnowledgeSourceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    projects?: ProjectListRelationFilter
    assignments?: AssignmentListRelationFilter
    scripts?: ScriptListRelationFilter
    knowledgeSources?: KnowledgeSourceListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    title?: StringNullableFilter<"Project"> | string | null
    name?: StringNullableFilter<"Project"> | string | null
    description?: StringNullableFilter<"Project"> | string | null
    client?: StringNullableFilter<"Project"> | string | null
    clientName?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    startDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    budget?: FloatNullableFilter<"Project"> | number | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    userId?: StringNullableFilter<"Project"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    roleRequirements?: RoleRequirementListRelationFilter
    assignments?: AssignmentListRelationFilter
    scripts?: ScriptListRelationFilter
    moodboardItems?: MoodboardItemListRelationFilter
    knowledgeSources?: KnowledgeSourceListRelationFilter
    transcripts?: TranscriptListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    client?: SortOrderInput | SortOrder
    clientName?: SortOrderInput | SortOrder
    status?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    budget?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    roleRequirements?: RoleRequirementOrderByRelationAggregateInput
    assignments?: AssignmentOrderByRelationAggregateInput
    scripts?: ScriptOrderByRelationAggregateInput
    moodboardItems?: MoodboardItemOrderByRelationAggregateInput
    knowledgeSources?: KnowledgeSourceOrderByRelationAggregateInput
    transcripts?: TranscriptOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    title?: StringNullableFilter<"Project"> | string | null
    description?: StringNullableFilter<"Project"> | string | null
    client?: StringNullableFilter<"Project"> | string | null
    clientName?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    startDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    budget?: FloatNullableFilter<"Project"> | number | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    userId?: StringNullableFilter<"Project"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    roleRequirements?: RoleRequirementListRelationFilter
    assignments?: AssignmentListRelationFilter
    scripts?: ScriptListRelationFilter
    moodboardItems?: MoodboardItemListRelationFilter
    knowledgeSources?: KnowledgeSourceListRelationFilter
    transcripts?: TranscriptListRelationFilter
  }, "id" | "name">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    client?: SortOrderInput | SortOrder
    clientName?: SortOrderInput | SortOrder
    status?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    budget?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _avg?: ProjectAvgOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
    _sum?: ProjectSumOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    title?: StringNullableWithAggregatesFilter<"Project"> | string | null
    name?: StringNullableWithAggregatesFilter<"Project"> | string | null
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    client?: StringNullableWithAggregatesFilter<"Project"> | string | null
    clientName?: StringNullableWithAggregatesFilter<"Project"> | string | null
    status?: EnumProjectStatusWithAggregatesFilter<"Project"> | $Enums.ProjectStatus
    startDate?: DateTimeNullableWithAggregatesFilter<"Project"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Project"> | Date | string | null
    budget?: FloatNullableWithAggregatesFilter<"Project"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    userId?: StringNullableWithAggregatesFilter<"Project"> | string | null
  }

  export type RoleRequirementWhereInput = {
    AND?: RoleRequirementWhereInput | RoleRequirementWhereInput[]
    OR?: RoleRequirementWhereInput[]
    NOT?: RoleRequirementWhereInput | RoleRequirementWhereInput[]
    id?: StringFilter<"RoleRequirement"> | string
    role?: StringFilter<"RoleRequirement"> | string
    count?: IntNullableFilter<"RoleRequirement"> | number | null
    skills?: StringNullableListFilter<"RoleRequirement">
    projectId?: StringFilter<"RoleRequirement"> | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type RoleRequirementOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    count?: SortOrderInput | SortOrder
    skills?: SortOrder
    projectId?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type RoleRequirementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoleRequirementWhereInput | RoleRequirementWhereInput[]
    OR?: RoleRequirementWhereInput[]
    NOT?: RoleRequirementWhereInput | RoleRequirementWhereInput[]
    role?: StringFilter<"RoleRequirement"> | string
    count?: IntNullableFilter<"RoleRequirement"> | number | null
    skills?: StringNullableListFilter<"RoleRequirement">
    projectId?: StringFilter<"RoleRequirement"> | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type RoleRequirementOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    count?: SortOrderInput | SortOrder
    skills?: SortOrder
    projectId?: SortOrder
    _count?: RoleRequirementCountOrderByAggregateInput
    _avg?: RoleRequirementAvgOrderByAggregateInput
    _max?: RoleRequirementMaxOrderByAggregateInput
    _min?: RoleRequirementMinOrderByAggregateInput
    _sum?: RoleRequirementSumOrderByAggregateInput
  }

  export type RoleRequirementScalarWhereWithAggregatesInput = {
    AND?: RoleRequirementScalarWhereWithAggregatesInput | RoleRequirementScalarWhereWithAggregatesInput[]
    OR?: RoleRequirementScalarWhereWithAggregatesInput[]
    NOT?: RoleRequirementScalarWhereWithAggregatesInput | RoleRequirementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoleRequirement"> | string
    role?: StringWithAggregatesFilter<"RoleRequirement"> | string
    count?: IntNullableWithAggregatesFilter<"RoleRequirement"> | number | null
    skills?: StringNullableListFilter<"RoleRequirement">
    projectId?: StringWithAggregatesFilter<"RoleRequirement"> | string
  }

  export type FreelancerWhereInput = {
    AND?: FreelancerWhereInput | FreelancerWhereInput[]
    OR?: FreelancerWhereInput[]
    NOT?: FreelancerWhereInput | FreelancerWhereInput[]
    id?: StringFilter<"Freelancer"> | string
    name?: StringFilter<"Freelancer"> | string
    email?: StringNullableFilter<"Freelancer"> | string | null
    contactInfo?: StringNullableFilter<"Freelancer"> | string | null
    skills?: StringNullableListFilter<"Freelancer">
    role?: StringNullableFilter<"Freelancer"> | string | null
    rate?: FloatNullableFilter<"Freelancer"> | number | null
    status?: EnumFreelancerStatusFilter<"Freelancer"> | $Enums.FreelancerStatus
    bio?: StringNullableFilter<"Freelancer"> | string | null
    phone?: StringNullableFilter<"Freelancer"> | string | null
    location?: StringNullableFilter<"Freelancer"> | string | null
    availability?: StringNullableFilter<"Freelancer"> | string | null
    portfolio?: StringNullableFilter<"Freelancer"> | string | null
    notes?: StringNullableFilter<"Freelancer"> | string | null
    rating?: FloatNullableFilter<"Freelancer"> | number | null
    createdAt?: DateTimeFilter<"Freelancer"> | Date | string
    updatedAt?: DateTimeFilter<"Freelancer"> | Date | string
    assignments?: AssignmentListRelationFilter
  }

  export type FreelancerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    contactInfo?: SortOrderInput | SortOrder
    skills?: SortOrder
    role?: SortOrderInput | SortOrder
    rate?: SortOrderInput | SortOrder
    status?: SortOrder
    bio?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    availability?: SortOrderInput | SortOrder
    portfolio?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    rating?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assignments?: AssignmentOrderByRelationAggregateInput
  }

  export type FreelancerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    contactInfo?: string
    AND?: FreelancerWhereInput | FreelancerWhereInput[]
    OR?: FreelancerWhereInput[]
    NOT?: FreelancerWhereInput | FreelancerWhereInput[]
    name?: StringFilter<"Freelancer"> | string
    skills?: StringNullableListFilter<"Freelancer">
    role?: StringNullableFilter<"Freelancer"> | string | null
    rate?: FloatNullableFilter<"Freelancer"> | number | null
    status?: EnumFreelancerStatusFilter<"Freelancer"> | $Enums.FreelancerStatus
    bio?: StringNullableFilter<"Freelancer"> | string | null
    phone?: StringNullableFilter<"Freelancer"> | string | null
    location?: StringNullableFilter<"Freelancer"> | string | null
    availability?: StringNullableFilter<"Freelancer"> | string | null
    portfolio?: StringNullableFilter<"Freelancer"> | string | null
    notes?: StringNullableFilter<"Freelancer"> | string | null
    rating?: FloatNullableFilter<"Freelancer"> | number | null
    createdAt?: DateTimeFilter<"Freelancer"> | Date | string
    updatedAt?: DateTimeFilter<"Freelancer"> | Date | string
    assignments?: AssignmentListRelationFilter
  }, "id" | "email" | "contactInfo">

  export type FreelancerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    contactInfo?: SortOrderInput | SortOrder
    skills?: SortOrder
    role?: SortOrderInput | SortOrder
    rate?: SortOrderInput | SortOrder
    status?: SortOrder
    bio?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    availability?: SortOrderInput | SortOrder
    portfolio?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    rating?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FreelancerCountOrderByAggregateInput
    _avg?: FreelancerAvgOrderByAggregateInput
    _max?: FreelancerMaxOrderByAggregateInput
    _min?: FreelancerMinOrderByAggregateInput
    _sum?: FreelancerSumOrderByAggregateInput
  }

  export type FreelancerScalarWhereWithAggregatesInput = {
    AND?: FreelancerScalarWhereWithAggregatesInput | FreelancerScalarWhereWithAggregatesInput[]
    OR?: FreelancerScalarWhereWithAggregatesInput[]
    NOT?: FreelancerScalarWhereWithAggregatesInput | FreelancerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Freelancer"> | string
    name?: StringWithAggregatesFilter<"Freelancer"> | string
    email?: StringNullableWithAggregatesFilter<"Freelancer"> | string | null
    contactInfo?: StringNullableWithAggregatesFilter<"Freelancer"> | string | null
    skills?: StringNullableListFilter<"Freelancer">
    role?: StringNullableWithAggregatesFilter<"Freelancer"> | string | null
    rate?: FloatNullableWithAggregatesFilter<"Freelancer"> | number | null
    status?: EnumFreelancerStatusWithAggregatesFilter<"Freelancer"> | $Enums.FreelancerStatus
    bio?: StringNullableWithAggregatesFilter<"Freelancer"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Freelancer"> | string | null
    location?: StringNullableWithAggregatesFilter<"Freelancer"> | string | null
    availability?: StringNullableWithAggregatesFilter<"Freelancer"> | string | null
    portfolio?: StringNullableWithAggregatesFilter<"Freelancer"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Freelancer"> | string | null
    rating?: FloatNullableWithAggregatesFilter<"Freelancer"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Freelancer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Freelancer"> | Date | string
  }

  export type AssignmentWhereInput = {
    AND?: AssignmentWhereInput | AssignmentWhereInput[]
    OR?: AssignmentWhereInput[]
    NOT?: AssignmentWhereInput | AssignmentWhereInput[]
    id?: StringFilter<"Assignment"> | string
    freelancerId?: StringFilter<"Assignment"> | string
    projectId?: StringFilter<"Assignment"> | string
    startDate?: DateTimeNullableFilter<"Assignment"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Assignment"> | Date | string | null
    allocation?: FloatNullableFilter<"Assignment"> | number | null
    status?: EnumAssignmentStatusFilter<"Assignment"> | $Enums.AssignmentStatus
    createdAt?: DateTimeFilter<"Assignment"> | Date | string
    updatedAt?: DateTimeFilter<"Assignment"> | Date | string
    userId?: StringNullableFilter<"Assignment"> | string | null
    freelancer?: XOR<FreelancerScalarRelationFilter, FreelancerWhereInput>
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type AssignmentOrderByWithRelationInput = {
    id?: SortOrder
    freelancerId?: SortOrder
    projectId?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    allocation?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    freelancer?: FreelancerOrderByWithRelationInput
    project?: ProjectOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type AssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    freelancerId_projectId?: AssignmentFreelancerIdProjectIdCompoundUniqueInput
    AND?: AssignmentWhereInput | AssignmentWhereInput[]
    OR?: AssignmentWhereInput[]
    NOT?: AssignmentWhereInput | AssignmentWhereInput[]
    freelancerId?: StringFilter<"Assignment"> | string
    projectId?: StringFilter<"Assignment"> | string
    startDate?: DateTimeNullableFilter<"Assignment"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Assignment"> | Date | string | null
    allocation?: FloatNullableFilter<"Assignment"> | number | null
    status?: EnumAssignmentStatusFilter<"Assignment"> | $Enums.AssignmentStatus
    createdAt?: DateTimeFilter<"Assignment"> | Date | string
    updatedAt?: DateTimeFilter<"Assignment"> | Date | string
    userId?: StringNullableFilter<"Assignment"> | string | null
    freelancer?: XOR<FreelancerScalarRelationFilter, FreelancerWhereInput>
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "freelancerId_projectId">

  export type AssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    freelancerId?: SortOrder
    projectId?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    allocation?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: AssignmentCountOrderByAggregateInput
    _avg?: AssignmentAvgOrderByAggregateInput
    _max?: AssignmentMaxOrderByAggregateInput
    _min?: AssignmentMinOrderByAggregateInput
    _sum?: AssignmentSumOrderByAggregateInput
  }

  export type AssignmentScalarWhereWithAggregatesInput = {
    AND?: AssignmentScalarWhereWithAggregatesInput | AssignmentScalarWhereWithAggregatesInput[]
    OR?: AssignmentScalarWhereWithAggregatesInput[]
    NOT?: AssignmentScalarWhereWithAggregatesInput | AssignmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Assignment"> | string
    freelancerId?: StringWithAggregatesFilter<"Assignment"> | string
    projectId?: StringWithAggregatesFilter<"Assignment"> | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Assignment"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Assignment"> | Date | string | null
    allocation?: FloatNullableWithAggregatesFilter<"Assignment"> | number | null
    status?: EnumAssignmentStatusWithAggregatesFilter<"Assignment"> | $Enums.AssignmentStatus
    createdAt?: DateTimeWithAggregatesFilter<"Assignment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Assignment"> | Date | string
    userId?: StringNullableWithAggregatesFilter<"Assignment"> | string | null
  }

  export type MoodboardItemWhereInput = {
    AND?: MoodboardItemWhereInput | MoodboardItemWhereInput[]
    OR?: MoodboardItemWhereInput[]
    NOT?: MoodboardItemWhereInput | MoodboardItemWhereInput[]
    id?: StringFilter<"MoodboardItem"> | string
    url?: StringFilter<"MoodboardItem"> | string
    title?: StringNullableFilter<"MoodboardItem"> | string | null
    description?: StringNullableFilter<"MoodboardItem"> | string | null
    tags?: StringNullableListFilter<"MoodboardItem">
    moods?: StringNullableListFilter<"MoodboardItem">
    colors?: StringNullableListFilter<"MoodboardItem">
    shotType?: StringNullableFilter<"MoodboardItem"> | string | null
    source?: StringFilter<"MoodboardItem"> | string
    metadata?: JsonNullableFilter<"MoodboardItem">
    isFavorite?: BoolFilter<"MoodboardItem"> | boolean
    projectId?: StringFilter<"MoodboardItem"> | string
    createdAt?: DateTimeFilter<"MoodboardItem"> | Date | string
    updatedAt?: DateTimeFilter<"MoodboardItem"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    collections?: MoodboardCollectionItemListRelationFilter
  }

  export type MoodboardItemOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    tags?: SortOrder
    moods?: SortOrder
    colors?: SortOrder
    shotType?: SortOrderInput | SortOrder
    source?: SortOrder
    metadata?: SortOrderInput | SortOrder
    isFavorite?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    collections?: MoodboardCollectionItemOrderByRelationAggregateInput
  }

  export type MoodboardItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MoodboardItemWhereInput | MoodboardItemWhereInput[]
    OR?: MoodboardItemWhereInput[]
    NOT?: MoodboardItemWhereInput | MoodboardItemWhereInput[]
    url?: StringFilter<"MoodboardItem"> | string
    title?: StringNullableFilter<"MoodboardItem"> | string | null
    description?: StringNullableFilter<"MoodboardItem"> | string | null
    tags?: StringNullableListFilter<"MoodboardItem">
    moods?: StringNullableListFilter<"MoodboardItem">
    colors?: StringNullableListFilter<"MoodboardItem">
    shotType?: StringNullableFilter<"MoodboardItem"> | string | null
    source?: StringFilter<"MoodboardItem"> | string
    metadata?: JsonNullableFilter<"MoodboardItem">
    isFavorite?: BoolFilter<"MoodboardItem"> | boolean
    projectId?: StringFilter<"MoodboardItem"> | string
    createdAt?: DateTimeFilter<"MoodboardItem"> | Date | string
    updatedAt?: DateTimeFilter<"MoodboardItem"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    collections?: MoodboardCollectionItemListRelationFilter
  }, "id">

  export type MoodboardItemOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    tags?: SortOrder
    moods?: SortOrder
    colors?: SortOrder
    shotType?: SortOrderInput | SortOrder
    source?: SortOrder
    metadata?: SortOrderInput | SortOrder
    isFavorite?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MoodboardItemCountOrderByAggregateInput
    _max?: MoodboardItemMaxOrderByAggregateInput
    _min?: MoodboardItemMinOrderByAggregateInput
  }

  export type MoodboardItemScalarWhereWithAggregatesInput = {
    AND?: MoodboardItemScalarWhereWithAggregatesInput | MoodboardItemScalarWhereWithAggregatesInput[]
    OR?: MoodboardItemScalarWhereWithAggregatesInput[]
    NOT?: MoodboardItemScalarWhereWithAggregatesInput | MoodboardItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MoodboardItem"> | string
    url?: StringWithAggregatesFilter<"MoodboardItem"> | string
    title?: StringNullableWithAggregatesFilter<"MoodboardItem"> | string | null
    description?: StringNullableWithAggregatesFilter<"MoodboardItem"> | string | null
    tags?: StringNullableListFilter<"MoodboardItem">
    moods?: StringNullableListFilter<"MoodboardItem">
    colors?: StringNullableListFilter<"MoodboardItem">
    shotType?: StringNullableWithAggregatesFilter<"MoodboardItem"> | string | null
    source?: StringWithAggregatesFilter<"MoodboardItem"> | string
    metadata?: JsonNullableWithAggregatesFilter<"MoodboardItem">
    isFavorite?: BoolWithAggregatesFilter<"MoodboardItem"> | boolean
    projectId?: StringWithAggregatesFilter<"MoodboardItem"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MoodboardItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MoodboardItem"> | Date | string
  }

  export type MoodboardCollectionWhereInput = {
    AND?: MoodboardCollectionWhereInput | MoodboardCollectionWhereInput[]
    OR?: MoodboardCollectionWhereInput[]
    NOT?: MoodboardCollectionWhereInput | MoodboardCollectionWhereInput[]
    id?: StringFilter<"MoodboardCollection"> | string
    name?: StringFilter<"MoodboardCollection"> | string
    description?: StringNullableFilter<"MoodboardCollection"> | string | null
    projectId?: StringFilter<"MoodboardCollection"> | string
    createdAt?: DateTimeFilter<"MoodboardCollection"> | Date | string
    updatedAt?: DateTimeFilter<"MoodboardCollection"> | Date | string
    items?: MoodboardCollectionItemListRelationFilter
  }

  export type MoodboardCollectionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: MoodboardCollectionItemOrderByRelationAggregateInput
  }

  export type MoodboardCollectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name_projectId?: MoodboardCollectionNameProjectIdCompoundUniqueInput
    AND?: MoodboardCollectionWhereInput | MoodboardCollectionWhereInput[]
    OR?: MoodboardCollectionWhereInput[]
    NOT?: MoodboardCollectionWhereInput | MoodboardCollectionWhereInput[]
    name?: StringFilter<"MoodboardCollection"> | string
    description?: StringNullableFilter<"MoodboardCollection"> | string | null
    projectId?: StringFilter<"MoodboardCollection"> | string
    createdAt?: DateTimeFilter<"MoodboardCollection"> | Date | string
    updatedAt?: DateTimeFilter<"MoodboardCollection"> | Date | string
    items?: MoodboardCollectionItemListRelationFilter
  }, "id" | "name_projectId">

  export type MoodboardCollectionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MoodboardCollectionCountOrderByAggregateInput
    _max?: MoodboardCollectionMaxOrderByAggregateInput
    _min?: MoodboardCollectionMinOrderByAggregateInput
  }

  export type MoodboardCollectionScalarWhereWithAggregatesInput = {
    AND?: MoodboardCollectionScalarWhereWithAggregatesInput | MoodboardCollectionScalarWhereWithAggregatesInput[]
    OR?: MoodboardCollectionScalarWhereWithAggregatesInput[]
    NOT?: MoodboardCollectionScalarWhereWithAggregatesInput | MoodboardCollectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MoodboardCollection"> | string
    name?: StringWithAggregatesFilter<"MoodboardCollection"> | string
    description?: StringNullableWithAggregatesFilter<"MoodboardCollection"> | string | null
    projectId?: StringWithAggregatesFilter<"MoodboardCollection"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MoodboardCollection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MoodboardCollection"> | Date | string
  }

  export type MoodboardCollectionItemWhereInput = {
    AND?: MoodboardCollectionItemWhereInput | MoodboardCollectionItemWhereInput[]
    OR?: MoodboardCollectionItemWhereInput[]
    NOT?: MoodboardCollectionItemWhereInput | MoodboardCollectionItemWhereInput[]
    id?: StringFilter<"MoodboardCollectionItem"> | string
    collectionId?: StringFilter<"MoodboardCollectionItem"> | string
    moodboardItemId?: StringFilter<"MoodboardCollectionItem"> | string
    collection?: XOR<MoodboardCollectionScalarRelationFilter, MoodboardCollectionWhereInput>
    item?: XOR<MoodboardItemScalarRelationFilter, MoodboardItemWhereInput>
  }

  export type MoodboardCollectionItemOrderByWithRelationInput = {
    id?: SortOrder
    collectionId?: SortOrder
    moodboardItemId?: SortOrder
    collection?: MoodboardCollectionOrderByWithRelationInput
    item?: MoodboardItemOrderByWithRelationInput
  }

  export type MoodboardCollectionItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    collectionId_moodboardItemId?: MoodboardCollectionItemCollectionIdMoodboardItemIdCompoundUniqueInput
    AND?: MoodboardCollectionItemWhereInput | MoodboardCollectionItemWhereInput[]
    OR?: MoodboardCollectionItemWhereInput[]
    NOT?: MoodboardCollectionItemWhereInput | MoodboardCollectionItemWhereInput[]
    collectionId?: StringFilter<"MoodboardCollectionItem"> | string
    moodboardItemId?: StringFilter<"MoodboardCollectionItem"> | string
    collection?: XOR<MoodboardCollectionScalarRelationFilter, MoodboardCollectionWhereInput>
    item?: XOR<MoodboardItemScalarRelationFilter, MoodboardItemWhereInput>
  }, "id" | "collectionId_moodboardItemId">

  export type MoodboardCollectionItemOrderByWithAggregationInput = {
    id?: SortOrder
    collectionId?: SortOrder
    moodboardItemId?: SortOrder
    _count?: MoodboardCollectionItemCountOrderByAggregateInput
    _max?: MoodboardCollectionItemMaxOrderByAggregateInput
    _min?: MoodboardCollectionItemMinOrderByAggregateInput
  }

  export type MoodboardCollectionItemScalarWhereWithAggregatesInput = {
    AND?: MoodboardCollectionItemScalarWhereWithAggregatesInput | MoodboardCollectionItemScalarWhereWithAggregatesInput[]
    OR?: MoodboardCollectionItemScalarWhereWithAggregatesInput[]
    NOT?: MoodboardCollectionItemScalarWhereWithAggregatesInput | MoodboardCollectionItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MoodboardCollectionItem"> | string
    collectionId?: StringWithAggregatesFilter<"MoodboardCollectionItem"> | string
    moodboardItemId?: StringWithAggregatesFilter<"MoodboardCollectionItem"> | string
  }

  export type ScriptWhereInput = {
    AND?: ScriptWhereInput | ScriptWhereInput[]
    OR?: ScriptWhereInput[]
    NOT?: ScriptWhereInput | ScriptWhereInput[]
    id?: StringFilter<"Script"> | string
    title?: StringNullableFilter<"Script"> | string | null
    content?: StringNullableFilter<"Script"> | string | null
    tags?: StringNullableListFilter<"Script">
    projectId?: StringFilter<"Script"> | string
    userId?: StringNullableFilter<"Script"> | string | null
    createdAt?: DateTimeFilter<"Script"> | Date | string
    updatedAt?: DateTimeFilter<"Script"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ScriptOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    tags?: SortOrder
    projectId?: SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ScriptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScriptWhereInput | ScriptWhereInput[]
    OR?: ScriptWhereInput[]
    NOT?: ScriptWhereInput | ScriptWhereInput[]
    title?: StringNullableFilter<"Script"> | string | null
    content?: StringNullableFilter<"Script"> | string | null
    tags?: StringNullableListFilter<"Script">
    projectId?: StringFilter<"Script"> | string
    userId?: StringNullableFilter<"Script"> | string | null
    createdAt?: DateTimeFilter<"Script"> | Date | string
    updatedAt?: DateTimeFilter<"Script"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type ScriptOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    tags?: SortOrder
    projectId?: SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ScriptCountOrderByAggregateInput
    _max?: ScriptMaxOrderByAggregateInput
    _min?: ScriptMinOrderByAggregateInput
  }

  export type ScriptScalarWhereWithAggregatesInput = {
    AND?: ScriptScalarWhereWithAggregatesInput | ScriptScalarWhereWithAggregatesInput[]
    OR?: ScriptScalarWhereWithAggregatesInput[]
    NOT?: ScriptScalarWhereWithAggregatesInput | ScriptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Script"> | string
    title?: StringNullableWithAggregatesFilter<"Script"> | string | null
    content?: StringNullableWithAggregatesFilter<"Script"> | string | null
    tags?: StringNullableListFilter<"Script">
    projectId?: StringWithAggregatesFilter<"Script"> | string
    userId?: StringNullableWithAggregatesFilter<"Script"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Script"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Script"> | Date | string
  }

  export type KnowledgeSourceWhereInput = {
    AND?: KnowledgeSourceWhereInput | KnowledgeSourceWhereInput[]
    OR?: KnowledgeSourceWhereInput[]
    NOT?: KnowledgeSourceWhereInput | KnowledgeSourceWhereInput[]
    id?: StringFilter<"KnowledgeSource"> | string
    title?: StringFilter<"KnowledgeSource"> | string
    content?: StringFilter<"KnowledgeSource"> | string
    category?: StringFilter<"KnowledgeSource"> | string
    sourceType?: StringFilter<"KnowledgeSource"> | string
    sourceId?: StringNullableFilter<"KnowledgeSource"> | string | null
    projectId?: StringNullableFilter<"KnowledgeSource"> | string | null
    userId?: StringNullableFilter<"KnowledgeSource"> | string | null
    metadata?: JsonNullableFilter<"KnowledgeSource">
    embedding?: JsonNullableFilter<"KnowledgeSource">
    createdAt?: DateTimeFilter<"KnowledgeSource"> | Date | string
    updatedAt?: DateTimeFilter<"KnowledgeSource"> | Date | string
    project?: XOR<ProjectNullableScalarRelationFilter, ProjectWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type KnowledgeSourceOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    embedding?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type KnowledgeSourceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: KnowledgeSourceWhereInput | KnowledgeSourceWhereInput[]
    OR?: KnowledgeSourceWhereInput[]
    NOT?: KnowledgeSourceWhereInput | KnowledgeSourceWhereInput[]
    title?: StringFilter<"KnowledgeSource"> | string
    content?: StringFilter<"KnowledgeSource"> | string
    category?: StringFilter<"KnowledgeSource"> | string
    sourceType?: StringFilter<"KnowledgeSource"> | string
    sourceId?: StringNullableFilter<"KnowledgeSource"> | string | null
    projectId?: StringNullableFilter<"KnowledgeSource"> | string | null
    userId?: StringNullableFilter<"KnowledgeSource"> | string | null
    metadata?: JsonNullableFilter<"KnowledgeSource">
    embedding?: JsonNullableFilter<"KnowledgeSource">
    createdAt?: DateTimeFilter<"KnowledgeSource"> | Date | string
    updatedAt?: DateTimeFilter<"KnowledgeSource"> | Date | string
    project?: XOR<ProjectNullableScalarRelationFilter, ProjectWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type KnowledgeSourceOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrderInput | SortOrder
    projectId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    embedding?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KnowledgeSourceCountOrderByAggregateInput
    _max?: KnowledgeSourceMaxOrderByAggregateInput
    _min?: KnowledgeSourceMinOrderByAggregateInput
  }

  export type KnowledgeSourceScalarWhereWithAggregatesInput = {
    AND?: KnowledgeSourceScalarWhereWithAggregatesInput | KnowledgeSourceScalarWhereWithAggregatesInput[]
    OR?: KnowledgeSourceScalarWhereWithAggregatesInput[]
    NOT?: KnowledgeSourceScalarWhereWithAggregatesInput | KnowledgeSourceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KnowledgeSource"> | string
    title?: StringWithAggregatesFilter<"KnowledgeSource"> | string
    content?: StringWithAggregatesFilter<"KnowledgeSource"> | string
    category?: StringWithAggregatesFilter<"KnowledgeSource"> | string
    sourceType?: StringWithAggregatesFilter<"KnowledgeSource"> | string
    sourceId?: StringNullableWithAggregatesFilter<"KnowledgeSource"> | string | null
    projectId?: StringNullableWithAggregatesFilter<"KnowledgeSource"> | string | null
    userId?: StringNullableWithAggregatesFilter<"KnowledgeSource"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"KnowledgeSource">
    embedding?: JsonNullableWithAggregatesFilter<"KnowledgeSource">
    createdAt?: DateTimeWithAggregatesFilter<"KnowledgeSource"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KnowledgeSource"> | Date | string
  }

  export type TranscriptWhereInput = {
    AND?: TranscriptWhereInput | TranscriptWhereInput[]
    OR?: TranscriptWhereInput[]
    NOT?: TranscriptWhereInput | TranscriptWhereInput[]
    id?: StringFilter<"Transcript"> | string
    jobId?: StringFilter<"Transcript"> | string
    title?: StringNullableFilter<"Transcript"> | string | null
    content?: StringNullableFilter<"Transcript"> | string | null
    sourceUrl?: StringNullableFilter<"Transcript"> | string | null
    status?: EnumTranscriptStatusFilter<"Transcript"> | $Enums.TranscriptStatus
    projectId?: StringNullableFilter<"Transcript"> | string | null
    createdAt?: DateTimeFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeFilter<"Transcript"> | Date | string
    project?: XOR<ProjectNullableScalarRelationFilter, ProjectWhereInput> | null
  }

  export type TranscriptOrderByWithRelationInput = {
    id?: SortOrder
    jobId?: SortOrder
    title?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    projectId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type TranscriptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    jobId?: string
    AND?: TranscriptWhereInput | TranscriptWhereInput[]
    OR?: TranscriptWhereInput[]
    NOT?: TranscriptWhereInput | TranscriptWhereInput[]
    title?: StringNullableFilter<"Transcript"> | string | null
    content?: StringNullableFilter<"Transcript"> | string | null
    sourceUrl?: StringNullableFilter<"Transcript"> | string | null
    status?: EnumTranscriptStatusFilter<"Transcript"> | $Enums.TranscriptStatus
    projectId?: StringNullableFilter<"Transcript"> | string | null
    createdAt?: DateTimeFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeFilter<"Transcript"> | Date | string
    project?: XOR<ProjectNullableScalarRelationFilter, ProjectWhereInput> | null
  }, "id" | "jobId">

  export type TranscriptOrderByWithAggregationInput = {
    id?: SortOrder
    jobId?: SortOrder
    title?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    projectId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TranscriptCountOrderByAggregateInput
    _max?: TranscriptMaxOrderByAggregateInput
    _min?: TranscriptMinOrderByAggregateInput
  }

  export type TranscriptScalarWhereWithAggregatesInput = {
    AND?: TranscriptScalarWhereWithAggregatesInput | TranscriptScalarWhereWithAggregatesInput[]
    OR?: TranscriptScalarWhereWithAggregatesInput[]
    NOT?: TranscriptScalarWhereWithAggregatesInput | TranscriptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transcript"> | string
    jobId?: StringWithAggregatesFilter<"Transcript"> | string
    title?: StringNullableWithAggregatesFilter<"Transcript"> | string | null
    content?: StringNullableWithAggregatesFilter<"Transcript"> | string | null
    sourceUrl?: StringNullableWithAggregatesFilter<"Transcript"> | string | null
    status?: EnumTranscriptStatusWithAggregatesFilter<"Transcript"> | $Enums.TranscriptStatus
    projectId?: StringNullableWithAggregatesFilter<"Transcript"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transcript"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    assignments?: AssignmentCreateNestedManyWithoutUserInput
    scripts?: ScriptCreateNestedManyWithoutUserInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    assignments?: AssignmentUncheckedCreateNestedManyWithoutUserInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutUserInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    assignments?: AssignmentUpdateManyWithoutUserNestedInput
    scripts?: ScriptUpdateManyWithoutUserNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    assignments?: AssignmentUncheckedUpdateManyWithoutUserNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutUserNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutProjectsInput
    roleRequirements?: RoleRequirementCreateNestedManyWithoutProjectInput
    assignments?: AssignmentCreateNestedManyWithoutProjectInput
    scripts?: ScriptCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    roleRequirements?: RoleRequirementUncheckedCreateNestedManyWithoutProjectInput
    assignments?: AssignmentUncheckedCreateNestedManyWithoutProjectInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemUncheckedCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutProjectsNestedInput
    roleRequirements?: RoleRequirementUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roleRequirements?: RoleRequirementUncheckedUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUncheckedUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUncheckedUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoleRequirementCreateInput = {
    id?: string
    role: string
    count?: number | null
    skills?: RoleRequirementCreateskillsInput | string[]
    project: ProjectCreateNestedOneWithoutRoleRequirementsInput
  }

  export type RoleRequirementUncheckedCreateInput = {
    id?: string
    role: string
    count?: number | null
    skills?: RoleRequirementCreateskillsInput | string[]
    projectId: string
  }

  export type RoleRequirementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    count?: NullableIntFieldUpdateOperationsInput | number | null
    skills?: RoleRequirementUpdateskillsInput | string[]
    project?: ProjectUpdateOneRequiredWithoutRoleRequirementsNestedInput
  }

  export type RoleRequirementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    count?: NullableIntFieldUpdateOperationsInput | number | null
    skills?: RoleRequirementUpdateskillsInput | string[]
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type RoleRequirementCreateManyInput = {
    id?: string
    role: string
    count?: number | null
    skills?: RoleRequirementCreateskillsInput | string[]
    projectId: string
  }

  export type RoleRequirementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    count?: NullableIntFieldUpdateOperationsInput | number | null
    skills?: RoleRequirementUpdateskillsInput | string[]
  }

  export type RoleRequirementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    count?: NullableIntFieldUpdateOperationsInput | number | null
    skills?: RoleRequirementUpdateskillsInput | string[]
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type FreelancerCreateInput = {
    id?: string
    name: string
    email?: string | null
    contactInfo?: string | null
    skills?: FreelancerCreateskillsInput | string[]
    role?: string | null
    rate?: number | null
    status?: $Enums.FreelancerStatus
    bio?: string | null
    phone?: string | null
    location?: string | null
    availability?: string | null
    portfolio?: string | null
    notes?: string | null
    rating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignments?: AssignmentCreateNestedManyWithoutFreelancerInput
  }

  export type FreelancerUncheckedCreateInput = {
    id?: string
    name: string
    email?: string | null
    contactInfo?: string | null
    skills?: FreelancerCreateskillsInput | string[]
    role?: string | null
    rate?: number | null
    status?: $Enums.FreelancerStatus
    bio?: string | null
    phone?: string | null
    location?: string | null
    availability?: string | null
    portfolio?: string | null
    notes?: string | null
    rating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignments?: AssignmentUncheckedCreateNestedManyWithoutFreelancerInput
  }

  export type FreelancerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: FreelancerUpdateskillsInput | string[]
    role?: NullableStringFieldUpdateOperationsInput | string | null
    rate?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumFreelancerStatusFieldUpdateOperationsInput | $Enums.FreelancerStatus
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: AssignmentUpdateManyWithoutFreelancerNestedInput
  }

  export type FreelancerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: FreelancerUpdateskillsInput | string[]
    role?: NullableStringFieldUpdateOperationsInput | string | null
    rate?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumFreelancerStatusFieldUpdateOperationsInput | $Enums.FreelancerStatus
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: AssignmentUncheckedUpdateManyWithoutFreelancerNestedInput
  }

  export type FreelancerCreateManyInput = {
    id?: string
    name: string
    email?: string | null
    contactInfo?: string | null
    skills?: FreelancerCreateskillsInput | string[]
    role?: string | null
    rate?: number | null
    status?: $Enums.FreelancerStatus
    bio?: string | null
    phone?: string | null
    location?: string | null
    availability?: string | null
    portfolio?: string | null
    notes?: string | null
    rating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FreelancerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: FreelancerUpdateskillsInput | string[]
    role?: NullableStringFieldUpdateOperationsInput | string | null
    rate?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumFreelancerStatusFieldUpdateOperationsInput | $Enums.FreelancerStatus
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FreelancerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: FreelancerUpdateskillsInput | string[]
    role?: NullableStringFieldUpdateOperationsInput | string | null
    rate?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumFreelancerStatusFieldUpdateOperationsInput | $Enums.FreelancerStatus
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssignmentCreateInput = {
    id?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    freelancer: FreelancerCreateNestedOneWithoutAssignmentsInput
    project: ProjectCreateNestedOneWithoutAssignmentsInput
    user?: UserCreateNestedOneWithoutAssignmentsInput
  }

  export type AssignmentUncheckedCreateInput = {
    id?: string
    freelancerId: string
    projectId: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type AssignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    freelancer?: FreelancerUpdateOneRequiredWithoutAssignmentsNestedInput
    project?: ProjectUpdateOneRequiredWithoutAssignmentsNestedInput
    user?: UserUpdateOneWithoutAssignmentsNestedInput
  }

  export type AssignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    freelancerId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AssignmentCreateManyInput = {
    id?: string
    freelancerId: string
    projectId: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type AssignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    freelancerId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MoodboardItemCreateInput = {
    id?: string
    url: string
    title?: string | null
    description?: string | null
    tags?: MoodboardItemCreatetagsInput | string[]
    moods?: MoodboardItemCreatemoodsInput | string[]
    colors?: MoodboardItemCreatecolorsInput | string[]
    shotType?: string | null
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutMoodboardItemsInput
    collections?: MoodboardCollectionItemCreateNestedManyWithoutItemInput
  }

  export type MoodboardItemUncheckedCreateInput = {
    id?: string
    url: string
    title?: string | null
    description?: string | null
    tags?: MoodboardItemCreatetagsInput | string[]
    moods?: MoodboardItemCreatemoodsInput | string[]
    colors?: MoodboardItemCreatecolorsInput | string[]
    shotType?: string | null
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: boolean
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: MoodboardCollectionItemUncheckedCreateNestedManyWithoutItemInput
  }

  export type MoodboardItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MoodboardItemUpdatetagsInput | string[]
    moods?: MoodboardItemUpdatemoodsInput | string[]
    colors?: MoodboardItemUpdatecolorsInput | string[]
    shotType?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutMoodboardItemsNestedInput
    collections?: MoodboardCollectionItemUpdateManyWithoutItemNestedInput
  }

  export type MoodboardItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MoodboardItemUpdatetagsInput | string[]
    moods?: MoodboardItemUpdatemoodsInput | string[]
    colors?: MoodboardItemUpdatecolorsInput | string[]
    shotType?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: MoodboardCollectionItemUncheckedUpdateManyWithoutItemNestedInput
  }

  export type MoodboardItemCreateManyInput = {
    id?: string
    url: string
    title?: string | null
    description?: string | null
    tags?: MoodboardItemCreatetagsInput | string[]
    moods?: MoodboardItemCreatemoodsInput | string[]
    colors?: MoodboardItemCreatecolorsInput | string[]
    shotType?: string | null
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: boolean
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoodboardItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MoodboardItemUpdatetagsInput | string[]
    moods?: MoodboardItemUpdatemoodsInput | string[]
    colors?: MoodboardItemUpdatecolorsInput | string[]
    shotType?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodboardItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MoodboardItemUpdatetagsInput | string[]
    moods?: MoodboardItemUpdatemoodsInput | string[]
    colors?: MoodboardItemUpdatecolorsInput | string[]
    shotType?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodboardCollectionCreateInput = {
    id?: string
    name: string
    description?: string | null
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: MoodboardCollectionItemCreateNestedManyWithoutCollectionInput
  }

  export type MoodboardCollectionUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: MoodboardCollectionItemUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type MoodboardCollectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: MoodboardCollectionItemUpdateManyWithoutCollectionNestedInput
  }

  export type MoodboardCollectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: MoodboardCollectionItemUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type MoodboardCollectionCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoodboardCollectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodboardCollectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodboardCollectionItemCreateInput = {
    id?: string
    collection: MoodboardCollectionCreateNestedOneWithoutItemsInput
    item: MoodboardItemCreateNestedOneWithoutCollectionsInput
  }

  export type MoodboardCollectionItemUncheckedCreateInput = {
    id?: string
    collectionId: string
    moodboardItemId: string
  }

  export type MoodboardCollectionItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    collection?: MoodboardCollectionUpdateOneRequiredWithoutItemsNestedInput
    item?: MoodboardItemUpdateOneRequiredWithoutCollectionsNestedInput
  }

  export type MoodboardCollectionItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    collectionId?: StringFieldUpdateOperationsInput | string
    moodboardItemId?: StringFieldUpdateOperationsInput | string
  }

  export type MoodboardCollectionItemCreateManyInput = {
    id?: string
    collectionId: string
    moodboardItemId: string
  }

  export type MoodboardCollectionItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type MoodboardCollectionItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    collectionId?: StringFieldUpdateOperationsInput | string
    moodboardItemId?: StringFieldUpdateOperationsInput | string
  }

  export type ScriptCreateInput = {
    id?: string
    title?: string | null
    content?: string | null
    tags?: ScriptCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutScriptsInput
    user?: UserCreateNestedOneWithoutScriptsInput
  }

  export type ScriptUncheckedCreateInput = {
    id?: string
    title?: string | null
    content?: string | null
    tags?: ScriptCreatetagsInput | string[]
    projectId: string
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScriptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ScriptUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutScriptsNestedInput
    user?: UserUpdateOneWithoutScriptsNestedInput
  }

  export type ScriptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ScriptUpdatetagsInput | string[]
    projectId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScriptCreateManyInput = {
    id?: string
    title?: string | null
    content?: string | null
    tags?: ScriptCreatetagsInput | string[]
    projectId: string
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScriptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ScriptUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScriptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ScriptUpdatetagsInput | string[]
    projectId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeSourceCreateInput = {
    id?: string
    title: string
    content: string
    category: string
    sourceType: string
    sourceId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    project?: ProjectCreateNestedOneWithoutKnowledgeSourcesInput
    user?: UserCreateNestedOneWithoutKnowledgeSourcesInput
  }

  export type KnowledgeSourceUncheckedCreateInput = {
    id?: string
    title: string
    content: string
    category: string
    sourceType: string
    sourceId?: string | null
    projectId?: string | null
    userId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KnowledgeSourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneWithoutKnowledgeSourcesNestedInput
    user?: UserUpdateOneWithoutKnowledgeSourcesNestedInput
  }

  export type KnowledgeSourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeSourceCreateManyInput = {
    id?: string
    title: string
    content: string
    category: string
    sourceType: string
    sourceId?: string | null
    projectId?: string | null
    userId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KnowledgeSourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeSourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptCreateInput = {
    id?: string
    jobId: string
    title?: string | null
    content?: string | null
    sourceUrl?: string | null
    status?: $Enums.TranscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    project?: ProjectCreateNestedOneWithoutTranscriptsInput
  }

  export type TranscriptUncheckedCreateInput = {
    id?: string
    jobId: string
    title?: string | null
    content?: string | null
    sourceUrl?: string | null
    status?: $Enums.TranscriptStatus
    projectId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTranscriptStatusFieldUpdateOperationsInput | $Enums.TranscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneWithoutTranscriptsNestedInput
  }

  export type TranscriptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTranscriptStatusFieldUpdateOperationsInput | $Enums.TranscriptStatus
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptCreateManyInput = {
    id?: string
    jobId: string
    title?: string | null
    content?: string | null
    sourceUrl?: string | null
    status?: $Enums.TranscriptStatus
    projectId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTranscriptStatusFieldUpdateOperationsInput | $Enums.TranscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTranscriptStatusFieldUpdateOperationsInput | $Enums.TranscriptStatus
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type AssignmentListRelationFilter = {
    every?: AssignmentWhereInput
    some?: AssignmentWhereInput
    none?: AssignmentWhereInput
  }

  export type ScriptListRelationFilter = {
    every?: ScriptWhereInput
    some?: ScriptWhereInput
    none?: ScriptWhereInput
  }

  export type KnowledgeSourceListRelationFilter = {
    every?: KnowledgeSourceWhereInput
    some?: KnowledgeSourceWhereInput
    none?: KnowledgeSourceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScriptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KnowledgeSourceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type RoleRequirementListRelationFilter = {
    every?: RoleRequirementWhereInput
    some?: RoleRequirementWhereInput
    none?: RoleRequirementWhereInput
  }

  export type MoodboardItemListRelationFilter = {
    every?: MoodboardItemWhereInput
    some?: MoodboardItemWhereInput
    none?: MoodboardItemWhereInput
  }

  export type TranscriptListRelationFilter = {
    every?: TranscriptWhereInput
    some?: TranscriptWhereInput
    none?: TranscriptWhereInput
  }

  export type RoleRequirementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MoodboardItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TranscriptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    name?: SortOrder
    description?: SortOrder
    client?: SortOrder
    clientName?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    budget?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ProjectAvgOrderByAggregateInput = {
    budget?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    name?: SortOrder
    description?: SortOrder
    client?: SortOrder
    clientName?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    budget?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    name?: SortOrder
    description?: SortOrder
    client?: SortOrder
    clientName?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    budget?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ProjectSumOrderByAggregateInput = {
    budget?: SortOrder
  }

  export type EnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type RoleRequirementCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    count?: SortOrder
    skills?: SortOrder
    projectId?: SortOrder
  }

  export type RoleRequirementAvgOrderByAggregateInput = {
    count?: SortOrder
  }

  export type RoleRequirementMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    count?: SortOrder
    projectId?: SortOrder
  }

  export type RoleRequirementMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    count?: SortOrder
    projectId?: SortOrder
  }

  export type RoleRequirementSumOrderByAggregateInput = {
    count?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumFreelancerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FreelancerStatus | EnumFreelancerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FreelancerStatus[] | ListEnumFreelancerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FreelancerStatus[] | ListEnumFreelancerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFreelancerStatusFilter<$PrismaModel> | $Enums.FreelancerStatus
  }

  export type FreelancerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contactInfo?: SortOrder
    skills?: SortOrder
    role?: SortOrder
    rate?: SortOrder
    status?: SortOrder
    bio?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    availability?: SortOrder
    portfolio?: SortOrder
    notes?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FreelancerAvgOrderByAggregateInput = {
    rate?: SortOrder
    rating?: SortOrder
  }

  export type FreelancerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contactInfo?: SortOrder
    role?: SortOrder
    rate?: SortOrder
    status?: SortOrder
    bio?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    availability?: SortOrder
    portfolio?: SortOrder
    notes?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FreelancerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    contactInfo?: SortOrder
    role?: SortOrder
    rate?: SortOrder
    status?: SortOrder
    bio?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    availability?: SortOrder
    portfolio?: SortOrder
    notes?: SortOrder
    rating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FreelancerSumOrderByAggregateInput = {
    rate?: SortOrder
    rating?: SortOrder
  }

  export type EnumFreelancerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FreelancerStatus | EnumFreelancerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FreelancerStatus[] | ListEnumFreelancerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FreelancerStatus[] | ListEnumFreelancerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFreelancerStatusWithAggregatesFilter<$PrismaModel> | $Enums.FreelancerStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFreelancerStatusFilter<$PrismaModel>
    _max?: NestedEnumFreelancerStatusFilter<$PrismaModel>
  }

  export type EnumAssignmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusFilter<$PrismaModel> | $Enums.AssignmentStatus
  }

  export type FreelancerScalarRelationFilter = {
    is?: FreelancerWhereInput
    isNot?: FreelancerWhereInput
  }

  export type AssignmentFreelancerIdProjectIdCompoundUniqueInput = {
    freelancerId: string
    projectId: string
  }

  export type AssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    freelancerId?: SortOrder
    projectId?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    allocation?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type AssignmentAvgOrderByAggregateInput = {
    allocation?: SortOrder
  }

  export type AssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    freelancerId?: SortOrder
    projectId?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    allocation?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type AssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    freelancerId?: SortOrder
    projectId?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    allocation?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type AssignmentSumOrderByAggregateInput = {
    allocation?: SortOrder
  }

  export type EnumAssignmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssignmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssignmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAssignmentStatusFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type MoodboardCollectionItemListRelationFilter = {
    every?: MoodboardCollectionItemWhereInput
    some?: MoodboardCollectionItemWhereInput
    none?: MoodboardCollectionItemWhereInput
  }

  export type MoodboardCollectionItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MoodboardItemCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrder
    tags?: SortOrder
    moods?: SortOrder
    colors?: SortOrder
    shotType?: SortOrder
    source?: SortOrder
    metadata?: SortOrder
    isFavorite?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MoodboardItemMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrder
    shotType?: SortOrder
    source?: SortOrder
    isFavorite?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MoodboardItemMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrder
    shotType?: SortOrder
    source?: SortOrder
    isFavorite?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type MoodboardCollectionNameProjectIdCompoundUniqueInput = {
    name: string
    projectId: string
  }

  export type MoodboardCollectionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MoodboardCollectionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MoodboardCollectionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MoodboardCollectionScalarRelationFilter = {
    is?: MoodboardCollectionWhereInput
    isNot?: MoodboardCollectionWhereInput
  }

  export type MoodboardItemScalarRelationFilter = {
    is?: MoodboardItemWhereInput
    isNot?: MoodboardItemWhereInput
  }

  export type MoodboardCollectionItemCollectionIdMoodboardItemIdCompoundUniqueInput = {
    collectionId: string
    moodboardItemId: string
  }

  export type MoodboardCollectionItemCountOrderByAggregateInput = {
    id?: SortOrder
    collectionId?: SortOrder
    moodboardItemId?: SortOrder
  }

  export type MoodboardCollectionItemMaxOrderByAggregateInput = {
    id?: SortOrder
    collectionId?: SortOrder
    moodboardItemId?: SortOrder
  }

  export type MoodboardCollectionItemMinOrderByAggregateInput = {
    id?: SortOrder
    collectionId?: SortOrder
    moodboardItemId?: SortOrder
  }

  export type ScriptCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    tags?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScriptMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScriptMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectNullableScalarRelationFilter = {
    is?: ProjectWhereInput | null
    isNot?: ProjectWhereInput | null
  }

  export type KnowledgeSourceCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    metadata?: SortOrder
    embedding?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KnowledgeSourceMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KnowledgeSourceMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    category?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTranscriptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TranscriptStatus | EnumTranscriptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TranscriptStatus[] | ListEnumTranscriptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TranscriptStatus[] | ListEnumTranscriptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTranscriptStatusFilter<$PrismaModel> | $Enums.TranscriptStatus
  }

  export type TranscriptCountOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    sourceUrl?: SortOrder
    status?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TranscriptMaxOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    sourceUrl?: SortOrder
    status?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TranscriptMinOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    sourceUrl?: SortOrder
    status?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTranscriptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TranscriptStatus | EnumTranscriptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TranscriptStatus[] | ListEnumTranscriptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TranscriptStatus[] | ListEnumTranscriptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTranscriptStatusWithAggregatesFilter<$PrismaModel> | $Enums.TranscriptStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTranscriptStatusFilter<$PrismaModel>
    _max?: NestedEnumTranscriptStatusFilter<$PrismaModel>
  }

  export type ProjectCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type AssignmentCreateNestedManyWithoutUserInput = {
    create?: XOR<AssignmentCreateWithoutUserInput, AssignmentUncheckedCreateWithoutUserInput> | AssignmentCreateWithoutUserInput[] | AssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutUserInput | AssignmentCreateOrConnectWithoutUserInput[]
    createMany?: AssignmentCreateManyUserInputEnvelope
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
  }

  export type ScriptCreateNestedManyWithoutUserInput = {
    create?: XOR<ScriptCreateWithoutUserInput, ScriptUncheckedCreateWithoutUserInput> | ScriptCreateWithoutUserInput[] | ScriptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScriptCreateOrConnectWithoutUserInput | ScriptCreateOrConnectWithoutUserInput[]
    createMany?: ScriptCreateManyUserInputEnvelope
    connect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
  }

  export type KnowledgeSourceCreateNestedManyWithoutUserInput = {
    create?: XOR<KnowledgeSourceCreateWithoutUserInput, KnowledgeSourceUncheckedCreateWithoutUserInput> | KnowledgeSourceCreateWithoutUserInput[] | KnowledgeSourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KnowledgeSourceCreateOrConnectWithoutUserInput | KnowledgeSourceCreateOrConnectWithoutUserInput[]
    createMany?: KnowledgeSourceCreateManyUserInputEnvelope
    connect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type AssignmentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AssignmentCreateWithoutUserInput, AssignmentUncheckedCreateWithoutUserInput> | AssignmentCreateWithoutUserInput[] | AssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutUserInput | AssignmentCreateOrConnectWithoutUserInput[]
    createMany?: AssignmentCreateManyUserInputEnvelope
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
  }

  export type ScriptUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ScriptCreateWithoutUserInput, ScriptUncheckedCreateWithoutUserInput> | ScriptCreateWithoutUserInput[] | ScriptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScriptCreateOrConnectWithoutUserInput | ScriptCreateOrConnectWithoutUserInput[]
    createMany?: ScriptCreateManyUserInputEnvelope
    connect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
  }

  export type KnowledgeSourceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<KnowledgeSourceCreateWithoutUserInput, KnowledgeSourceUncheckedCreateWithoutUserInput> | KnowledgeSourceCreateWithoutUserInput[] | KnowledgeSourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KnowledgeSourceCreateOrConnectWithoutUserInput | KnowledgeSourceCreateOrConnectWithoutUserInput[]
    createMany?: KnowledgeSourceCreateManyUserInputEnvelope
    connect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProjectUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutUserInput | ProjectUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutUserInput | ProjectUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutUserInput | ProjectUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type AssignmentUpdateManyWithoutUserNestedInput = {
    create?: XOR<AssignmentCreateWithoutUserInput, AssignmentUncheckedCreateWithoutUserInput> | AssignmentCreateWithoutUserInput[] | AssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutUserInput | AssignmentCreateOrConnectWithoutUserInput[]
    upsert?: AssignmentUpsertWithWhereUniqueWithoutUserInput | AssignmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AssignmentCreateManyUserInputEnvelope
    set?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    disconnect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    delete?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    update?: AssignmentUpdateWithWhereUniqueWithoutUserInput | AssignmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AssignmentUpdateManyWithWhereWithoutUserInput | AssignmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AssignmentScalarWhereInput | AssignmentScalarWhereInput[]
  }

  export type ScriptUpdateManyWithoutUserNestedInput = {
    create?: XOR<ScriptCreateWithoutUserInput, ScriptUncheckedCreateWithoutUserInput> | ScriptCreateWithoutUserInput[] | ScriptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScriptCreateOrConnectWithoutUserInput | ScriptCreateOrConnectWithoutUserInput[]
    upsert?: ScriptUpsertWithWhereUniqueWithoutUserInput | ScriptUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ScriptCreateManyUserInputEnvelope
    set?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    disconnect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    delete?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    connect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    update?: ScriptUpdateWithWhereUniqueWithoutUserInput | ScriptUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ScriptUpdateManyWithWhereWithoutUserInput | ScriptUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ScriptScalarWhereInput | ScriptScalarWhereInput[]
  }

  export type KnowledgeSourceUpdateManyWithoutUserNestedInput = {
    create?: XOR<KnowledgeSourceCreateWithoutUserInput, KnowledgeSourceUncheckedCreateWithoutUserInput> | KnowledgeSourceCreateWithoutUserInput[] | KnowledgeSourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KnowledgeSourceCreateOrConnectWithoutUserInput | KnowledgeSourceCreateOrConnectWithoutUserInput[]
    upsert?: KnowledgeSourceUpsertWithWhereUniqueWithoutUserInput | KnowledgeSourceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: KnowledgeSourceCreateManyUserInputEnvelope
    set?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    disconnect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    delete?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    connect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    update?: KnowledgeSourceUpdateWithWhereUniqueWithoutUserInput | KnowledgeSourceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: KnowledgeSourceUpdateManyWithWhereWithoutUserInput | KnowledgeSourceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: KnowledgeSourceScalarWhereInput | KnowledgeSourceScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutUserInput | ProjectUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutUserInput | ProjectUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutUserInput | ProjectUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type AssignmentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AssignmentCreateWithoutUserInput, AssignmentUncheckedCreateWithoutUserInput> | AssignmentCreateWithoutUserInput[] | AssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutUserInput | AssignmentCreateOrConnectWithoutUserInput[]
    upsert?: AssignmentUpsertWithWhereUniqueWithoutUserInput | AssignmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AssignmentCreateManyUserInputEnvelope
    set?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    disconnect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    delete?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    update?: AssignmentUpdateWithWhereUniqueWithoutUserInput | AssignmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AssignmentUpdateManyWithWhereWithoutUserInput | AssignmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AssignmentScalarWhereInput | AssignmentScalarWhereInput[]
  }

  export type ScriptUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ScriptCreateWithoutUserInput, ScriptUncheckedCreateWithoutUserInput> | ScriptCreateWithoutUserInput[] | ScriptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScriptCreateOrConnectWithoutUserInput | ScriptCreateOrConnectWithoutUserInput[]
    upsert?: ScriptUpsertWithWhereUniqueWithoutUserInput | ScriptUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ScriptCreateManyUserInputEnvelope
    set?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    disconnect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    delete?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    connect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    update?: ScriptUpdateWithWhereUniqueWithoutUserInput | ScriptUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ScriptUpdateManyWithWhereWithoutUserInput | ScriptUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ScriptScalarWhereInput | ScriptScalarWhereInput[]
  }

  export type KnowledgeSourceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<KnowledgeSourceCreateWithoutUserInput, KnowledgeSourceUncheckedCreateWithoutUserInput> | KnowledgeSourceCreateWithoutUserInput[] | KnowledgeSourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KnowledgeSourceCreateOrConnectWithoutUserInput | KnowledgeSourceCreateOrConnectWithoutUserInput[]
    upsert?: KnowledgeSourceUpsertWithWhereUniqueWithoutUserInput | KnowledgeSourceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: KnowledgeSourceCreateManyUserInputEnvelope
    set?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    disconnect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    delete?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    connect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    update?: KnowledgeSourceUpdateWithWhereUniqueWithoutUserInput | KnowledgeSourceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: KnowledgeSourceUpdateManyWithWhereWithoutUserInput | KnowledgeSourceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: KnowledgeSourceScalarWhereInput | KnowledgeSourceScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutProjectsInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type RoleRequirementCreateNestedManyWithoutProjectInput = {
    create?: XOR<RoleRequirementCreateWithoutProjectInput, RoleRequirementUncheckedCreateWithoutProjectInput> | RoleRequirementCreateWithoutProjectInput[] | RoleRequirementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RoleRequirementCreateOrConnectWithoutProjectInput | RoleRequirementCreateOrConnectWithoutProjectInput[]
    createMany?: RoleRequirementCreateManyProjectInputEnvelope
    connect?: RoleRequirementWhereUniqueInput | RoleRequirementWhereUniqueInput[]
  }

  export type AssignmentCreateNestedManyWithoutProjectInput = {
    create?: XOR<AssignmentCreateWithoutProjectInput, AssignmentUncheckedCreateWithoutProjectInput> | AssignmentCreateWithoutProjectInput[] | AssignmentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutProjectInput | AssignmentCreateOrConnectWithoutProjectInput[]
    createMany?: AssignmentCreateManyProjectInputEnvelope
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
  }

  export type ScriptCreateNestedManyWithoutProjectInput = {
    create?: XOR<ScriptCreateWithoutProjectInput, ScriptUncheckedCreateWithoutProjectInput> | ScriptCreateWithoutProjectInput[] | ScriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ScriptCreateOrConnectWithoutProjectInput | ScriptCreateOrConnectWithoutProjectInput[]
    createMany?: ScriptCreateManyProjectInputEnvelope
    connect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
  }

  export type MoodboardItemCreateNestedManyWithoutProjectInput = {
    create?: XOR<MoodboardItemCreateWithoutProjectInput, MoodboardItemUncheckedCreateWithoutProjectInput> | MoodboardItemCreateWithoutProjectInput[] | MoodboardItemUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MoodboardItemCreateOrConnectWithoutProjectInput | MoodboardItemCreateOrConnectWithoutProjectInput[]
    createMany?: MoodboardItemCreateManyProjectInputEnvelope
    connect?: MoodboardItemWhereUniqueInput | MoodboardItemWhereUniqueInput[]
  }

  export type KnowledgeSourceCreateNestedManyWithoutProjectInput = {
    create?: XOR<KnowledgeSourceCreateWithoutProjectInput, KnowledgeSourceUncheckedCreateWithoutProjectInput> | KnowledgeSourceCreateWithoutProjectInput[] | KnowledgeSourceUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: KnowledgeSourceCreateOrConnectWithoutProjectInput | KnowledgeSourceCreateOrConnectWithoutProjectInput[]
    createMany?: KnowledgeSourceCreateManyProjectInputEnvelope
    connect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
  }

  export type TranscriptCreateNestedManyWithoutProjectInput = {
    create?: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput> | TranscriptCreateWithoutProjectInput[] | TranscriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TranscriptCreateOrConnectWithoutProjectInput | TranscriptCreateOrConnectWithoutProjectInput[]
    createMany?: TranscriptCreateManyProjectInputEnvelope
    connect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
  }

  export type RoleRequirementUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<RoleRequirementCreateWithoutProjectInput, RoleRequirementUncheckedCreateWithoutProjectInput> | RoleRequirementCreateWithoutProjectInput[] | RoleRequirementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RoleRequirementCreateOrConnectWithoutProjectInput | RoleRequirementCreateOrConnectWithoutProjectInput[]
    createMany?: RoleRequirementCreateManyProjectInputEnvelope
    connect?: RoleRequirementWhereUniqueInput | RoleRequirementWhereUniqueInput[]
  }

  export type AssignmentUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<AssignmentCreateWithoutProjectInput, AssignmentUncheckedCreateWithoutProjectInput> | AssignmentCreateWithoutProjectInput[] | AssignmentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutProjectInput | AssignmentCreateOrConnectWithoutProjectInput[]
    createMany?: AssignmentCreateManyProjectInputEnvelope
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
  }

  export type ScriptUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ScriptCreateWithoutProjectInput, ScriptUncheckedCreateWithoutProjectInput> | ScriptCreateWithoutProjectInput[] | ScriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ScriptCreateOrConnectWithoutProjectInput | ScriptCreateOrConnectWithoutProjectInput[]
    createMany?: ScriptCreateManyProjectInputEnvelope
    connect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
  }

  export type MoodboardItemUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<MoodboardItemCreateWithoutProjectInput, MoodboardItemUncheckedCreateWithoutProjectInput> | MoodboardItemCreateWithoutProjectInput[] | MoodboardItemUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MoodboardItemCreateOrConnectWithoutProjectInput | MoodboardItemCreateOrConnectWithoutProjectInput[]
    createMany?: MoodboardItemCreateManyProjectInputEnvelope
    connect?: MoodboardItemWhereUniqueInput | MoodboardItemWhereUniqueInput[]
  }

  export type KnowledgeSourceUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<KnowledgeSourceCreateWithoutProjectInput, KnowledgeSourceUncheckedCreateWithoutProjectInput> | KnowledgeSourceCreateWithoutProjectInput[] | KnowledgeSourceUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: KnowledgeSourceCreateOrConnectWithoutProjectInput | KnowledgeSourceCreateOrConnectWithoutProjectInput[]
    createMany?: KnowledgeSourceCreateManyProjectInputEnvelope
    connect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
  }

  export type TranscriptUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput> | TranscriptCreateWithoutProjectInput[] | TranscriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TranscriptCreateOrConnectWithoutProjectInput | TranscriptCreateOrConnectWithoutProjectInput[]
    createMany?: TranscriptCreateManyProjectInputEnvelope
    connect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
  }

  export type EnumProjectStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProjectStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneWithoutProjectsNestedInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    upsert?: UserUpsertWithoutProjectsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectsInput, UserUpdateWithoutProjectsInput>, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type RoleRequirementUpdateManyWithoutProjectNestedInput = {
    create?: XOR<RoleRequirementCreateWithoutProjectInput, RoleRequirementUncheckedCreateWithoutProjectInput> | RoleRequirementCreateWithoutProjectInput[] | RoleRequirementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RoleRequirementCreateOrConnectWithoutProjectInput | RoleRequirementCreateOrConnectWithoutProjectInput[]
    upsert?: RoleRequirementUpsertWithWhereUniqueWithoutProjectInput | RoleRequirementUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: RoleRequirementCreateManyProjectInputEnvelope
    set?: RoleRequirementWhereUniqueInput | RoleRequirementWhereUniqueInput[]
    disconnect?: RoleRequirementWhereUniqueInput | RoleRequirementWhereUniqueInput[]
    delete?: RoleRequirementWhereUniqueInput | RoleRequirementWhereUniqueInput[]
    connect?: RoleRequirementWhereUniqueInput | RoleRequirementWhereUniqueInput[]
    update?: RoleRequirementUpdateWithWhereUniqueWithoutProjectInput | RoleRequirementUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: RoleRequirementUpdateManyWithWhereWithoutProjectInput | RoleRequirementUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: RoleRequirementScalarWhereInput | RoleRequirementScalarWhereInput[]
  }

  export type AssignmentUpdateManyWithoutProjectNestedInput = {
    create?: XOR<AssignmentCreateWithoutProjectInput, AssignmentUncheckedCreateWithoutProjectInput> | AssignmentCreateWithoutProjectInput[] | AssignmentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutProjectInput | AssignmentCreateOrConnectWithoutProjectInput[]
    upsert?: AssignmentUpsertWithWhereUniqueWithoutProjectInput | AssignmentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: AssignmentCreateManyProjectInputEnvelope
    set?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    disconnect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    delete?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    update?: AssignmentUpdateWithWhereUniqueWithoutProjectInput | AssignmentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: AssignmentUpdateManyWithWhereWithoutProjectInput | AssignmentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: AssignmentScalarWhereInput | AssignmentScalarWhereInput[]
  }

  export type ScriptUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ScriptCreateWithoutProjectInput, ScriptUncheckedCreateWithoutProjectInput> | ScriptCreateWithoutProjectInput[] | ScriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ScriptCreateOrConnectWithoutProjectInput | ScriptCreateOrConnectWithoutProjectInput[]
    upsert?: ScriptUpsertWithWhereUniqueWithoutProjectInput | ScriptUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ScriptCreateManyProjectInputEnvelope
    set?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    disconnect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    delete?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    connect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    update?: ScriptUpdateWithWhereUniqueWithoutProjectInput | ScriptUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ScriptUpdateManyWithWhereWithoutProjectInput | ScriptUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ScriptScalarWhereInput | ScriptScalarWhereInput[]
  }

  export type MoodboardItemUpdateManyWithoutProjectNestedInput = {
    create?: XOR<MoodboardItemCreateWithoutProjectInput, MoodboardItemUncheckedCreateWithoutProjectInput> | MoodboardItemCreateWithoutProjectInput[] | MoodboardItemUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MoodboardItemCreateOrConnectWithoutProjectInput | MoodboardItemCreateOrConnectWithoutProjectInput[]
    upsert?: MoodboardItemUpsertWithWhereUniqueWithoutProjectInput | MoodboardItemUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: MoodboardItemCreateManyProjectInputEnvelope
    set?: MoodboardItemWhereUniqueInput | MoodboardItemWhereUniqueInput[]
    disconnect?: MoodboardItemWhereUniqueInput | MoodboardItemWhereUniqueInput[]
    delete?: MoodboardItemWhereUniqueInput | MoodboardItemWhereUniqueInput[]
    connect?: MoodboardItemWhereUniqueInput | MoodboardItemWhereUniqueInput[]
    update?: MoodboardItemUpdateWithWhereUniqueWithoutProjectInput | MoodboardItemUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: MoodboardItemUpdateManyWithWhereWithoutProjectInput | MoodboardItemUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: MoodboardItemScalarWhereInput | MoodboardItemScalarWhereInput[]
  }

  export type KnowledgeSourceUpdateManyWithoutProjectNestedInput = {
    create?: XOR<KnowledgeSourceCreateWithoutProjectInput, KnowledgeSourceUncheckedCreateWithoutProjectInput> | KnowledgeSourceCreateWithoutProjectInput[] | KnowledgeSourceUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: KnowledgeSourceCreateOrConnectWithoutProjectInput | KnowledgeSourceCreateOrConnectWithoutProjectInput[]
    upsert?: KnowledgeSourceUpsertWithWhereUniqueWithoutProjectInput | KnowledgeSourceUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: KnowledgeSourceCreateManyProjectInputEnvelope
    set?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    disconnect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    delete?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    connect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    update?: KnowledgeSourceUpdateWithWhereUniqueWithoutProjectInput | KnowledgeSourceUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: KnowledgeSourceUpdateManyWithWhereWithoutProjectInput | KnowledgeSourceUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: KnowledgeSourceScalarWhereInput | KnowledgeSourceScalarWhereInput[]
  }

  export type TranscriptUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput> | TranscriptCreateWithoutProjectInput[] | TranscriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TranscriptCreateOrConnectWithoutProjectInput | TranscriptCreateOrConnectWithoutProjectInput[]
    upsert?: TranscriptUpsertWithWhereUniqueWithoutProjectInput | TranscriptUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TranscriptCreateManyProjectInputEnvelope
    set?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    disconnect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    delete?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    connect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    update?: TranscriptUpdateWithWhereUniqueWithoutProjectInput | TranscriptUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TranscriptUpdateManyWithWhereWithoutProjectInput | TranscriptUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TranscriptScalarWhereInput | TranscriptScalarWhereInput[]
  }

  export type RoleRequirementUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<RoleRequirementCreateWithoutProjectInput, RoleRequirementUncheckedCreateWithoutProjectInput> | RoleRequirementCreateWithoutProjectInput[] | RoleRequirementUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RoleRequirementCreateOrConnectWithoutProjectInput | RoleRequirementCreateOrConnectWithoutProjectInput[]
    upsert?: RoleRequirementUpsertWithWhereUniqueWithoutProjectInput | RoleRequirementUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: RoleRequirementCreateManyProjectInputEnvelope
    set?: RoleRequirementWhereUniqueInput | RoleRequirementWhereUniqueInput[]
    disconnect?: RoleRequirementWhereUniqueInput | RoleRequirementWhereUniqueInput[]
    delete?: RoleRequirementWhereUniqueInput | RoleRequirementWhereUniqueInput[]
    connect?: RoleRequirementWhereUniqueInput | RoleRequirementWhereUniqueInput[]
    update?: RoleRequirementUpdateWithWhereUniqueWithoutProjectInput | RoleRequirementUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: RoleRequirementUpdateManyWithWhereWithoutProjectInput | RoleRequirementUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: RoleRequirementScalarWhereInput | RoleRequirementScalarWhereInput[]
  }

  export type AssignmentUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<AssignmentCreateWithoutProjectInput, AssignmentUncheckedCreateWithoutProjectInput> | AssignmentCreateWithoutProjectInput[] | AssignmentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutProjectInput | AssignmentCreateOrConnectWithoutProjectInput[]
    upsert?: AssignmentUpsertWithWhereUniqueWithoutProjectInput | AssignmentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: AssignmentCreateManyProjectInputEnvelope
    set?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    disconnect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    delete?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    update?: AssignmentUpdateWithWhereUniqueWithoutProjectInput | AssignmentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: AssignmentUpdateManyWithWhereWithoutProjectInput | AssignmentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: AssignmentScalarWhereInput | AssignmentScalarWhereInput[]
  }

  export type ScriptUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ScriptCreateWithoutProjectInput, ScriptUncheckedCreateWithoutProjectInput> | ScriptCreateWithoutProjectInput[] | ScriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ScriptCreateOrConnectWithoutProjectInput | ScriptCreateOrConnectWithoutProjectInput[]
    upsert?: ScriptUpsertWithWhereUniqueWithoutProjectInput | ScriptUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ScriptCreateManyProjectInputEnvelope
    set?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    disconnect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    delete?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    connect?: ScriptWhereUniqueInput | ScriptWhereUniqueInput[]
    update?: ScriptUpdateWithWhereUniqueWithoutProjectInput | ScriptUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ScriptUpdateManyWithWhereWithoutProjectInput | ScriptUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ScriptScalarWhereInput | ScriptScalarWhereInput[]
  }

  export type MoodboardItemUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<MoodboardItemCreateWithoutProjectInput, MoodboardItemUncheckedCreateWithoutProjectInput> | MoodboardItemCreateWithoutProjectInput[] | MoodboardItemUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MoodboardItemCreateOrConnectWithoutProjectInput | MoodboardItemCreateOrConnectWithoutProjectInput[]
    upsert?: MoodboardItemUpsertWithWhereUniqueWithoutProjectInput | MoodboardItemUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: MoodboardItemCreateManyProjectInputEnvelope
    set?: MoodboardItemWhereUniqueInput | MoodboardItemWhereUniqueInput[]
    disconnect?: MoodboardItemWhereUniqueInput | MoodboardItemWhereUniqueInput[]
    delete?: MoodboardItemWhereUniqueInput | MoodboardItemWhereUniqueInput[]
    connect?: MoodboardItemWhereUniqueInput | MoodboardItemWhereUniqueInput[]
    update?: MoodboardItemUpdateWithWhereUniqueWithoutProjectInput | MoodboardItemUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: MoodboardItemUpdateManyWithWhereWithoutProjectInput | MoodboardItemUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: MoodboardItemScalarWhereInput | MoodboardItemScalarWhereInput[]
  }

  export type KnowledgeSourceUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<KnowledgeSourceCreateWithoutProjectInput, KnowledgeSourceUncheckedCreateWithoutProjectInput> | KnowledgeSourceCreateWithoutProjectInput[] | KnowledgeSourceUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: KnowledgeSourceCreateOrConnectWithoutProjectInput | KnowledgeSourceCreateOrConnectWithoutProjectInput[]
    upsert?: KnowledgeSourceUpsertWithWhereUniqueWithoutProjectInput | KnowledgeSourceUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: KnowledgeSourceCreateManyProjectInputEnvelope
    set?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    disconnect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    delete?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    connect?: KnowledgeSourceWhereUniqueInput | KnowledgeSourceWhereUniqueInput[]
    update?: KnowledgeSourceUpdateWithWhereUniqueWithoutProjectInput | KnowledgeSourceUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: KnowledgeSourceUpdateManyWithWhereWithoutProjectInput | KnowledgeSourceUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: KnowledgeSourceScalarWhereInput | KnowledgeSourceScalarWhereInput[]
  }

  export type TranscriptUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput> | TranscriptCreateWithoutProjectInput[] | TranscriptUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TranscriptCreateOrConnectWithoutProjectInput | TranscriptCreateOrConnectWithoutProjectInput[]
    upsert?: TranscriptUpsertWithWhereUniqueWithoutProjectInput | TranscriptUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TranscriptCreateManyProjectInputEnvelope
    set?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    disconnect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    delete?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    connect?: TranscriptWhereUniqueInput | TranscriptWhereUniqueInput[]
    update?: TranscriptUpdateWithWhereUniqueWithoutProjectInput | TranscriptUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TranscriptUpdateManyWithWhereWithoutProjectInput | TranscriptUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TranscriptScalarWhereInput | TranscriptScalarWhereInput[]
  }

  export type RoleRequirementCreateskillsInput = {
    set: string[]
  }

  export type ProjectCreateNestedOneWithoutRoleRequirementsInput = {
    create?: XOR<ProjectCreateWithoutRoleRequirementsInput, ProjectUncheckedCreateWithoutRoleRequirementsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRoleRequirementsInput
    connect?: ProjectWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RoleRequirementUpdateskillsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProjectUpdateOneRequiredWithoutRoleRequirementsNestedInput = {
    create?: XOR<ProjectCreateWithoutRoleRequirementsInput, ProjectUncheckedCreateWithoutRoleRequirementsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRoleRequirementsInput
    upsert?: ProjectUpsertWithoutRoleRequirementsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutRoleRequirementsInput, ProjectUpdateWithoutRoleRequirementsInput>, ProjectUncheckedUpdateWithoutRoleRequirementsInput>
  }

  export type FreelancerCreateskillsInput = {
    set: string[]
  }

  export type AssignmentCreateNestedManyWithoutFreelancerInput = {
    create?: XOR<AssignmentCreateWithoutFreelancerInput, AssignmentUncheckedCreateWithoutFreelancerInput> | AssignmentCreateWithoutFreelancerInput[] | AssignmentUncheckedCreateWithoutFreelancerInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutFreelancerInput | AssignmentCreateOrConnectWithoutFreelancerInput[]
    createMany?: AssignmentCreateManyFreelancerInputEnvelope
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
  }

  export type AssignmentUncheckedCreateNestedManyWithoutFreelancerInput = {
    create?: XOR<AssignmentCreateWithoutFreelancerInput, AssignmentUncheckedCreateWithoutFreelancerInput> | AssignmentCreateWithoutFreelancerInput[] | AssignmentUncheckedCreateWithoutFreelancerInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutFreelancerInput | AssignmentCreateOrConnectWithoutFreelancerInput[]
    createMany?: AssignmentCreateManyFreelancerInputEnvelope
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
  }

  export type FreelancerUpdateskillsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumFreelancerStatusFieldUpdateOperationsInput = {
    set?: $Enums.FreelancerStatus
  }

  export type AssignmentUpdateManyWithoutFreelancerNestedInput = {
    create?: XOR<AssignmentCreateWithoutFreelancerInput, AssignmentUncheckedCreateWithoutFreelancerInput> | AssignmentCreateWithoutFreelancerInput[] | AssignmentUncheckedCreateWithoutFreelancerInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutFreelancerInput | AssignmentCreateOrConnectWithoutFreelancerInput[]
    upsert?: AssignmentUpsertWithWhereUniqueWithoutFreelancerInput | AssignmentUpsertWithWhereUniqueWithoutFreelancerInput[]
    createMany?: AssignmentCreateManyFreelancerInputEnvelope
    set?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    disconnect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    delete?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    update?: AssignmentUpdateWithWhereUniqueWithoutFreelancerInput | AssignmentUpdateWithWhereUniqueWithoutFreelancerInput[]
    updateMany?: AssignmentUpdateManyWithWhereWithoutFreelancerInput | AssignmentUpdateManyWithWhereWithoutFreelancerInput[]
    deleteMany?: AssignmentScalarWhereInput | AssignmentScalarWhereInput[]
  }

  export type AssignmentUncheckedUpdateManyWithoutFreelancerNestedInput = {
    create?: XOR<AssignmentCreateWithoutFreelancerInput, AssignmentUncheckedCreateWithoutFreelancerInput> | AssignmentCreateWithoutFreelancerInput[] | AssignmentUncheckedCreateWithoutFreelancerInput[]
    connectOrCreate?: AssignmentCreateOrConnectWithoutFreelancerInput | AssignmentCreateOrConnectWithoutFreelancerInput[]
    upsert?: AssignmentUpsertWithWhereUniqueWithoutFreelancerInput | AssignmentUpsertWithWhereUniqueWithoutFreelancerInput[]
    createMany?: AssignmentCreateManyFreelancerInputEnvelope
    set?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    disconnect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    delete?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    connect?: AssignmentWhereUniqueInput | AssignmentWhereUniqueInput[]
    update?: AssignmentUpdateWithWhereUniqueWithoutFreelancerInput | AssignmentUpdateWithWhereUniqueWithoutFreelancerInput[]
    updateMany?: AssignmentUpdateManyWithWhereWithoutFreelancerInput | AssignmentUpdateManyWithWhereWithoutFreelancerInput[]
    deleteMany?: AssignmentScalarWhereInput | AssignmentScalarWhereInput[]
  }

  export type FreelancerCreateNestedOneWithoutAssignmentsInput = {
    create?: XOR<FreelancerCreateWithoutAssignmentsInput, FreelancerUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: FreelancerCreateOrConnectWithoutAssignmentsInput
    connect?: FreelancerWhereUniqueInput
  }

  export type ProjectCreateNestedOneWithoutAssignmentsInput = {
    create?: XOR<ProjectCreateWithoutAssignmentsInput, ProjectUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutAssignmentsInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAssignmentsInput = {
    create?: XOR<UserCreateWithoutAssignmentsInput, UserUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssignmentsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumAssignmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.AssignmentStatus
  }

  export type FreelancerUpdateOneRequiredWithoutAssignmentsNestedInput = {
    create?: XOR<FreelancerCreateWithoutAssignmentsInput, FreelancerUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: FreelancerCreateOrConnectWithoutAssignmentsInput
    upsert?: FreelancerUpsertWithoutAssignmentsInput
    connect?: FreelancerWhereUniqueInput
    update?: XOR<XOR<FreelancerUpdateToOneWithWhereWithoutAssignmentsInput, FreelancerUpdateWithoutAssignmentsInput>, FreelancerUncheckedUpdateWithoutAssignmentsInput>
  }

  export type ProjectUpdateOneRequiredWithoutAssignmentsNestedInput = {
    create?: XOR<ProjectCreateWithoutAssignmentsInput, ProjectUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutAssignmentsInput
    upsert?: ProjectUpsertWithoutAssignmentsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutAssignmentsInput, ProjectUpdateWithoutAssignmentsInput>, ProjectUncheckedUpdateWithoutAssignmentsInput>
  }

  export type UserUpdateOneWithoutAssignmentsNestedInput = {
    create?: XOR<UserCreateWithoutAssignmentsInput, UserUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAssignmentsInput
    upsert?: UserUpsertWithoutAssignmentsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAssignmentsInput, UserUpdateWithoutAssignmentsInput>, UserUncheckedUpdateWithoutAssignmentsInput>
  }

  export type MoodboardItemCreatetagsInput = {
    set: string[]
  }

  export type MoodboardItemCreatemoodsInput = {
    set: string[]
  }

  export type MoodboardItemCreatecolorsInput = {
    set: string[]
  }

  export type ProjectCreateNestedOneWithoutMoodboardItemsInput = {
    create?: XOR<ProjectCreateWithoutMoodboardItemsInput, ProjectUncheckedCreateWithoutMoodboardItemsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMoodboardItemsInput
    connect?: ProjectWhereUniqueInput
  }

  export type MoodboardCollectionItemCreateNestedManyWithoutItemInput = {
    create?: XOR<MoodboardCollectionItemCreateWithoutItemInput, MoodboardCollectionItemUncheckedCreateWithoutItemInput> | MoodboardCollectionItemCreateWithoutItemInput[] | MoodboardCollectionItemUncheckedCreateWithoutItemInput[]
    connectOrCreate?: MoodboardCollectionItemCreateOrConnectWithoutItemInput | MoodboardCollectionItemCreateOrConnectWithoutItemInput[]
    createMany?: MoodboardCollectionItemCreateManyItemInputEnvelope
    connect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
  }

  export type MoodboardCollectionItemUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<MoodboardCollectionItemCreateWithoutItemInput, MoodboardCollectionItemUncheckedCreateWithoutItemInput> | MoodboardCollectionItemCreateWithoutItemInput[] | MoodboardCollectionItemUncheckedCreateWithoutItemInput[]
    connectOrCreate?: MoodboardCollectionItemCreateOrConnectWithoutItemInput | MoodboardCollectionItemCreateOrConnectWithoutItemInput[]
    createMany?: MoodboardCollectionItemCreateManyItemInputEnvelope
    connect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
  }

  export type MoodboardItemUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MoodboardItemUpdatemoodsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MoodboardItemUpdatecolorsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProjectUpdateOneRequiredWithoutMoodboardItemsNestedInput = {
    create?: XOR<ProjectCreateWithoutMoodboardItemsInput, ProjectUncheckedCreateWithoutMoodboardItemsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMoodboardItemsInput
    upsert?: ProjectUpsertWithoutMoodboardItemsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutMoodboardItemsInput, ProjectUpdateWithoutMoodboardItemsInput>, ProjectUncheckedUpdateWithoutMoodboardItemsInput>
  }

  export type MoodboardCollectionItemUpdateManyWithoutItemNestedInput = {
    create?: XOR<MoodboardCollectionItemCreateWithoutItemInput, MoodboardCollectionItemUncheckedCreateWithoutItemInput> | MoodboardCollectionItemCreateWithoutItemInput[] | MoodboardCollectionItemUncheckedCreateWithoutItemInput[]
    connectOrCreate?: MoodboardCollectionItemCreateOrConnectWithoutItemInput | MoodboardCollectionItemCreateOrConnectWithoutItemInput[]
    upsert?: MoodboardCollectionItemUpsertWithWhereUniqueWithoutItemInput | MoodboardCollectionItemUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: MoodboardCollectionItemCreateManyItemInputEnvelope
    set?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    disconnect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    delete?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    connect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    update?: MoodboardCollectionItemUpdateWithWhereUniqueWithoutItemInput | MoodboardCollectionItemUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: MoodboardCollectionItemUpdateManyWithWhereWithoutItemInput | MoodboardCollectionItemUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: MoodboardCollectionItemScalarWhereInput | MoodboardCollectionItemScalarWhereInput[]
  }

  export type MoodboardCollectionItemUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<MoodboardCollectionItemCreateWithoutItemInput, MoodboardCollectionItemUncheckedCreateWithoutItemInput> | MoodboardCollectionItemCreateWithoutItemInput[] | MoodboardCollectionItemUncheckedCreateWithoutItemInput[]
    connectOrCreate?: MoodboardCollectionItemCreateOrConnectWithoutItemInput | MoodboardCollectionItemCreateOrConnectWithoutItemInput[]
    upsert?: MoodboardCollectionItemUpsertWithWhereUniqueWithoutItemInput | MoodboardCollectionItemUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: MoodboardCollectionItemCreateManyItemInputEnvelope
    set?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    disconnect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    delete?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    connect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    update?: MoodboardCollectionItemUpdateWithWhereUniqueWithoutItemInput | MoodboardCollectionItemUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: MoodboardCollectionItemUpdateManyWithWhereWithoutItemInput | MoodboardCollectionItemUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: MoodboardCollectionItemScalarWhereInput | MoodboardCollectionItemScalarWhereInput[]
  }

  export type MoodboardCollectionItemCreateNestedManyWithoutCollectionInput = {
    create?: XOR<MoodboardCollectionItemCreateWithoutCollectionInput, MoodboardCollectionItemUncheckedCreateWithoutCollectionInput> | MoodboardCollectionItemCreateWithoutCollectionInput[] | MoodboardCollectionItemUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: MoodboardCollectionItemCreateOrConnectWithoutCollectionInput | MoodboardCollectionItemCreateOrConnectWithoutCollectionInput[]
    createMany?: MoodboardCollectionItemCreateManyCollectionInputEnvelope
    connect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
  }

  export type MoodboardCollectionItemUncheckedCreateNestedManyWithoutCollectionInput = {
    create?: XOR<MoodboardCollectionItemCreateWithoutCollectionInput, MoodboardCollectionItemUncheckedCreateWithoutCollectionInput> | MoodboardCollectionItemCreateWithoutCollectionInput[] | MoodboardCollectionItemUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: MoodboardCollectionItemCreateOrConnectWithoutCollectionInput | MoodboardCollectionItemCreateOrConnectWithoutCollectionInput[]
    createMany?: MoodboardCollectionItemCreateManyCollectionInputEnvelope
    connect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
  }

  export type MoodboardCollectionItemUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<MoodboardCollectionItemCreateWithoutCollectionInput, MoodboardCollectionItemUncheckedCreateWithoutCollectionInput> | MoodboardCollectionItemCreateWithoutCollectionInput[] | MoodboardCollectionItemUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: MoodboardCollectionItemCreateOrConnectWithoutCollectionInput | MoodboardCollectionItemCreateOrConnectWithoutCollectionInput[]
    upsert?: MoodboardCollectionItemUpsertWithWhereUniqueWithoutCollectionInput | MoodboardCollectionItemUpsertWithWhereUniqueWithoutCollectionInput[]
    createMany?: MoodboardCollectionItemCreateManyCollectionInputEnvelope
    set?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    disconnect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    delete?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    connect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    update?: MoodboardCollectionItemUpdateWithWhereUniqueWithoutCollectionInput | MoodboardCollectionItemUpdateWithWhereUniqueWithoutCollectionInput[]
    updateMany?: MoodboardCollectionItemUpdateManyWithWhereWithoutCollectionInput | MoodboardCollectionItemUpdateManyWithWhereWithoutCollectionInput[]
    deleteMany?: MoodboardCollectionItemScalarWhereInput | MoodboardCollectionItemScalarWhereInput[]
  }

  export type MoodboardCollectionItemUncheckedUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<MoodboardCollectionItemCreateWithoutCollectionInput, MoodboardCollectionItemUncheckedCreateWithoutCollectionInput> | MoodboardCollectionItemCreateWithoutCollectionInput[] | MoodboardCollectionItemUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: MoodboardCollectionItemCreateOrConnectWithoutCollectionInput | MoodboardCollectionItemCreateOrConnectWithoutCollectionInput[]
    upsert?: MoodboardCollectionItemUpsertWithWhereUniqueWithoutCollectionInput | MoodboardCollectionItemUpsertWithWhereUniqueWithoutCollectionInput[]
    createMany?: MoodboardCollectionItemCreateManyCollectionInputEnvelope
    set?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    disconnect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    delete?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    connect?: MoodboardCollectionItemWhereUniqueInput | MoodboardCollectionItemWhereUniqueInput[]
    update?: MoodboardCollectionItemUpdateWithWhereUniqueWithoutCollectionInput | MoodboardCollectionItemUpdateWithWhereUniqueWithoutCollectionInput[]
    updateMany?: MoodboardCollectionItemUpdateManyWithWhereWithoutCollectionInput | MoodboardCollectionItemUpdateManyWithWhereWithoutCollectionInput[]
    deleteMany?: MoodboardCollectionItemScalarWhereInput | MoodboardCollectionItemScalarWhereInput[]
  }

  export type MoodboardCollectionCreateNestedOneWithoutItemsInput = {
    create?: XOR<MoodboardCollectionCreateWithoutItemsInput, MoodboardCollectionUncheckedCreateWithoutItemsInput>
    connectOrCreate?: MoodboardCollectionCreateOrConnectWithoutItemsInput
    connect?: MoodboardCollectionWhereUniqueInput
  }

  export type MoodboardItemCreateNestedOneWithoutCollectionsInput = {
    create?: XOR<MoodboardItemCreateWithoutCollectionsInput, MoodboardItemUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: MoodboardItemCreateOrConnectWithoutCollectionsInput
    connect?: MoodboardItemWhereUniqueInput
  }

  export type MoodboardCollectionUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<MoodboardCollectionCreateWithoutItemsInput, MoodboardCollectionUncheckedCreateWithoutItemsInput>
    connectOrCreate?: MoodboardCollectionCreateOrConnectWithoutItemsInput
    upsert?: MoodboardCollectionUpsertWithoutItemsInput
    connect?: MoodboardCollectionWhereUniqueInput
    update?: XOR<XOR<MoodboardCollectionUpdateToOneWithWhereWithoutItemsInput, MoodboardCollectionUpdateWithoutItemsInput>, MoodboardCollectionUncheckedUpdateWithoutItemsInput>
  }

  export type MoodboardItemUpdateOneRequiredWithoutCollectionsNestedInput = {
    create?: XOR<MoodboardItemCreateWithoutCollectionsInput, MoodboardItemUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: MoodboardItemCreateOrConnectWithoutCollectionsInput
    upsert?: MoodboardItemUpsertWithoutCollectionsInput
    connect?: MoodboardItemWhereUniqueInput
    update?: XOR<XOR<MoodboardItemUpdateToOneWithWhereWithoutCollectionsInput, MoodboardItemUpdateWithoutCollectionsInput>, MoodboardItemUncheckedUpdateWithoutCollectionsInput>
  }

  export type ScriptCreatetagsInput = {
    set: string[]
  }

  export type ProjectCreateNestedOneWithoutScriptsInput = {
    create?: XOR<ProjectCreateWithoutScriptsInput, ProjectUncheckedCreateWithoutScriptsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutScriptsInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutScriptsInput = {
    create?: XOR<UserCreateWithoutScriptsInput, UserUncheckedCreateWithoutScriptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutScriptsInput
    connect?: UserWhereUniqueInput
  }

  export type ScriptUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProjectUpdateOneRequiredWithoutScriptsNestedInput = {
    create?: XOR<ProjectCreateWithoutScriptsInput, ProjectUncheckedCreateWithoutScriptsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutScriptsInput
    upsert?: ProjectUpsertWithoutScriptsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutScriptsInput, ProjectUpdateWithoutScriptsInput>, ProjectUncheckedUpdateWithoutScriptsInput>
  }

  export type UserUpdateOneWithoutScriptsNestedInput = {
    create?: XOR<UserCreateWithoutScriptsInput, UserUncheckedCreateWithoutScriptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutScriptsInput
    upsert?: UserUpsertWithoutScriptsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutScriptsInput, UserUpdateWithoutScriptsInput>, UserUncheckedUpdateWithoutScriptsInput>
  }

  export type ProjectCreateNestedOneWithoutKnowledgeSourcesInput = {
    create?: XOR<ProjectCreateWithoutKnowledgeSourcesInput, ProjectUncheckedCreateWithoutKnowledgeSourcesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutKnowledgeSourcesInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutKnowledgeSourcesInput = {
    create?: XOR<UserCreateWithoutKnowledgeSourcesInput, UserUncheckedCreateWithoutKnowledgeSourcesInput>
    connectOrCreate?: UserCreateOrConnectWithoutKnowledgeSourcesInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectUpdateOneWithoutKnowledgeSourcesNestedInput = {
    create?: XOR<ProjectCreateWithoutKnowledgeSourcesInput, ProjectUncheckedCreateWithoutKnowledgeSourcesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutKnowledgeSourcesInput
    upsert?: ProjectUpsertWithoutKnowledgeSourcesInput
    disconnect?: ProjectWhereInput | boolean
    delete?: ProjectWhereInput | boolean
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutKnowledgeSourcesInput, ProjectUpdateWithoutKnowledgeSourcesInput>, ProjectUncheckedUpdateWithoutKnowledgeSourcesInput>
  }

  export type UserUpdateOneWithoutKnowledgeSourcesNestedInput = {
    create?: XOR<UserCreateWithoutKnowledgeSourcesInput, UserUncheckedCreateWithoutKnowledgeSourcesInput>
    connectOrCreate?: UserCreateOrConnectWithoutKnowledgeSourcesInput
    upsert?: UserUpsertWithoutKnowledgeSourcesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutKnowledgeSourcesInput, UserUpdateWithoutKnowledgeSourcesInput>, UserUncheckedUpdateWithoutKnowledgeSourcesInput>
  }

  export type ProjectCreateNestedOneWithoutTranscriptsInput = {
    create?: XOR<ProjectCreateWithoutTranscriptsInput, ProjectUncheckedCreateWithoutTranscriptsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTranscriptsInput
    connect?: ProjectWhereUniqueInput
  }

  export type EnumTranscriptStatusFieldUpdateOperationsInput = {
    set?: $Enums.TranscriptStatus
  }

  export type ProjectUpdateOneWithoutTranscriptsNestedInput = {
    create?: XOR<ProjectCreateWithoutTranscriptsInput, ProjectUncheckedCreateWithoutTranscriptsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTranscriptsInput
    upsert?: ProjectUpsertWithoutTranscriptsInput
    disconnect?: ProjectWhereInput | boolean
    delete?: ProjectWhereInput | boolean
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutTranscriptsInput, ProjectUpdateWithoutTranscriptsInput>, ProjectUncheckedUpdateWithoutTranscriptsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedEnumFreelancerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FreelancerStatus | EnumFreelancerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FreelancerStatus[] | ListEnumFreelancerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FreelancerStatus[] | ListEnumFreelancerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFreelancerStatusFilter<$PrismaModel> | $Enums.FreelancerStatus
  }

  export type NestedEnumFreelancerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FreelancerStatus | EnumFreelancerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FreelancerStatus[] | ListEnumFreelancerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FreelancerStatus[] | ListEnumFreelancerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFreelancerStatusWithAggregatesFilter<$PrismaModel> | $Enums.FreelancerStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFreelancerStatusFilter<$PrismaModel>
    _max?: NestedEnumFreelancerStatusFilter<$PrismaModel>
  }

  export type NestedEnumAssignmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusFilter<$PrismaModel> | $Enums.AssignmentStatus
  }

  export type NestedEnumAssignmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssignmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssignmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAssignmentStatusFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumTranscriptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TranscriptStatus | EnumTranscriptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TranscriptStatus[] | ListEnumTranscriptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TranscriptStatus[] | ListEnumTranscriptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTranscriptStatusFilter<$PrismaModel> | $Enums.TranscriptStatus
  }

  export type NestedEnumTranscriptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TranscriptStatus | EnumTranscriptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TranscriptStatus[] | ListEnumTranscriptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TranscriptStatus[] | ListEnumTranscriptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTranscriptStatusWithAggregatesFilter<$PrismaModel> | $Enums.TranscriptStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTranscriptStatusFilter<$PrismaModel>
    _max?: NestedEnumTranscriptStatusFilter<$PrismaModel>
  }

  export type ProjectCreateWithoutUserInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roleRequirements?: RoleRequirementCreateNestedManyWithoutProjectInput
    assignments?: AssignmentCreateNestedManyWithoutProjectInput
    scripts?: ScriptCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roleRequirements?: RoleRequirementUncheckedCreateNestedManyWithoutProjectInput
    assignments?: AssignmentUncheckedCreateNestedManyWithoutProjectInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemUncheckedCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutUserInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput>
  }

  export type ProjectCreateManyUserInputEnvelope = {
    data: ProjectCreateManyUserInput | ProjectCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AssignmentCreateWithoutUserInput = {
    id?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    freelancer: FreelancerCreateNestedOneWithoutAssignmentsInput
    project: ProjectCreateNestedOneWithoutAssignmentsInput
  }

  export type AssignmentUncheckedCreateWithoutUserInput = {
    id?: string
    freelancerId: string
    projectId: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AssignmentCreateOrConnectWithoutUserInput = {
    where: AssignmentWhereUniqueInput
    create: XOR<AssignmentCreateWithoutUserInput, AssignmentUncheckedCreateWithoutUserInput>
  }

  export type AssignmentCreateManyUserInputEnvelope = {
    data: AssignmentCreateManyUserInput | AssignmentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ScriptCreateWithoutUserInput = {
    id?: string
    title?: string | null
    content?: string | null
    tags?: ScriptCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutScriptsInput
  }

  export type ScriptUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string | null
    content?: string | null
    tags?: ScriptCreatetagsInput | string[]
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScriptCreateOrConnectWithoutUserInput = {
    where: ScriptWhereUniqueInput
    create: XOR<ScriptCreateWithoutUserInput, ScriptUncheckedCreateWithoutUserInput>
  }

  export type ScriptCreateManyUserInputEnvelope = {
    data: ScriptCreateManyUserInput | ScriptCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type KnowledgeSourceCreateWithoutUserInput = {
    id?: string
    title: string
    content: string
    category: string
    sourceType: string
    sourceId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    project?: ProjectCreateNestedOneWithoutKnowledgeSourcesInput
  }

  export type KnowledgeSourceUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    content: string
    category: string
    sourceType: string
    sourceId?: string | null
    projectId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KnowledgeSourceCreateOrConnectWithoutUserInput = {
    where: KnowledgeSourceWhereUniqueInput
    create: XOR<KnowledgeSourceCreateWithoutUserInput, KnowledgeSourceUncheckedCreateWithoutUserInput>
  }

  export type KnowledgeSourceCreateManyUserInputEnvelope = {
    data: KnowledgeSourceCreateManyUserInput | KnowledgeSourceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithWhereUniqueWithoutUserInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutUserInput, ProjectUncheckedUpdateWithoutUserInput>
    create: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutUserInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutUserInput, ProjectUncheckedUpdateWithoutUserInput>
  }

  export type ProjectUpdateManyWithWhereWithoutUserInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutUserInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    title?: StringNullableFilter<"Project"> | string | null
    name?: StringNullableFilter<"Project"> | string | null
    description?: StringNullableFilter<"Project"> | string | null
    client?: StringNullableFilter<"Project"> | string | null
    clientName?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    startDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Project"> | Date | string | null
    budget?: FloatNullableFilter<"Project"> | number | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    userId?: StringNullableFilter<"Project"> | string | null
  }

  export type AssignmentUpsertWithWhereUniqueWithoutUserInput = {
    where: AssignmentWhereUniqueInput
    update: XOR<AssignmentUpdateWithoutUserInput, AssignmentUncheckedUpdateWithoutUserInput>
    create: XOR<AssignmentCreateWithoutUserInput, AssignmentUncheckedCreateWithoutUserInput>
  }

  export type AssignmentUpdateWithWhereUniqueWithoutUserInput = {
    where: AssignmentWhereUniqueInput
    data: XOR<AssignmentUpdateWithoutUserInput, AssignmentUncheckedUpdateWithoutUserInput>
  }

  export type AssignmentUpdateManyWithWhereWithoutUserInput = {
    where: AssignmentScalarWhereInput
    data: XOR<AssignmentUpdateManyMutationInput, AssignmentUncheckedUpdateManyWithoutUserInput>
  }

  export type AssignmentScalarWhereInput = {
    AND?: AssignmentScalarWhereInput | AssignmentScalarWhereInput[]
    OR?: AssignmentScalarWhereInput[]
    NOT?: AssignmentScalarWhereInput | AssignmentScalarWhereInput[]
    id?: StringFilter<"Assignment"> | string
    freelancerId?: StringFilter<"Assignment"> | string
    projectId?: StringFilter<"Assignment"> | string
    startDate?: DateTimeNullableFilter<"Assignment"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Assignment"> | Date | string | null
    allocation?: FloatNullableFilter<"Assignment"> | number | null
    status?: EnumAssignmentStatusFilter<"Assignment"> | $Enums.AssignmentStatus
    createdAt?: DateTimeFilter<"Assignment"> | Date | string
    updatedAt?: DateTimeFilter<"Assignment"> | Date | string
    userId?: StringNullableFilter<"Assignment"> | string | null
  }

  export type ScriptUpsertWithWhereUniqueWithoutUserInput = {
    where: ScriptWhereUniqueInput
    update: XOR<ScriptUpdateWithoutUserInput, ScriptUncheckedUpdateWithoutUserInput>
    create: XOR<ScriptCreateWithoutUserInput, ScriptUncheckedCreateWithoutUserInput>
  }

  export type ScriptUpdateWithWhereUniqueWithoutUserInput = {
    where: ScriptWhereUniqueInput
    data: XOR<ScriptUpdateWithoutUserInput, ScriptUncheckedUpdateWithoutUserInput>
  }

  export type ScriptUpdateManyWithWhereWithoutUserInput = {
    where: ScriptScalarWhereInput
    data: XOR<ScriptUpdateManyMutationInput, ScriptUncheckedUpdateManyWithoutUserInput>
  }

  export type ScriptScalarWhereInput = {
    AND?: ScriptScalarWhereInput | ScriptScalarWhereInput[]
    OR?: ScriptScalarWhereInput[]
    NOT?: ScriptScalarWhereInput | ScriptScalarWhereInput[]
    id?: StringFilter<"Script"> | string
    title?: StringNullableFilter<"Script"> | string | null
    content?: StringNullableFilter<"Script"> | string | null
    tags?: StringNullableListFilter<"Script">
    projectId?: StringFilter<"Script"> | string
    userId?: StringNullableFilter<"Script"> | string | null
    createdAt?: DateTimeFilter<"Script"> | Date | string
    updatedAt?: DateTimeFilter<"Script"> | Date | string
  }

  export type KnowledgeSourceUpsertWithWhereUniqueWithoutUserInput = {
    where: KnowledgeSourceWhereUniqueInput
    update: XOR<KnowledgeSourceUpdateWithoutUserInput, KnowledgeSourceUncheckedUpdateWithoutUserInput>
    create: XOR<KnowledgeSourceCreateWithoutUserInput, KnowledgeSourceUncheckedCreateWithoutUserInput>
  }

  export type KnowledgeSourceUpdateWithWhereUniqueWithoutUserInput = {
    where: KnowledgeSourceWhereUniqueInput
    data: XOR<KnowledgeSourceUpdateWithoutUserInput, KnowledgeSourceUncheckedUpdateWithoutUserInput>
  }

  export type KnowledgeSourceUpdateManyWithWhereWithoutUserInput = {
    where: KnowledgeSourceScalarWhereInput
    data: XOR<KnowledgeSourceUpdateManyMutationInput, KnowledgeSourceUncheckedUpdateManyWithoutUserInput>
  }

  export type KnowledgeSourceScalarWhereInput = {
    AND?: KnowledgeSourceScalarWhereInput | KnowledgeSourceScalarWhereInput[]
    OR?: KnowledgeSourceScalarWhereInput[]
    NOT?: KnowledgeSourceScalarWhereInput | KnowledgeSourceScalarWhereInput[]
    id?: StringFilter<"KnowledgeSource"> | string
    title?: StringFilter<"KnowledgeSource"> | string
    content?: StringFilter<"KnowledgeSource"> | string
    category?: StringFilter<"KnowledgeSource"> | string
    sourceType?: StringFilter<"KnowledgeSource"> | string
    sourceId?: StringNullableFilter<"KnowledgeSource"> | string | null
    projectId?: StringNullableFilter<"KnowledgeSource"> | string | null
    userId?: StringNullableFilter<"KnowledgeSource"> | string | null
    metadata?: JsonNullableFilter<"KnowledgeSource">
    embedding?: JsonNullableFilter<"KnowledgeSource">
    createdAt?: DateTimeFilter<"KnowledgeSource"> | Date | string
    updatedAt?: DateTimeFilter<"KnowledgeSource"> | Date | string
  }

  export type UserCreateWithoutProjectsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assignments?: AssignmentCreateNestedManyWithoutUserInput
    scripts?: ScriptCreateNestedManyWithoutUserInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProjectsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assignments?: AssignmentUncheckedCreateNestedManyWithoutUserInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutUserInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
  }

  export type RoleRequirementCreateWithoutProjectInput = {
    id?: string
    role: string
    count?: number | null
    skills?: RoleRequirementCreateskillsInput | string[]
  }

  export type RoleRequirementUncheckedCreateWithoutProjectInput = {
    id?: string
    role: string
    count?: number | null
    skills?: RoleRequirementCreateskillsInput | string[]
  }

  export type RoleRequirementCreateOrConnectWithoutProjectInput = {
    where: RoleRequirementWhereUniqueInput
    create: XOR<RoleRequirementCreateWithoutProjectInput, RoleRequirementUncheckedCreateWithoutProjectInput>
  }

  export type RoleRequirementCreateManyProjectInputEnvelope = {
    data: RoleRequirementCreateManyProjectInput | RoleRequirementCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type AssignmentCreateWithoutProjectInput = {
    id?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    freelancer: FreelancerCreateNestedOneWithoutAssignmentsInput
    user?: UserCreateNestedOneWithoutAssignmentsInput
  }

  export type AssignmentUncheckedCreateWithoutProjectInput = {
    id?: string
    freelancerId: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type AssignmentCreateOrConnectWithoutProjectInput = {
    where: AssignmentWhereUniqueInput
    create: XOR<AssignmentCreateWithoutProjectInput, AssignmentUncheckedCreateWithoutProjectInput>
  }

  export type AssignmentCreateManyProjectInputEnvelope = {
    data: AssignmentCreateManyProjectInput | AssignmentCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ScriptCreateWithoutProjectInput = {
    id?: string
    title?: string | null
    content?: string | null
    tags?: ScriptCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutScriptsInput
  }

  export type ScriptUncheckedCreateWithoutProjectInput = {
    id?: string
    title?: string | null
    content?: string | null
    tags?: ScriptCreatetagsInput | string[]
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScriptCreateOrConnectWithoutProjectInput = {
    where: ScriptWhereUniqueInput
    create: XOR<ScriptCreateWithoutProjectInput, ScriptUncheckedCreateWithoutProjectInput>
  }

  export type ScriptCreateManyProjectInputEnvelope = {
    data: ScriptCreateManyProjectInput | ScriptCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type MoodboardItemCreateWithoutProjectInput = {
    id?: string
    url: string
    title?: string | null
    description?: string | null
    tags?: MoodboardItemCreatetagsInput | string[]
    moods?: MoodboardItemCreatemoodsInput | string[]
    colors?: MoodboardItemCreatecolorsInput | string[]
    shotType?: string | null
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: MoodboardCollectionItemCreateNestedManyWithoutItemInput
  }

  export type MoodboardItemUncheckedCreateWithoutProjectInput = {
    id?: string
    url: string
    title?: string | null
    description?: string | null
    tags?: MoodboardItemCreatetagsInput | string[]
    moods?: MoodboardItemCreatemoodsInput | string[]
    colors?: MoodboardItemCreatecolorsInput | string[]
    shotType?: string | null
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: MoodboardCollectionItemUncheckedCreateNestedManyWithoutItemInput
  }

  export type MoodboardItemCreateOrConnectWithoutProjectInput = {
    where: MoodboardItemWhereUniqueInput
    create: XOR<MoodboardItemCreateWithoutProjectInput, MoodboardItemUncheckedCreateWithoutProjectInput>
  }

  export type MoodboardItemCreateManyProjectInputEnvelope = {
    data: MoodboardItemCreateManyProjectInput | MoodboardItemCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type KnowledgeSourceCreateWithoutProjectInput = {
    id?: string
    title: string
    content: string
    category: string
    sourceType: string
    sourceId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutKnowledgeSourcesInput
  }

  export type KnowledgeSourceUncheckedCreateWithoutProjectInput = {
    id?: string
    title: string
    content: string
    category: string
    sourceType: string
    sourceId?: string | null
    userId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KnowledgeSourceCreateOrConnectWithoutProjectInput = {
    where: KnowledgeSourceWhereUniqueInput
    create: XOR<KnowledgeSourceCreateWithoutProjectInput, KnowledgeSourceUncheckedCreateWithoutProjectInput>
  }

  export type KnowledgeSourceCreateManyProjectInputEnvelope = {
    data: KnowledgeSourceCreateManyProjectInput | KnowledgeSourceCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type TranscriptCreateWithoutProjectInput = {
    id?: string
    jobId: string
    title?: string | null
    content?: string | null
    sourceUrl?: string | null
    status?: $Enums.TranscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptUncheckedCreateWithoutProjectInput = {
    id?: string
    jobId: string
    title?: string | null
    content?: string | null
    sourceUrl?: string | null
    status?: $Enums.TranscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptCreateOrConnectWithoutProjectInput = {
    where: TranscriptWhereUniqueInput
    create: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput>
  }

  export type TranscriptCreateManyProjectInputEnvelope = {
    data: TranscriptCreateManyProjectInput | TranscriptCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutProjectsInput = {
    update: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type UserUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: AssignmentUpdateManyWithoutUserNestedInput
    scripts?: ScriptUpdateManyWithoutUserNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: AssignmentUncheckedUpdateManyWithoutUserNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutUserNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RoleRequirementUpsertWithWhereUniqueWithoutProjectInput = {
    where: RoleRequirementWhereUniqueInput
    update: XOR<RoleRequirementUpdateWithoutProjectInput, RoleRequirementUncheckedUpdateWithoutProjectInput>
    create: XOR<RoleRequirementCreateWithoutProjectInput, RoleRequirementUncheckedCreateWithoutProjectInput>
  }

  export type RoleRequirementUpdateWithWhereUniqueWithoutProjectInput = {
    where: RoleRequirementWhereUniqueInput
    data: XOR<RoleRequirementUpdateWithoutProjectInput, RoleRequirementUncheckedUpdateWithoutProjectInput>
  }

  export type RoleRequirementUpdateManyWithWhereWithoutProjectInput = {
    where: RoleRequirementScalarWhereInput
    data: XOR<RoleRequirementUpdateManyMutationInput, RoleRequirementUncheckedUpdateManyWithoutProjectInput>
  }

  export type RoleRequirementScalarWhereInput = {
    AND?: RoleRequirementScalarWhereInput | RoleRequirementScalarWhereInput[]
    OR?: RoleRequirementScalarWhereInput[]
    NOT?: RoleRequirementScalarWhereInput | RoleRequirementScalarWhereInput[]
    id?: StringFilter<"RoleRequirement"> | string
    role?: StringFilter<"RoleRequirement"> | string
    count?: IntNullableFilter<"RoleRequirement"> | number | null
    skills?: StringNullableListFilter<"RoleRequirement">
    projectId?: StringFilter<"RoleRequirement"> | string
  }

  export type AssignmentUpsertWithWhereUniqueWithoutProjectInput = {
    where: AssignmentWhereUniqueInput
    update: XOR<AssignmentUpdateWithoutProjectInput, AssignmentUncheckedUpdateWithoutProjectInput>
    create: XOR<AssignmentCreateWithoutProjectInput, AssignmentUncheckedCreateWithoutProjectInput>
  }

  export type AssignmentUpdateWithWhereUniqueWithoutProjectInput = {
    where: AssignmentWhereUniqueInput
    data: XOR<AssignmentUpdateWithoutProjectInput, AssignmentUncheckedUpdateWithoutProjectInput>
  }

  export type AssignmentUpdateManyWithWhereWithoutProjectInput = {
    where: AssignmentScalarWhereInput
    data: XOR<AssignmentUpdateManyMutationInput, AssignmentUncheckedUpdateManyWithoutProjectInput>
  }

  export type ScriptUpsertWithWhereUniqueWithoutProjectInput = {
    where: ScriptWhereUniqueInput
    update: XOR<ScriptUpdateWithoutProjectInput, ScriptUncheckedUpdateWithoutProjectInput>
    create: XOR<ScriptCreateWithoutProjectInput, ScriptUncheckedCreateWithoutProjectInput>
  }

  export type ScriptUpdateWithWhereUniqueWithoutProjectInput = {
    where: ScriptWhereUniqueInput
    data: XOR<ScriptUpdateWithoutProjectInput, ScriptUncheckedUpdateWithoutProjectInput>
  }

  export type ScriptUpdateManyWithWhereWithoutProjectInput = {
    where: ScriptScalarWhereInput
    data: XOR<ScriptUpdateManyMutationInput, ScriptUncheckedUpdateManyWithoutProjectInput>
  }

  export type MoodboardItemUpsertWithWhereUniqueWithoutProjectInput = {
    where: MoodboardItemWhereUniqueInput
    update: XOR<MoodboardItemUpdateWithoutProjectInput, MoodboardItemUncheckedUpdateWithoutProjectInput>
    create: XOR<MoodboardItemCreateWithoutProjectInput, MoodboardItemUncheckedCreateWithoutProjectInput>
  }

  export type MoodboardItemUpdateWithWhereUniqueWithoutProjectInput = {
    where: MoodboardItemWhereUniqueInput
    data: XOR<MoodboardItemUpdateWithoutProjectInput, MoodboardItemUncheckedUpdateWithoutProjectInput>
  }

  export type MoodboardItemUpdateManyWithWhereWithoutProjectInput = {
    where: MoodboardItemScalarWhereInput
    data: XOR<MoodboardItemUpdateManyMutationInput, MoodboardItemUncheckedUpdateManyWithoutProjectInput>
  }

  export type MoodboardItemScalarWhereInput = {
    AND?: MoodboardItemScalarWhereInput | MoodboardItemScalarWhereInput[]
    OR?: MoodboardItemScalarWhereInput[]
    NOT?: MoodboardItemScalarWhereInput | MoodboardItemScalarWhereInput[]
    id?: StringFilter<"MoodboardItem"> | string
    url?: StringFilter<"MoodboardItem"> | string
    title?: StringNullableFilter<"MoodboardItem"> | string | null
    description?: StringNullableFilter<"MoodboardItem"> | string | null
    tags?: StringNullableListFilter<"MoodboardItem">
    moods?: StringNullableListFilter<"MoodboardItem">
    colors?: StringNullableListFilter<"MoodboardItem">
    shotType?: StringNullableFilter<"MoodboardItem"> | string | null
    source?: StringFilter<"MoodboardItem"> | string
    metadata?: JsonNullableFilter<"MoodboardItem">
    isFavorite?: BoolFilter<"MoodboardItem"> | boolean
    projectId?: StringFilter<"MoodboardItem"> | string
    createdAt?: DateTimeFilter<"MoodboardItem"> | Date | string
    updatedAt?: DateTimeFilter<"MoodboardItem"> | Date | string
  }

  export type KnowledgeSourceUpsertWithWhereUniqueWithoutProjectInput = {
    where: KnowledgeSourceWhereUniqueInput
    update: XOR<KnowledgeSourceUpdateWithoutProjectInput, KnowledgeSourceUncheckedUpdateWithoutProjectInput>
    create: XOR<KnowledgeSourceCreateWithoutProjectInput, KnowledgeSourceUncheckedCreateWithoutProjectInput>
  }

  export type KnowledgeSourceUpdateWithWhereUniqueWithoutProjectInput = {
    where: KnowledgeSourceWhereUniqueInput
    data: XOR<KnowledgeSourceUpdateWithoutProjectInput, KnowledgeSourceUncheckedUpdateWithoutProjectInput>
  }

  export type KnowledgeSourceUpdateManyWithWhereWithoutProjectInput = {
    where: KnowledgeSourceScalarWhereInput
    data: XOR<KnowledgeSourceUpdateManyMutationInput, KnowledgeSourceUncheckedUpdateManyWithoutProjectInput>
  }

  export type TranscriptUpsertWithWhereUniqueWithoutProjectInput = {
    where: TranscriptWhereUniqueInput
    update: XOR<TranscriptUpdateWithoutProjectInput, TranscriptUncheckedUpdateWithoutProjectInput>
    create: XOR<TranscriptCreateWithoutProjectInput, TranscriptUncheckedCreateWithoutProjectInput>
  }

  export type TranscriptUpdateWithWhereUniqueWithoutProjectInput = {
    where: TranscriptWhereUniqueInput
    data: XOR<TranscriptUpdateWithoutProjectInput, TranscriptUncheckedUpdateWithoutProjectInput>
  }

  export type TranscriptUpdateManyWithWhereWithoutProjectInput = {
    where: TranscriptScalarWhereInput
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyWithoutProjectInput>
  }

  export type TranscriptScalarWhereInput = {
    AND?: TranscriptScalarWhereInput | TranscriptScalarWhereInput[]
    OR?: TranscriptScalarWhereInput[]
    NOT?: TranscriptScalarWhereInput | TranscriptScalarWhereInput[]
    id?: StringFilter<"Transcript"> | string
    jobId?: StringFilter<"Transcript"> | string
    title?: StringNullableFilter<"Transcript"> | string | null
    content?: StringNullableFilter<"Transcript"> | string | null
    sourceUrl?: StringNullableFilter<"Transcript"> | string | null
    status?: EnumTranscriptStatusFilter<"Transcript"> | $Enums.TranscriptStatus
    projectId?: StringNullableFilter<"Transcript"> | string | null
    createdAt?: DateTimeFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeFilter<"Transcript"> | Date | string
  }

  export type ProjectCreateWithoutRoleRequirementsInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutProjectsInput
    assignments?: AssignmentCreateNestedManyWithoutProjectInput
    scripts?: ScriptCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutRoleRequirementsInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    assignments?: AssignmentUncheckedCreateNestedManyWithoutProjectInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemUncheckedCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutRoleRequirementsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutRoleRequirementsInput, ProjectUncheckedCreateWithoutRoleRequirementsInput>
  }

  export type ProjectUpsertWithoutRoleRequirementsInput = {
    update: XOR<ProjectUpdateWithoutRoleRequirementsInput, ProjectUncheckedUpdateWithoutRoleRequirementsInput>
    create: XOR<ProjectCreateWithoutRoleRequirementsInput, ProjectUncheckedCreateWithoutRoleRequirementsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutRoleRequirementsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutRoleRequirementsInput, ProjectUncheckedUpdateWithoutRoleRequirementsInput>
  }

  export type ProjectUpdateWithoutRoleRequirementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutProjectsNestedInput
    assignments?: AssignmentUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutRoleRequirementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    assignments?: AssignmentUncheckedUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUncheckedUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type AssignmentCreateWithoutFreelancerInput = {
    id?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutAssignmentsInput
    user?: UserCreateNestedOneWithoutAssignmentsInput
  }

  export type AssignmentUncheckedCreateWithoutFreelancerInput = {
    id?: string
    projectId: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type AssignmentCreateOrConnectWithoutFreelancerInput = {
    where: AssignmentWhereUniqueInput
    create: XOR<AssignmentCreateWithoutFreelancerInput, AssignmentUncheckedCreateWithoutFreelancerInput>
  }

  export type AssignmentCreateManyFreelancerInputEnvelope = {
    data: AssignmentCreateManyFreelancerInput | AssignmentCreateManyFreelancerInput[]
    skipDuplicates?: boolean
  }

  export type AssignmentUpsertWithWhereUniqueWithoutFreelancerInput = {
    where: AssignmentWhereUniqueInput
    update: XOR<AssignmentUpdateWithoutFreelancerInput, AssignmentUncheckedUpdateWithoutFreelancerInput>
    create: XOR<AssignmentCreateWithoutFreelancerInput, AssignmentUncheckedCreateWithoutFreelancerInput>
  }

  export type AssignmentUpdateWithWhereUniqueWithoutFreelancerInput = {
    where: AssignmentWhereUniqueInput
    data: XOR<AssignmentUpdateWithoutFreelancerInput, AssignmentUncheckedUpdateWithoutFreelancerInput>
  }

  export type AssignmentUpdateManyWithWhereWithoutFreelancerInput = {
    where: AssignmentScalarWhereInput
    data: XOR<AssignmentUpdateManyMutationInput, AssignmentUncheckedUpdateManyWithoutFreelancerInput>
  }

  export type FreelancerCreateWithoutAssignmentsInput = {
    id?: string
    name: string
    email?: string | null
    contactInfo?: string | null
    skills?: FreelancerCreateskillsInput | string[]
    role?: string | null
    rate?: number | null
    status?: $Enums.FreelancerStatus
    bio?: string | null
    phone?: string | null
    location?: string | null
    availability?: string | null
    portfolio?: string | null
    notes?: string | null
    rating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FreelancerUncheckedCreateWithoutAssignmentsInput = {
    id?: string
    name: string
    email?: string | null
    contactInfo?: string | null
    skills?: FreelancerCreateskillsInput | string[]
    role?: string | null
    rate?: number | null
    status?: $Enums.FreelancerStatus
    bio?: string | null
    phone?: string | null
    location?: string | null
    availability?: string | null
    portfolio?: string | null
    notes?: string | null
    rating?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FreelancerCreateOrConnectWithoutAssignmentsInput = {
    where: FreelancerWhereUniqueInput
    create: XOR<FreelancerCreateWithoutAssignmentsInput, FreelancerUncheckedCreateWithoutAssignmentsInput>
  }

  export type ProjectCreateWithoutAssignmentsInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutProjectsInput
    roleRequirements?: RoleRequirementCreateNestedManyWithoutProjectInput
    scripts?: ScriptCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutAssignmentsInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    roleRequirements?: RoleRequirementUncheckedCreateNestedManyWithoutProjectInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemUncheckedCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutAssignmentsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutAssignmentsInput, ProjectUncheckedCreateWithoutAssignmentsInput>
  }

  export type UserCreateWithoutAssignmentsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    scripts?: ScriptCreateNestedManyWithoutUserInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAssignmentsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutUserInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAssignmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAssignmentsInput, UserUncheckedCreateWithoutAssignmentsInput>
  }

  export type FreelancerUpsertWithoutAssignmentsInput = {
    update: XOR<FreelancerUpdateWithoutAssignmentsInput, FreelancerUncheckedUpdateWithoutAssignmentsInput>
    create: XOR<FreelancerCreateWithoutAssignmentsInput, FreelancerUncheckedCreateWithoutAssignmentsInput>
    where?: FreelancerWhereInput
  }

  export type FreelancerUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: FreelancerWhereInput
    data: XOR<FreelancerUpdateWithoutAssignmentsInput, FreelancerUncheckedUpdateWithoutAssignmentsInput>
  }

  export type FreelancerUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: FreelancerUpdateskillsInput | string[]
    role?: NullableStringFieldUpdateOperationsInput | string | null
    rate?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumFreelancerStatusFieldUpdateOperationsInput | $Enums.FreelancerStatus
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FreelancerUncheckedUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: FreelancerUpdateskillsInput | string[]
    role?: NullableStringFieldUpdateOperationsInput | string | null
    rate?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumFreelancerStatusFieldUpdateOperationsInput | $Enums.FreelancerStatus
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    availability?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUpsertWithoutAssignmentsInput = {
    update: XOR<ProjectUpdateWithoutAssignmentsInput, ProjectUncheckedUpdateWithoutAssignmentsInput>
    create: XOR<ProjectCreateWithoutAssignmentsInput, ProjectUncheckedCreateWithoutAssignmentsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutAssignmentsInput, ProjectUncheckedUpdateWithoutAssignmentsInput>
  }

  export type ProjectUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutProjectsNestedInput
    roleRequirements?: RoleRequirementUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roleRequirements?: RoleRequirementUncheckedUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUncheckedUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutAssignmentsInput = {
    update: XOR<UserUpdateWithoutAssignmentsInput, UserUncheckedUpdateWithoutAssignmentsInput>
    create: XOR<UserCreateWithoutAssignmentsInput, UserUncheckedCreateWithoutAssignmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAssignmentsInput, UserUncheckedUpdateWithoutAssignmentsInput>
  }

  export type UserUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    scripts?: ScriptUpdateManyWithoutUserNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutUserNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectCreateWithoutMoodboardItemsInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutProjectsInput
    roleRequirements?: RoleRequirementCreateNestedManyWithoutProjectInput
    assignments?: AssignmentCreateNestedManyWithoutProjectInput
    scripts?: ScriptCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutMoodboardItemsInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    roleRequirements?: RoleRequirementUncheckedCreateNestedManyWithoutProjectInput
    assignments?: AssignmentUncheckedCreateNestedManyWithoutProjectInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutMoodboardItemsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutMoodboardItemsInput, ProjectUncheckedCreateWithoutMoodboardItemsInput>
  }

  export type MoodboardCollectionItemCreateWithoutItemInput = {
    id?: string
    collection: MoodboardCollectionCreateNestedOneWithoutItemsInput
  }

  export type MoodboardCollectionItemUncheckedCreateWithoutItemInput = {
    id?: string
    collectionId: string
  }

  export type MoodboardCollectionItemCreateOrConnectWithoutItemInput = {
    where: MoodboardCollectionItemWhereUniqueInput
    create: XOR<MoodboardCollectionItemCreateWithoutItemInput, MoodboardCollectionItemUncheckedCreateWithoutItemInput>
  }

  export type MoodboardCollectionItemCreateManyItemInputEnvelope = {
    data: MoodboardCollectionItemCreateManyItemInput | MoodboardCollectionItemCreateManyItemInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutMoodboardItemsInput = {
    update: XOR<ProjectUpdateWithoutMoodboardItemsInput, ProjectUncheckedUpdateWithoutMoodboardItemsInput>
    create: XOR<ProjectCreateWithoutMoodboardItemsInput, ProjectUncheckedCreateWithoutMoodboardItemsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutMoodboardItemsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutMoodboardItemsInput, ProjectUncheckedUpdateWithoutMoodboardItemsInput>
  }

  export type ProjectUpdateWithoutMoodboardItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutProjectsNestedInput
    roleRequirements?: RoleRequirementUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutMoodboardItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roleRequirements?: RoleRequirementUncheckedUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUncheckedUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type MoodboardCollectionItemUpsertWithWhereUniqueWithoutItemInput = {
    where: MoodboardCollectionItemWhereUniqueInput
    update: XOR<MoodboardCollectionItemUpdateWithoutItemInput, MoodboardCollectionItemUncheckedUpdateWithoutItemInput>
    create: XOR<MoodboardCollectionItemCreateWithoutItemInput, MoodboardCollectionItemUncheckedCreateWithoutItemInput>
  }

  export type MoodboardCollectionItemUpdateWithWhereUniqueWithoutItemInput = {
    where: MoodboardCollectionItemWhereUniqueInput
    data: XOR<MoodboardCollectionItemUpdateWithoutItemInput, MoodboardCollectionItemUncheckedUpdateWithoutItemInput>
  }

  export type MoodboardCollectionItemUpdateManyWithWhereWithoutItemInput = {
    where: MoodboardCollectionItemScalarWhereInput
    data: XOR<MoodboardCollectionItemUpdateManyMutationInput, MoodboardCollectionItemUncheckedUpdateManyWithoutItemInput>
  }

  export type MoodboardCollectionItemScalarWhereInput = {
    AND?: MoodboardCollectionItemScalarWhereInput | MoodboardCollectionItemScalarWhereInput[]
    OR?: MoodboardCollectionItemScalarWhereInput[]
    NOT?: MoodboardCollectionItemScalarWhereInput | MoodboardCollectionItemScalarWhereInput[]
    id?: StringFilter<"MoodboardCollectionItem"> | string
    collectionId?: StringFilter<"MoodboardCollectionItem"> | string
    moodboardItemId?: StringFilter<"MoodboardCollectionItem"> | string
  }

  export type MoodboardCollectionItemCreateWithoutCollectionInput = {
    id?: string
    item: MoodboardItemCreateNestedOneWithoutCollectionsInput
  }

  export type MoodboardCollectionItemUncheckedCreateWithoutCollectionInput = {
    id?: string
    moodboardItemId: string
  }

  export type MoodboardCollectionItemCreateOrConnectWithoutCollectionInput = {
    where: MoodboardCollectionItemWhereUniqueInput
    create: XOR<MoodboardCollectionItemCreateWithoutCollectionInput, MoodboardCollectionItemUncheckedCreateWithoutCollectionInput>
  }

  export type MoodboardCollectionItemCreateManyCollectionInputEnvelope = {
    data: MoodboardCollectionItemCreateManyCollectionInput | MoodboardCollectionItemCreateManyCollectionInput[]
    skipDuplicates?: boolean
  }

  export type MoodboardCollectionItemUpsertWithWhereUniqueWithoutCollectionInput = {
    where: MoodboardCollectionItemWhereUniqueInput
    update: XOR<MoodboardCollectionItemUpdateWithoutCollectionInput, MoodboardCollectionItemUncheckedUpdateWithoutCollectionInput>
    create: XOR<MoodboardCollectionItemCreateWithoutCollectionInput, MoodboardCollectionItemUncheckedCreateWithoutCollectionInput>
  }

  export type MoodboardCollectionItemUpdateWithWhereUniqueWithoutCollectionInput = {
    where: MoodboardCollectionItemWhereUniqueInput
    data: XOR<MoodboardCollectionItemUpdateWithoutCollectionInput, MoodboardCollectionItemUncheckedUpdateWithoutCollectionInput>
  }

  export type MoodboardCollectionItemUpdateManyWithWhereWithoutCollectionInput = {
    where: MoodboardCollectionItemScalarWhereInput
    data: XOR<MoodboardCollectionItemUpdateManyMutationInput, MoodboardCollectionItemUncheckedUpdateManyWithoutCollectionInput>
  }

  export type MoodboardCollectionCreateWithoutItemsInput = {
    id?: string
    name: string
    description?: string | null
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoodboardCollectionUncheckedCreateWithoutItemsInput = {
    id?: string
    name: string
    description?: string | null
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoodboardCollectionCreateOrConnectWithoutItemsInput = {
    where: MoodboardCollectionWhereUniqueInput
    create: XOR<MoodboardCollectionCreateWithoutItemsInput, MoodboardCollectionUncheckedCreateWithoutItemsInput>
  }

  export type MoodboardItemCreateWithoutCollectionsInput = {
    id?: string
    url: string
    title?: string | null
    description?: string | null
    tags?: MoodboardItemCreatetagsInput | string[]
    moods?: MoodboardItemCreatemoodsInput | string[]
    colors?: MoodboardItemCreatecolorsInput | string[]
    shotType?: string | null
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutMoodboardItemsInput
  }

  export type MoodboardItemUncheckedCreateWithoutCollectionsInput = {
    id?: string
    url: string
    title?: string | null
    description?: string | null
    tags?: MoodboardItemCreatetagsInput | string[]
    moods?: MoodboardItemCreatemoodsInput | string[]
    colors?: MoodboardItemCreatecolorsInput | string[]
    shotType?: string | null
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: boolean
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoodboardItemCreateOrConnectWithoutCollectionsInput = {
    where: MoodboardItemWhereUniqueInput
    create: XOR<MoodboardItemCreateWithoutCollectionsInput, MoodboardItemUncheckedCreateWithoutCollectionsInput>
  }

  export type MoodboardCollectionUpsertWithoutItemsInput = {
    update: XOR<MoodboardCollectionUpdateWithoutItemsInput, MoodboardCollectionUncheckedUpdateWithoutItemsInput>
    create: XOR<MoodboardCollectionCreateWithoutItemsInput, MoodboardCollectionUncheckedCreateWithoutItemsInput>
    where?: MoodboardCollectionWhereInput
  }

  export type MoodboardCollectionUpdateToOneWithWhereWithoutItemsInput = {
    where?: MoodboardCollectionWhereInput
    data: XOR<MoodboardCollectionUpdateWithoutItemsInput, MoodboardCollectionUncheckedUpdateWithoutItemsInput>
  }

  export type MoodboardCollectionUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodboardCollectionUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodboardItemUpsertWithoutCollectionsInput = {
    update: XOR<MoodboardItemUpdateWithoutCollectionsInput, MoodboardItemUncheckedUpdateWithoutCollectionsInput>
    create: XOR<MoodboardItemCreateWithoutCollectionsInput, MoodboardItemUncheckedCreateWithoutCollectionsInput>
    where?: MoodboardItemWhereInput
  }

  export type MoodboardItemUpdateToOneWithWhereWithoutCollectionsInput = {
    where?: MoodboardItemWhereInput
    data: XOR<MoodboardItemUpdateWithoutCollectionsInput, MoodboardItemUncheckedUpdateWithoutCollectionsInput>
  }

  export type MoodboardItemUpdateWithoutCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MoodboardItemUpdatetagsInput | string[]
    moods?: MoodboardItemUpdatemoodsInput | string[]
    colors?: MoodboardItemUpdatecolorsInput | string[]
    shotType?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutMoodboardItemsNestedInput
  }

  export type MoodboardItemUncheckedUpdateWithoutCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MoodboardItemUpdatetagsInput | string[]
    moods?: MoodboardItemUpdatemoodsInput | string[]
    colors?: MoodboardItemUpdatecolorsInput | string[]
    shotType?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateWithoutScriptsInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutProjectsInput
    roleRequirements?: RoleRequirementCreateNestedManyWithoutProjectInput
    assignments?: AssignmentCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutScriptsInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    roleRequirements?: RoleRequirementUncheckedCreateNestedManyWithoutProjectInput
    assignments?: AssignmentUncheckedCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemUncheckedCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutScriptsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutScriptsInput, ProjectUncheckedCreateWithoutScriptsInput>
  }

  export type UserCreateWithoutScriptsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    assignments?: AssignmentCreateNestedManyWithoutUserInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutScriptsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    assignments?: AssignmentUncheckedCreateNestedManyWithoutUserInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutScriptsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutScriptsInput, UserUncheckedCreateWithoutScriptsInput>
  }

  export type ProjectUpsertWithoutScriptsInput = {
    update: XOR<ProjectUpdateWithoutScriptsInput, ProjectUncheckedUpdateWithoutScriptsInput>
    create: XOR<ProjectCreateWithoutScriptsInput, ProjectUncheckedCreateWithoutScriptsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutScriptsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutScriptsInput, ProjectUncheckedUpdateWithoutScriptsInput>
  }

  export type ProjectUpdateWithoutScriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutProjectsNestedInput
    roleRequirements?: RoleRequirementUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutScriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roleRequirements?: RoleRequirementUncheckedUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUncheckedUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUncheckedUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutScriptsInput = {
    update: XOR<UserUpdateWithoutScriptsInput, UserUncheckedUpdateWithoutScriptsInput>
    create: XOR<UserCreateWithoutScriptsInput, UserUncheckedCreateWithoutScriptsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutScriptsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutScriptsInput, UserUncheckedUpdateWithoutScriptsInput>
  }

  export type UserUpdateWithoutScriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    assignments?: AssignmentUpdateManyWithoutUserNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutScriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    assignments?: AssignmentUncheckedUpdateManyWithoutUserNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectCreateWithoutKnowledgeSourcesInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutProjectsInput
    roleRequirements?: RoleRequirementCreateNestedManyWithoutProjectInput
    assignments?: AssignmentCreateNestedManyWithoutProjectInput
    scripts?: ScriptCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutKnowledgeSourcesInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    roleRequirements?: RoleRequirementUncheckedCreateNestedManyWithoutProjectInput
    assignments?: AssignmentUncheckedCreateNestedManyWithoutProjectInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemUncheckedCreateNestedManyWithoutProjectInput
    transcripts?: TranscriptUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutKnowledgeSourcesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutKnowledgeSourcesInput, ProjectUncheckedCreateWithoutKnowledgeSourcesInput>
  }

  export type UserCreateWithoutKnowledgeSourcesInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    assignments?: AssignmentCreateNestedManyWithoutUserInput
    scripts?: ScriptCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutKnowledgeSourcesInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    assignments?: AssignmentUncheckedCreateNestedManyWithoutUserInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutKnowledgeSourcesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutKnowledgeSourcesInput, UserUncheckedCreateWithoutKnowledgeSourcesInput>
  }

  export type ProjectUpsertWithoutKnowledgeSourcesInput = {
    update: XOR<ProjectUpdateWithoutKnowledgeSourcesInput, ProjectUncheckedUpdateWithoutKnowledgeSourcesInput>
    create: XOR<ProjectCreateWithoutKnowledgeSourcesInput, ProjectUncheckedCreateWithoutKnowledgeSourcesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutKnowledgeSourcesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutKnowledgeSourcesInput, ProjectUncheckedUpdateWithoutKnowledgeSourcesInput>
  }

  export type ProjectUpdateWithoutKnowledgeSourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutProjectsNestedInput
    roleRequirements?: RoleRequirementUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutKnowledgeSourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roleRequirements?: RoleRequirementUncheckedUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUncheckedUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUncheckedUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutKnowledgeSourcesInput = {
    update: XOR<UserUpdateWithoutKnowledgeSourcesInput, UserUncheckedUpdateWithoutKnowledgeSourcesInput>
    create: XOR<UserCreateWithoutKnowledgeSourcesInput, UserUncheckedCreateWithoutKnowledgeSourcesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutKnowledgeSourcesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutKnowledgeSourcesInput, UserUncheckedUpdateWithoutKnowledgeSourcesInput>
  }

  export type UserUpdateWithoutKnowledgeSourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    assignments?: AssignmentUpdateManyWithoutUserNestedInput
    scripts?: ScriptUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutKnowledgeSourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    assignments?: AssignmentUncheckedUpdateManyWithoutUserNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectCreateWithoutTranscriptsInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutProjectsInput
    roleRequirements?: RoleRequirementCreateNestedManyWithoutProjectInput
    assignments?: AssignmentCreateNestedManyWithoutProjectInput
    scripts?: ScriptCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutTranscriptsInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    roleRequirements?: RoleRequirementUncheckedCreateNestedManyWithoutProjectInput
    assignments?: AssignmentUncheckedCreateNestedManyWithoutProjectInput
    scripts?: ScriptUncheckedCreateNestedManyWithoutProjectInput
    moodboardItems?: MoodboardItemUncheckedCreateNestedManyWithoutProjectInput
    knowledgeSources?: KnowledgeSourceUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutTranscriptsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTranscriptsInput, ProjectUncheckedCreateWithoutTranscriptsInput>
  }

  export type ProjectUpsertWithoutTranscriptsInput = {
    update: XOR<ProjectUpdateWithoutTranscriptsInput, ProjectUncheckedUpdateWithoutTranscriptsInput>
    create: XOR<ProjectCreateWithoutTranscriptsInput, ProjectUncheckedCreateWithoutTranscriptsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutTranscriptsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutTranscriptsInput, ProjectUncheckedUpdateWithoutTranscriptsInput>
  }

  export type ProjectUpdateWithoutTranscriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutProjectsNestedInput
    roleRequirements?: RoleRequirementUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTranscriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roleRequirements?: RoleRequirementUncheckedUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUncheckedUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUncheckedUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyUserInput = {
    id?: string
    title?: string | null
    name?: string | null
    description?: string | null
    client?: string | null
    clientName?: string | null
    status?: $Enums.ProjectStatus
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AssignmentCreateManyUserInput = {
    id?: string
    freelancerId: string
    projectId: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScriptCreateManyUserInput = {
    id?: string
    title?: string | null
    content?: string | null
    tags?: ScriptCreatetagsInput | string[]
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KnowledgeSourceCreateManyUserInput = {
    id?: string
    title: string
    content: string
    category: string
    sourceType: string
    sourceId?: string | null
    projectId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roleRequirements?: RoleRequirementUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roleRequirements?: RoleRequirementUncheckedUpdateManyWithoutProjectNestedInput
    assignments?: AssignmentUncheckedUpdateManyWithoutProjectNestedInput
    scripts?: ScriptUncheckedUpdateManyWithoutProjectNestedInput
    moodboardItems?: MoodboardItemUncheckedUpdateManyWithoutProjectNestedInput
    knowledgeSources?: KnowledgeSourceUncheckedUpdateManyWithoutProjectNestedInput
    transcripts?: TranscriptUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    client?: NullableStringFieldUpdateOperationsInput | string | null
    clientName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssignmentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    freelancer?: FreelancerUpdateOneRequiredWithoutAssignmentsNestedInput
    project?: ProjectUpdateOneRequiredWithoutAssignmentsNestedInput
  }

  export type AssignmentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    freelancerId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssignmentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    freelancerId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScriptUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ScriptUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutScriptsNestedInput
  }

  export type ScriptUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ScriptUpdatetagsInput | string[]
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScriptUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ScriptUpdatetagsInput | string[]
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeSourceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneWithoutKnowledgeSourcesNestedInput
  }

  export type KnowledgeSourceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeSourceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleRequirementCreateManyProjectInput = {
    id?: string
    role: string
    count?: number | null
    skills?: RoleRequirementCreateskillsInput | string[]
  }

  export type AssignmentCreateManyProjectInput = {
    id?: string
    freelancerId: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type ScriptCreateManyProjectInput = {
    id?: string
    title?: string | null
    content?: string | null
    tags?: ScriptCreatetagsInput | string[]
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MoodboardItemCreateManyProjectInput = {
    id?: string
    url: string
    title?: string | null
    description?: string | null
    tags?: MoodboardItemCreatetagsInput | string[]
    moods?: MoodboardItemCreatemoodsInput | string[]
    colors?: MoodboardItemCreatecolorsInput | string[]
    shotType?: string | null
    source: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KnowledgeSourceCreateManyProjectInput = {
    id?: string
    title: string
    content: string
    category: string
    sourceType: string
    sourceId?: string | null
    userId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptCreateManyProjectInput = {
    id?: string
    jobId: string
    title?: string | null
    content?: string | null
    sourceUrl?: string | null
    status?: $Enums.TranscriptStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleRequirementUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    count?: NullableIntFieldUpdateOperationsInput | number | null
    skills?: RoleRequirementUpdateskillsInput | string[]
  }

  export type RoleRequirementUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    count?: NullableIntFieldUpdateOperationsInput | number | null
    skills?: RoleRequirementUpdateskillsInput | string[]
  }

  export type RoleRequirementUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    count?: NullableIntFieldUpdateOperationsInput | number | null
    skills?: RoleRequirementUpdateskillsInput | string[]
  }

  export type AssignmentUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    freelancer?: FreelancerUpdateOneRequiredWithoutAssignmentsNestedInput
    user?: UserUpdateOneWithoutAssignmentsNestedInput
  }

  export type AssignmentUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    freelancerId?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AssignmentUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    freelancerId?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ScriptUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ScriptUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutScriptsNestedInput
  }

  export type ScriptUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ScriptUpdatetagsInput | string[]
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScriptUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ScriptUpdatetagsInput | string[]
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MoodboardItemUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MoodboardItemUpdatetagsInput | string[]
    moods?: MoodboardItemUpdatemoodsInput | string[]
    colors?: MoodboardItemUpdatecolorsInput | string[]
    shotType?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: MoodboardCollectionItemUpdateManyWithoutItemNestedInput
  }

  export type MoodboardItemUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MoodboardItemUpdatetagsInput | string[]
    moods?: MoodboardItemUpdatemoodsInput | string[]
    colors?: MoodboardItemUpdatecolorsInput | string[]
    shotType?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: MoodboardCollectionItemUncheckedUpdateManyWithoutItemNestedInput
  }

  export type MoodboardItemUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MoodboardItemUpdatetagsInput | string[]
    moods?: MoodboardItemUpdatemoodsInput | string[]
    colors?: MoodboardItemUpdatecolorsInput | string[]
    shotType?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeSourceUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutKnowledgeSourcesNestedInput
  }

  export type KnowledgeSourceUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeSourceUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    embedding?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTranscriptStatusFieldUpdateOperationsInput | $Enums.TranscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTranscriptStatusFieldUpdateOperationsInput | $Enums.TranscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTranscriptStatusFieldUpdateOperationsInput | $Enums.TranscriptStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssignmentCreateManyFreelancerInput = {
    id?: string
    projectId: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    allocation?: number | null
    status?: $Enums.AssignmentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
  }

  export type AssignmentUpdateWithoutFreelancerInput = {
    id?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutAssignmentsNestedInput
    user?: UserUpdateOneWithoutAssignmentsNestedInput
  }

  export type AssignmentUncheckedUpdateWithoutFreelancerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AssignmentUncheckedUpdateManyWithoutFreelancerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allocation?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MoodboardCollectionItemCreateManyItemInput = {
    id?: string
    collectionId: string
  }

  export type MoodboardCollectionItemUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    collection?: MoodboardCollectionUpdateOneRequiredWithoutItemsNestedInput
  }

  export type MoodboardCollectionItemUncheckedUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    collectionId?: StringFieldUpdateOperationsInput | string
  }

  export type MoodboardCollectionItemUncheckedUpdateManyWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    collectionId?: StringFieldUpdateOperationsInput | string
  }

  export type MoodboardCollectionItemCreateManyCollectionInput = {
    id?: string
    moodboardItemId: string
  }

  export type MoodboardCollectionItemUpdateWithoutCollectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    item?: MoodboardItemUpdateOneRequiredWithoutCollectionsNestedInput
  }

  export type MoodboardCollectionItemUncheckedUpdateWithoutCollectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    moodboardItemId?: StringFieldUpdateOperationsInput | string
  }

  export type MoodboardCollectionItemUncheckedUpdateManyWithoutCollectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    moodboardItemId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}