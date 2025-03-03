import axios from 'axios';

// JSON file storage using localStorage
const STORAGE_KEY = 'employeeData';

// Get the API URL from environment variables or use the default
const API_URL = 'https://hrms-au5y.onrender.com/employee/add';

const getStoredEmployees = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveEmployeeData = (employees) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
};

export const getAllEmployees = () => {
  return getStoredEmployees();
};

// Format date to DD-MM-YYYY format required by the API
const formatDateForAPI = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const submitEmployeeData = async (data) => {
  try {
    // First save data locally
    const employees = getStoredEmployees();
    const newEmployee = {
      ...data,
      id: employees.length + 1, // Simple ID generation
    };
    
    employees.push(newEmployee);
    saveEmployeeData(employees);
    
    // Format data for API according to the required format
    const apiData = {
      name: data.name,
      contactNumber: data.contactNumber,
      officeEmail: data.officeEmail,
      personalEmail: data.personalEmail,
      employeeId: Number(data.employeeId),
      dateOfBirth: formatDateForAPI(data.dateOfBirth),
      dateOfJoining: formatDateForAPI(data.dateOfJoining),
      totalYrExp: Number(data.totalYrExp),
      primarySkills: Array.isArray(data.primarySkills) ? data.primarySkills : [],
      secondarySkills: Array.isArray(data.secondarySkills) ? data.secondarySkills : [],
      designation: data.designation,
      department: data.department,
      reportingManager: Number(data.reportingManager)
    };
    
    console.log('Sending to API:', apiData);
    
    // Then try to send to the API
    try {
      const response = await axios.post(API_URL, apiData);
      console.log('API Response:', response.data);
      
      return { 
        success: true, 
        message: 'Employee registered successfully',
        apiResponse: response.data 
      };
    } catch (apiError) {
      console.error('API error:', apiError);
      // If API fails, we still have local data saved
      return { 
        success: true, 
        message: 'Employee registered successfully (saved locally only)',
        localOnly: true
      };
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to submit form');
  }
};