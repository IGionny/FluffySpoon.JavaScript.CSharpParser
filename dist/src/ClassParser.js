"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var MethodParser_1 = require("./MethodParser");
var PropertyParser_1 = require("./PropertyParser");
var InterfaceParser_1 = require("./InterfaceParser");
var AttributeParser_1 = require("./AttributeParser");
var ClassParser = /** @class */ (function () {
    function ClassParser(typeParser, enumParser, fieldParser) {
        this.typeParser = typeParser;
        this.enumParser = enumParser;
        this.fieldParser = fieldParser;
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.propertyParser = new PropertyParser_1.PropertyParser();
        this.attributeParser = new AttributeParser_1.AttributeParser();
        this.interfaceParser = new InterfaceParser_1.InterfaceParser(typeParser);
        this.methodParser = new MethodParser_1.MethodParser(typeParser);
    }
    ClassParser.prototype.parseClasses = function (content) {
        var classes = new Array();
        var scopes = this.scopeHelper.getCurlyScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, new RegExp(RegExHelper_1.RegExHelper.REGEX_CLASS, "g"));
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                debugger;
                var classObject = new Models_1.CSharpClass(match[2]);
                classObject.isPublic = (match[1] || "").indexOf("public") > -1;
                classObject.attributes = this.attributeParser.parseAttributes(match[0]);
                classObject.innerScopeText = scope.content;
                classObject.genericParameters = this.typeParser.parseTypesFromGenericParameters(match[3]);
                classObject.inheritsFrom = [this.typeParser.parseType(match[4])];
                var fields = this.fieldParser.parseFields(scope.content);
                for (var _b = 0, fields_1 = fields; _b < fields_1.length; _b++) {
                    var field = fields_1[_b];
                    field.parent = classObject;
                    classObject.fields.push(field);
                }
                var properties = this.propertyParser.parseProperties(scope.content);
                for (var _c = 0, properties_1 = properties; _c < properties_1.length; _c++) {
                    var property = properties_1[_c];
                    property.parent = classObject;
                    classObject.properties.push(property);
                }
                var enums = this.enumParser.parseEnums(scope.content);
                for (var _d = 0, enums_1 = enums; _d < enums_1.length; _d++) {
                    var enumObject = enums_1[_d];
                    enumObject.parent = classObject;
                    classObject.enums.push(enumObject);
                }
                var methods = this.methodParser.parseMethods(scope.content, classObject);
                for (var _e = 0, methods_1 = methods; _e < methods_1.length; _e++) {
                    var method = methods_1[_e];
                    method.parent = classObject;
                    classObject.methods.push(method);
                }
                var subClasses = this.parseClasses(scope.content);
                for (var _f = 0, subClasses_1 = subClasses; _f < subClasses_1.length; _f++) {
                    var subClass = subClasses_1[_f];
                    subClass.parent = classObject;
                    classObject.classes.push(subClass);
                }
                var interfaces = this.interfaceParser.parseInterfaces(scope.content);
                for (var _g = 0, interfaces_1 = interfaces; _g < interfaces_1.length; _g++) {
                    var interfaceObject = interfaces_1[_g];
                    classObject.interfaces.push(interfaceObject);
                }
                classObject.constructors = classObject
                    .methods
                    .filter(function (x) { return x.isConstructor; });
                classObject.methods = classObject
                    .methods
                    .filter(function (x) { return !x.isConstructor; });
                classes.push(classObject);
                console.log("Detected class", classObject);
            }
        }
        return classes;
    };
    return ClassParser;
}());
exports.ClassParser = ClassParser;
//# sourceMappingURL=ClassParser.js.map