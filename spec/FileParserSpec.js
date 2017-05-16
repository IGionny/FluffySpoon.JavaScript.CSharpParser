"use strict";
var FileParser_1 = require("../src/FileParser");
var fs = require('fs');
function useCSharp(file, callback) {
    return function (done) {
        fs.readFile('./spec/csharp/' + file, 'utf8', function (err, data) {
            callback(new FileParser_1.FileParser(data));
            done();
        });
    };
}
describe("FileParser", function () {
    describe("usings", function () {
        //TODO: add real CSharp files and read them using NodeJS
        it("should be able to fetch file containing only usings and no scopes", useCSharp('Usings.cs', function (parser) {
            var file = parser.parseFile();
            expect(file.usings.length).toEqual(2);
            expect(file.usings[0].alias).toEqual('foo');
            expect(file.usings[0].namespace.fullName).toEqual('buz.bar');
            expect(file.usings[1].alias).toBeUndefined();
            expect(file.usings[1].namespace.fullName).toEqual('blah.lol.omg');
        }));
        it("should be able to fetch file containing scoped usings", useCSharp('UsingsAndNamespaces.cs', function (parser) {
            var file = parser.parseFile();
            expect(file.usings.length).toEqual(2);
            expect(file.usings[0].alias).toEqual('foo');
            expect(file.usings[0].namespace.fullName).toEqual('buz.bar');
            expect(file.usings[1].alias).toBeUndefined();
            expect(file.usings[1].namespace.fullName).toEqual('blah');
        }));
    });
    describe("namespaces", function () {
        it("should be able to fetch file containing scoped namespaces", useCSharp('NamespacesNested.cs', function (parser) {
            var file = parser.parseFile();
            expect(file.namespaces.length).toEqual(2);
            expect(file.namespaces[0].name).toEqual('my.stuff');
            expect(file.namespaces[1].name).toEqual('omg');
        }));
    });
});
