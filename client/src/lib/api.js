import axios from 'axios';

// Get the external API URL from environment variables or use the default
const EXTERNAL_API_URL = import.meta.env.VITE_API_URL || 'https://hrms-au5y.onrender.com/employee/add';

// JSON Server URL (local API)
const JSON_SERVER_URL = import.meta.env.VITE_JSON_SERVER_URL || 'http://localhost:3001';

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
 * Get all employees from the JSON Server
 */
export const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/employees`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

/**
 * Submit employee data to both the JSON Server and the external API
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
    
    console.log('Saving to JSON Server:', formattedData);
    
    // First save to JSON Server
    try {
      const jsonServerResponse = await axios.post(`${JSON_SERVER_URL}/employees`, formattedData);
      console.log('JSON Server Response:', jsonServerResponse.data);
      
      // Then try to send to the external API
      try {
        const externalApiResponse = await axios.post(EXTERNAL_API_URL, formattedData);
        console.log('External API Response:', externalApiResponse.data);
        
        return { 
          success: true, 
          message: 'Employee registered successfully',
          localData: jsonServerResponse.data,
          apiResponse: externalApiResponse.data 
        };
      } catch (apiError) {
        console.error('External API error:', apiError);
        // If external API fails, we still have data saved to JSON Server
        return { 
          success: true, 
          message: 'Employee registered successfully (saved to JSON Server only)',
          localData: jsonServerResponse.data,
          externalApiFailed: true
        };
      }
    } catch (jsonServerError) {
      console.error('JSON Server error:', jsonServerError);
      
      // If JSON Server fails, try the external API as a backup
      try {
        const externalApiResponse = await axios.post(EXTERNAL_API_URL, formattedData);
        console.log('External API Response:', externalApiResponse.data);
        
        return { 
          success: true, 
          message: 'Employee registered with external API only (JSON Server unavailable)',
          apiResponse: externalApiResponse.data,
          jsonServerFailed: true 
        };
      } catch (apiError) {
        console.error('External API error:', apiError);
        throw new Error('Failed to save employee data to both storage systems');
      }
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to submit form');
  }
};