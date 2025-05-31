/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("nestjs-pino");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const node_fs_1 = __webpack_require__(5);
const yaml = tslib_1.__importStar(__webpack_require__(6));
const common_1 = __webpack_require__(7);
const nestjs_pino_1 = __webpack_require__(2);
const config_1 = __webpack_require__(8);
const logger_module_options_1 = __webpack_require__(9);
const auth_module_1 = __webpack_require__(11);
const service_module_1 = __webpack_require__(25);
const database_module_1 = __webpack_require__(26);
const gql_module_1 = __webpack_require__(28);
const CONFIG_FILENAME = 'config.yaml';
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [() => yaml.load((0, node_fs_1.readFileSync)(CONFIG_FILENAME, 'utf8'))],
            }),
            nestjs_pino_1.LoggerModule.forRootAsync({ useFactory: logger_module_options_1.LoggerModuleOptions, inject: [config_1.ConfigService] }),
            auth_module_1.AuthModule,
            database_module_1.DatabaseModule,
            service_module_1.ServiceModule,
            gql_module_1.GqlModule,
        ],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("js-yaml");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerModuleOptions = void 0;
__webpack_require__(10);
const LoggerModuleOptions = async (configService) => {
    const targets = [];
    // Pretty-print
    const prettyPrint = {
        target: process.env.NODE_ENV === 'test' ? 'pino-pretty' : `${__dirname}/pino-pretty.js`,
        options: {
            colorize: process.env.NODE_ENV !== 'production',
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            singleLine: true,
            ignore: 'pid,hostname',
        },
        level: configService.getOrThrow('log.level'),
    };
    targets.push(prettyPrint);
    // TODO: add support for pino-elasticsearch
    const kibanaHost = configService.get('kibana.host');
    if (kibanaHost) {
        const kibana = {
            target: 'pino-elasticsearch',
            options: {
                node: kibanaHost,
                compression: true,
            },
            level: configService.get('log.level', 'debug'),
        };
        targets.push(kibana);
    }
    return {
        pinoHttp: {
            level: configService.get('log.level', 'debug'),
            transport: { targets },
            autoLogging: false,
        },
    };
};
exports.LoggerModuleOptions = LoggerModuleOptions;


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("pino-elasticsearch");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const jwt_1 = __webpack_require__(12);
const passport_1 = __webpack_require__(13);
const jwt_strategy_1 = __webpack_require__(14);
const auth_service_1 = __webpack_require__(16);
const service_module_1 = __webpack_require__(25);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: async (configService) => ({
                    secret: configService.getOrThrow('jwt.access.token'),
                    signOptions: {
                        algorithm: 'HS256',
                        expiresIn: configService.getOrThrow('jwt.access.expires'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            passport_1.PassportModule,
            service_module_1.ServiceModule,
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(4);
const passport_jwt_1 = __webpack_require__(15);
const common_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const passport_1 = __webpack_require__(13);
const auth_service_1 = __webpack_require__(16);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    authService;
    constructor(configService, authService) {
        const secretOrKey = configService.getOrThrow('jwt.access.token');
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey,
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate({ sub: username }) {
        if (!username) {
            return null;
        }
        return this.authService.validateUser(username);
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var AuthService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(4);
const node_crypto_1 = __webpack_require__(17);
const common_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const jwt_1 = __webpack_require__(12);
const jwt_payload_1 = __webpack_require__(18);
const user_service_1 = __webpack_require__(19);
let AuthService = AuthService_1 = class AuthService {
    configService;
    jwtService;
    userService;
    accessTokenExpires;
    constructor(configService, jwtService, userService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.userService = userService;
        this.accessTokenExpires = this.configService.getOrThrow('jwt.access.expires');
    }
    async login({ username, password }) {
        const user = await this.validateUser(username);
        const valid = AuthService_1.validateCredentials(user.password, password);
        if (!valid) {
            throw new common_1.ForbiddenException();
        }
        const token = await this.generateAccessToken(user);
        return {
            token,
            user: {
                username: user.username,
                email: user.email,
            },
        };
    }
    async validateUser(username) {
        const user = await this.userService.findOne({ username });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
    async generateAccessToken(user) {
        const opts = {
            ...jwt_payload_1.JWT_BASE_OPTIONS,
            subject: String(user.username),
            expiresIn: this.accessTokenExpires,
        };
        return this.jwtService.signAsync({ name: user.username }, opts);
    }
    static validateCredentials(passwordToCheck, password) {
        const passwordSha256 = (0, node_crypto_1.createHmac)('sha256', password.normalize()).digest('hex');
        return passwordSha256 === passwordToCheck;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JWT_BASE_OPTIONS = void 0;
exports.JWT_BASE_OPTIONS = {};


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const tslib_1 = __webpack_require__(4);
const node_crypto_1 = __webpack_require__(17);
const common_1 = __webpack_require__(7);
const mongoose_1 = __webpack_require__(20);
const mongoose_2 = __webpack_require__(21);
const user_schema_1 = __webpack_require__(22);
const status_enum_1 = __webpack_require__(23);
let UserService = class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async find() {
        return this.userModel.find().exec();
    }
    async findOne(userToFind) {
        return this.userModel.findOne(userToFind).exec();
    }
    async create(userInput) {
        const { username, password, email } = userInput;
        const userInDb = await this.userModel.findOne({ username }).exec();
        if (userInDb) {
            throw new common_1.BadRequestException();
        }
        const user = new this.userModel({
            username,
            password: (0, node_crypto_1.createHmac)('sha256', password.normalize()).digest('hex'),
            email,
        });
        return user.save();
    }
    async delete(userInput) {
        if (!userInput.email && !userInput.username) {
            throw new common_1.BadRequestException();
        }
        const user = await this.userModel.findOne(userInput).exec();
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const deleteResult = await user.deleteOne().exec();
        if (deleteResult.deletedCount === 0) {
            return status_enum_1.Status.ERROR;
        }
        return status_enum_1.Status.OK;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(user_schema_1.UserModel.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UserService);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.UserModel = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(20);
const mongoose_2 = __webpack_require__(21);
let UserModel = class UserModel extends mongoose_2.Document {
    username;
    email;
    password;
};
exports.UserModel = UserModel;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    tslib_1.__metadata("design:type", String)
], UserModel.prototype, "username", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    tslib_1.__metadata("design:type", String)
], UserModel.prototype, "email", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], UserModel.prototype, "password", void 0);
exports.UserModel = UserModel = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ collection: 'user', timestamps: true })
], UserModel);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(UserModel);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Status = void 0;
const graphql_1 = __webpack_require__(24);
var Status;
(function (Status) {
    Status["OK"] = "OK";
    Status["ERROR"] = "ERROR";
})(Status || (exports.Status = Status = {}));
(0, graphql_1.registerEnumType)(Status, { name: 'Status' });


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("@nestjs/graphql");

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(7);
const user_service_1 = __webpack_require__(19);
const database_module_1 = __webpack_require__(26);
let ServiceModule = class ServiceModule {
};
exports.ServiceModule = ServiceModule;
exports.ServiceModule = ServiceModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    })
], ServiceModule);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(7);
const config_1 = __webpack_require__(8);
const mongoose_1 = __webpack_require__(20);
const user_schema_1 = __webpack_require__(22);
const mongo_module_options_1 = __webpack_require__(27);
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({ useFactory: mongo_module_options_1.MongoDbModuleOptions, inject: [config_1.ConfigService] }),
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.UserModel.name, schema: user_schema_1.UserSchema }]),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], DatabaseModule);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MongoDbModuleOptions = void 0;
const MongoDbModuleOptions = async (configService) => {
    return {
        uri: configService.getOrThrow('mongodb.uri'),
    };
};
exports.MongoDbModuleOptions = MongoDbModuleOptions;


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GqlModule = void 0;
const tslib_1 = __webpack_require__(4);
const node_path_1 = __webpack_require__(29);
const common_1 = __webpack_require__(7);
const graphql_1 = __webpack_require__(24);
const apollo_1 = __webpack_require__(30);
const auth_module_1 = __webpack_require__(11);
const service_module_1 = __webpack_require__(25);
const user_resolver_1 = __webpack_require__(31);
let GqlModule = class GqlModule {
};
exports.GqlModule = GqlModule;
exports.GqlModule = GqlModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                graphiql: true,
                autoSchemaFile: (0, node_path_1.join)(process.cwd(), 'schema.gql'),
                sortSchema: true,
                context: async ({ req, res }) => ({ req, res }),
            }),
            auth_module_1.AuthModule,
            service_module_1.ServiceModule,
        ],
        providers: [user_resolver_1.UserResolver],
    })
], GqlModule);


