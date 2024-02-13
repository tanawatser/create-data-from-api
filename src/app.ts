import axios from 'axios';

interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    hair: { color: string };
    address: {
        address: string;
        city: string;
        postalCode: string;
        state: string;
    };
    company: {
        department: string;
    };
}

interface TransformedData {
    [department: string]: {
        male: number;
        female: number;
        ageRange: string;
        hair: { [color: string]: number };
        addressUser: { [name: string]: string };
        [key: string]: any; // Optional index signature
    };
}

async function fetchDataFromAPI(): Promise<UserData[]> {
    const response = await axios.get('https://dummyjson.com/users');
    return response.data.users;
}

function transformData(data: UserData[]): TransformedData {
    const transformedData: TransformedData = {};

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
        } else {
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

async function main() {
    try {
        const userData = await fetchDataFromAPI();
        const transformedData = transformData(userData);
        console.log(transformedData);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}

main();
