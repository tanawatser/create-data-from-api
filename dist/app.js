"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function fetchDataFromAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get('https://dummyjson.com/users');
        return response.data.users;
    });
}
function transformData(data) {
    const transformedData = {};
    data.forEach(user => {
        const { company, gender, age, hair, address, firstName, lastName } = user;
        const key = company.department.toLowerCase();
        if (!transformedData[key]) {
            transformedData[key] = {
                male: 0,
                female: 0,
                ageRange: "",
                hair: {},
                addressUser: {}
            };
        }
        const departmentData = transformedData[key];
        // Increment gender count
        departmentData[gender]++;
        // Update age range
        if (!departmentData.ageRange) {
            departmentData.ageRange = `${age}-${age}`;
        }
        else {
            const [min, max] = departmentData.ageRange.split("-");
            departmentData.ageRange = `${Math.min(age, parseInt(min))}-${Math.max(age, parseInt(max))}`;
        }
        // Increment hair color count
        departmentData.hair[hair.color] = (departmentData.hair[hair.color] || 0) + 1;
        // Store address user
        departmentData.addressUser[`${firstName}${lastName}`] = address.postalCode;
    });
    return transformedData;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = yield fetchDataFromAPI();
            const transformedData = transformData(userData);
            console.log(transformedData);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error:', error.message);
            }
            else {
                console.error('An unknown error occurred:', error);
            }
        }
    });
}
main();