/***/ }),
/* 29 */
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("@nestjs/apollo");

/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserResolver = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(7);
const graphql_1 = __webpack_require__(24);
const jwt_auth_guard_1 = __webpack_require__(32);
const status_enum_1 = __webpack_require__(23);
const user_schema_1 = __webpack_require__(22);
const user_decorator_1 = __webpack_require__(33);
const user_service_1 = __webpack_require__(19);
const auth_service_1 = __webpack_require__(16);
const user_gql_1 = __webpack_require__(34);
let UserResolver = class UserResolver {
    authService;
    userService;
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async users() {
        return this.userService.find();
    }
    async username(username) {
        const data = await this.userService.findOne({ username });
        if (!data) {
            throw new common_1.NotFoundException();
        }
        return data;
    }
    async login(user) {
        const loginResult = await this.authService.login(user);
        return loginResult;
    }
    async whoami(user) {
        const { username } = user;
        const data = await this.userService.findOne({ username });
        if (!data) {
            throw new common_1.NotFoundException();
        }
        return data;
    }
    async createUser(user) {
        return this.userService.create(user);
    }
    async deleteUser(user) {
        return this.userService.delete(user);
    }
};
exports.UserResolver = UserResolver;
tslib_1.__decorate([
    (0, graphql_1.Query)(() => [user_gql_1.UserOutput]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => user_gql_1.UserOutput),
    tslib_1.__param(0, (0, graphql_1.Args)('name', { type: () => String })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "username", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => user_gql_1.LoginUserOutput),
    tslib_1.__param(0, (0, graphql_1.Args)('user', { type: () => user_gql_1.LoginUserInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof user_gql_1.LoginUserInput !== "undefined" && user_gql_1.LoginUserInput) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
tslib_1.__decorate([
    (0, graphql_1.Query)(() => user_gql_1.UserOutput),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, (0, user_decorator_1.User)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof user_schema_1.UserModel !== "undefined" && user_schema_1.UserModel) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "whoami", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => user_gql_1.UserOutput),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, (0, graphql_1.Args)('user', { type: () => user_gql_1.CreateUserInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_e = typeof user_gql_1.CreateUserInput !== "undefined" && user_gql_1.CreateUserInput) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
tslib_1.__decorate([
    (0, graphql_1.Mutation)(() => status_enum_1.Status),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, (0, graphql_1.Args)('user', { type: () => user_gql_1.DeleteUserInput })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_f = typeof user_gql_1.DeleteUserInput !== "undefined" && user_gql_1.DeleteUserInput) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
exports.UserResolver = UserResolver = tslib_1.__decorate([
    (0, graphql_1.Resolver)(() => user_gql_1.UserOutput),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _b : Object])
], UserResolver);


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(7);
const graphql_1 = __webpack_require__(24);
const passport_1 = __webpack_require__(13);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    getRequest(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const common_1 = __webpack_require__(7);
const graphql_1 = __webpack_require__(24);
exports.User = (0, common_1.createParamDecorator)((data, ctx) => {
    const context = graphql_1.GqlExecutionContext.create(ctx).getContext();
    return context.req?.user;
});


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteUserInput = exports.CreateUserInput = exports.LoginUserInput = exports.LoginUserOutput = exports.UserOutput = void 0;
const tslib_1 = __webpack_require__(4);
const graphql_1 = __webpack_require__(24);
let UserOutput = class UserOutput {
    username;
    email;
};
exports.UserOutput = UserOutput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String),
    tslib_1.__metadata("design:type", String)
], UserOutput.prototype, "username", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String),
    tslib_1.__metadata("design:type", String)
], UserOutput.prototype, "email", void 0);
exports.UserOutput = UserOutput = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('User')
], UserOutput);
let LoginUserOutput = class LoginUserOutput {
    token;
    user;
};
exports.LoginUserOutput = LoginUserOutput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String, { nullable: false }),
    tslib_1.__metadata("design:type", String)
], LoginUserOutput.prototype, "token", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => UserOutput),
    tslib_1.__metadata("design:type", UserOutput)
], LoginUserOutput.prototype, "user", void 0);
exports.LoginUserOutput = LoginUserOutput = tslib_1.__decorate([
    (0, graphql_1.ObjectType)('LoginUser')
], LoginUserOutput);
let LoginUserInput = class LoginUserInput {
    username;
    password;
};
exports.LoginUserInput = LoginUserInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String),
    tslib_1.__metadata("design:type", String)
], LoginUserInput.prototype, "username", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String),
    tslib_1.__metadata("design:type", String)
], LoginUserInput.prototype, "password", void 0);
exports.LoginUserInput = LoginUserInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], LoginUserInput);
let CreateUserInput = class CreateUserInput {
    username;
    email;
    password;
};
exports.CreateUserInput = CreateUserInput;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String),
    tslib_1.__metadata("design:type", String)
], CreateUserInput.prototype, "username", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String),
    tslib_1.__metadata("design:type", String)
], CreateUserInput.prototype, "email", void 0);
tslib_1.__decorate([
    (0, graphql_1.Field)(() => String),
    tslib_1.__metadata("design:type", String)
], CreateUserInput.prototype, "password", void 0);
exports.CreateUserInput = CreateUserInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], CreateUserInput);
let DeleteUserInput = class DeleteUserInput extends (0, graphql_1.PartialType)((0, graphql_1.OmitType)(CreateUserInput, ['password'])) {
};
exports.DeleteUserInput = DeleteUserInput;
exports.DeleteUserInput = DeleteUserInput = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], DeleteUserInput);


/***/ }),
/* 35 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-fastify");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const nestjs_pino_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
const platform_fastify_1 = __webpack_require__(35);
const config_1 = __webpack_require__(8);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter(), {
        bufferLogs: false,
        autoFlushLogs: false,
    });
    const logger = app.get(nestjs_pino_1.Logger);
    app.useLogger(logger);
    app.flushLogs();
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('port', 3000);
    app.useGlobalInterceptors(new nestjs_pino_1.LoggerErrorInterceptor());
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Application is running on: http://0.0.0.0:${port}/`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map