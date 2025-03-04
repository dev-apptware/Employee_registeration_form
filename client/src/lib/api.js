import axios from 'axios';

// Get the external API base URL from environment variables or use the default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hrms-au5y.onrender.com';
const API_ADD_URL = `${API_BASE_URL}/employee/add`;
const API_LIST_URL = `${API_BASE_URL}/employee/listEmployees`;

// Format date to DD-MM-YYYY format required by the API
const formatDateForAPI = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Get all employees from the API
 */
export const getAllEmployees = async () => {
  try {
    const response = await axios.get(API_LIST_URL);
    // Check the structure of the response and extract the employee array
    const employees = response.data?.employees || response.data || [];
    console.log('Fetched employees from API:', employees);
    return employees;
  } catch (error) {
    console.error('Error fetching employees from API:', error);
    return [];
  }
};

/**
 * Submit employee data to the external API
 */
export const submitEmployeeData = async (data) => {
  try {
    // Format data for API according to the required format
    const formattedData = {
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
      reportingManager: data.reportingManager ? Number(data.reportingManager) : null
    };

    console.log('Sending data to API:', formattedData);

    try {
      const response = await axios.post(API_ADD_URL, formattedData);
      console.log('API Response:', response.data);

      return {
        success: true,
        message: 'Employee registered successfully',
        apiResponse: response.data
      };
    } catch (apiError) {
      console.error('API error:', apiError);
      throw new Error(apiError.response?.data?.message || 'Failed to register employee. Please try again.');
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to submit form');
  }
};

